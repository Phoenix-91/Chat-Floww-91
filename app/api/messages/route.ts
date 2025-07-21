import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { MongoClient, ObjectId } from "mongodb"
import { rateLimit } from "@/lib/rate-limit"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const { success } = rateLimit(session.user.email, 100, 60000)
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get("chatId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("chatflow")
    const messages = db.collection("messages")

    const skip = (page - 1) * limit

    const messageList = await messages.find({ chatId }).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray()

    return NextResponse.json({
      messages: messageList.reverse(),
      hasMore: messageList.length === limit,
    })
  } catch (error) {
    console.error("Messages fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const { success } = rateLimit(session.user.email, 50, 60000)
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { chatId, content, type = "text", replyTo } = await req.json()

    if (!chatId || !content) {
      return NextResponse.json({ error: "Chat ID and content are required" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("chatflow")
    const messages = db.collection("messages")
    const chats = db.collection("chats")

    const message = {
      chatId,
      content,
      type,
      sender: session.user.email,
      timestamp: new Date(),
      status: "sent",
      reactions: [],
      replyTo: replyTo ? new ObjectId(replyTo) : null,
      edited: false,
      editedAt: null,
    }

    const result = await messages.insertOne(message)

    // Update chat's last message
    await chats.updateOne(
      { _id: new ObjectId(chatId) },
      {
        $set: {
          lastMessage: content,
          lastMessageAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      id: result.insertedId,
      ...message,
    })
  } catch (error) {
    console.error("Message send error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
