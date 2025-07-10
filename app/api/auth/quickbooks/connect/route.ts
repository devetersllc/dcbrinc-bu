import { type NextRequest, NextResponse } from "next/server";
import { QuickBooksPaymentService, quickbooksConfig } from "@/lib/quickbooks";

export async function GET(request: NextRequest) {
  try {
    console.log("Initiating QuickBooks OAuth flow...");

    // Generate a random state parameter for security
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Get the redirect URI from environment or use default
    const redirectUri = `${
      process.env.NEXT_PUBLIC_APP_URL || "https://lulu-seven.vercel.app"
    }/api/auth/quickbooks/callback`;

    console.log("Redirect URI:", redirectUri);

    // Initialize QuickBooks service
    const paymentService = new QuickBooksPaymentService(quickbooksConfig);

    // Generate authorization URL following the OAuth 2 flow
    const authUrl = paymentService.generateAuthUrl(redirectUri, state);

    console.log("Generated auth URL:", authUrl);

    // Store state in a cookie for validation in callback
    const response = NextResponse.redirect(authUrl);
    response.cookies.set("qb_oauth_state", state, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error("OAuth initiation error:", error);
    return NextResponse.json(
      {
        error: "Failed to initiate OAuth flow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
