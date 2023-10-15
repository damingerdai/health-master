import {
    Flex,
    FlexProps,
    IconButton,
    useColorModeValue,
    HStack,
    Spacer,
  } from '@chakra-ui/react';
  import * as React from 'react';
  import { FiMenu } from 'react-icons/fi';
  import { ToggleThemeButton } from './toggle-theme-button';
  import { UserMenu } from './user-menu';
  
  interface HeaderProps extends FlexProps {
    onOpen?: () => void;
  }
  
  export const Header: React.FC<HeaderProps> = (props) => {
    const { onOpen, ...rest } = props;
  
    return (
      <Flex
        as="nav"
        px={4}
        height="16"
        alignItems="center"
        bg={useColorModeValue('#ffffff40', '#20202380')}
        css={{ backdropFilter: 'blur(10px)' }}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
        {...rest}
      >
      </Flex>
    );
  };
  