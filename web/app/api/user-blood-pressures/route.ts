import { authOptions } from '@/lib/auth-options';
import { httpClient } from '@/lib/http-client';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const authorization = session?.accessToken;

  return httpClient
    .request({
      headers: {
        Authorization: 'Bearer ' + authorization
      },
      method: 'GET',
      url: `/api/v1/user-blood-pressures${req.nextUrl.search}`
    })
    .then(resp => {
      if (resp.data && !resp?.data?.data) {
        resp.data.data = [];
      }

      return NextResponse.json(resp);
    })
    .catch(err => NextResponse.json(err, { status: 500 }));
}
