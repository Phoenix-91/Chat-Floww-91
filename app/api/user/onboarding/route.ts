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

    const body = await req.json()
    const { displayName, bio, avatar } = body

    // Validate required fields
    if (!displayName || !displayName.trim()) {
      return NextResponse.json({ error: "Display name is required" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("chatflow")
    const users = db.collection("users")

    // Generate unique profile code
    let profileCode = ""
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    while (!isUnique && attempts < maxAttempts) {
      profileCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      const existingUser = await users.findOne({ profileCode })
      if (!existingUser) {
        isUnique = true
      }
      attempts++
    }

    if (!isUnique) {
      return NextResponse.json({ error: "Failed to generate unique profile code" }, { status: 500 })
    }

    const userData = {
      email: session.user.email,
      name: session.user.name,
      displayName: displayName.trim(),
      bio: bio?.trim() || "",
      avatar: avatar || "/placeholder.svg?height=80&width=80",
      profileCode,
      onboardingCompleted: true,
      isOnline: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await users.updateOne({ email: session.user.email }, { $set: userData }, { upsert: true })

    return NextResponse.json({
      success: true,
      profileCode,
      message: "Profile created successfully",
    })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json(
      {
        error: "Internal server error. Please try again.",
      },
      { status: 500 },
    )
  } finally {
    await client.close()
  }
}
