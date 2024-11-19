import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react';
import * as React from 'react';
import { SidebarContent } from './context';
import { Header } from './header';

export const Siderbar: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        hasTitle
      />
      <Drawer
        autoFocus={false}
        isOpen={open}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} hasTitle />
        </DrawerContent>
      </Drawer>
      <Header onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};
