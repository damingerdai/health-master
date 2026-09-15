import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode}) {

    return <div className="max-w-4xl mx-auto p-6 md:p-10">
        {children}
    </div>
}