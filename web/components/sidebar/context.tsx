import {
  Box,
  BoxProps,
  Flex,
  Spacer,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { FiHome } from 'react-icons/fi';
import { GiBodyHeight } from 'react-icons/gi';
import { MdBloodtype } from 'react-icons/md';
import { CiSettings } from 'react-icons/ci';
import { NavItem } from './item';

interface SidebarContentProps extends BoxProps {
  hasTitle: boolean;
  onClose: () => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  hasTitle,
  onClose: _onClosde,
  ...rest
}) => (
  <Box
    as="nav"
    display="flex"
    flexDir="column"
    bg={useColorModeValue('white', 'black')}
    transition="3s ease"
    borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    // w={{ base: '240px', md: 'full' }}
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
    <Flex h="100%" flexDir="column" flexGrow="1" px={2} fontWeight="400">
      <NavItem path="dashboard" icon={FiHome}>
        仪表盘
      </NavItem>
      <NavItem path="/blood-pressure" icon={MdBloodtype}>
        血压管理
      </NavItem>
      <NavItem path="/weight" icon={GiBodyHeight}>
        体重管理
      </NavItem>
      <Spacer />
      <NavItem path="/settings" icon={CiSettings}>
        设置
      </NavItem>
    </Flex>
  </Box>
);
