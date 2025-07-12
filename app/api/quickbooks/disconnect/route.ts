import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function POST() {
  try {
    const db = await connectToDatabase()
    const tokensCollection = db.collection("quickbooks_tokens")

    // Mark all tokens as inactive
    const result = await tokensCollection.updateMany(
      { isActive: true },
      {
        $set: {
          isActive: false,
          updatedAt: new Date(),
        },
      },
    )

    console.log(`Disconnected ${result.modifiedCount} QuickBooks tokens`)

    return NextResponse.json({
      success: true,
      message: "QuickBooks disconnected successfully",
    })
  } catch (error) {
    console.error("Error disconnecting QuickBooks:", error)
    return NextResponse.json({ success: false, error: "Failed to disconnect QuickBooks" }, { status: 500 })
  }
}
