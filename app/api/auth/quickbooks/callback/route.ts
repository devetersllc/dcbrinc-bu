import { type NextRequest, NextResponse } from "next/server";
import { QuickBooksPaymentService, quickbooksConfig } from "@/lib/quickbooks";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    console.log("QuickBooks callback received:", {
      code: !!code,
      state,
      error,
    });

    // Check for OAuth errors
    if (error) {
      console.error("OAuth error:", error);
      const redirectUrl = new URL("/test-payment", request.url);
      redirectUrl.searchParams.set("error", error);
      return NextResponse.redirect(redirectUrl);
    }

    // Validate required parameters
    if (!code) {
      console.error("No authorization code received");
      const redirectUrl = new URL("/test-payment", request.url);
      redirectUrl.searchParams.set("error", "No authorization code received");
      return NextResponse.redirect(redirectUrl);
    }

    // Validate state parameter
    const storedState = request.cookies.get("qb_oauth_state")?.value;
    if (!storedState || storedState !== state) {
      console.error("Invalid state parameter");
      const redirectUrl = new URL("/test-payment", request.url);
      redirectUrl.searchParams.set("error", "Invalid state parameter");
      return NextResponse.redirect(redirectUrl);
    }

    // Exchange code for tokens
    const paymentService = new QuickBooksPaymentService(quickbooksConfig);
    const redirectUri = `${
      process.env.NEXT_PUBLIC_APP_URL || "https://lulu-seven.vercel.app"
    }/api/auth/quickbooks/callback`;

    const tokenResult = await paymentService.exchangeCodeForToken(
      code,
      redirectUri
    );

    if (!tokenResult.success || !tokenResult.accessToken) {
      console.error("Token exchange failed:", tokenResult.error);
      const redirectUrl = new URL("/test-payment", request.url);
      redirectUrl.searchParams.set(
        "error",
        tokenResult.error || "Token exchange failed"
      );
      return NextResponse.redirect(redirectUrl);
    }

    console.log("Token exchange successful");

    // Create response and set cookies
    const redirectUrl = new URL("/test-payment", request.url);
    redirectUrl.searchParams.set("success", "true");
    redirectUrl.searchParams.set(
      "message",
      "QuickBooks connected successfully"
    );

    const response = NextResponse.redirect(redirectUrl);

    // Set access token cookie
    response.cookies.set("qb_access_token", tokenResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenResult.expiresIn || 3600, // Default 1 hour
    });

    // Set refresh token cookie if available
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
    console.error("Callback processing error:", error);
    const redirectUrl = new URL("/test-payment", request.url);
    redirectUrl.searchParams.set("error", "Callback processing failed");
    return NextResponse.redirect(redirectUrl);
  }
}
