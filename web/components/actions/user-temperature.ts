'use server';

import { authOptions } from "@/lib/auth-options";
import { UserTemperatures } from "@/types/user-temperature";
import { getServerSession } from "next-auth";

export const getUserTemperatures = async (query?: string) => {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    if (!accessToken) {
        return []; // Return empty array if no access token is available
    }

    try {
        const res = await fetch(
            `${process.env.BACKEND_HOST}/api/v1/user-temperatures${query ?? ''}`,
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
            return [];
        }

        const resp = await res.json();
        return resp.data as UserTemperatures;
    } catch (err) {
        console.error('getUserTemperature error:', err);
        return null;
    }
}