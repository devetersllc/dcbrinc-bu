import { NextResponse } from "next/server"

export async function POST() {
  // removeAuthCookie()

  return NextResponse.json({
    message: "Logged out successfully",
  })
}
