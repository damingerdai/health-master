import { LoginForm } from '@/components/login-form';

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return <LoginForm passwordUpdated={params['password-updated'] === '1'} />;
}
