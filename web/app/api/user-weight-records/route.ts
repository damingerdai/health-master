import { authOptions } from '@/lib/auth-options';
import { httpClient } from '@/lib/http-client';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const authorization = session?.accessToken;
  console.log('authorization', authorization);
  console.log('req.nextUrl.search', req.nextUrl.search); 
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
