'use client';

import { Header } from '@/components/header';
import { ToggleThemeButton } from '@/components/toggle-theme-button';
import { Text, HStack, Spacer, Box, useColorModeValue } from '@chakra-ui/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bg = useColorModeValue('#f0f2f5', '#20202380');

  return (
    <>
      <Header bgColor="Background" position="sticky" top={0}>
        <Text>Health Master</Text>
        <Spacer />
        <HStack spacing={{ base: '1', md: '2' }}>
          <ToggleThemeButton />
        </HStack>
      </Header>
      <Box bg={bg} as="main" h="100%" minH="calc(100vh - 64px)">
        {children}
      </Box>
    </>
  );
}
