import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { profileCode } = await req.json()

    if (!profileCode) {
      return NextResponse.json({ error: "Profile code is required" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("chatflow")
    const users = db.collection("users")
    const friendRequests = db.collection("friendRequests")

    // Find the target user by profile code
    const targetUser = await users.findOne({ profileCode })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (targetUser.email === session.user.email) {
      return NextResponse.json({ error: "Cannot add yourself as a friend" }, { status: 400 })
    }

    // Check if friend request already exists
    const existingRequest = await friendRequests.findOne({
      $or: [
        { from: session.user.email, to: targetUser.email },
        { from: targetUser.email, to: session.user.email },
      ],
    })

    if (existingRequest) {
      return NextResponse.json({ error: "Friend request already exists" }, { status: 400 })
    }

    // Create friend request
    await friendRequests.insertOne({
      from: session.user.email,
      to: targetUser.email,
      status: "pending",
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, message: "Friend request sent" })
  } catch (error) {
    console.error("Add friend error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
