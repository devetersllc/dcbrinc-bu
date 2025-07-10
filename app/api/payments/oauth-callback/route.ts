import { type NextRequest, NextResponse } from "next/server";
import { QuickBooksPaymentService, quickbooksConfig } from "@/lib/quickbooks";

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Processing OAuth callback...");

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Check for OAuth errors
    if (error) {
      console.error("❌ OAuth error:", error);
      const errorDescription =
        searchParams.get("error_description") || "Authorization failed";
      const redirectUrl = new URL("/test-payment", request.url);
      redirectUrl.searchParams.set("error", errorDescription);
      return NextResponse.redirect(redirectUrl);
    }

    // Validate required parameters
    if (!code) {
      console.error("❌ No authorization code received");
      const redirectUrl = new URL("/test-payment", request.url);
      redirectUrl.searchParams.set("error", "No authorization code received");
      return NextResponse.redirect(redirectUrl);
    }

    // Validate state parameter
    const storedState = request.cookies.get("qb_oauth_state")?.value;
    if (!state || state !== storedState) {
      console.error("❌ Invalid state parameter");
      const redirectUrl = new URL("/test-payment", request.url);
      redirectUrl.searchParams.set("error", "Invalid state parameter");
      return NextResponse.redirect(redirectUrl);
    }

    console.log("🔑 Exchanging code for tokens...");

    // Initialize QuickBooks service
    const paymentService = new QuickBooksPaymentService(quickbooksConfig);

    // Get redirect URI
    const redirectUri = `${
      process.env.NEXT_PUBLIC_APP_URL || "https://lulu-seven.vercel.app"
    }/api/payments/oauth-callback`;

    // Exchange code for tokens
    const tokenResult = await paymentService.exchangeCodeForToken(
      code,
      redirectUri
    );

    if (!tokenResult.success || !tokenResult.accessToken) {
      console.error("❌ Token exchange failed:", tokenResult.error);
      const redirectUrl = new URL("/test-payment", request.url);
      redirectUrl.searchParams.set(
        "error",
        tokenResult.error || "Token exchange failed"
      );
      return NextResponse.redirect(redirectUrl);
    }

    console.log("✅ Tokens obtained successfully");

    // Create success redirect
    const redirectUrl = new URL("/test-payment", request.url);
    redirectUrl.searchParams.set(
      "success",
      "QuickBooks connected! You can now process payments."
    );
    redirectUrl.searchParams.set("auto_process", "true"); // Signal to auto-process pending payment

    const response = NextResponse.redirect(redirectUrl);

    // Store tokens in cookies
    response.cookies.set("qb_access_token", tokenResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenResult.expiresIn || 3600,
    });

    if (tokenResult.refreshToken) {
      response.cookies.set("qb_refresh_token", tokenResult.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 8640000, // 100 days
      });
    }

    // Clear state cookie
    response.cookies.delete("qb_oauth_state");

    return response;
  } catch (error) {
    console.error("💥 OAuth callback error:", error);
    const redirectUrl = new URL("/test-payment", request.url);
    redirectUrl.searchParams.set("error", "OAuth processing failed");
    return NextResponse.redirect(redirectUrl);
  }
}
