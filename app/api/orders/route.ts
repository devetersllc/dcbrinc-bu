import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { decode, JwtPayload } from "jsonwebtoken";

// GET - Fetch all orders (Admin only)
export async function GET(request: NextRequest) {
  try {
    // const token = request.cookies.get("auth-token")?.value;

    // if (!token) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // const decoded = decode(token) as JwtPayload;
    // if (!decoded || decoded.role !== "admin") {
    //   return NextResponse.json(
    //     { error: "Admin access required" },
    //     { status: 403 }
    //   );
    // }

    const db = await connectToDatabase();
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ orderDate: -1 })
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    // if (!token) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    //     const decoded = decode(token) as JwtPayload;
    // console.log("decoded---", decoded);
    // console.log("token---", token);

    //     if (!decoded) {
    //       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    //     }

    const orderData = await request.json();

    // Validate required fields
    const requiredFields = [
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

    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          {
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    const db = await connectToDatabase();

    // Create the order object
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
      status: "pending",
      orderDate: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);

    return NextResponse.json({
      success: true,
      orderId: result.insertedId,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
