import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";

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
    const _id = searchParams.get("_id");
    const db = await connectToDatabase();

    if (!_id) {
      return NextResponse.json(
        { error: "Missing _id parameter" },
        { status: 400 }
      );
    }
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(_id) });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
