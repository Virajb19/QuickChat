import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { Message } from '@prisma/client'

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id)
      
        socket.on('message', (msg: string) => {
          console.log('Message:', msg)
          io.emit('message', msg)
        })
      
        socket.on('disconnect', () => console.log('User disconnected:', socket.id))
    })

  httpServer
  .once("error", (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
})