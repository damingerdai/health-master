import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6 md:px-10 md:py-10">
      {children}
    </div>
  );
}
