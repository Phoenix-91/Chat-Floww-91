"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Phone, Video, Search, MoreVertical, UserPlus, Settings } from "lucide-react"
import { AnimatedAvatar } from "@/components/ui/animated-avatar"

interface ChatHeaderProps {
  chat: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
    isGroup?: boolean
    memberCount?: number
    lastSeen?: string
  }
  onCall?: () => void
  onVideoCall?: () => void
  onSearch?: () => void
}

export function ChatHeader({ chat, onCall, onVideoCall, onSearch }: ChatHeaderProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AnimatedAvatar
            src={chat.avatar}
            fallback={chat.name.charAt(0)}
            isOnline={chat.isOnline}
            size="md"
            onClick={() => setShowInfo(true)}
          />

          <div>
            <h3 className="font-semibold text-white flex items-center">
              {chat.name}
              {chat.isGroup && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {chat.memberCount} members
                </Badge>
              )}
            </h3>
            <p className="text-sm text-gray-400">
              {chat.isOnline ? "Online" : chat.lastSeen ? `Last seen ${chat.lastSeen}` : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" onClick={onCall} className="text-white hover:bg-white/10">
              <Phone className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" onClick={onVideoCall} className="text-white hover:bg-white/10">
              <Video className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" onClick={onSearch} className="text-white hover:bg-white/10">
              <Search className="w-4 h-4" />
            </Button>
          </motion.div>

          <Dialog open={showInfo} onOpenChange={setShowInfo}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Chat Information</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <AnimatedAvatar src={chat.avatar} fallback={chat.name.charAt(0)} isOnline={chat.isOnline} size="lg" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{chat.name}</h3>
                    <p className="text-gray-400">{chat.isOnline ? "Online" : "Offline"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
