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
  DrawerHeader,
  DrawerOverlay,
  Flex,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, onClose, onToggle } = useDisclosure({ defaultIsOpen: true });
  const bg = useColorModeValue('#f0f2f5', '#20202380');
  const [drawerMode] = useState<'side' | 'over' | 'push'>('side');

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
            <DrawerHeader>
              <SidebarContent onClose={onClose} hasTitle />
            </DrawerHeader>
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
            <Text>Health Master</Text>
          </Box>
          <Spacer />
          <HStack spacing={{ base: '1', md: '2' }}>
            {/* <Text>{drawerMode}</Text> */}
            {/* <Select
              placeholder="Select option"
              value={drawerMode}
              onChange={(e) => {
                const { value } = e.target;
                setDrawerMode(value as 'side' | 'over' | 'push');
              }}
            >
              <option value="side">Side</option>
              <option value="over">Over</option>
              <option value="push">Push</option>
            </Select> */}
            <ToggleThemeButton />
          </HStack>
        </Header>
        <Flex bg={bg} as="main" h="calc(100vh - 64px)">
          <Box w="100%">{children}</Box>
        </Flex>
      </Box>
    </Flex>
  );
}
