"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error. Please try again.",
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center space-y-4 p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center"
      >
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </motion.div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-gray-400 max-w-md">{message}</p>
      </div>

      {showRetry && onRetry && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
