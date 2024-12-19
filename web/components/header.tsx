'use client';

import { Flex, FlexProps } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import * as React from 'react';

export const Header: React.FC<FlexProps> = props => (
  <Flex
    as="nav"
    suppressHydrationWarning
    px={4}
    height="16"
    alignItems="center"
    bg={useColorModeValue('#ffffff40', '#20202380')}
    css={{ backdropFilter: 'blur(10px)' }}
    borderBottomWidth="1px"
    borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
    justifyContent={{ base: 'space-between', md: 'flex-end' }}
    zIndex={1}
    {...props}
  />
);
