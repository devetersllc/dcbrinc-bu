import { type NextRequest, NextResponse } from "next/server";
import {
  QuickBooksPaymentService,
  quickbooksConfig,
  type PaymentRequest,
} from "@/lib/quickbooks";

export async function POST(request: NextRequest) {
  try {
    console.log("Payment processing started");

    const paymentData: PaymentRequest = await request.json();
    console.log("Payment data received:", {
      ...paymentData,
      cardData: "[REDACTED]",
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
    console.log("Processing payment with QuickBooks...");
    const paymentResult = await paymentService.createPayment(paymentData);
    console.log("Payment result:", paymentResult);

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
    console.log("Payment processed successfully");
    return NextResponse.json({
      success: true,
      paymentId: paymentResult.paymentId,
      transactionId: paymentResult.transactionId,
      status: paymentResult.status,
      message: "Payment processed successfully",
      details: paymentResult.details,
    });
  } catch (error) {
    console.error("Payment processing error:", error);

    // Handle JSON parsing errors
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

// Add OPTIONS handler for CORS
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
