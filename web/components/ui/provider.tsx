'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { theme } from '@/lib/theme';
import { ThemeProvider } from 'next-themes';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider>
      <ChakraProvider value={theme}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </ThemeProvider>
  );
}
