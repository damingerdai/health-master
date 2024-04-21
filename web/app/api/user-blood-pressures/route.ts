import { httpClient } from '@/lib/http-client';
import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  return httpClient
    .request({
      headers: {
        Authorization: req.headers.get('Authorization'),
      },
      method: 'GET',
      url: `/api/v1/user-blood-pressures${req.nextUrl.search}`,
    })
    .then(resp => {
      if (resp.data && !resp?.data?.data) {
        resp.data.data = [];
      }
      return NextResponse.json(resp);
    })
    .catch(err => NextResponse.json(err, { status: 500 }));
}
