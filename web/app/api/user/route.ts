import { httpClient } from '@/lib/http-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const resp = await httpClient.request({
      headers: {
        Authorization: req.headers.get('Authorization')
      } as Record<string, string>,
      method: 'POST',
      url: '/api/v1/user',
      data
    });

    if (resp.code != 200) {
      return NextResponse.json(resp.message, { status: 500 });
    }
    return NextResponse.json(resp);
  } catch (err) {
    console.error(err);

    return NextResponse.json(err, { status: 500 });
  }
}
