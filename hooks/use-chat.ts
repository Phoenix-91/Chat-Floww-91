"use client"

import { useState, useEffect } from "react"
import { useSocket } from "./use-socket"

interface Message {
  id: string
  content: string
  sender: "me" | "other"
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "read"
  type: "text" | "image" | "file"
}

export function useChat(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const socket = useSocket()

  useEffect(() => {
    if (!socket || !chatId) return

    // Join chat room
    socket.emit("join-chat", chatId)

    // Listen for new messages
    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    // Listen for message updates
    socket.on("message-updated", (updatedMessage: Message) => {
      setMessages((prev) => prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg)))
    })

    // Listen for message deletions
    socket.on("message-deleted", (messageId: string) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
    })

    return () => {
      socket.off("new-message")
      socket.off("message-updated")
      socket.off("message-deleted")
    }
  }, [socket, chatId])

  const sendMessage = async (content: string, type: "text" | "image" | "file" = "text") => {
    if (!socket || !chatId) return

    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: "me",
      timestamp: new Date(),
      status: "sending",
      type,
    }

    setMessages((prev) => [...prev, message])

    try {
      socket.emit("send-message", {
        chatId,
        message: {
          ...message,
          status: "sent",
        },
      })
    } catch (error) {
      console.error("Failed to send message:", error)
      // Update message status to failed
      setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, status: "sent" as const } : msg)))
    }
  }

  const editMessage = async (messageId: string, newContent: string) => {
    if (!socket || !chatId) return

    socket.emit("edit-message", {
      chatId,
      messageId,
      newContent,
    })
  }

  const deleteMessage = async (messageId: string) => {
    if (!socket || !chatId) return

    socket.emit("delete-message", {
      chatId,
      messageId,
    })
  }

  return {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    isLoading,
  }
}
