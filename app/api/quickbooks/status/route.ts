import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const db = await connectToDatabase()
    const tokensCollection = db.collection("quickbooks_tokens")

    // Find the active token
    const tokenDoc = await tokensCollection.findOne({ isActive: true }, { sort: { createdAt: -1 } })

    if (!tokenDoc) {
      return NextResponse.json({
        isConnected: false,
        error: "No QuickBooks connection found",
      })
    }

    // Check if token is expired
    const now = new Date()
    const isExpired = tokenDoc.expiresAt < now

    if (isExpired) {
      return NextResponse.json({
        isConnected: false,
        error: "QuickBooks connection has expired",
      })
    }

    return NextResponse.json({
      isConnected: true,
      connectedAt: tokenDoc.createdAt.toISOString(),
      expiresAt: tokenDoc.expiresAt.toISOString(),
      companyName: tokenDoc.companyName || "QuickBooks Company",
      companyId: tokenDoc.companyId,
    })
  } catch (error) {
    console.error("Error checking QuickBooks status:", error)
    return NextResponse.json(
      {
        isConnected: false,
        error: "Failed to check connection status",
      },
      { status: 500 },
    )
  }
}
