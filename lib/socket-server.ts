import type { Server as NetServer } from "http"
import type { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"

export type NextApiResponseServerIO = {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket is already running")
  } else {
    console.log("Socket is initializing")
    const io = new ServerIO(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id)

      // Join user to their personal room
      socket.on("join-user", (userId) => {
        socket.join(`user:${userId}`)
        console.log(`User ${userId} joined their room`)
      })

      // Join chat room
      socket.on("join-chat", (chatId) => {
        socket.join(`chat:${chatId}`)
        console.log(`User joined chat: ${chatId}`)
      })

      // Leave chat room
      socket.on("leave-chat", (chatId) => {
        socket.leave(`chat:${chatId}`)
        console.log(`User left chat: ${chatId}`)
      })

      // Handle new message
      socket.on("send-message", (data) => {
        socket.to(`chat:${data.chatId}`).emit("new-message", data.message)
      })

      // Handle typing indicators
      socket.on("typing", (data) => {
        socket.to(`chat:${data.chatId}`).emit("user-typing", {
          userId: data.userId,
          isTyping: data.isTyping,
        })
      })

      // Handle message reactions
      socket.on("message-reaction", (data) => {
        socket.to(`chat:${data.chatId}`).emit("message-reaction-update", data)
      })

      // Handle message edits
      socket.on("edit-message", (data) => {
        socket.to(`chat:${data.chatId}`).emit("message-edited", data)
      })

      // Handle message deletions
      socket.on("delete-message", (data) => {
        socket.to(`chat:${data.chatId}`).emit("message-deleted", data)
      })

      // Handle user status updates
      socket.on("status-update", (data) => {
        socket.broadcast.emit("user-status-changed", data)
      })

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
      })
    })
  }
  res.end()
}

export default SocketHandler
