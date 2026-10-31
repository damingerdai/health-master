'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { UserBloodPressurePage } from '@/types/user-blood-pressure';

export const getUserBloodPressures = async (
  page = 1,
  limit = 20
): Promise<UserBloodPressurePage | null> => {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return null;
  }

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  try {
    const res = await fetch(
      `${process.env.BACKEND_HOST}/api/v1/user-blood-pressures?${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        next: { revalidate: 60 } // Revalidate every minute
      }
    );

    if (!res.ok) {
      console.error('getUserBloodPressures failed:', res.statusText);
      return null;
    }

    const data = await res.json();
    return data.data as UserBloodPressurePage;
  } catch (err) {
    console.error('getUserBloodPressures error:', err);
    return null;
  }
};
