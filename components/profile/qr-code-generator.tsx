"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

interface QRCodeGeneratorProps {
  value: string
  size?: number
}

export function QRCodeGenerator({ value, size = 200 }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: "#FFFFFF",
          light: "#00000000",
        },
      })
    }
  }, [value, size])

  return (
    <div className="p-4 bg-white rounded-lg">
      <canvas ref={canvasRef} />
    </div>
  )
}
