import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields for card order
    const requiredFields = [
      "name",
      "email",
      "cardImageUrl",
      "cardData",
      "totalPrice",
    ];

    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate cardData structure
    const cardDataRequiredFields = [
      "companyName",
      "companyMessage",
      "jobTitle",
      "phone",
      "address",
      "backgroundColor",
      "textColor",
    ];

    for (const field of cardDataRequiredFields) {
      if (!orderData.cardData[field]) {
        return NextResponse.json(
          { error: `Missing required card data field: ${field}` },
          { status: 400 }
        );
      }
    }

    const db = await connectToDatabase();

    // Create the card order object
    const order = {
      name: orderData.name,
      email: orderData.email,
      type: "card",
      cardImageUrl: orderData.cardImageUrl,
      cardData: {
        companyName: orderData.cardData.companyName,
        companyMessage: orderData.cardData.companyMessage,
        companyLogo: orderData.cardData.companyLogo || null,
        jobTitle: orderData.cardData.jobTitle,
        phone: orderData.cardData.phone,
        address: orderData.cardData.address,
        website: orderData.cardData.website || null,
        backgroundColor: orderData.cardData.backgroundColor,
        textColor: orderData.cardData.textColor,
      },
      totalPrice: Number.parseFloat(orderData.totalPrice),
      status: "pending",
      orderDate: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);

    return NextResponse.json({
      success: true,
      orderId: result.insertedId,
      message: "Card order created successfully",
    });
  } catch (error) {
    console.error("Failed to create card order:", error);
    return NextResponse.json(
      { error: "Failed to create card order" },
      { status: 500 }
    );
  }
}
