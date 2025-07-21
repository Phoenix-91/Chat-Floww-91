import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("chatflow")
    const chats = db.collection("chats")
    const users = db.collection("users")

    // Get user's chats
    const userChats = await chats
      .find({
        participants: session.user.email,
      })
      .sort({ lastMessageAt: -1 })
      .toArray()

    // Populate chat data
    const populatedChats = await Promise.all(
      userChats.map(async (chat) => {
        if (chat.type === "direct") {
          // For direct chats, get the other participant's info
          const otherParticipant = chat.participants.find((p: string) => p !== session.user.email)
          const otherUser = await users.findOne({ email: otherParticipant })

          return {
            id: chat._id,
            name: otherUser?.displayName || otherUser?.name || "Unknown User",
            avatar: otherUser?.avatar || "/placeholder.svg",
            lastMessage: chat.lastMessage || "",
            timestamp: chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleString() : "",
            unread: chat.unreadCount?.[session.user.email] || 0,
            online: otherUser?.isOnline || false,
            isGroup: false,
            isAI: false,
          }
        } else {
          // For group chats
          return {
            id: chat._id,
            name: chat.name,
            avatar: chat.avatar || "/placeholder.svg",
            lastMessage: chat.lastMessage || "",
            timestamp: chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleString() : "",
            unread: chat.unreadCount?.[session.user.email] || 0,
            online: false,
            isGroup: true,
            isAI: false,
            memberCount: chat.participants.length,
          }
        }
      }),
    )

    return NextResponse.json({ chats: populatedChats })
  } catch (error) {
    console.error("Chats fetch error:", error)
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

    const { participants, name, type = "direct" } = await req.json()

    if (!participants || participants.length === 0) {
      return NextResponse.json({ error: "Participants are required" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("chatflow")
    const chats = db.collection("chats")

    // For direct chats, check if chat already exists
    if (type === "direct" && participants.length === 2) {
      const existingChat = await chats.findOne({
        type: "direct",
        participants: { $all: participants, $size: 2 },
      })

      if (existingChat) {
        return NextResponse.json({ chatId: existingChat._id })
      }
    }

    const chat = {
      type,
      name: type === "group" ? name : null,
      participants: [...participants, session.user.email],
      createdBy: session.user.email,
      createdAt: new Date(),
      lastMessage: null,
      lastMessageAt: null,
      unreadCount: {},
    }

    const result = await chats.insertOne(chat)

    return NextResponse.json({ chatId: result.insertedId })
  } catch (error) {
    console.error("Chat creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
