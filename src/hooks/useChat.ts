'use client'

import { io, Socket } from 'socket.io-client'

let socket: Socket

export const useChat = () => {

}

export const getSocket = () => {
   if(!socket) {
      socket = io(process.env.NEXT_URL, {autoConnect: false})
   }
   return socket
}