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
    const type = searchParams.get("type") || ""; // Filter by order type

    const db = await connectToDatabase();

    // Build search query
    let searchQuery: any = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { bookSize: { $regex: search, $options: "i" } },
          { type: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (type && (type === "book" || type === "card")) {
      searchQuery.type = type;
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
    if (!orderData.type || !["book", "card"].includes(orderData.type)) {
      return NextResponse.json(
        { error: "Invalid or missing order type" },
        { status: 400 }
      );
    }
    const commonRequiredFields = ["name", "email", "totalPrice", "type"];
    const bookRequiredFields = [
      "pdfCloudinaryUrl",
      "coverCloudinaryUrl",
      "bookSize",
      "pageCount",
      "interiorColor",
      "paperType",
      "bindingType",
      "coverFinish",
    ];

    const cardRequiredFields = ["cardData"];
    for (const field of commonRequiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    if (orderData.type === "book") {
      for (const field of bookRequiredFields) {
        if (!orderData[field]) {
          return NextResponse.json(
            { error: `Missing required field for book order: ${field}` },
            { status: 400 }
          );
        }
      }
    } else if (orderData.type === "card") {
      for (const field of cardRequiredFields) {
        if (!orderData[field]) {
          return NextResponse.json(
            { error: `Missing required field for card order: ${field}` },
            { status: 400 }
          );
        }
      }
    }

    const db = await connectToDatabase();

    // Create the order object
    const order: any = {
      name: orderData.name,
      email: orderData.email,
      type: orderData.type,
      totalPrice: Number.parseFloat(orderData.totalPrice),
      status: "pending",
      orderDate: new Date(),
    };
    if (orderData.type === "book") {
      order.pdfCloudinaryUrl = orderData.pdfCloudinaryUrl;
      order.coverCloudinaryUrl = orderData.coverCloudinaryUrl;
      order.bookSize = orderData.bookSize;
      order.pageCount = Number.parseInt(orderData.pageCount);
      order.interiorColor = orderData.interiorColor;
      order.paperType = orderData.paperType;
      order.bindingType = orderData.bindingType;
      order.coverFinish = orderData.coverFinish;
    } else if (orderData.type === "card") {
      order.cardData = orderData.cardData;
    }

    const result = await db.collection("orders").insertOne(order);

    return NextResponse.json({
      success: true,
      orderId: result.insertedId,
      message: `${orderData.type} order created successfully`,
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
