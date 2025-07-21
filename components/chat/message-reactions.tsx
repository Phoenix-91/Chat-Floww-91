"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Reaction {
  emoji: string
  count: number
  users: string[]
  hasReacted: boolean
}

interface MessageReactionsProps {
  messageId: string
  reactions: Reaction[]
  onAddReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
}

const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "😡"]

export function MessageReactions({ messageId, reactions, onAddReaction, onRemoveReaction }: MessageReactionsProps) {
  const [showQuickReactions, setShowQuickReactions] = useState(false)

  const handleReactionClick = (emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      onRemoveReaction(messageId, emoji)
    } else {
      onAddReaction(messageId, emoji)
    }
  }

  return (
    <div className="flex items-center space-x-1 mt-1">
      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.button
            key={reaction.emoji}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleReactionClick(reaction.emoji, reaction.hasReacted)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
              reaction.hasReacted ? "bg-purple-500/30 border border-purple-500/50" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <span>{reaction.emoji}</span>
            <span className="text-white">{reaction.count}</span>
          </motion.button>
        ))}
      </AnimatePresence>

      <div className="relative">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowQuickReactions(!showQuickReactions)}
          className="w-6 h-6 p-0 text-gray-400 hover:text-white hover:bg-white/10"
        >
          <Plus className="w-3 h-3" />
        </Button>

        <AnimatePresence>
          {showQuickReactions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-full mb-2 left-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-2 flex space-x-1"
            >
              {quickReactions.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onAddReaction(messageId, emoji)
                    setShowQuickReactions(false)
                  }}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded"
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
