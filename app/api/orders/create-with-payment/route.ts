import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { sendOrderNotificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { orderData, paymentData } = requestData;

    // Validate required fields
    // if (!paymentData?.paymentId || !paymentData?.transactionId) {
    //   return NextResponse.json(
    //     { error: "Valid payment information is required" },
    //     { status: 400 }
    //   );
    // }
    const orderType = orderData.type || "book";
    if (orderType === "book") {
      const requiredBookFields = [
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

      for (const field of requiredBookFields) {
        if (!orderData[field]) {
          return NextResponse.json(
            { error: `Missing required book field: ${field}` },
            { status: 400 }
          );
        }
      }
    } else if (orderType === "card") {
      const requiredCardFields = [
        "name",
        "email",
        "cardData",
        "totalPrice",
      ];
      for (const field of requiredCardFields) {
        if (!orderData[field]) {
          return NextResponse.json(
            { error: `Missing required card field: ${field}` },
            { status: 400 }
          );
        }
      }
      if (!orderData.cardData.companyName || !orderData.cardData.jobTitle) {
        return NextResponse.json(
          { error: "Missing required card data fields" },
          { status: 400 }
        );
      }
    }

    const db = await connectToDatabase();

    // Create the order object with payment information
    let order: any = {
      type: orderType,
      name: orderData.name,
      email: orderData.email,
      totalPrice: Number.parseFloat(orderData.totalPrice),
      status: "pending",
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
    if (orderType === "book") {
      order = {
        ...order,
        pdfCloudinaryUrl: orderData.pdfCloudinaryUrl,
        coverCloudinaryUrl: orderData.coverCloudinaryUrl,
        bookSize: orderData.bookSize,
        pageCount: Number.parseInt(orderData.pageCount),
        interiorColor: orderData.interiorColor,
        paperType: orderData.paperType,
        bindingType: orderData.bindingType,
        coverFinish: orderData.coverFinish,
      };
    } else if (orderType === "card") {
      order = {
        ...order,
        cardData: orderData.cardData,
      };
    }

    // Save the order to database
    const result = await db.collection("orders").insertOne(order);
    try {
      const mailResult = await sendOrderNotificationEmail(order);
      console.log("Admin notification email sent for order:", mailResult);
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
    }

    return NextResponse.json({
      success: true,
      orderId: result.insertedId,
      paymentId: paymentData.paymentId,
      message: `${
        orderType === "book" ? "Book" : "Card"
      } order created successfully with payment confirmation`,
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
