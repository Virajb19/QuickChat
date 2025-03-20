import { ChatParticipant, Message, User } from '@prisma/client'
import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { useRouter } from 'nextjs-toploader/app'
import { useSocketStore } from '~/lib/store'

type message = Message & { sender: Pick<User, "ProfilePicture" | "username">}
type participant = ChatParticipant & {user: Pick<User, "ProfilePicture" | "username">}

// let socket: Socket | null = null

//  const getSocket = (chatId: string) => {
//   if (!socket) {
//       socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {reconnectionAttempts: 10, autoConnect: false, auth: { chatId }})
//   }
//   return socket
// }

export const useSocket = (chatId: string) => {
    const utils = api.useUtils()
   //  const socket = getSocket(chatId)
    const { socket, connectSocket, chatId: prevChatId} = useSocketStore()

    const router = useRouter()

   //  const {data: session, status} = useSession()

   useEffect(() => {
      if (!socket || prevChatId !== chatId) {
        connectSocket(chatId);
      }
      // router.refresh()
   }, [chatId,connectSocket])

    useEffect(() => {
      //  if(!socket.connected) {
      //     socket.connect()
      //  }

      //  if(!socket) {
      //    connectSocket(chatId)
      //    return
      //  }

       if(!socket) return
          // This makes sure that event listeners are set up only once 
          // But what about connect event is it singleton??
       socket.on("connect", () => {
          console.log("Connected to socket")
          socket.off('send:message').on('send:message', sendMessage)
          socket.off('delete:message').on('delete:message', deleteMessage)
          socket.off('edit:message').on('edit:message', editMessage)
          socket.off('join:chat').on('join:chat', joinChat)
          socket.off('leave:chat').on('leave:chat', leaveChat)
          socket.off('delete:chat').on('delete:chat',deleteChat)
          socket.off('user:statusChange').on('user:statusChange', userStatusChange)
       })
       socket.on("disconnect", () => console.log("Socket disconnected"))

       const sendMessage = (msg: message) => {
            // toast.success(JSON.stringify(msg))
            // utils.chat.getMessages.refetch({chatId})
            utils.chat.getMessages.setData({chatId}, (messages) => [...(messages ?? []), msg])
       }

       const deleteMessage = (messageId: string) => {
          //  utils.chat.getMessages.refetch({chatId})
          utils.chat.getMessages.setData({chatId}, (messages) => (messages?.filter(msg => msg.id !== messageId)))
       }

       const editMessage = ({messageId, newContent}: {messageId: string, newContent: string}) => {
           utils.chat.getMessages.setData({chatId}, (messages) => (
             messages?.map(msg => msg.id === messageId ? {...msg, content: newContent} : msg)
           ))
       }

       const leaveChat = (name: string, participantId: string) => {
         toast.success(`${name} left the chat`, { position: 'bottom-right', duration: 5000})
         utils.chat.getParticipants.setData({chatId}, (participants) => participants?.filter(p => p.id !== participantId))
         router.refresh()
       }

       // multiple toasts appearing means there are more than one event listeners or duplicate listeners
       const joinChat = (participant: participant) => {
         toast.success(`${participant.user.username} joined the chat`, { position: 'bottom-right', duration: 5000})
         utils.chat.getParticipants.setData({chatId}, (participants) => [...(participants ?? []), participant])
         router.refresh()
       }

       const deleteChat = (name: string) => {
          router.push('/')
          toast.success(`${name} deleted the chat`)
       }

       const userStatusChange = (userId: number) => {
        utils.chat.getParticipants.setData({chatId}, (participants) => participants?.map(p => p.userId === userId ? {...p, isOnline: !p.isOnline} : p))
       }

      //  socket.off('send:message').on('send:message', sendMessage)
      //  socket.off('delete:message').on('delete:message', deleteMessage)
      //  socket.off('edit:message').on('edit:message', editMessage)
      //  socket.off('join:chat').on('join:chat', joinChat)
      //  socket.off('leave:chat').on('leave:chat', leaveChat)
      //  socket.off('delete:chat').on('delete:chat',deleteChat)
      //  socket.off('user:statusChange').on('user:statusChange', userStatusChange)

      //  toast.success('Setting up listeners')
  
       return () => {
         if(socket) {
            // socket.disconnect()
            socket.off('send:message', sendMessage)
            socket.off('delete:message', deleteMessage)
            socket.off('edit:message', editMessage)
            socket.off('join:chat', joinChat)
            socket.off('leave:chat', leaveChat)
            socket.off('delete:chat', deleteChat)
         }
       }
    // Adding socket is necessary to add event listeners see execution flow or await connectSocket 
    }, [chatId,socket])

    return socket
}
