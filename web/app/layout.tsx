import type { Metadata } from 'next';
import { Provider } from '@/components/ui/provider';
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
    <html lang="zh" suppressHydrationWarning>
      <body className={fonts.inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
