import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function PUT(req: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await req.json()
    const { messageId } = params

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("chatflow")
    const messages = db.collection("messages")

    // Check if user owns the message
    const message = await messages.findOne({
      _id: new ObjectId(messageId),
      sender: session.user.email,
    })

    if (!message) {
      return NextResponse.json({ error: "Message not found or unauthorized" }, { status: 404 })
    }

    await messages.updateOne(
      { _id: new ObjectId(messageId) },
      {
        $set: {
          content,
          edited: true,
          editedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Message edit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messageId } = params

    await client.connect()
    const db = client.db("chatflow")
    const messages = db.collection("messages")

    // Check if user owns the message
    const message = await messages.findOne({
      _id: new ObjectId(messageId),
      sender: session.user.email,
    })

    if (!message) {
      return NextResponse.json({ error: "Message not found or unauthorized" }, { status: 404 })
    }

    await messages.deleteOne({ _id: new ObjectId(messageId) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Message delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
