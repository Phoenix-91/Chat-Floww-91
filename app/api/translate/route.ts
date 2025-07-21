import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, targetLanguage = "en" } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Mock translation - in a real app, you'd use Google Translate API or similar
    const translations: Record<string, string> = {
      Hello: "Hola",
      "How are you?": "¿Cómo estás?",
      "Good morning": "Buenos días",
      "Thank you": "Gracias",
      Goodbye: "Adiós",
    }

    const translatedText = translations[text] || `[Translated: ${text}]`

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
