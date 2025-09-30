// /app/api/order/route.ts
import { NextResponse } from "next/server";

async function getAccessToken() {
  const res = await fetch(
    "https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "f0a3cfa5-f55f-4c9a-b66a-9b4031ba08b5",
        client_secret: "E3IJE70mqBdqi5RcBW1xMaX7TW4BoC07",
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to get token: ${res.statusText}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = await getAccessToken();

    let orderRes: any = {};
    try {
      orderRes = await fetch("https://api.lulu.com/print-jobs/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log("error----------------", error);
    }
    console.log("orderRes----------------", orderRes);

    if (!orderRes.ok) {
      const errData = await orderRes.json();
      throw new Error(JSON.stringify(errData));
    }

    const data = await orderRes.json();
    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
