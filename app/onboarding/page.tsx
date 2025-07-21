"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { User, ArrowRight, Sparkles, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const avatarOptions = [
  "/placeholder.svg?height=80&width=80&text=A",
  "/placeholder.svg?height=80&width=80&text=B",
  "/placeholder.svg?height=80&width=80&text=C",
  "/placeholder.svg?height=80&width=80&text=D",
  "/placeholder.svg?height=80&width=80&text=E",
  "/placeholder.svg?height=80&width=80&text=F",
]

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    avatar: avatarOptions[0],
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  // Pre-populate display name from session
  useEffect(() => {
    if (session?.user?.name && !formData.displayName) {
      setFormData((prev) => ({
        ...prev,
        displayName: session.user.name || "",
      }))
    }
  }, [session, formData.displayName])

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    if (!formData.displayName.trim()) {
      toast({
        title: "Display name required",
        description: "Please enter a display name to continue",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: formData.displayName.trim(),
          bio: formData.bio.trim(),
          avatar: formData.avatar,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Welcome to ChatFlow!",
          description: "Your profile has been set up successfully",
        })
        // Add a small delay to show the success message
        setTimeout(() => {
          router.push("/chat")
        }, 1000)
      } else {
        throw new Error(data.error || "Failed to complete onboarding")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      toast({
        title: "Setup failed",
        description: error instanceof Error ? error.message : "Failed to complete setup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      title: "Welcome to ChatFlow!",
      description: "Let's set up your profile to get started",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 rounded-full flex items-center justify-center mx-auto mb-4 mono-glow">
              <Sparkles className="w-10 h-10 text-white dark:text-black" />
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
              Hello, {session?.user?.name || "there"}!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We're excited to have you join our community of modern communicators.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Choose Your Avatar",
      description: "Pick an avatar that represents you",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {avatarOptions.map((avatar, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, avatar })}
                className={`relative p-2 rounded-lg border-2 transition-colors ${
                  formData.avatar === avatar
                    ? "border-black dark:border-white bg-black/10 dark:bg-white/10 mono-glow"
                    : "border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40"
                }`}
              >
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarImage src={avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                {formData.avatar === avatar && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center mono-glow">
                    <Check className="w-4 h-4 text-white dark:text-black" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Tell us about yourself",
      description: "Add some personal details to complete your profile",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-black dark:text-white">
              Display Name *
            </Label>
            <Input
              id="displayName"
              placeholder="How should others see you?"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="bg-white/30 dark:bg-black/30 border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-black dark:focus:border-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-black dark:text-white">
              Bio (Optional)
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell others a bit about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="bg-white/30 dark:bg-black/30 border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none focus:border-black dark:focus:border-white"
              rows={3}
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen mono-bg flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-bounce" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i <= step
                    ? "bg-black dark:bg-white text-white dark:text-black mono-glow"
                    : "bg-black/20 dark:bg-white/20 text-gray-600 dark:text-gray-400"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i}
              </div>
            ))}
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 h-2 rounded-full mono-glow"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10 backdrop-blur-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-black dark:text-white">{steps[step - 1].title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {steps[step - 1].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {steps[step - 1].content}

                <div className="flex justify-between">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={isLoading || (step === 3 && !formData.displayName.trim())}
                    className="bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 hover:from-mono-black-900 hover:to-mono-black-800 dark:hover:from-mono-white-300 dark:hover:to-mono-white-200 ml-auto mono-glow text-white dark:text-black"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin mr-2" />
                        Setting up...
                      </div>
                    ) : (
                      <>
                        {step === 3 ? "Complete Setup" : "Next"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
