import { NextRequest, NextResponse } from 'next/server';
import { httpClient } from '@/lib/http-client';
import { DataResponse, isErrorResponse } from '@/type/response';
import { User } from '@/type/user';

export async function GET(req: NextRequest) {
  try {
    const resp = await httpClient.request<DataResponse<User>>({
      headers: {
        Authorization: req.headers.get('Authorization'),
      },
      method: 'GET',
      url: '/api/v1/user',
    });
    if (isErrorResponse(resp)) {
      if (resp.code === 10000006) {
        return NextResponse.json(resp.message, { status: 401 });
      }

      return NextResponse.json(resp.message, { status: 500 });
    }

    return NextResponse.json(resp);
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
