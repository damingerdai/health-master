import { httpClient } from '@/lib/http-client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const [session, data] = await Promise.all([
    getServerSession(authOptions),
    req.json()
  ]);
  // const session = await getServerSession(authOptions);
  // const data = await req.json();
  const authorization = session?.accessToken;
  try {
    const resp = await httpClient.request({
      method: 'POST',
      url: '/api/v1/user-blood-pressure',
      data: {
        userId: session?.user?.id,
        systolicBloodPressure: data.systolic,
        diastolicBloodPressure: data.diastolic,
        pulse: data.pulse,
        logDatetime: data.logDate
      },
      headers: {
        Authorization: authorization
      }
    });
    revalidatePath('/dashboard');
    revalidatePath('/blood-pressure');
    return NextResponse.json(resp.data);
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
