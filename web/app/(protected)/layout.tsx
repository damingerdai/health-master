'use client';

import { Header } from '@/components/header';
import { SidebarContent } from '@/components/sidebar/context';
import { ToggleThemeButton } from '@/components/toggle-theme-button';
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Text,
  HStack,
  Spacer,
  Box,
  useColorModeValue,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerBody,
  DrawerOverlay,
  Flex,
  useMediaQuery,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserMenu } from '@/components/user-menu';
import { AuthRequired } from '@/components/auth';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, onClose, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });
  const bg = useColorModeValue('#f0f2f5', '#20202380');
  const [drawerMode, setDrawerMode] = useState<'side' | 'over' | 'push'>(
    'side'
  );
  const [isMobile] = useMediaQuery('(max-width: 720px)');

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
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          autoFocus={false}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="xs"
        >
          <DrawerOverlay />
          <DrawerContent width="240px !important">
            <DrawerCloseButton />
            <DrawerBody px={0}>
              <SidebarContent onClose={onClose} hasTitle />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
      <Box w="100%">
        <Header bgColor="Background" position="sticky" top={0}>
          <IconButton
            aria-label="hamburger menu"
            bg="transparent"
            icon={<HamburgerIcon />}
            onClick={onToggle}
          />
          <Box px={1}>
            <Text fontWeight="700">Health Master</Text>
          </Box>
          <Spacer />
          <HStack spacing={{ base: '1', md: '2' }}>
            <ToggleThemeButton />
            <UserMenu />
          </HStack>
        </Header>
        <Flex bg={bg} as="main" h="calc(100vh - 64px)">
          <Box w="100%">
            <AuthRequired>{children}</AuthRequired>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
