import { type NextRequest, NextResponse } from "next/server";
import {
  QuickBooksPaymentService,
  quickbooksConfig,
  type PaymentRequest,
} from "@/lib/quickbooks";

export async function POST(request: NextRequest) {
  try {
    console.log("Processing production payment request");

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

    const returnUrl =
      request.cookies.get("oauth_return_url")?.value || "/dashboard/user";

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
          // code: code,
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
    console.log("Token exchange successful, tokenData:", tokenData);
    // Get access token from cookies
    let accessToken =
      request.cookies.get("qb_access_token")?.value || tokenData?.access_token;
    let refreshToken =
      request.cookies.get("qb_refresh_token")?.value ||
      tokenData?.refresh_token;
    console.log("refreshToken--------------------", refreshToken);
    console.log("accessToken---------------------", accessToken);
    console.log(
      "qb_access_token--------------------",
      request.cookies.get("qb_access_token")
    );
    console.log(
      "qb_refresh_token--------------------",
      request.cookies.get("qb_refresh_token")
    );

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: "QuickBooks authorization required",
          requiresAuth: true,
          authUrl: `https://lulu-seven.vercel.app/api/auth/quickbooks/connect`,
        },
        { status: 401 }
      );
    }

    // Initialize QuickBooks payment service
    const paymentService = new QuickBooksPaymentService(quickbooksConfig);

    let currentAccessToken = accessToken;

    // If no access token but we have refresh token, try to refresh
    if (!currentAccessToken && refreshToken) {
      console.log("Attempting to refresh access token...");
      const refreshResult = await paymentService.refreshAccessToken(
        refreshToken
      );

      if (refreshResult) {
        currentAccessToken = refreshResult.accessToken;

        // Update cookies with new tokens
        const response = NextResponse.json({
          success: true,
          message: "Token refreshed",
        });
        response.cookies.set("qb_access_token", refreshResult.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 3600,
        });

        if (refreshResult.refreshToken) {
          response.cookies.set("qb_refresh_token", refreshResult.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 8640000,
          });
        }
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "QuickBooks authorization expired",
            requiresAuth: true,
            authUrl: `https://lulu-seven.vercel.app/api/auth/quickbooks/connect`,
          },
          { status: 401 }
        );
      }
    }
    console.log("currentAccessToken--------------------", currentAccessToken);
    if (!currentAccessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "QuickBooks authorization required",
          requiresAuth: true,
          authUrl: `https://lulu-seven.vercel.app/api/auth/quickbooks/connect`,
        },
        { status: 401 }
      );
    }

    // Process the payment
    const paymentResult = await paymentService.createPayment(
      paymentData,
      currentAccessToken
    );
    console.log(
      "paymentResult----------------------------------------------------------------------------",
      paymentResult
    );

    if (!paymentResult.success) {
      console.error("Payment failed:", paymentResult.error);

      // Check if it's an auth error
      if (
        paymentResult.error?.includes("authentication") ||
        paymentResult.error?.includes("unauthorized")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "QuickBooks authorization expired",
            requiresAuth: true,
            authUrl: `https://lulu-seven.vercel.app/api/auth/quickbooks/connect`,
          },
          { status: 401 }
        );
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

    console.log("Payment processed successfully");
    return NextResponse.json({
      success: true,
      paymentId: paymentResult.paymentId,
      transactionId: paymentResult.transactionId,
      status: paymentResult.status,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("Payment processing error:", error);

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
