import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { quickbooksConfig } from "@/lib/quickbooks"

export async function POST() {
  try {
    const db = await connectToDatabase()
    const tokensCollection = db.collection("quickbooks_tokens")

    // Find the active token
    const tokenDoc = await tokensCollection.findOne({ isActive: true }, { sort: { createdAt: -1 } })

    if (!tokenDoc || !tokenDoc.refreshToken) {
      return NextResponse.json({ success: false, error: "No refresh token available" }, { status: 400 })
    }

    // Refresh the token using QuickBooks API
    const response = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${quickbooksConfig.clientId}:${quickbooksConfig.clientSecret}`).toString("base64")}`,
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokenDoc.refreshToken,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Token refresh failed:", errorText)

      // Mark token as inactive if refresh failed
      await tokensCollection.updateOne({ _id: tokenDoc._id }, { $set: { isActive: false, updatedAt: new Date() } })

      return NextResponse.json({ success: false, error: "Failed to refresh token" }, { status: 400 })
    }

    const tokenData = await response.json()

    // Calculate new expiration time
    const expiresAt = new Date(Date.now() + (tokenData.expires_in || 3600) * 1000)

    // Update the token in database
    await tokensCollection.updateOne(
      { _id: tokenDoc._id },
      {
        $set: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || tokenDoc.refreshToken,
          expiresAt: expiresAt,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error("Error refreshing QuickBooks token:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
