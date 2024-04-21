import { httpClient } from '@/lib/http-client';
import { NextRequest, NextResponse } from 'next/server';

const baseURL =
  process.env.NEXT_PUBLIC_REACT_APP_BACKEND_DOWNLOAD_HOST ||
  process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST;

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const Authorization = req.headers.get('Authorization');
  const { data } = await httpClient.request({
    method: 'POST',
    url: '/api/v1/tmptoken',
    headers: {
      Authorization,
    },
  });

  const { accessToken } = data;
  const downloadUrl = `${baseURL}/api/v1/user-blood-pressure/${userId}/export?accessToken=${accessToken}`;
  return NextResponse.json({ downloadUrl });
}
