import { Box, BoxProps, CloseButton, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import { FiHome } from 'react-icons/fi';
import { NavItem } from './item';

interface SidebarContentProps extends BoxProps {
  onClose: () => void;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({ onClose, ...rest }) => {
  return (<Box
    transition="3s ease"
    bg={useColorModeValue('white', 'gray.900')}
    borderRight="1px"
    borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    w={{ base: 'full', md: 60}}
    h="100%"
    pos="fixed"
    {...rest}
    >
    <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
       <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">H & M</Text> 
      <CloseButton display={{base: 'flex', md: 'none'}} onClick={onClose}/>
    </Flex>
    <Box>
      <NavItem icon={FiHome}>
         主页
      </NavItem>
    </Box>
  </Box>);
}
