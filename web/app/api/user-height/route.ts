import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { httpClient } from '@/lib/http-client';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const [session, data] = await Promise.all([
    getServerSession(authOptions),
    req.json()
  ]);
  const authorization = session?.accessToken;

  try {
    const resp = await httpClient.request({
      method: 'POST',
      url: '/api/v1/height',
      data: {
        height: data.height,
        recordDate: data.recordDate ?? new Date().toISOString(),
        userId: session?.user?.id
      },
      headers: {
        Authorization: authorization
      }
    });
    revalidatePath('/dashboard');
    revalidatePath('/height');
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (err) {
    return NextResponse.json(err, {
      status: (err as { status: number }).status ?? 500
    });
  }
}
