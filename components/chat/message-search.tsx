"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, ChevronUp, ChevronDown } from "lucide-react"

interface SearchResult {
  id: string
  content: string
  timestamp: Date
  sender: string
}

interface MessageSearchProps {
  isOpen: boolean
  onClose: () => void
  onMessageSelect: (messageId: string) => void
}

export function MessageSearch({ isOpen, onClose, onMessageSelect }: MessageSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      content: "Hey there! How has your day been?",
      timestamp: new Date(Date.now() - 300000),
      sender: "Sarah Johnson",
    },
    {
      id: "2",
      content: "Pretty good! Just finished a big project at work.",
      timestamp: new Date(Date.now() - 240000),
      sender: "You",
    },
    {
      id: "3",
      content: "That's awesome! I've been working on some new features.",
      timestamp: new Date(Date.now() - 180000),
      sender: "Sarah Johnson",
    },
  ]

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = mockResults.filter((result) => result.content.toLowerCase().includes(query.toLowerCase()))
        setResults(filtered)
        setCurrentIndex(0)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setCurrentIndex(0)
    }
  }, [query])

  const navigateResults = (direction: "up" | "down") => {
    if (results.length === 0) return

    if (direction === "up") {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else {
      setCurrentIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    }
  }

  const handleResultClick = (result: SearchResult) => {
    onMessageSelect(result.id)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-b border-white/10 z-50"
        >
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  autoFocus
                />
              </div>

              {results.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigateResults("up")}
                    className="text-white hover:bg-white/10"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigateResults("down")}
                    className="text-white hover:bg-white/10"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-400">
                    {currentIndex + 1} of {results.length}
                  </span>
                </div>
              )}

              <Button size="sm" variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {query && (
              <div className="mt-4">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto" />
                  </div>
                ) : results.length > 0 ? (
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {results.map((result, index) => (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleResultClick(result)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            index === currentIndex
                              ? "bg-purple-500/30 border border-purple-500/50"
                              : "bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-white text-sm">{result.content}</p>
                              <p className="text-gray-400 text-xs mt-1">
                                {result.sender} • {result.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400">No messages found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
