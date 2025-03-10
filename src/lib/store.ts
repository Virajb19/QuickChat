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
  

type SocketState =  {
    socket: Socket | null;
    connected: boolean;
    currentRoom: string | null;
    isConnecting: boolean;
    error: string | null;
    // messages: Record<string, any[]>;
    
    initSocket: () => void;
    disconnectSocket: () => void;
    // createRoom: (chatId: string) => void;
    // joinRoom: (chatId: string) => void;
    // leaveRoom: () => void;
    // sendMessage: (chatId: string, message: any) => void;
    // resetError: () => void;
}

export const useSocketStore = create<SocketState>((set,get) => ({
    socket: null,
    connected: false,
    currentRoom: null,
    isConnecting: false,
    error: null,

    initSocket: () => {
        set({ isConnecting: true });
        try {
            if(get().socket?.connected) {
                set({isConnecting: false})
                return
            }
            // toast.success(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL)
            const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {reconnectionAttempts: 10})
            socket.on('connect', () => {
                set({ connected: true, isConnecting: false, error: null })
            })

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
                set({ connected: false, currentRoom: null });
              })

            set({socket})
        } catch(err) {
            console.error(err)
            set({error: 'Failed to connect'})
        }
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
        socket.disconnect();
        set({ 
            socket: null, 
            connected: false, 
            currentRoom: null 
        })
        }
    }
}))