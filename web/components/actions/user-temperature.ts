'use server';

import { authOptions } from '@/lib/auth-options';
import { ListResponse } from '@/types/response';
import { UserTemperature } from '@/types/user-temperature';
import { getServerSession } from 'next-auth';

export const getUserTemperatures = async (page = 1, limit = 20) => {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return { data: [], count: 0 } as ListResponse<UserTemperature>;
  }

   const query = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  try {
    const res = await fetch(
      `${process.env.BACKEND_HOST}/api/v1/user-temperatures?${query ?? ''}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        next: { revalidate: 60 } // Revalidate every minute
      }
    );

    if (!res.ok) {
      console.error('getUserTemperature failed:', res.statusText);
      return { data: [], count: 0 } as ListResponse<UserTemperature>;
    }

    const resp = await res.json();
    return resp.data as ListResponse<UserTemperature>;
  } catch (err) {
    console.error('getUserTemperature error:', err);
    return null;
  }
};
