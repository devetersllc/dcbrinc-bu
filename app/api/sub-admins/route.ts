import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { verifyToken, hashPassword } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const db = await connectToDatabase();
    const subAdmins = await db
      .collection("users")
      .find({ role: "sub-admin" }, { projection: { password: 0 } })
      .toArray();

    return NextResponse.json(subAdmins);
  } catch (error) {
    console.error("Get sub-admins error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { name, email, password, permissions } = await request.json();

    if (!name || !email || !password || !permissions) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: "sub-admin",
      permissions,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("users").insertOne(userData);

    return NextResponse.json({
      message: "Sub-admin created successfully",
      user: {
        _id: result.insertedId,
        name,
        email,
        role: "sub-admin",
        permissions,
        createdAt: userData.createdAt,
      },
    });
  } catch (error) {
    console.error("Create sub-admin error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
