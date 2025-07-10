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

    // Step 1: Get access token using client credentials flow
    console.log("Step 1: Getting access token...");
    const tokenResult = await paymentService.getClientCredentialsToken();

    if (!tokenResult.success || !tokenResult.accessToken) {
      console.error("Failed to get access token:", tokenResult.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to authenticate with payment processor",
          details: tokenResult.error,
        },
        { status: 500 }
      );
    }

    console.log("Access token obtained successfully");

    // Step 2: Process the payment directly
    console.log("Step 2: Processing payment...");
    const paymentResult = await paymentService.createDirectPayment(
      paymentData,
      tokenResult.accessToken
    );

    if (!paymentResult.success) {
      console.error("Payment failed:", paymentResult.error);
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

    return NextResponse.json({
      success: true,
      paymentId: paymentResult.paymentId,
      transactionId: paymentResult.transactionId,
      status: paymentResult.status,
      message: "Payment processed successfully",
    });
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
