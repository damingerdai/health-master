import { httpClient } from "@/lib/http-client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: NextRequest) {
  const [session, data] = await Promise.all([
    getServerSession(authOptions),
    req.json(),
  ]);
  const authorization = session?.accessToken;

  try {
    const resp = await httpClient.request({
      method: "POST",
      url: "/api/v1/user-temperature",
      data: {
        userId: session?.user?.id,
        temperature: data.temperature,
        unit: data.unit,
        notes: data.notes,
        recordDate: data.recordDate,
      },
      headers: {
        Authorization: authorization,
      },
    });

    return NextResponse.json(resp.data);
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
