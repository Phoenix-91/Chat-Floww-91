import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, bio, avatar } = await req.json()

    await client.connect()
    const db = client.db("chatflow")
    const users = db.collection("users")

    await users.updateOne(
      { email: session.user.email },
      {
        $set: {
          displayName: name,
          bio,
          avatar,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await client.connect()
    const db = client.db("chatflow")
    const users = db.collection("users")

    const user = await users.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.displayName || user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      profileCode: user.profileCode,
      isOnline: true, // You'd implement real online status tracking
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await client.close()
  }
}
