import type { Metadata } from 'next';
import { ToastContainer } from '@/components/toast';
import { Providers } from './providers';
import { fonts } from './fonts';

export const metadata: Metadata = {
  title: 'Health Master Web',
  description: 'health master web',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={fonts.inter.className}>
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
