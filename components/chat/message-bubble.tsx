"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreVertical, Edit, Trash2, ImportIcon as Translate, Copy, Reply, Check, CheckCheck } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  content: string
  sender: "me" | "other"
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "read"
  type: "text" | "image" | "file"
}

interface MessageBubbleProps {
  message: Message
  onEdit: (id: string, content: string) => void
  onDelete: (id: string) => void
  onTranslate: (id: string) => void
}

export function MessageBubble({ message, onEdit, onDelete, onTranslate }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)
  const isMe = message.sender === "me"

  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-black dark:text-white" />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isMe ? "flex-row-reverse space-x-reverse" : ""}`}
      >
        {!isMe && (
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
        )}

        <div className="relative">
          <div
            className={`px-4 py-2 rounded-2xl ${
              isMe
                ? "bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 text-white dark:text-black"
                : "bg-white/50 dark:bg-black/50 text-black dark:text-white backdrop-blur-lg border border-black/10 dark:border-white/10"
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>

          <div className={`flex items-center mt-1 space-x-1 ${isMe ? "justify-end" : "justify-start"}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {isMe && getStatusIcon()}
          </div>

          {/* Message Actions */}
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute top-0 ${isMe ? "right-full mr-2" : "left-full ml-2"}`}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-white/50 dark:bg-black/50 backdrop-blur-lg border border-black/10 dark:border-white/10"
                  >
                    <MoreVertical className="w-4 h-4 text-black dark:text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-black border-black/10 dark:border-white/10">
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(message.content)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTranslate(message.id)}>
                    <Translate className="w-4 h-4 mr-2" />
                    Translate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </DropdownMenuItem>
                  {isMe && (
                    <>
                      <DropdownMenuItem onClick={() => onEdit(message.id, message.content)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(message.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
