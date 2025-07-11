import { type NextRequest, NextResponse } from "next/server"
import { quickbooksConfig } from "@/lib/quickbooks"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      console.error("QuickBooks OAuth error:", error)
      return NextResponse.redirect(new URL("/dashboard/user?error=oauth_failed", request.url))
    }

    if (!code) {
      console.error("No authorization code received")
      return NextResponse.redirect(new URL("/dashboard/user?error=no_code", request.url))
    }

    console.log("Received authorization code:", code)

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${quickbooksConfig.clientId}:${quickbooksConfig.clientSecret}`).toString("base64")}`,
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "https://lulu-seven.vercel.app"}/api/auth/quickbooks/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("Token exchange failed:", errorText)
      return NextResponse.redirect(new URL("/dashboard/user?error=token_exchange_failed", request.url))
    }

    const tokenData = await tokenResponse.json()
    console.log("Token exchange successful")

    // Store tokens in a simple way (in production, use a proper database)
    const response = NextResponse.redirect(new URL("/dashboard/user?success=connected", request.url))

    // Set secure cookies with the tokens
    response.cookies.set("qb_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenData.expires_in || 3600,
    })

    if (tokenData.refresh_token) {
      response.cookies.set("qb_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 8640000, // 100 days
      })
    }

    return response
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.redirect(new URL("/dashboard/user?error=callback_failed", request.url))
  }
}
