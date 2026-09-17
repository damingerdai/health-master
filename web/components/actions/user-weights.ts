'use server';

import { authOptions } from '@/lib/auth-options';
import { WeightRecords } from '@/types/weight-record';
import { getServerSession } from 'next-auth';

export const getUserWeights = async (query?: string) => {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return []; // Return empty array if no access token is available
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_HOST}/api/v1/weight-records${query ?? ''}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        next: { revalidate: 60 } // Revalidate every minute
      }
    );

    if (!res.ok) {
      console.error('getUserWeights failed:', res.statusText);
      return [];
    }

    const resp = await res.json();
    return resp.data.data as WeightRecords;
  } catch (err) {
    console.error('getUserWeights error:', err);
    return null;
  }
}