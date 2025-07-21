"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { ProfileCard } from "@/components/profile/profile-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          toast({
            title: "Error",
            description: "Failed to load profile",
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
        setIsLoading(false)
      }
    }

    if (session) {
      fetchProfile()
    }
  }, [session, toast])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link href="/chat">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
          </Link>
        </motion.div>

        {user && <ProfileCard user={user} isOwnProfile={true} />}
      </div>
    </div>
  )
}
