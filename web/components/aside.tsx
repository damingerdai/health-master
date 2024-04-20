import {
  Box,
  Drawer,
  DrawerContent,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { useCallback } from 'react';
import { drawerStatusAtom } from '@/store/drawer';
import { useAtom } from 'jotai';
import { SidebarContent } from './sidebar/context';

export const Aside: React.FC = () => {
  const [drawserStatus, setDrawserStatus] = useAtom(drawerStatusAtom);

  const onClose = useCallback(
    () => setDrawserStatus(false),
    [setDrawserStatus],
  );

  const isDrawerMode = useBreakpointValue(
    { base: true, sm: false },
    { ssr: true },
  );

  return (
    <Box
      as="aside"
      w={isDrawerMode ? '0px' : '240px'}
      minW={isDrawerMode ? '0px' : '240px'}
      bg={useColorModeValue('#ffffff40', '#20202380')}
      zIndex="100"
    >
      {isDrawerMode ? (
        <Drawer
          autoFocus={false}
          isOpen={drawserStatus}
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
      ) : (
        <SidebarContent onClose={onClose} hasTitle={false} />
      )}
    </Box>
  );
};
