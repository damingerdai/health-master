import {
  Box,
  Drawer,
  DrawerContent,
  useBreakpoint,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { SidebarContent } from './sidebar/context';
import { drawerStatusAtom } from '@/store/drawer';
import { useAtom } from 'jotai';

export const Aside: React.FC = () => {
  const [drawserStatus, setDrawserStatus] = useAtom(drawerStatusAtom);

  const onClose = useCallback(
    () => setDrawserStatus(false),
    [setDrawserStatus]
  );

  const isDrawerMode = useBreakpointValue(
    { base: true, lg: false },
    { ssr: true }
  );

  return (
    <Box as="aside" w="240px" minW="240px" bg={useColorModeValue('#ffffff40', '#20202380')}>
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
            <SidebarContent onClose={onClose} hasTitle={false} />
          </DrawerContent>
        </Drawer>
      ) : (
        <SidebarContent onClose={onClose} hasTitle={false} />
      )}
    </Box>
  );
};
