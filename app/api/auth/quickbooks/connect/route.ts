import { type NextRequest, NextResponse } from "next/server";
import { quickbooksConfig } from "@/lib/quickbooks";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const returnUrl = searchParams.get("returnUrl") || "/dashboard/user";

    // Generate a random state parameter for security
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Store the state and return URL in cookies for validation
    const response = new NextResponse();
    response.cookies.set("oauth_state", state, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });
    response.cookies.set("oauth_return_url", returnUrl, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });

    // Build the QuickBooks OAuth URL
    const baseUrl = "https://appcenter.intuit.com/connect/oauth2";
    const redirectUri = `https://lulu-seven.vercel.app/api/auth/quickbooks/callback`;

    const params = new URLSearchParams({
      client_id: quickbooksConfig.clientId,
      scope: "com.intuit.quickbooks.payment",
      redirect_uri: redirectUri,
      response_type: "code",
      access_type: "offline",
      state: state,
    });

    const authUrl = `${baseUrl}?${params.toString()}`;

    console.log("Redirecting to QuickBooks OAuth:", authUrl);

    // Redirect to QuickBooks OAuth
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error initiating QuickBooks OAuth:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initiate QuickBooks connection",
      },
      { status: 500 }
    );
  }
}
