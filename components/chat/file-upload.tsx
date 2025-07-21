"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, File, ImageIcon, Video } from "lucide-react"

interface FileUploadProps {
  onFileUpload: (file: File, type: string) => void
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export function FileUpload({
  onFileUpload,
  maxSize = 10,
  acceptedTypes = ["image/*", "video/*", "application/*"],
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 100)

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUploadProgress(100)

      const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file"

      onFileUpload(file, fileType)

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      clearInterval(interval)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    return File
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 left-0 right-0 bg-white/10 backdrop-blur-lg rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">Uploading...</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsUploading(false)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.05 : 1,
          borderColor: isDragging ? "#8b5cf6" : "rgba(255, 255, 255, 0.2)",
        }}
        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-400">{isDragging ? "Drop files here" : "Click or drag files to upload"}</p>
        <p className="text-xs text-gray-500 mt-1">Max size: {maxSize}MB</p>
      </motion.div>
    </div>
  )
}
