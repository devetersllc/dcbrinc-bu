import { type NextRequest, NextResponse } from "next/server";
import { QuickBooksPaymentService, quickbooksConfig } from "@/lib/quickbooks";

export async function GET(request: NextRequest) {
  try {
    console.log("Initiating QuickBooks OAuth connection...");

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

    // Generate authorization URL
    const authUrl = paymentService.generateAuthUrl(redirectUri, state);

    console.log("Generated auth URL, redirecting...");

    // Create response with redirect
    const response = NextResponse.redirect(authUrl);

    // Store state in cookie for validation
    response.cookies.set("qb_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error("OAuth initiation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initiate QuickBooks connection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
