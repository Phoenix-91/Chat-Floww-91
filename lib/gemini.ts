import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateAIResponse(message: string, context?: string[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = context
      ? `Context: ${context.join("\n")}\n\nUser: ${message}\n\nAssistant:`
      : `User: ${message}\n\nAssistant:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API error:", error)
    throw new Error("Failed to generate AI response")
  }
}

export async function translateText(text: string, targetLanguage: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, nothing else:\n\n${text}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Translation error:", error)
    throw new Error("Failed to translate text")
  }
}

export async function moderateContent(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Analyze this text for inappropriate content, spam, or harmful language. Respond with only "SAFE" or "UNSAFE":\n\n${text}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim() === "SAFE"
  } catch (error) {
    console.error("Content moderation error:", error)
    return true // Default to safe if moderation fails
  }
}
