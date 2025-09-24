import { type NextRequest, NextResponse } from "next/server";
import { quickbooksConfig } from "@/lib/quickbooks";
import { connectToDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("QuickBooks OAuth error:", error);
      return NextResponse.redirect(
        new URL("/dashboard/admin?error=oauth_failed", request.url)
      );
    }

    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect(
        new URL("/dashboard/admin?error=no_code", request.url)
      );
    }

    console.log("Received authorization code:", code);

    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${quickbooksConfig.clientId}:${quickbooksConfig.clientSecret}`
          ).toString("base64")}`,
          Accept: "application/json",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: `${
            process.env.NEXT_PUBLIC_APP_URL || "https://dcbrinc.vercel.app"
          }/api/auth/quickbooks/callback`,
        }),
      }
    );
    console.log(
      "Token response-------------------------------------------------------",
      tokenResponse
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.redirect(
        new URL("/dashboard/admin?error=token_exchange_failed", request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    console.log("Token exchange successful");

    // Store token in database
    try {
      const db = await connectToDatabase();
      const tokensCollection = db.collection("quickbooks_tokens");

      // First, mark any existing tokens as inactive
      await tokensCollection.updateMany(
        { isActive: true },
        { $set: { isActive: false, updatedAt: new Date() } }
      );

      // Calculate expiration time
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

      // Insert new token
      const tokenDocument = {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenType: tokenData.token_type || "Bearer",
        expiresIn: tokenData.expires_in || 3600,
        expiresAt: expiresAt,
        scope: tokenData.scope || "",
        companyId: tokenData.realmId || "",
        companyName: "QuickBooks Company", // You can fetch this later if needed
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };
      console.log("tokenDocument-------------------------", tokenDocument);

      await tokensCollection.insertOne(tokenDocument);
      console.log("Token stored in database successfully");
    } catch (dbError) {
      console.error("Failed to store token in database:", dbError);
      return NextResponse.redirect(
        new URL("/dashboard/admin?error=database_failed", request.url)
      );
    }

    return NextResponse.redirect(
      new URL("/dashboard/admin?success=connected", request.url)
    );
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/admin?error=callback_failed", request.url)
    );
  }
}
