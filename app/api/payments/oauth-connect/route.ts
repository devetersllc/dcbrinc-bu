import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Redirect to the main payment endpoint with oauth action
  const redirectUrl = new URL("/api/payments/process", request.url);
  redirectUrl.searchParams.set("action", "oauth-connect");
  return NextResponse.redirect(redirectUrl);
}
