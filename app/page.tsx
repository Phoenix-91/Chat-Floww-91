"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MessageCircle, Zap, Shield, Globe, Sparkles, Users, Bot, Star, Play } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ParallaxSection } from "@/components/ui/parallax-section"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export default function LandingPage() {
  const { data: session } = useSession()
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const featuresInView = useInView(featuresRef, { once: true })
  const statsInView = useInView(statsRef, { once: true })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Messaging",
      description: "Lightning-fast WebSocket communication with message indicators and typing status",
      gradient: "from-mono-black-600 to-mono-black-500",
    },
    {
      icon: Bot,
      title: "AI-Powered Chat",
      description: "Integrated Gemini AI chatbot for intelligent conversations and assistance",
      gradient: "from-mono-black-500 to-mono-black-600",
    },
    {
      icon: Globe,
      title: "Universal Translation",
      description: "Translate any message instantly with our built-in translation feature",
      gradient: "from-mono-black-600 to-mono-black-700",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end security with unique profile codes and secure authentication",
      gradient: "from-mono-black-700 to-mono-black-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with code splitting and intelligent caching",
      gradient: "from-mono-black-800 to-mono-black-600",
    },
    {
      icon: Users,
      title: "Social Features",
      description: "Customizable profiles, friend connections, and real-time status updates",
      gradient: "from-mono-black-600 to-mono-black-800",
    },
  ]

  const stats = [
    { number: 50000, label: "Active Users", suffix: "+" },
    { number: 1000000, label: "Messages Sent", suffix: "+" },
    { number: 99.9, label: "Uptime", suffix: "%" },
    { number: 150, label: "Countries", suffix: "+" },
  ]

  return (
    <div className="min-h-screen mono-bg overflow-hidden">
      {/* Enhanced Animated Background with Monochrome Theme */}
      <div className="absolute inset-0">
        <div
          className="absolute w-96 h-96 bg-black/10 dark:bg-white/10 rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-bounce" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-black/5 dark:bg-white/5 rounded-full blur-2xl animate-ping" />
      </div>

      {/* Navigation with enhanced animations */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-mono-black-900 to-mono-black-700 dark:from-mono-white-100 dark:to-mono-white-300 rounded-lg flex items-center justify-center mono-glow">
              <Sparkles className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="text-2xl font-bold text-black dark:text-white mono-text">ChatFlow</span>
          </motion.div>

          <div className="flex items-center space-x-4">
            {session ? (
              <Link href="/chat">
                <Button className="bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 hover:from-mono-black-900 hover:to-mono-black-800 dark:hover:from-mono-white-300 dark:hover:to-mono-white-200 transform hover:scale-105 transition-all mono-glow text-white dark:text-black">
                  Go to Chat
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transform hover:scale-105 transition-all border border-black/20 dark:border-white/20"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button className="bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 hover:from-mono-black-900 hover:to-mono-black-800 dark:hover:from-mono-white-300 dark:hover:to-mono-white-200 transform hover:scale-105 transition-all mono-glow text-white dark:text-black">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Hero Section */}
      <motion.section ref={heroRef} className="relative z-10 px-6 py-20" style={{ y, opacity, scale }}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={heroInView ? { scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <Badge className="mb-6 bg-black/10 dark:bg-white/10 text-black dark:text-white border-black/20 dark:border-white/20 animate-pulse">
                🚀 Now with AI-powered conversations
              </Badge>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold text-black dark:text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              The Future of
              <motion.span
                className="bg-gradient-to-r from-mono-black-800 to-mono-black-600 dark:from-mono-white-200 dark:to-mono-white-400 bg-clip-text text-transparent mono-text"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                {" "}
                Communication
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Experience real-time messaging like never before. With AI assistance, universal translation, and seamless
              file sharing - all in a beautifully designed interface.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 hover:from-mono-black-900 hover:to-mono-black-800 dark:hover:from-mono-white-300 dark:hover:to-mono-white-200 text-lg px-8 py-4 group transform hover:scale-105 transition-all mono-glow text-white dark:text-black"
                >
                  Start Chatting Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 text-lg px-8 py-4 bg-transparent group transform hover:scale-105 transition-all"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <ParallaxSection offset={50}>
        <section ref={statsRef} className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2 mono-text">
                    <AnimatedCounter end={stat.number} duration={2} suffix={stat.suffix} trigger={statsInView} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Enhanced Features Section */}
      <ParallaxSection offset={100}>
        <section ref={featuresRef} className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6">Powerful Features</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need for modern communication, powered by cutting-edge technology
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="group"
                >
                  <Card className="bg-white/50 dark:bg-black/50 border-black/10 dark:border-white/10 backdrop-blur-lg hover:bg-white/70 dark:hover:bg-black/70 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} dark:from-mono-white-200 dark:to-mono-white-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mono-glow`}
                      >
                        <feature.icon className="w-6 h-6 text-white dark:text-black" />
                      </div>
                      <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* Enhanced CTA Section */}
      <ParallaxSection offset={150}>
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 rounded-3xl p-12 border border-black/10 dark:border-white/10 backdrop-blur-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 animate-pulse" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
                  Ready to Transform Your Communication?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Join thousands of users already experiencing the future of messaging
                </p>
                <Link href="/auth/signin">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-mono-black-800 to-mono-black-700 dark:from-mono-white-200 dark:to-mono-white-100 hover:from-mono-black-900 hover:to-mono-black-800 dark:hover:from-mono-white-300 dark:hover:to-mono-white-200 text-lg px-12 py-4 transform hover:scale-105 transition-all mono-glow text-white dark:text-black"
                  >
                    Get Started Free
                    <Star className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </ParallaxSection>
    </div>
  )
}
