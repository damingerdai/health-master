import { Button } from '@/components/ui/button';
import { MailCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function Page({ searchParams }: { searchParams: { email?: string } }) {
  const currentSearchParams = await searchParams;
  const email = currentSearchParams.email || 'your email address';

  return (
    <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <MailCheck className="h-10 w-10 text-primary" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold italic tracking-tight text-foreground">Check your email</h1>
        <p className="text-muted-foreground text-sm text-balance leading-relaxed">
          We&apos;ve sent a password reset link to <br />
          <span className="font-semibold text-foreground underline decoration-primary/30 decoration-2 underline-offset-4">
            {email}
          </span>
        </p>
      </div>

      <div className="grid gap-3 w-full max-w-sm">
        <Button asChild className="w-full shadow-sm hover:shadow-md transition-all">
          <Link href="https://mail.google.com" target="_blank">
            Open your email
          </Link>
        </Button>

        <p className="text-xs text-muted-foreground mt-2">
          Didn&apos;t receive the email? Check your spam folder or
          <Link href="/forgot-password" title="Try again" className="ml-1 text-primary hover:underline font-medium">
            try again
          </Link>
        </p>
      </div>

      <div className="mt-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to login
        </Link>
      </div>
    </div>
  );
}