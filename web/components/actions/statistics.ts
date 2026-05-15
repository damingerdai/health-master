"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function getStatisticsSummary() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return null;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/statistics/summary`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      next: { revalidate: 60 } // Revalidate every minute
    });

    if (!res.ok) {
      console.error('getStatisticsSummary failed:', res.statusText);
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('getStatisticsSummary error:', err);
    return null;
  }
}
