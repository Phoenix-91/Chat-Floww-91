"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Settings, Users, Bot, Sparkles, UserPlus } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  isGroup?: boolean
  isAI?: boolean
}

interface SidebarProps {
  chats: Chat[]
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
}

export function Sidebar({ chats, selectedChat, onSelectChat }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [profileCode, setProfileCode] = useState("")
  const [isAddingFriend, setIsAddingFriend] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddFriend = async () => {
    if (!profileCode.trim()) return

    setIsAddingFriend(true)
    try {
      const response = await fetch("/api/friends/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileCode: profileCode.toUpperCase() }),
      })

      if (response.ok) {
        toast({
          title: "Friend request sent!",
          description: "Your friend request has been sent successfully",
        })
        setProfileCode("")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to send friend request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsAddingFriend(false)
    }
  }

  return (
    <div className="w-80 bg-white/50 dark:bg-black/50 backdrop-blur-lg border-r border-black/10 dark:border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 rounded-lg flex items-center justify-center mono-glow">
              <Sparkles className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="text-xl font-bold text-black dark:text-white mono-text">ChatFlow</span>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/30 dark:bg-black/30 border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-black dark:focus:border-white"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-black/10 dark:border-white/10">
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 flex-col h-auto py-3"
          >
            <Plus className="w-4 h-4 mb-1" />
            <span className="text-xs">New Chat</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 flex-col h-auto py-3"
          >
            <Users className="w-4 h-4 mb-1" />
            <span className="text-xs">Groups</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 flex-col h-auto py-3"
          >
            <Bot className="w-4 h-4 mb-1" />
            <span className="text-xs">AI Chat</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 flex-col h-auto py-3"
              >
                <UserPlus className="w-4 h-4 mb-1" />
                <span className="text-xs">Add Friend</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-black border-black/10 dark:border-white/10">
              <DialogHeader>
                <DialogTitle className="text-black dark:text-white">Add Friend</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileCode" className="text-black dark:text-white">
                    Profile Code
                  </Label>
                  <Input
                    id="profileCode"
                    placeholder="Enter friend's profile code"
                    value={profileCode}
                    onChange={(e) => setProfileCode(e.target.value.toUpperCase())}
                    className="bg-white/30 dark:bg-black/30 border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-black dark:focus:border-white"
                  />
                </div>
                <Button
                  onClick={handleAddFriend}
                  disabled={!profileCode.trim() || isAddingFriend}
                  className="w-full bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 hover:from-mono-black-900 hover:to-mono-black-800 dark:hover:from-mono-white-300 dark:hover:to-mono-white-200 mono-glow text-white dark:text-black"
                >
                  {isAddingFriend ? "Sending..." : "Send Friend Request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <motion.button
            key={chat.id}
            whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full p-4 text-left border-b border-black/5 dark:border-white/5 transition-colors ${
              selectedChat === chat.id ? "bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{chat.isAI ? <Bot className="w-6 h-6" /> : chat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {chat.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-black dark:text-white truncate flex items-center">
                    {chat.name}
                    {chat.isAI && <Bot className="w-4 h-4 inline ml-1 text-gray-600 dark:text-gray-400" />}
                    {chat.isGroup && <Users className="w-4 h-4 inline ml-1 text-gray-600 dark:text-gray-400" />}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <Badge className="bg-black dark:bg-white text-white dark:text-black text-xs px-2 py-1 rounded-full">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-black dark:text-white truncate">{session?.user?.name || "User"}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
