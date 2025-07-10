import { type NextRequest, NextResponse } from "next/server";
import {
  QuickBooksPaymentService,
  quickbooksConfig,
  type PaymentRequest,
} from "@/lib/quickbooks";

export async function POST(request: NextRequest) {
  try {
    console.log("Direct payment processing started...");

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

    console.log("Payment data validated successfully");

    // Initialize QuickBooks payment service
    const paymentService = new QuickBooksPaymentService(quickbooksConfig);

    // Check if we have existing tokens in cookies
    const accessToken = request.cookies.get("qb_access_token")?.value;
    const refreshToken = request.cookies.get("qb_refresh_token")?.value;

    let validAccessToken = accessToken;

    // If we have a refresh token but no access token, try to refresh
    if (!validAccessToken && refreshToken) {
      console.log("No access token found, attempting to refresh...");
      const refreshResult = await paymentService.refreshAccessToken(
        refreshToken
      );

      if (refreshResult.success && refreshResult.accessToken) {
        validAccessToken = refreshResult.accessToken;
        console.log("Token refreshed successfully");
      } else {
        console.log("Token refresh failed:", refreshResult.error);
      }
    }

    // If we still don't have a valid token, return authorization required error
    if (!validAccessToken) {
      console.log("No valid access token available, authorization required");
      return NextResponse.json(
        {
          success: false,
          error: "QuickBooks authorization required",
          requiresAuth: true,
          authUrl: `/api/auth/quickbooks/connect`,
        },
        { status: 401 }
      );
    }

    console.log("Using existing access token for payment processing");

    // Process the payment directly with the valid token
    const paymentResult = await paymentService.createDirectPayment(
      paymentData,
      validAccessToken
    );

    if (!paymentResult.success) {
      console.error("Payment failed:", paymentResult.error);

      // If it's an auth error, clear tokens and require re-authorization
      if (paymentResult.requiresAuth) {
        const response = NextResponse.json(
          {
            success: false,
            error: "QuickBooks authorization expired",
            requiresAuth: true,
            authUrl: `/api/auth/quickbooks/connect`,
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

    console.log("Payment processed successfully:", paymentResult.paymentId);

    const response = NextResponse.json({
      success: true,
      paymentId: paymentResult.paymentId,
      transactionId: paymentResult.transactionId,
      status: paymentResult.status,
      message: "Payment processed successfully",
    });

    // Update tokens if we refreshed them
    if (!accessToken && validAccessToken) {
      response.cookies.set("qb_access_token", validAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600, // 1 hour
      });
    }

    return response;
  } catch (error) {
    console.error("Direct payment processing error:", error);

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

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
