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

    // Get access token from cookies
    // const accessToken = request.cookies.get("qb_access_token")?.value
    const accessToken =
      "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwieC5vcmciOiJIMCJ9..i81ezaObXPWsibfHio6-Xw.KlOY7vd9L1Yb4bHRd8qIacmrHozbKvmBfBlRv6NfKlyimqy6W4b9cQeZx2cJN5-02bNs4KIGf-7hCxg5goK9RDPNbyC_KyT0vRxYusU3882j6C4wY_8x2h1qc65So1MdGydV1D5Z6yjOF_zUONMy6K6XvtzdpOKIriZIUpyMOOTVXWAag8G5SNB3l-LYW78Tj2U9EHLixNu6dF2o-jlUBdKIllbzFKxD5tK-_gZ6DrWhSFWvb14HWh8nt7S5478_sTuQdEd_iacsoUxPzOr8UmjHZDZrs8tVvVo9Bg7CLoFY0z2f5RVRD15v3b34-QEFLONSJP_vSVGNsPUDPTA7oqQYQF3GBU1Ut0Myd2AMcIAQLhpXp0dbs-aOFYI3OZWWIrrkiOZVuxgEKXVfqvbt1uNktu3F_uRJeeaOLPexf55EhDgCK7MwYcDM97Pt7Q_AarPV4FR42oXD67Y8m7fQa-CYtyyOU-FcXaga4Iv5X0g.yqEIXqejNzXGEeojKhp-kw";
    const refreshToken = request.cookies.get("qb_refresh_token")?.value;

    if (!accessToken && !refreshToken) {
      console.log(
        "!accessToken && !refreshToken",
        !accessToken && !refreshToken
      );

      return NextResponse.json(
        {
          success: false,
          error: "QuickBooks authorization required",
          requiresAuth: true,
          authUrl: "/api/auth/quickbooks/connect",
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
            authUrl: "/api/auth/quickbooks/connect",
          },
          { status: 401 }
        );
      }
    }

    if (!currentAccessToken) {
      console.log("!currentAccessToken", currentAccessToken);
      return NextResponse.json(
        {
          success: false,
          error: "QuickBooks authorization required",
          requiresAuth: true,
          authUrl: "/api/auth/quickbooks/connect",
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
            authUrl: "/api/auth/quickbooks/connect",
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
