import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Database helper functions
export async function getDatabase() {
  const client = await clientPromise
  return client.db("chatflow")
}

export async function createIndexes() {
  const db = await getDatabase()

  // Users collection indexes
  await db.collection("users").createIndex({ email: 1 }, { unique: true })
  await db.collection("users").createIndex({ profileCode: 1 }, { unique: true })

  // Messages collection indexes
  await db.collection("messages").createIndex({ chatId: 1, timestamp: -1 })
  await db.collection("messages").createIndex({ sender: 1 })

  // Chats collection indexes
  await db.collection("chats").createIndex({ participants: 1 })
  await db.collection("chats").createIndex({ lastMessageAt: -1 })

  // Friend requests collection indexes
  await db.collection("friendRequests").createIndex({ from: 1, to: 1 }, { unique: true })
  await db.collection("friendRequests").createIndex({ to: 1, status: 1 })

  console.log("Database indexes created successfully")
}
