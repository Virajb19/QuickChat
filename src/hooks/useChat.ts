import { Message, User } from '@prisma/client'
import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import { useRouter } from 'nextjs-toploader/app'

type message = Message & { sender: Pick<User, "ProfilePicture" | "username">}

let socket: Socket | null = null

 const getSocket = () => {
  if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {reconnectionAttempts: 10, autoConnect: false})
  }
  return socket
}

// Try using ZUSTAND STORE to prevent duplicate listeners
// use it just for socket along with useChat hook
export const useChat = (chatId: string) => {
    const utils = api.useUtils()
    const socket = getSocket()

    const router = useRouter()

   //  const {data: session, status} = useSession()

    useEffect(() => {
       if(!socket.connected) {
          socket.connect()
       }

       socket.on("connect", () => console.log("Connected to socket"))
       socket.on("disconnect", () => console.log("Socket disconnected"))

       const sendMessage = (msg: message) => {
            //  toast.success(JSON.stringify(msg))
            utils.chat.getMessages.refetch({chatId})
            utils.chat.getMessages.setData({chatId}, (messages) => [...(messages ?? []), msg])
       }

       const deleteMessage = (messageId: string) => {
          // utils.chat.getMessages.refetch({chatId})
          utils.chat.getMessages.setData({chatId}, (messages) => (messages?.filter(msg => msg.id !== messageId)))
       }

       const editMessage = ({messageId, newContent}: {messageId: string, newContent: string}) => {
           utils.chat.getMessages.setData({chatId}, (messages) => (
             messages?.map(msg => msg.id === messageId ? {...msg, content: newContent} : msg)
           ))
       }

       const leaveChat = (name: string) => {
         toast.success(`${name} left the chat`, { position: 'bottom-right', duration: 5000})
         router.refresh()
       }

       const joinChat = (name: string) => {
         toast.success(`${name} joined the chat`, { position: 'bottom-right', duration: 5000})
         router.refresh()
       }

       socket.once('send:message', sendMessage)   
       socket.once('delete:message', deleteMessage)
       socket.once('edit:message', editMessage)
       socket.once('join:chat', joinChat)
       socket.once('leave:chat', leaveChat)

      //  socket.off()

       return () => {
         if(socket) {
            socket.disconnect()
            socket.off('send:message', sendMessage)
            socket.off('delete:message', deleteMessage)
            socket.off('edit:message', editMessage)
            socket.off('join:chat', joinChat)
            socket.off('leave:chat', leaveChat)
         }
       }

    }, [chatId])

    return { socket }
}

// CONTEXT API
// type useSocketType = {
//    socket: Socket | null
// }

// const SocketContext = createContext<useSocketType | undefined>(undefined)

// export const socketProvider = ({children}: {children: ReactNode}) => {
//    const utils = api.useUtils()
//    const [socket, setSocket] = useState<Socket | null>(null)

//        useEffect(() => {
//        if(!socket || !socket.connected) {
//          const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {reconnectionAttempts: 10})
//          newSocket.on('connect', () => {
//             console.log('connected')
//          })
   
//          newSocket.on('disconnect', () => {
//              console.log('Socket disconnected');
//            });
   
//          newSocket.on('message', (chatId: string) => {
//              toast.success(chatId)
//              utils.chat.getMessages.refetch({chatId})
//          })   
//          newSocket.connect()

//          setSocket(newSocket)
//        }

//        return () => {
//          if(socket) socket.disconnect()
//        }

//     }, [])

//     return (
//       <SocketContext.Provider value={{ socket, isConnected }}>
//         {children}
//       </SocketContext.Provider>
//     )
// }
