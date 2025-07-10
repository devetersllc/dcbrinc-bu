import { type NextRequest, NextResponse } from "next/server";
import { QuickBooksPaymentService, quickbooksConfig } from "@/lib/quickbooks";

export async function POST(request: NextRequest) {
  try {
    console.log("Auto-connect: Checking QuickBooks authorization...");

    // Check if we already have valid tokens
    let accessToken = request.cookies.get("qb_access_token")?.value;
    const refreshToken = request.cookies.get("qb_refresh_token")?.value;

    const paymentService = new QuickBooksPaymentService(quickbooksConfig);

    // If no access token but we have refresh token, try to refresh
    if (!accessToken && refreshToken) {
      console.log("Auto-connect: Attempting to refresh access token...");

      const refreshResult = await paymentService.refreshAccessToken(
        refreshToken
      );

      if (refreshResult.success && refreshResult.accessToken) {
        accessToken = refreshResult.accessToken;
        console.log("Auto-connect: Access token refreshed successfully");

        // Return success with new token info
        const response = NextResponse.json({
          success: true,
          connected: true,
          message: "Access token refreshed",
        });

        // Update cookies with new tokens
        response.cookies.set("qb_access_token", refreshResult.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: refreshResult.expiresIn || 3600,
        });

        if (refreshResult.refreshToken) {
          response.cookies.set("qb_refresh_token", refreshResult.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 8640000,
          });
        }

        return response;
      } else {
        console.log(
          "Auto-connect: Token refresh failed, need new authorization"
        );
      }
    }

    // If we have a valid access token, we're good
    if (accessToken) {
      console.log("Auto-connect: Valid access token found");
      return NextResponse.json({
        success: true,
        connected: true,
        message: "Already connected to QuickBooks",
      });
    }

    // No valid tokens, need to initiate OAuth flow
    console.log("Auto-connect: No valid tokens, initiating OAuth flow...");

    // Generate a random state parameter for security
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Get the redirect URI
    const redirectUri = `${
      process.env.NEXT_PUBLIC_APP_URL || "https://lulu-seven.vercel.app"
    }/api/auth/quickbooks/callback`;

    // Generate authorization URL
    const authUrl = paymentService.generateAuthUrl(redirectUri, state);

    console.log("Auto-connect: Generated auth URL");

    // Return the auth URL for frontend to redirect
    const response = NextResponse.json({
      success: false,
      connected: false,
      requiresAuth: true,
      authUrl: authUrl,
      message: "QuickBooks authorization required",
    });

    // Store state in cookie for validation
    response.cookies.set("qb_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error("Auto-connect error:", error);
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: "Failed to check/establish QuickBooks connection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
