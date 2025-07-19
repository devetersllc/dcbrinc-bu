import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function GET() {
  try {
    const db = await connectToDatabase()
    const usersCollection = db.collection("users")

    // Check if admin already exists
    const adminExists = await usersCollection.findOne({ role: "admin" })

    if (!adminExists) {
      // Create admin user
      const hashedPassword = await hashPassword("admin123")
      await usersCollection.insertOne({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      })
    }

    // Create some sample users if they don't exist
    const sampleUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: await hashPassword("password123"),
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: await hashPassword("password123"),
        role: "user",
      },
    ]

    for (const user of sampleUsers) {
      const exists = await usersCollection.findOne({ email: user.email })
      if (!exists) {
        await usersCollection.insertOne(user)
      }
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      adminCredentials: {
        email: "admin@example.com",
        password: "admin123",
      },
      userCredentials: {
        email: "john@example.com",
        password: "password123",
      },
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
