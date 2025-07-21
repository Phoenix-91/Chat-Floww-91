"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  trigger?: boolean
}

export function AnimatedCounter({ end, duration = 2, suffix = "", trigger = false }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    if (trigger) {
      let startTime: number
      let animationFrame: number

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

        setCount(Math.floor(progress * end))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
      }
    }
  }, [end, duration, trigger])

  return (
    <motion.span
      initial={{ scale: 0.5, opacity: 0 }}
      animate={trigger ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  )
}
