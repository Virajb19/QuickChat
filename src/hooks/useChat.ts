import { Message, User } from '@prisma/client'
import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { api } from '~/trpc/react'

type message = Message & { sender: Pick<User, "ProfilePicture" | "username">}

let socket: Socket | null = null

 const getSocket = () => {
  if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {reconnectionAttempts: 10, autoConnect: false})
  }
  return socket
}

// Try using ZUSTAND STORE to prevent duplicate listeners
export const useChat = (chatId: string) => {
    const utils = api.useUtils()
    const socket = getSocket()

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

       socket.on('send:message', sendMessage)   
       socket.on('delete:message', deleteMessage)

       return () => {
         if(socket) {
            // socket.disconnect()
            socket.off('send:message', sendMessage)
            socket.off('delete:message', deleteMessage)
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
