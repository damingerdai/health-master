'use client';

import { Header } from '@/components/header';
import { SidebarContent } from '@/components/sidebar/context';
import { ToggleThemeButton } from '@/components/toggle-theme-button';
import { Text, HStack, Spacer, Box, IconButton, Flex } from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UserMenu } from '@/components/user-menu';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
} from '@/components/ui/drawer';
import { useDisclosure, useMediaQuery } from '@reactuses/core';
import { AuthRequired } from '@/components/auth';
import { HamburgerIcon } from 'components/icons';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultOpen: true,
  });
  // const bg = useColorModeValue('#f0f2f5', '#20202380');
  const [drawerMode, setDrawerMode] = useState<'side' | 'over' | 'push'>(
    'side'
  );
  const bg = '#f0f2f5';
  const isMobile = useMediaQuery('(max-width: 720px)');
  const onToggle = useCallback(() => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }, [isOpen, onOpen, onClose]);

  useEffect(() => {
    if (isMobile) {
      setDrawerMode('over');
      onClose();
    } else {
      setDrawerMode('side');
    }
  }, [isMobile]);

  return (
    <Flex flexDir="row" w="100%">
      {drawerMode === 'side' && (
        <motion.aside initial={false} animate={{ width: isOpen ? 320 : 0 }}>
          <SidebarContent onClose={onClose} hasTitle />
        </motion.aside>
      )}
      {drawerMode === 'over' && (
        <DrawerRoot
          isOpen={isOpen}
          placement="start"
          onClose={onClose}
          autoFocus={false}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="xs"
        >
          <DrawerBackdrop />
          <DrawerContent width="240px !important">
            <DrawerCloseTrigger />
            <DrawerBody px={0}>
              <SidebarContent onClose={onClose} hasTitle />
            </DrawerBody>
          </DrawerContent>
        </DrawerRoot>
      )}
      <Box w="100%">
        <Header bgColor="background" position="sticky" top={0}>
          <IconButton
            aria-label="hamburger menu"
            variant="ghost"
            // bg="transparent"
            onClick={onToggle}
          >
            <HamburgerIcon />
          </IconButton>
          <Box px={1}>
            <Text fontWeight="700">Health Master</Text>
          </Box>
          <Spacer />
          <HStack gap={{ base: '1', md: '2' }}>
            <ToggleThemeButton />
            <UserMenu />
          </HStack>
        </Header>
        <Flex id="glbalLayout" bg={bg} as="main" h="calc(100vh - 64px)">
          <Box w="100%">
            <AuthRequired>{children}</AuthRequired>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
