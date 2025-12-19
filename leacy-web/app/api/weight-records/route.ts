import { httpClient } from '@/lib/http-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authorization = req.headers.get('Authorization');
  try {
    const resp = await httpClient.request({
      method: 'GET',
      url: `/api/v1/weight-records${req.nextUrl.search}`,
      headers: {
        Authorization: authorization,
      },
    });

    return NextResponse.json(resp.data);
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
