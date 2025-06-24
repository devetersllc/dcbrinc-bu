import { type NextRequest, NextResponse } from "next/server";
import { QuickBooksPaymentService, quickbooksConfig } from "@/lib/quickbooks";

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const paymentService = new QuickBooksPaymentService(quickbooksConfig);
    const statusResult = await paymentService.getPaymentStatus(paymentId);

    if (!statusResult.success) {
      return NextResponse.json(
        {
          error: statusResult.error || "Failed to get payment status",
          details: statusResult.details,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: statusResult.paymentId,
      status: statusResult.status,
      details: statusResult.details,
    });
  } catch (error) {
    console.error("Error getting payment status:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
