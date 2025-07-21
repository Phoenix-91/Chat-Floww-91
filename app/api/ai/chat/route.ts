import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { generateAIResponse } from "@/lib/gemini"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting for AI requests
    const { success } = rateLimit(session.user.email, 20, 60000) // 20 requests per minute
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { message, context } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const response = await generateAIResponse(message, context)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
