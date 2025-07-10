import { type NextRequest, NextResponse } from "next/server";
import {
  QuickBooksPaymentService,
  quickbooksConfig,
  type PaymentRequest,
} from "@/lib/quickbooks";

export async function POST(request: NextRequest) {
  try {
    console.log("=== UNIFIED PAYMENT PROCESSING STARTED ===");

    const paymentData: PaymentRequest = await request.json();

    // Validate required fields
    const requiredFields = [
      "amount",
      "currency",
      "description",
      "customerName",
      "customerEmail",
      "orderId",
    ];
    for (const field of requiredFields) {
      if (!paymentData[field as keyof PaymentRequest]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate card data
    if (!paymentData.cardData) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing card data",
        },
        { status: 400 }
      );
    }

    const requiredCardFields = [
      "number",
      "expMonth",
      "expYear",
      "cvc",
      "name",
      "address",
    ];
    for (const field of requiredCardFields) {
      if (!paymentData.cardData[field as keyof typeof paymentData.cardData]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing card field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate amount
    if (typeof paymentData.amount !== "number" || paymentData.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment amount must be a positive number",
        },
        { status: 400 }
      );
    }

    console.log("✅ Payment data validation passed");

    // Initialize QuickBooks payment service
    const paymentService = new QuickBooksPaymentService(quickbooksConfig);

    // Check existing tokens
    let accessToken = request.cookies.get("qb_access_token")?.value;
    const refreshToken = request.cookies.get("qb_refresh_token")?.value;

    console.log("🔍 Token status:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    });

    // STEP 1: Try to refresh token if we have refresh token but no access token
    if (!accessToken && refreshToken) {
      console.log("🔄 Attempting to refresh access token...");
      const refreshResult = await paymentService.refreshAccessToken(
        refreshToken
      );

      if (refreshResult.success && refreshResult.accessToken) {
        accessToken = refreshResult.accessToken;
        console.log("✅ Token refreshed successfully");
      } else {
        console.log("❌ Token refresh failed:", refreshResult.error);
        // Clear invalid refresh token
        const response = NextResponse.json(
          {
            success: false,
            error: "QuickBooks authorization expired",
            requiresAuth: true,
            authUrl: `/api/payments/oauth-connect`,
          },
          { status: 401 }
        );
        response.cookies.delete("qb_refresh_token");
        return response;
      }
    }

    // STEP 2: If no valid access token, return OAuth requirement
    if (!accessToken) {
      console.log("🔐 No valid access token - OAuth required");
      return NextResponse.json(
        {
          success: false,
          error: "QuickBooks authorization required",
          requiresAuth: true,
          authUrl: `/api/payments/oauth-connect`,
        },
        { status: 401 }
      );
    }

    // STEP 3: Process payment with valid access token
    console.log("💳 Processing payment with valid access token...");
    const paymentResult = await paymentService.createPayment(
      paymentData,
      accessToken
    );

    if (!paymentResult.success) {
      console.error("❌ Payment failed:", paymentResult.error);

      // If auth error, clear tokens and require re-authorization
      if (paymentResult.requiresAuth) {
        const response = NextResponse.json(
          {
            success: false,
            error: "QuickBooks authorization expired - please reconnect",
            requiresAuth: true,
            authUrl: `/api/payments/oauth-connect`,
          },
          { status: 401 }
        );

        // Clear expired tokens
        response.cookies.delete("qb_access_token");
        response.cookies.delete("qb_refresh_token");
        return response;
      }

      return NextResponse.json(
        {
          success: false,
          error: paymentResult.error || "Payment processing failed",
          details: paymentResult.details,
        },
        { status: 400 }
      );
    }

    console.log("✅ Payment processed successfully:", paymentResult.paymentId);

    // Create success response
    const response = NextResponse.json({
      success: true,
      paymentId: paymentResult.paymentId,
      transactionId: paymentResult.transactionId,
      status: paymentResult.status,
      message: "Payment processed successfully",
      details: paymentResult.details,
    });

    // Update access token cookie if we refreshed it
    if (
      refreshToken &&
      accessToken &&
      !request.cookies.get("qb_access_token")?.value
    ) {
      response.cookies.set("qb_access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600, // 1 hour
      });
      console.log("🍪 Updated access token cookie");
    }

    return response;
  } catch (error) {
    console.error("💥 Payment processing error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
          details: "Request body must be valid JSON",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during payment processing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle OAuth initiation in the same endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "oauth-connect") {
      console.log("🔗 Initiating OAuth connection...");

      // Generate state for security
      const state =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Get redirect URI
      const redirectUri = `${
        process.env.NEXT_PUBLIC_APP_URL || "https://lulu-seven.vercel.app"
      }/api/payments/oauth-callback`;

      // Initialize QuickBooks service
      const paymentService = new QuickBooksPaymentService(quickbooksConfig);

      // Generate authorization URL
      const authUrl = paymentService.generateAuthUrl(redirectUri, state);

      console.log("🚀 Redirecting to QuickBooks OAuth...");

      // Create redirect response
      const response = NextResponse.redirect(authUrl);

      // Store state for validation
      response.cookies.set("qb_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600, // 10 minutes
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action parameter",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("OAuth initiation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initiate OAuth",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
