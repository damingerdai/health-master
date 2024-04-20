import { httpClient } from '@/lib/http-client';
import { isErrorResponse } from '@/type/response';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { headers } = req;
    const username = headers.get('username')!;
    const password = headers.get('password')!;
    const resp = await httpClient.login(username, password);
    if (isErrorResponse(resp)) {
      return NextResponse.json(
        { code: -1, message: resp.message },
        { status: 500 },
      );
    }
    const { token, data } = resp;
    return NextResponse.json({ code: 0, token, data });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
