import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const { success } = rateLimit(session.user.email, 10, 60000) // 10 uploads per minute
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const data = await req.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "audio/mpeg",
      "audio/wav",
      "application/pdf",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const path = join(process.cwd(), "public/uploads", filename)

    await writeFile(path, buffer)

    const fileUrl = `/uploads/${filename}`

    return NextResponse.json({
      url: fileUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
