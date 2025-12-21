import * as React from 'react';
import { AppBreadcrumb } from '@/components/app-breadcrumb';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex w-full items-center justify-between border-b px-4 py-2 md:px-6 md:py-6">
        <AppBreadcrumb subTitle="Blood Pressure" />
      </div>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
          <div className="flex w-full justify-end">
            <Button asChild>
              <Link href="/blood-pressure-new">New Blood Pressue</Link>
            </Button>
          </div>
          <React.Suspense
            fallback={
              <div>
                <Spinner />
              </div>
            }
          >
            {children}
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
