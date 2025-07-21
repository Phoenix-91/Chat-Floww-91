import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(req: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { emoji } = await req.json()
    const { messageId } = params

    if (!emoji) {
      return NextResponse.json({ error: "Emoji is required" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("chatflow")
    const messages = db.collection("messages")

    const message = await messages.findOne({ _id: new ObjectId(messageId) })

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions?.find(
      (r: any) => r.emoji === emoji && r.users.includes(session.user.email),
    )

    if (existingReaction) {
      // Remove reaction
      await messages.updateOne(
        { _id: new ObjectId(messageId) },
        {
          $pull: {
            "reactions.$[elem].users": session.user.email,
          },
        },
        {
          arrayFilters: [{ "elem.emoji": emoji }],
        },
      )

      // Remove empty reaction objects
      await messages.updateOne(
        { _id: new ObjectId(messageId) },
        {
          $pull: {
            reactions: { users: { $size: 0 } },
          },
        },
      )
    } else {
      // Add reaction
      const reactionExists = message.reactions?.some((r: any) => r.emoji === emoji)

      if (reactionExists) {
        await messages.updateOne(
          { _id: new ObjectId(messageId), "reactions.emoji": emoji },
          {
            $addToSet: {
              "reactions.$.users": session.user.email,
            },
          },
        )
      } else {
        await messages.updateOne(
          { _id: new ObjectId(messageId) },
          {
            $push: {
              reactions: {
                emoji,
                users: [session.user.email],
              },
            },
          },
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
