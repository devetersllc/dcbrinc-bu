import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

// GET - Fetch all users with pagination
export async function GET(request: NextRequest) {
  try {
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
          { role: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await db.collection("users").countDocuments(searchQuery);

    // Fetch users with pagination
    const users = await db
      .collection("users")
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
