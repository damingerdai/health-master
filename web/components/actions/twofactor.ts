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
      const failure = await response.json().catch(() => null);
      console.error('Two-factor request failed', {
        method,
        status: response.status,
        code: failure?.code
      });
      if (failure?.code === 10000008) {
        return {
          error: body?.enabled
            ? 'The code does not match. Refresh this page and add the current QR code to your authenticator app again. Check that your device time is set automatically.'
            : 'The code does not match. Use the current code from your linked authenticator and check that your device time is set automatically.'
        };
      }
      if (response.status === 401) {
        return { error: 'Your session has expired. Please sign in again.' };
      }
      return {
        error:
          response.status === 400
            ? 'Enter a valid 6-digit verification code.'
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
  if (!result.error) {
    revalidatePath('/profile');
    revalidatePath('/settings/2fa');
  }
  return result;
}
