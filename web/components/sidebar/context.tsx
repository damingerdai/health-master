import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Spacer,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { FiHome } from 'react-icons/fi';
import { CiSettings } from 'react-icons/ci';
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
    display="flex"
    flexDir="column"
    bg={useColorModeValue('white', 'black')}
    transition="3s ease"
    borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    w="full"
    h="100%"
    __css={{
      textWrap: 'nowrap',
    }}
    {...rest}
  >
    {hasTitle && (
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          H & M
        </Text>
      </Flex>
    )}
    <Flex flexDir="column" flexGrow="1" px={2}>
      <NavItem path="dashboard" icon={FiHome}>
        仪表盘
      </NavItem>
      <NavItem path="/blood-pressure" icon={FiHome}>
        血压管理
      </NavItem>
      <Spacer />
      <NavItem path="/settings" icon={CiSettings}>
        设置
      </NavItem>
    </Flex>
  </Box>
);
