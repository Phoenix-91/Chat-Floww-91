"use client"

import { AIChat } from "@/components/chat/ai-chat"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AIChatPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-4">
        <Link href="/chat">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Button>
        </Link>
      </motion.div>

      <div className="flex-1 max-w-4xl mx-auto w-full">
        <AIChat />
      </div>
    </div>
  )
}
