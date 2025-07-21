import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { getServerSession } from "next-auth"

export const maxDuration = 30

export async function POST(req: Request) {
  const session = await getServerSession()

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are a helpful AI assistant integrated into ChatFlow, a modern messaging platform. 
    Be conversational, friendly, and helpful. Keep responses concise but informative.
    You can help with various tasks like answering questions, providing suggestions, 
    translating text, and general conversation.`,
  })

  return result.toDataStreamResponse()
}
