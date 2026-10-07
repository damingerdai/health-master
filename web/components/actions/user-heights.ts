'use server';

import { authOptions } from "@/lib/auth-options";
import { UserHeights } from "@/types/user-height";
import { getServerSession } from "next-auth";

export const getUserHeights = async (query?: string) => {
 const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return []; // Return empty array if no access token is available
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_HOST}/api/v1/heights${query ?? ''}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        next: { revalidate: 60 } // Revalidate every minute
      }
    );

    if (!res.ok) {
      console.error('getUserHeights failed:', res.statusText);
      return [];
    }

    const resp = await res.json();
    return resp.data.data as UserHeights;
  } catch (err) {
    console.error('getUserHeights error:', err);
    return null;
  }
}