import {
  Flex,
  FlexProps,
  IconButton,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import * as React from 'react';
import { FiMenu } from 'react-icons/fi';
import { ToggleThemeButton } from '../toggle-theme-button';
import { UserMenu } from '../user-menu';

interface HeaderProps extends FlexProps {
  onOpen: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const { onOpen, ...rest } = props;

  return (
    <Flex
      as="nav"
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('#ffffff40', '#20202380')}
      css={{ backdropFilter: 'blur(10px)' }}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        icon={<FiMenu />}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
      />

      <HStack spacing={{ base: '1', md: '2' }}>
        <UserMenu />
        <ToggleThemeButton />
      </HStack>
    </Flex>
  );
};
