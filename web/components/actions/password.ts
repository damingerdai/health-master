'use server';

import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

type PasswordErrorField = 'currentPassword' | 'newPassword' | 'twoFactorCode';

type Result<T> =
  | { data: T; error?: never; field?: never }
  | { data?: never; error: string; field?: PasswordErrorField };

// Passwords are validated exactly as entered: never trimmed or truncated.
const changePasswordInputSchema = z.object({
  currentPassword: z
    .string({ error: 'Enter your current password.' })
    .min(8, 'Enter your current password (at least 8 characters).'),
  newPassword: z
    .string({ error: 'Choose a new password.' })
    .min(8, 'Choose a new password of at least 8 characters.'),
  twoFactorCode: z
    .string()
    .regex(/^[0-9]{6}$/, 'Enter the 6-digit code from your authenticator app.')
    .optional()
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: 'New password must be different from your current password.',
  path: ['newPassword'],
});

export async function changePassword(
  input: z.input<typeof changePasswordInputSchema>
): Promise<Result<{ code: number }>> {
  const parsed = changePasswordInputSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = issue?.path[0];
    return {
      error: issue?.message ?? 'Check your entries and try again.',
      ...(path === 'currentPassword' ||
      path === 'newPassword' ||
      path === 'twoFactorCode'
        ? { field: path }
        : {})
    };
  }
  const { currentPassword, newPassword, twoFactorCode } = parsed.data;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken || session.needTwoFactor) {
    return { error: 'Your session has expired. Please sign in again.' };
  }

  try {
    const response = await fetch(
      `${process.env.BACKEND_HOST}/api/v1/settings/password`,
      {
        method: 'PUT',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          ...(twoFactorCode ? { two_factor_code: twoFactorCode } : {})
        })
      }
    );

    if (!response.ok) {
      const failure = await response.json().catch(() => null);
      console.error('Change password request failed', {
        status: response.status,
        code: failure?.code
      });
      if (failure?.code === 10000019) {
        return {
          error: 'The current password you entered is incorrect.',
          field: 'currentPassword'
        };
      }
      if (failure?.code === 10000020) {
        return {
          error: 'Enter the 6-digit code from your authenticator app.',
          field: 'twoFactorCode'
        };
      }
      if (failure?.code === 10000008) {
        return {
          error:
            'The verification code does not match. Use the current code from your authenticator app and check that your device time is set automatically.',
          field: 'twoFactorCode'
        };
      }
      if (response.status === 429) {
        return {
          error:
            'Too many attempts. Please wait a few minutes before trying again.'
        };
      }
      if (response.status === 401) {
        return { error: 'Your session has expired. Please sign in again.' };
      }
      if (response.status === 400) {
        return { error: 'Check your entries and try again.' };
      }
      return { error: 'Unable to update your password. Please try again.' };
    }

    const result = await response.json();
    return { data: result.data ?? { code: result.code ?? 200 } };
  } catch {
    return { error: 'Unable to reach the server. Please try again.' };
  }
}
