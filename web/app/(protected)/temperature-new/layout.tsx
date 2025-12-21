import * as React from 'react';
import { AppBreadcrumb } from '@/components/app-breadcrumb';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex w-full items-center justify-between border-b px-4 py-2 md:px-6 md:py-6">
        <AppBreadcrumb subTitle="Temperature" subTitleHref="temperature" />
      </div>
      <div className="@container/main flex flex-1 flex-col gap-2">
        {children}
      </div>
    </div>
  );
}
