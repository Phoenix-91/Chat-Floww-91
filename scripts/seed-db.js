const { MongoClient } = require("mongodb")
require("dotenv").config({ path: ".env.local" })

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("chatflow")

    // Create collections
    const collections = ["users", "chats", "messages", "friendRequests"]
    for (const collection of collections) {
      await db.createCollection(collection)
      console.log(`Created collection: ${collection}`)
    }

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ profileCode: 1 }, { unique: true })
    await db.collection("messages").createIndex({ chatId: 1, timestamp: -1 })
    await db.collection("chats").createIndex({ participants: 1 })
    await db.collection("friendRequests").createIndex({ from: 1, to: 1 }, { unique: true })

    console.log("Database indexes created")

    // Seed sample data
    const sampleUser = {
      email: "demo@chatflow.app",
      name: "Demo User",
      displayName: "Demo User",
      avatar: "/placeholder.svg?height=80&width=80",
      bio: "Welcome to ChatFlow!",
      profileCode: "DEMO123",
      onboardingCompleted: true,
      isOnline: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("users").insertOne(sampleUser)
    console.log("Sample user created")

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
