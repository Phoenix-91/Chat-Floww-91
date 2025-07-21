"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Chrome, Mail, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signIn("google", {
        callbackUrl: "/onboarding",
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to sign in with Google",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success!",
          description: "Signed in successfully",
        })
        router.push("/onboarding")
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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("email", {
        email,
        callbackUrl: "/onboarding",
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to send magic link",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Check your email!",
          description: "We sent you a magic link to sign in",
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

  return (
    <div className="min-h-screen mono-bg flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-bounce" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 rounded-lg flex items-center justify-center mono-glow">
              <Sparkles className="w-6 h-6 text-white dark:text-black" />
            </div>
            <span className="text-3xl font-bold text-black dark:text-white mono-text">ChatFlow</span>
          </div>
        </div>

        <Card className="bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10 backdrop-blur-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-black dark:text-white">Welcome back</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 border-0"
              size="lg"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-black/10 dark:bg-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/50 dark:bg-black/50 px-2 text-gray-600 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/30 dark:bg-black/30 border-black/20 dark:border-white/20 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-black dark:focus:border-white"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 hover:from-mono-black-900 hover:to-mono-black-800 dark:hover:from-mono-white-300 dark:hover:to-mono-white-200 mono-glow text-white dark:text-black"
                size="lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Magic Link
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-black dark:text-white hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-black dark:text-white hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
