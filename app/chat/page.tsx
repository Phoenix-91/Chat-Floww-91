"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Search, Users, ImageIcon } from "lucide-react"
import { Sidebar } from "@/components/chat/sidebar"
import { MessageBubble } from "@/components/chat/message-bubble"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { FileUpload } from "@/components/chat/file-upload"
import { EmojiPicker } from "@/components/chat/emoji-picker"
import { GifPicker } from "@/components/chat/gif-picker"
import { useSocket } from "@/hooks/use-socket"
import { useChat } from "@/hooks/use-chat"

export default function ChatPage() {
  const { data: session } = useSession()
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const socket = useSocket()
  const { messages, sendMessage, editMessage, deleteMessage } = useChat(selectedChat)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return

    try {
      await sendMessage(message, "text")
      setMessage("")

      // Emit typing stopped
      socket?.emit("typing", { chatId: selectedChat, isTyping: false })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    }
  }

  const handleTyping = (value: string) => {
    setMessage(value)

    if (!isTyping && selectedChat) {
      setIsTyping(true)
      socket?.emit("typing", { chatId: selectedChat, isTyping: true })

      // Stop typing after 3 seconds of inactivity
      setTimeout(() => {
        setIsTyping(false)
        socket?.emit("typing", { chatId: selectedChat, isTyping: false })
      }, 3000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji)
  }

  const handleGifSelect = async (gifUrl: string) => {
    if (!selectedChat) return

    try {
      await sendMessage(gifUrl, "gif")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send GIF",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (file: File, type: string) => {
    if (!selectedChat) return

    try {
      // In a real app, you'd upload the file to a storage service first
      const fileUrl = URL.createObjectURL(file)
      await sendMessage(fileUrl, type)

      toast({
        title: "File sent!",
        description: `${file.name} has been sent`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send file",
        variant: "destructive",
      })
    }
  }

  const mockChats = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hey! How are you doing?",
      timestamp: "2 min ago",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "Team Alpha",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Meeting at 3 PM today",
      timestamp: "1 hour ago",
      unread: 0,
      online: false,
      isGroup: true,
    },
    {
      id: "ai",
      name: "AI Assistant",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "How can I help you today?",
      timestamp: "5 min ago",
      unread: 0,
      online: true,
      isAI: true,
    },
  ]

  const mockMessages = [
    {
      id: "1",
      content: "Hey there! How has your day been?",
      sender: "other",
      timestamp: new Date(Date.now() - 300000),
      status: "read",
      type: "text",
    },
    {
      id: "2",
      content: "Pretty good! Just finished a big project at work. How about you?",
      sender: "me",
      timestamp: new Date(Date.now() - 240000),
      status: "read",
      type: "text",
    },
    {
      id: "3",
      content: "That's awesome! I've been working on some new features for our chat app.",
      sender: "other",
      timestamp: new Date(Date.now() - 180000),
      status: "read",
      type: "text",
    },
    {
      id: "4",
      content: "Sounds exciting! Can't wait to see what you've built 🚀",
      sender: "me",
      timestamp: new Date(Date.now() - 120000),
      status: "delivered",
      type: "text",
    },
  ]

  return (
    <div className="h-screen mono-bg flex">
      {/* Sidebar */}
      <Sidebar chats={mockChats} selectedChat={selectedChat} onSelectChat={setSelectedChat} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/50 dark:bg-black/50 backdrop-blur-lg border-b border-black/10 dark:border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-black dark:text-white">Sarah Johnson</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {mockMessages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onEdit={editMessage}
                    onDelete={deleteMessage}
                    onTranslate={(id) => console.log("Translate:", id)}
                  />
                ))}
              </AnimatePresence>

              <TypingIndicator isVisible={isTyping} />
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white/50 dark:bg-black/50 backdrop-blur-lg border-t border-black/10 dark:border-white/10 p-4 relative">
              {/* File Upload */}
              {showFileUpload && (
                <div className="mb-4">
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    maxSize={10}
                    acceptedTypes={["image/*", "video/*", "application/*"]}
                  />
                </div>
              )}

              {/* Emoji Picker */}
              <EmojiPicker
                isOpen={showEmojiPicker}
                onClose={() => setShowEmojiPicker(false)}
                onEmojiSelect={handleEmojiSelect}
              />

              {/* GIF Picker */}
              <GifPicker isOpen={showGifPicker} onClose={() => setShowGifPicker(false)} onGifSelect={handleGifSelect} />

              <div className="flex items-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className={`text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 ${showFileUpload ? "bg-black/5 dark:bg-white/5" : ""}`}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGifPicker(!showGifPicker)}
                  className={`text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 ${showGifPicker ? "bg-black/5 dark:bg-white/5" : ""}`}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="bg-white/30 dark:bg-black/30 border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-12 focus:border-black dark:focus:border-white"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 ${showEmojiPicker ? "bg-black/5 dark:bg-white/5" : ""}`}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 hover:from-mono-black-900 hover:to-mono-black-800 dark:hover:from-mono-white-300 dark:hover:to-mono-white-200 mono-glow text-white dark:text-black"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 rounded-full flex items-center justify-center mx-auto mb-4 mono-glow">
                <Users className="w-10 h-10 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Select a conversation</h3>
              <p className="text-gray-600 dark:text-gray-300">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
