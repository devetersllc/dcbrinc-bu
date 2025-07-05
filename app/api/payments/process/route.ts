import { type NextRequest, NextResponse } from "next/server";
import {
  QuickBooksPaymentService,
  quickbooksConfig,
  type PaymentRequest,
  debugQuickBooksConfig,
} from "@/lib/quickbooks";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Payment Processing Started ===");

    // Debug environment variables
    debugQuickBooksConfig();

    let paymentData: PaymentRequest;
    try {
      paymentData = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request JSON:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request format",
          details: "Request body must be valid JSON",
        },
        { status: 400 }
      );
    }

    console.log("Payment data received:", {
      ...paymentData,
      cardData: {
        ...paymentData.cardData,
        number: paymentData.cardData?.number ? "[REDACTED]" : "MISSING",
        cvc: paymentData.cardData?.cvc ? "[REDACTED]" : "MISSING",
      },
    });

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
        console.error(`Missing required field: ${field}`);
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
      console.error("Missing card data");
      return NextResponse.json(
        {
          success: false,
          error: "Missing card data",
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (paymentData.amount <= 0) {
      console.error("Invalid amount:", paymentData.amount);
      return NextResponse.json(
        {
          success: false,
          error: "Payment amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Initialize QuickBooks payment service
    const paymentService = new QuickBooksPaymentService(quickbooksConfig);

    // Process the payment
    console.log("Processing payment with QuickBooks service...");
    const paymentResult = await paymentService.createPayment(paymentData);
    console.log("Payment result:", {
      success: paymentResult.success,
      paymentId: paymentResult.paymentId,
      status: paymentResult.status,
      error: paymentResult.error,
    });

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

    // Return success response
    console.log("=== Payment Processed Successfully ===");
    return NextResponse.json({
      success: true,
      paymentId: paymentResult.paymentId,
      transactionId: paymentResult.transactionId,
      status: paymentResult.status,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("=== Payment Processing Error ===");
    console.error("Error details:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

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
