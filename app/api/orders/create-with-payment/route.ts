import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { orderData, paymentData } = requestData;

    // Validate required fields
    const requiredOrderFields = [
      "name",
      "email",
      "pdfCloudinaryUrl",
      "coverCloudinaryUrl",
      "bookSize",
      "pageCount",
      "interiorColor",
      "paperType",
      "bindingType",
      "coverFinish",
      "totalPrice",
    ];

    for (const field of requiredOrderFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `Missing required order field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate payment data
    if (!paymentData?.paymentId || !paymentData?.transactionId) {
      return NextResponse.json(
        { error: "Valid payment information is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    // Create the order object with payment information
    const order = {
      name: orderData.name,
      email: orderData.email,
      pdfCloudinaryUrl: orderData.pdfCloudinaryUrl,
      coverCloudinaryUrl: orderData.coverCloudinaryUrl,
      bookSize: orderData.bookSize,
      pageCount: Number.parseInt(orderData.pageCount),
      interiorColor: orderData.interiorColor,
      paperType: orderData.paperType,
      bindingType: orderData.bindingType,
      coverFinish: orderData.coverFinish,
      totalPrice: Number.parseFloat(orderData.totalPrice),
      status: "paid",
      orderDate: new Date(),
      paymentInfo: {
        paymentId: paymentData.paymentId,
        transactionId: paymentData.transactionId,
        status: paymentData.status,
        processedAt: new Date(),
        amount: Number.parseFloat(orderData.totalPrice),
        currency: "USD",
      },
    };

    // Save the order to database
    const result = await db.collection("orders").insertOne(order);

    return NextResponse.json({
      success: true,
      orderId: result.insertedId,
      paymentId: paymentData.paymentId,
      message: "Order created successfully with payment confirmation",
    });
  } catch (error) {
    console.error("Failed to create order with payment:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
