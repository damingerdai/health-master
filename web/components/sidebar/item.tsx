import {
  Flex, FlexProps, Icon, useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { IconType } from 'react-icons/lib';

interface NavItemProps extends FlexProps {
  icon?: IconType;
  path?: string;
}

export const NavItem: React.FC<React.PropsWithChildren<NavItemProps>> = ({
  icon,
  path,
  children,
  ...rest
}) => (
  <Link href={path ?? '/'} style={{ textDecoration: 'none' }}>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      // _hover={{ bg: 'cyan.400', color: 'white' }}
      _hover={{
        color: useColorModeValue('black', 'white')
      }}
      {...rest}
    >
      {icon && <Icon mr="4" fontSize="16" _groupHover={{ color: useColorModeValue('black', 'white') }} as={icon} />}
      {children}
    </Flex>
  </Link>
);
