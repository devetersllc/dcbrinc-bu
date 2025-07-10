import { type NextRequest, NextResponse } from "next/server";
import { quickbooksConfig } from "@/lib/quickbooks";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    console.log("QuickBooks callback received:", {
      code: code ? "present" : "missing",
      state,
      error,
    });

    // Get stored state from cookies
    const storedState = request.cookies.get("oauth_state")?.value;
    const returnUrl =
      request.cookies.get("oauth_return_url")?.value || "/dashboard/user";

    if (error) {
      console.error("QuickBooks OAuth error:", error);
      const response = NextResponse.redirect(
        new URL(`${returnUrl}?error=${encodeURIComponent(error)}`, request.url)
      );
      // Clear OAuth cookies
      response.cookies.delete("oauth_state");
      response.cookies.delete("oauth_return_url");
      return response;
    }

    if (!code) {
      console.error("No authorization code received");
      const response = NextResponse.redirect(
        new URL(`${returnUrl}?error=no_code`, request.url)
      );
      response.cookies.delete("oauth_state");
      response.cookies.delete("oauth_return_url");
      return response;
    }

    // Validate state parameter
    if (!state || !storedState || state !== storedState) {
      console.error("Invalid state parameter");
      const response = NextResponse.redirect(
        new URL(`${returnUrl}?error=invalid_state`, request.url)
      );
      response.cookies.delete("oauth_state");
      response.cookies.delete("oauth_return_url");
      return response;
    }

    console.log("Exchanging authorization code for tokens...");

    // Exchange authorization code for access token
    const redirectUri = `https://lulu-seven.vercel.app/api/auth/quickbooks/callback`;

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
          redirect_uri: redirectUri,
        }),
      }
    );

    console.log("Token exchange response status:", tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      const response = NextResponse.redirect(
        new URL(`${returnUrl}?error=token_exchange_failed`, request.url)
      );
      response.cookies.delete("oauth_state");
      response.cookies.delete("oauth_return_url");
      return response;
    }

    const tokenData = await tokenResponse.json();
    console.log("Token exchange successful, expires in:", tokenData.expires_in);

    // Create response and set secure cookies with the tokens
    const response = NextResponse.redirect(
      new URL(`${returnUrl}?success=connected`, request.url)
    );

    // Clear OAuth cookies
    response.cookies.delete("oauth_state");
    response.cookies.delete("oauth_return_url");

    // Set access token cookie
    response.cookies.set("qb_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: tokenData.expires_in ? tokenData.expires_in - 60 : 3540, // Expire 1 minute early
      path: "/",
    });

    // Set refresh token cookie if available
    if (tokenData.refresh_token) {
      response.cookies.set("qb_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 8640000, // 100 days
        path: "/",
      });
    }

    console.log("Cookies set successfully, redirecting to:", returnUrl);
    return response;
  } catch (error) {
    console.error("Callback error:", error);
    const response = NextResponse.redirect(
      new URL("/dashboard/user?error=callback_failed", request.url)
    );
    response.cookies.delete("oauth_state");
    response.cookies.delete("oauth_return_url");
    return response;
  }
}
