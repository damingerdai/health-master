import {
  Box, BoxProps, CloseButton, Flex, Text, useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { FiHome } from 'react-icons/fi';
import { NavItem } from './item';

interface SidebarContentProps extends BoxProps {
  hasTitle: boolean;
  onClose: () => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({ hasTitle, onClose, ...rest }) => (
  <Box
    bg={useColorModeValue('white', 'black')}
    transition="3s ease"
    borderRight="1px"
    borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    w={{ base: 'full', md: 60 }}
    h="100%"
    pos="fixed"
    {...rest}
  >
    {hasTitle && (
    <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
      <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">H & M</Text>
      <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
    </Flex>
    )}
    <Box>
      <NavItem path="dashboard" icon={FiHome}>
        仪表盘
      </NavItem>
      <NavItem path="/" icon={FiHome}>
        首
        {' '}
        页
      </NavItem>
    </Box>
  </Box>
);
