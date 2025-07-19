import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, permissions } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
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
      role: role || "user",
      permissions: role === "sub-admin" ? permissions : null,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("users").insertOne(userData);

    const userForToken = {
      id: result.insertedId.toString(),
      name,
      email,
      role: userData.role,
      permissions: userData.permissions,
    };

    const token = generateToken(userForToken);

    const response = NextResponse.json({
      message: "User created successfully",
      user: {
        _id: result.insertedId,
        name,
        email,
        role: userData.role,
        permissions: userData.permissions,
        createdAt: userData.createdAt,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
