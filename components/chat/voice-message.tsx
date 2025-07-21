"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Play, Pause, Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoiceMessageProps {
  onSend: (audioBlob: Blob) => void
}

export function VoiceMessage({ onSend }: VoiceMessageProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const sendVoiceMessage = () => {
    if (audioBlob) {
      onSend(audioBlob)
      setAudioBlob(null)
      setAudioUrl(null)
      setDuration(0)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center space-x-2">
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}

      {!audioBlob ? (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant={isRecording ? "destructive" : "outline"}
            onClick={isRecording ? stopRecording : startRecording}
            className={`${
              isRecording ? "bg-red-500 hover:bg-red-600" : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </motion.div>
      ) : (
        <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={isPlaying ? pauseAudio : playAudio}
            className="text-white hover:bg-white/10"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <span className="text-sm text-white">{formatDuration(duration)}</span>

          <Button size="sm" onClick={sendVoiceMessage} className="bg-green-600 hover:bg-green-700 text-white">
            Send
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setAudioBlob(null)
              setAudioUrl(null)
              setDuration(0)
            }}
            className="text-white hover:bg-white/10"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      )}

      {isRecording && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-white">{formatDuration(duration)}</span>
        </motion.div>
      )}
    </div>
  )
}
