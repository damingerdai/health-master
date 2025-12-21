import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { httpClient } from '@/lib/http-client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  const authorization = session?.accessToken;

  return httpClient
    .request({
      headers: {
        Authorization: 'Bearer ' + authorization
      },
      method: 'GET',
      url: '/api/v1/user-temperatures'
    })
    .then(resp => {
      if (resp.data && !resp?.data?.data) {
        resp.data.data = [];
      }

      return NextResponse.json(resp);
    })
    .catch(err => {
      console.error('error', err);
      return NextResponse.json(err, { status: 500 });
    });
}
