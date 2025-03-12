import { create } from 'zustand'
import { io, Socket } from 'socket.io-client';

type loadingState = {
    loading: boolean,
    setLoading: (value: boolean) => void
}

export const useLoadingState = create<loadingState>((set, get) => ({
     loading: false,
     setLoading: (value: boolean) => {
        set({ loading: value})
     }
}))

type SocketState = {
    socket: Socket | null
    chatId: string | null
    connectSocket: (chatId: string) => void
    disconnectSocket: () => void
  }

export const useSocketStore = create<SocketState>((set,get) => ({
     socket: null,
     chatId: null,
     connectSocket: (chatId: string) => {
        const existingSocket = get().socket

        if(existingSocket && get().chatId === chatId) return
        if(existingSocket) existingSocket.disconnect()

         const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
            reconnectionAttempts: 10,
            autoConnect: false,
            auth: { chatId },
          })

          newSocket.connect()

          set({socket: newSocket, chatId})
     },
     disconnectSocket: () => {
        const { socket } = get()
        socket?.disconnect()
        set({socket: null, chatId: null})
     }
}))

// type SocketState =  {
//     socket: Socket | null
//     getSocket: () => Socket
//   }
  
//   export const useSocketStore = create<SocketState>((set, get) => ({
//     socket: null,
  
//     getSocket: () => {
//       let socket = get().socket
//       if (!socket) {
//         socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, { reconnectionAttempts: 10, autoConnect: false })
//         set({ socket })
//       }
//       return socket
//     },
//   }))
  
