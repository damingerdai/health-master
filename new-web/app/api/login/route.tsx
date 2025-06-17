import { httpClient } from "@/lib/http-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const username = req.headers.get("username") ?? "";
    const password = req.headers.get("password") ?? "";
    const res = await httpClient.login(username, password);
    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err, { status: 500 });
  }
}
