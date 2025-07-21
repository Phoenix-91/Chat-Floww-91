import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { translateText } from "@/lib/gemini"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const { success } = rateLimit(session.user.email, 30, 60000) // 30 translations per minute
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { text, targetLanguage } = await req.json()

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Text and target language are required" }, { status: 400 })
    }

    const translatedText = await translateText(text, targetLanguage)

    return NextResponse.json({
      originalText: text,
      translatedText,
      targetLanguage,
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
