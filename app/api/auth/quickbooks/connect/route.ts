import { NextResponse } from "next/server"
import { quickbooksConfig } from "@/lib/quickbooks"

export async function GET() {
  try {
    // Step 1: Authorization request (GET https://appcenter.intuit.com/connect/oauth2)
    const baseUrl = "https://appcenter.intuit.com/connect/oauth2"
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "https://lulu-seven.vercel.app"}/api/auth/quickbooks/callback`

    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const params = new URLSearchParams({
      client_id: quickbooksConfig.clientId,
      scope: "com.intuit.quickbooks.accounting com.intuit.quickbooks.payment",
      redirect_uri: redirectUri,
      response_type: "code",
      access_type: "offline",
      state: state,
    })

    const authUrl = `${baseUrl}?${params.toString()}`

    console.log("Redirecting to QuickBooks OAuth:", authUrl)

    // Redirect to QuickBooks authorization endpoint
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("Error initiating QuickBooks connection:", error)
    return NextResponse.json({ error: "Failed to initiate QuickBooks connection" }, { status: 500 })
  }
}
