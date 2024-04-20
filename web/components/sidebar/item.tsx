import {
  Flex, FlexProps, Icon, useColorModeValue,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
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
}) => {
  const hoverColor = useColorModeValue('black', 'white');

  return (
    <Link href={path ?? '/'} color={ useColorModeValue('black', 'white')} textDecoration="none" _hover={{ textDecoration: 'none' }}>
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
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{ color: hoverColor }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
