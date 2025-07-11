import { type NextRequest, NextResponse } from "next/server"
import { quickbooksConfig } from "@/lib/quickbooks"

export async function GET(request: NextRequest) {
  try {
    const state = Math.random().toString(36).substring(2, 15)
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "https://lulu-seven.vercel.app"}/api/auth/quickbooks/callback`

    const authUrl = new URL("https://appcenter.intuit.com/connect/oauth2")
    authUrl.searchParams.set("client_id", quickbooksConfig.clientId)
    authUrl.searchParams.set("scope", "com.intuit.quickbooks.payment")
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("access_type", "offline")
    authUrl.searchParams.set("state", state)

    console.log("Redirecting to QuickBooks OAuth:", authUrl.toString())

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error("Connect error:", error)
    return NextResponse.json({ error: "Failed to initiate OAuth flow" }, { status: 500 })
  }
}
