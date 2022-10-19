import {
  Flex, FlexProps, Icon,
} from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { IconType } from 'react-icons/lib';

interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: string | number;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  children,
  ...rest
}) => (
  <Link href="/" style={{ textDecoration: 'none' }}>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{ bg: 'cyan.400', color: 'white' }}
      {...rest}
    >
      {icon && <Icon mr="4" fontSize="16" _groupHover={{ color: 'white' }} as={icon} />}
      {children}
    </Flex>
  </Link>
);
