import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

// GET - Fetch all orders with pagination (Admin only)
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

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const db = await connectToDatabase();

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { bookSize: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await db.collection("orders").countDocuments(searchQuery);

    // Fetch orders with pagination
    const orders = await db
      .collection("orders")
      .find(searchQuery)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
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
