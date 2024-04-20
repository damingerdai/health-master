import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { FiHome } from 'react-icons/fi';
import { NavItem } from './item';

interface SidebarContentProps extends BoxProps {
  hasTitle: boolean;
  onClose: () => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  hasTitle,
  onClose,
  ...rest
}) => (
  <Box
    as="nav"
    bg={useColorModeValue('white', 'black')}
    transition="3s ease"
    borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    // w={{ base: 'full', md: 60 }}
    w="full"
    h="100%"
    __css={{
      textWrap: 'nowrap',
    }}
    // pos="fixed"
    {...rest}
  >
    {hasTitle && (
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          H & M
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
    )}
    <Box>
      <NavItem path="dashboard" icon={FiHome}>
        仪表盘
      </NavItem>
      <NavItem path="/blood-pressure" icon={FiHome}>
        血压管理
      </NavItem>
    </Box>
  </Box>
);
