"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Loader2 } from "lucide-react"
import Image from "next/image"

interface GifPickerProps {
  onGifSelect: (gifUrl: string) => void
  isOpen: boolean
  onClose: () => void
}

interface GifResult {
  id: string
  title: string
  images: {
    fixed_height: {
      url: string
      width: string
      height: string
    }
  }
}

export function GifPicker({ onGifSelect, isOpen, onClose }: GifPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [gifs, setGifs] = useState<GifResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock GIF data for demo purposes
  const mockGifs = [
    {
      id: "1",
      title: "Happy",
      images: { fixed_height: { url: "/placeholder.svg?height=200&width=200", width: "200", height: "200" } },
    },
    {
      id: "2",
      title: "Excited",
      images: { fixed_height: { url: "/placeholder.svg?height=200&width=200", width: "200", height: "200" } },
    },
    {
      id: "3",
      title: "Thumbs Up",
      images: { fixed_height: { url: "/placeholder.svg?height=200&width=200", width: "200", height: "200" } },
    },
    {
      id: "4",
      title: "Dancing",
      images: { fixed_height: { url: "/placeholder.svg?height=200&width=200", width: "200", height: "200" } },
    },
    {
      id: "5",
      title: "Celebration",
      images: { fixed_height: { url: "/placeholder.svg?height=200&width=200", width: "200", height: "200" } },
    },
    {
      id: "6",
      title: "Love",
      images: { fixed_height: { url: "/placeholder.svg?height=200&width=200", width: "200", height: "200" } },
    },
  ]

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setGifs(mockGifs)
        setIsLoading(false)
      }, 500)
    }
  }, [isOpen])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    // Simulate search
    setTimeout(() => {
      const filtered = mockGifs.filter((gif) => gif.title.toLowerCase().includes(searchQuery.toLowerCase()))
      setGifs(filtered)
      setIsLoading(false)
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-full mb-2 right-0 w-96 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl z-50"
        >
          <div className="p-3 border-b border-white/10">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search GIFs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Button size="sm" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </div>

          <ScrollArea className="h-64 p-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {gifs.map((gif) => (
                  <motion.button
                    key={gif.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onGifSelect(gif.images.fixed_height.url)
                      onClose()
                    }}
                    className="relative aspect-square rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Image
                      src={gif.images.fixed_height.url || "/placeholder.svg"}
                      alt={gif.title}
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
