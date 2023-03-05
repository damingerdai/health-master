import { drawerStatusAtom } from '@/store/jotai';
import {
  Box, Flex, HStack, IconButton, useColorModeValue,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import * as React from 'react';
import { FiMenu } from 'react-icons/fi';
import { ToggleThemeButton } from './toggle-theme-button';
import { UserMenu } from './user-menu';

export const Navbar: React.FC = () => {
  const [drawserStatus, setDrawserStatus] = useAtom(drawerStatusAtom);

  return (
    <Flex
      as="nav"
      w="100%"
      px={{ base: 4, md: 4 }}
      height="16"
      alignItems="center"
      bg={useColorModeValue('#ffffff40', '#20202380')}
      css={{ backdropFilter: 'blur(10px)' }}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      flexWrap="wrap"
    // justifyContent={'space-between'}
    >
      <IconButton
        display="flex"
        icon={<FiMenu />}
        onClick={() => setDrawserStatus(!drawserStatus)}
        variant="outline"
        aria-label="open menu"
      />
      <Box ml={2}>Health Master</Box>
      <Box flexGrow={1} />

      <HStack spacing={{ base: '1', md: '2' }}>
        <UserMenu />
        <ToggleThemeButton />
      </HStack>
    </Flex>
  );
};
