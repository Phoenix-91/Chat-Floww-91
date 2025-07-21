"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, Sparkles, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export function AIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: messages.slice(-5).map((m) => `${m.sender}: ${m.content}`),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* AI Chat Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500">
            <AvatarFallback>
              <Bot className="w-6 h-6 text-white" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white flex items-center">
              AI Assistant
              <Badge variant="secondary" className="ml-2 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by Gemini
              </Badge>
            </h3>
            <p className="text-sm text-green-400">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-white/10 text-white backdrop-blur-lg"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex items-end space-x-2">
                <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span className="text-sm text-white">Thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-white/5 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
