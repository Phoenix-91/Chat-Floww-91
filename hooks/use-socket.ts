"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useSession } from "next-auth/react"

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) return

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      auth: {
        userId: session.user?.id,
      },
    })

    socketInstance.on("connect", () => {
      console.log("Connected to socket server")
    })

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server")
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [session])

  return socket
}
