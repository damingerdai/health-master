import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/reset-password-form';

export default function Page() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

