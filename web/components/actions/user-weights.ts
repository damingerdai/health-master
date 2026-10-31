'use server';

import { authOptions } from '@/lib/auth-options';
import { WeightRecords } from '@/types/weight-record';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
};

const createWeightSchema = z.object({
  weight: z
    .string()
    .trim()
    .min(1)
    .pipe(z.coerce.number<string>().min(1).max(500)),
  recordDate: z.iso.datetime()
});

export async function createUserWeight(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken || !session.user?.id) {
    return { error: 'Please sign in to create a weight record.' };
  }

  const parsed = createWeightSchema.safeParse({
    weight: formData.get('weight'),
    recordDate: formData.get('recordDate')
  });
  if (!parsed.success) {
    return { error: 'Please enter a valid weight (1–500 kg), date and time.' };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_HOST}/api/v1/weight-record`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: session.user.id,
          weight: parsed.data.weight,
          recordDate: parsed.data.recordDate
        })
      }
    );
    if (!res.ok) {
      return { error: 'Failed to create weight record. Please try again.' };
    }
  } catch {
    return { error: 'Unable to save the record. Please try again.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/weight');
  return { success: true };
}
