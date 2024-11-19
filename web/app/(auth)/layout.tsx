'use client';

import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();

  const bg = useMemo(() => {
    if (theme === 'light') {
      return '#f0f2f5';
    } else if (theme === 'dark') {
      return '#20202380';
    }
  }, [theme]);

  return (
    <Box
      as="main"
      bg={bg}
      pos="relative"
      display="flex"
      justifyContent="center"
      minH="100vh"
      backgroundImage={`
          radial-gradient(at 97% 21%, hsla(125deg, 98%, 72%, 0.3) 0, transparent 50%),radial-gradient(at 52% 99%, hsla(354deg, 98%, 61%, 0.3) 0, transparent 50%),radial-gradient(at 10% 29%, hsla(256deg, 96%, 67%, 0.3) 0, transparent 50%),radial-gradient(at 97% 96%, hsla(38deg, 60%, 74%, 0.3) 0, transparent 50%),radial-gradient(at 33% 50%, hsla(222deg, 67%, 73%, 0.3) 0, transparent 50%),radial-gradient(at 79% 53%, hsla(343deg, 68%, 79%, 0.3) 0, transparent 50%)
      `}
    >
      {children}
    </Box>
  );
}
