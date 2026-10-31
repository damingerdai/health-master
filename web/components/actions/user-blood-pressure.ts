'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
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

const readingSchema = z
  .string()
  .trim()
  .min(1)
  .pipe(z.coerce.number<string>().int().min(0).max(2147483647));

const createBloodPressureSchema = z.object({
  systolic: readingSchema,
  diastolic: readingSchema,
  pulse: readingSchema,
  logDatetime: z.iso.datetime()
});

export async function createUserBloodPressure(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken || !session.user?.id) {
    return { error: 'Please sign in to create a blood pressure record.' };
  }

  const parsed = createBloodPressureSchema.safeParse({
    systolic: formData.get('systolic'),
    diastolic: formData.get('diastolic'),
    pulse: formData.get('pulse'),
    logDatetime: formData.get('logDatetime')
  });
  if (!parsed.success) {
    return { error: 'Please enter valid readings, date and time.' };
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_HOST}/api/v1/user-blood-pressure`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: session.user.id,
          systolicBloodPressure: parsed.data.systolic,
          diastolicBloodPressure: parsed.data.diastolic,
          pulse: parsed.data.pulse,
          logDatetime: parsed.data.logDatetime
        })
      }
    );
    if (!res.ok) {
      return {
        error: 'Failed to create blood pressure record. Please try again.'
      };
    }
  } catch {
    return { error: 'Unable to save the record. Please try again.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/blood-pressure');
  return { success: true };
}
