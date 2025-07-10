import { type NextRequest, NextResponse } from "next/server";
import { QuickBooksPaymentService, quickbooksConfig } from "@/lib/quickbooks";

export async function GET(request: NextRequest) {
  try {
    console.log("Processing QuickBooks OAuth callback...");

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Check for OAuth errors
    if (error) {
      console.error("QuickBooks OAuth error:", error, errorDescription);
      return NextResponse.redirect(
        new URL(
          `/dashboard/user?error=oauth_failed&details=${encodeURIComponent(
            errorDescription || error
          )}`,
          request.url
        )
      );
    }

    // Validate required parameters
    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect(
        new URL("/dashboard/user?error=no_authorization_code", request.url)
      );
    }

    // Validate state parameter for security
    const storedState = request.cookies.get("qb_oauth_state")?.value;
    if (!storedState || storedState !== state) {
      console.error("Invalid or missing state parameter");
      return NextResponse.redirect(
        new URL("/dashboard/user?error=invalid_state", request.url)
      );
    }

    console.log("Authorization code received:", code.substring(0, 10) + "...");

    // Initialize QuickBooks service
    const paymentService = new QuickBooksPaymentService(quickbooksConfig);

    // Get redirect URI (must match the one used in connect route)
    const redirectUri = `${
      process.env.NEXT_PUBLIC_APP_URL || "https://lulu-seven.vercel.app"
    }/api/auth/quickbooks/callback`;

    // Exchange authorization code for access token
    const tokenResult = await paymentService.exchangeCodeForToken(
      code,
      redirectUri
    );

    if (!tokenResult.success) {
      console.error("Token exchange failed:", tokenResult.error);
      return NextResponse.redirect(
        new URL(
          `/dashboard/user?error=token_exchange_failed&details=${encodeURIComponent(
            tokenResult.error || "Unknown error"
          )}`,
          request.url
        )
      );
    }

    console.log("Token exchange successful");

    // Create response and set secure cookies with tokens
    const response = NextResponse.redirect(
      new URL("/dashboard/user?success=quickbooks_connected", request.url)
    );

    // Clear the state cookie
    response.cookies.delete("qb_oauth_state");

    // Set access token cookie
    if (tokenResult.accessToken) {
      response.cookies.set("qb_access_token", tokenResult.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: tokenResult.expiresIn || 3600, // Default to 1 hour if not specified
      });
    }

    // Set refresh token cookie (if provided)
    if (tokenResult.refreshToken) {
      response.cookies.set("qb_refresh_token", tokenResult.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 8640000, // 100 days (typical refresh token lifetime)
      });
    }

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL(
        `/dashboard/user?error=callback_failed&details=${encodeURIComponent(
          error instanceof Error ? error.message : "Unknown error"
        )}`,
        request.url
      )
    );
  }
}
