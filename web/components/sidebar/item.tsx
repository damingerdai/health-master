import { Box, Flex, FlexProps, Icon, Link } from '@chakra-ui/react';
import * as React from 'react';
import { IconType } from 'react-icons/lib';
import { useColorModeValue } from '@/hooks/useColorModeValue';

interface NavItemProps extends FlexProps {
  icon?: IconType;
  path?: string;
}

export const NavItem: React.FC<React.PropsWithChildren<NavItemProps>> = ({
  icon,
  path,
  children,
  ...rest
}) => {
  const hoverColor = useColorModeValue('black', 'white');

  return (
    <Link
      href={path ?? '/'}
      color={useColorModeValue('black', 'white')}
      textDecoration="none"
      borderRadius={4}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.100', 'gray.800'),
      }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          color: hoverColor,
        }}
        {...rest}
      >
        {icon && (
          <Icon mr="4" fontSize="16" _groupHover={{ color: hoverColor }}>
            {React.createElement(icon)}
          </Icon>
        )}
        {children}
      </Flex>
    </Link>
  );
};
