import { httpClient } from '@/lib/http-client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const authorization = req.headers.get('Authorization');
  try {
    const resp = await httpClient.request({
      method: 'DELETE',
      url: `/api/v1/weight-record/${id}`,
      headers: {
        Authorization: authorization,
      },
    });

    return NextResponse.json(resp.data);
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
