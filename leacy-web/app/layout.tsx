import type { Metadata } from 'next';
import { Provider } from '@/components/ui/provider';
import { Toaster } from '@chakra-ui/toaster';
// import { fonts } from './fonts';

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
      <head>
        <link
          href="https://fonts.loli.net/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
