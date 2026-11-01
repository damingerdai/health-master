'use server';

import { authOptions } from "@/lib/auth-options";
import { ListResponse } from "@/types/response";
import { UserHeight } from "@/types/user-height";
import { getServerSession } from "next-auth";

export const getUserHeights = async (page = 1,limit = 20) => {
 const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return {
      data: [],
      count: 0
    } as ListResponse<UserHeight>
  }

    const query = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  try {
    const res = await fetch(
      `${process.env.BACKEND_HOST}/api/v1/heights?${query ?? ''}`,
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
      return {
        data: [],
        count: 0
      } as ListResponse<UserHeight>;
    }

    const resp = await res.json();
    return resp.data as ListResponse<UserHeight>;
  } catch (err) {
    console.error('getUserHeights error:', err);
    return null;
  }
}