import { Server as NetServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

const users = new Map<string, string>()

export function setupSocketServer(server: NetServer) {
   const io = new SocketIOServer(server)

   io.on('connection', (socket: Socket) => {
     console.log('New client connected:', socket.id)

     socket.on('join', (userId: string) => {
         users.set(socket.id,userId)
         io.emit('users', Array.from(users.values()))

         console.log(`${userId} joined the chat`)
     })
   })
}