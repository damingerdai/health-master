'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { TwoFactorSetup } from '@/types/twofactor';
import { revalidatePath } from 'next/cache';

type Result<T> = { data: T; error?: never } | { data?: never; error: string };

async function request<T>(
  method: 'GET' | 'PUT',
  body?: { enabled: boolean; code: string }
): Promise<Result<T>> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken || session.needTwoFactor) {
    return { error: 'Your session has expired. Please sign in again.' };
  }
  try {
    const response = await fetch(
      `${process.env.BACKEND_HOST}/api/v1/settings/2fa`,
      {
        method,
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        ...(body ? { body: JSON.stringify(body) } : {})
      }
    );
    if (!response.ok) {
      return {
        error:
          response.status === 400 || response.status === 401
            ? 'Verification failed. Check your code and session, then try again.'
            : 'Unable to update two-factor authentication. Please try again.'
      };
    }
    const result = await response.json();
    return { data: result.data };
  } catch {
    return { error: 'Unable to reach the server. Please try again.' };
  }
}

export async function getTwoFactorSetup(): Promise<Result<TwoFactorSetup>> {
  return request<TwoFactorSetup>('GET');
}

export async function updateTwoFactor(
  enabled: boolean,
  code: string
): Promise<Result<{ code: number }>> {
  if (
    typeof enabled !== 'boolean' ||
    typeof code !== 'string' ||
    !/^[0-9]{6}$/.test(code)
  ) {
    return { error: 'Enter a 6-digit verification code.' };
  }
  const result = await request<{ code: number }>('PUT', { enabled, code });
  if (!result.error) revalidatePath('/profile');
  return result;
}
