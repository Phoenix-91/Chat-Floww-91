"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AnimatedAvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg" | "xl"
  isOnline?: boolean
  showStatus?: boolean
  className?: string
  onClick?: () => void
}

export function AnimatedAvatar({
  src,
  alt,
  fallback,
  size = "md",
  isOnline = false,
  showStatus = true,
  className = "",
  onClick,
}: AnimatedAvatarProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  const statusSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-6 h-6",
  }

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <Avatar className={`${sizeClasses[size]} cursor-pointer`}>
        <AvatarImage src={imageError ? undefined : src} alt={alt} onError={() => setImageError(true)} />
        <AvatarFallback className="bg-gradient-to-r from-matrix-green-500 to-neon-green-500 text-black">
          {fallback}
        </AvatarFallback>
      </Avatar>

      <AnimatePresence>
        {showStatus && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={`absolute -bottom-1 -right-1 ${statusSizes[size]} rounded-full border-2 border-matrix-black-900 ${
              isOnline ? "bg-matrix-green-500" : "bg-gray-500"
            }`}
          >
            {isOnline && (
              <motion.div
                className="w-full h-full bg-matrix-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
