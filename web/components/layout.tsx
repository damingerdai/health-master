import { Box, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import { Navbar } from './navbar';
import { Aside } from './aside';

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>
    <Navbar />
    <Box
      as="section"
      display="flex"
      flex="auto"
      bg={useColorModeValue('#f0f2f5', '#20202380')}
      h="calc(100vh - 64px)"
      w="100%"
    >
      <Aside />
      <Box as="main" w="100%">{children}</Box>
    </Box>
  </>
);