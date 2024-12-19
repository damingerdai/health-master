import {
  Box,
  Flex,
  FlexProps,
  HStack,
  Text,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import * as React from 'react';
import { FiMenu } from 'react-icons/fi';
import { drawerStatusAtom } from '@/store/drawer';
import { ToggleThemeButton } from './toggle-theme-button';
import { UserMenu } from './user-menu';

export const Navbar: React.FC<FlexProps> = props => {
  const [drawserStatus, setDrawserStatus] = useAtom(drawerStatusAtom);

  return (
    <Flex
      as="header"
      w="100%"
      px={{ base: 4, md: 4 }}
      height="14"
      alignItems="center"
      // bg={useColorModeValue('#ffffff40', '#20202380')}
      // bg={useColorModeValue('white', 'black')}
      css={{ backdropFilter: 'blur(10px)' }}
      borderBottomWidth="1px"
      // borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      flexWrap="wrap"
      {...props}
    >
      <IconButton
        display={{ base: 'flex', lg: 'none' }}
        onClick={() => setDrawserStatus(!drawserStatus)}
        variant="outline"
        aria-label="open menu"
      >
        <FiMenu />
      </IconButton>
      <Box ml={2}>
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          {'Health Master'}
        </Text>
      </Box>

      <Box flexGrow={1} />

      <HStack gap={{ base: '1', md: '2' }}>
        <UserMenu />
        <ToggleThemeButton />
      </HStack>
    </Flex>
  );
};
