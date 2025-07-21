"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X, Copy, Check, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { QRCodeGenerator } from "./qr-code-generator"

interface ProfileCardProps {
  user: {
    id: string
    name: string
    email: string
    avatar: string
    bio: string
    profileCode: string
    isOnline: boolean
  }
  isOwnProfile?: boolean
}

export function ProfileCard({ user, isOwnProfile = false }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
  })
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsEditing(false)
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const copyProfileCode = async () => {
    await navigator.clipboard.writeText(user.profileCode)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Profile code copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-matrix-black-900/50 border-matrix-green-500/20 backdrop-blur-lg">
        <CardHeader className="text-center relative">
          {isOwnProfile && (
            <div className="absolute top-4 right-4">
              {isEditing ? (
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSave} className="bg-matrix-green-600 hover:bg-matrix-green-700">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-matrix-green-500/20 text-white hover:bg-matrix-green-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-matrix-green-500/20 text-white hover:bg-matrix-green-500/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          <div className="relative inline-block">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-r from-matrix-green-500 to-neon-green-500 text-black text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-matrix-black-900 ${
                user.isOnline ? "bg-matrix-green-500" : "bg-gray-500"
              }`}
            />
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-matrix-black-800/50 border-matrix-green-500/20 text-white focus:border-matrix-green-500"
                />
              </div>
              <div>
                <Label htmlFor="bio" className="text-white">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-matrix-black-800/50 border-matrix-green-500/20 text-white resize-none focus:border-matrix-green-500"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-300">{user.email}</p>
              {user.bio && <p className="text-gray-400 mt-2">{user.bio}</p>}
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-matrix-black-800/50 rounded-lg border border-matrix-green-500/20">
            <div>
              <p className="text-sm text-gray-400">Profile Code</p>
              <p className="font-mono text-white">{user.profileCode}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyProfileCode}
                className="border-matrix-green-500/20 text-white hover:bg-matrix-green-500/10 bg-transparent"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowQR(!showQR)}
                className="border-matrix-green-500/20 text-white hover:bg-matrix-green-500/10"
              >
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showQR && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-center"
            >
              <QRCodeGenerator value={user.profileCode} />
            </motion.div>
          )}

          <div className="flex justify-center">
            <Badge
              variant={user.isOnline ? "default" : "secondary"}
              className={
                user.isOnline ? "bg-matrix-green-500 text-black px-3 py-1" : "bg-gray-600 text-white px-3 py-1"
              }
            >
              {user.isOnline ? "🟢 Online" : "⚫ Offline"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
