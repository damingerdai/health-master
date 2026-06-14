"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { UserBloodPressures } from "@/types/user-blood-pressure";

export const getUserBloodPressures = async (query?: string) => {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

    if (!accessToken) {
        return []; // Return empty array if no access token is available
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/user-blood-pressures${query ?? ''}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!res.ok) {
            console.error('getUserBloodPressures failed:', res.statusText);
            return [];
        }

        const data = await res.json();
        return data.data.data as UserBloodPressures;
    } catch (err) {
        console.error('getUserBloodPressures error:', err);
        return null;
    }

}