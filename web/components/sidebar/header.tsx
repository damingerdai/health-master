import {
  Flex,
  FlexProps,
  Text,
  IconButton,
  useColorModeValue,
  HStack,
  Menu,
  MenuButton,
  Avatar,
  useColorMode,
} from "@chakra-ui/react";
import * as React from "react";
import { FiBell, FiMenu } from "react-icons/fi";
import { ToggleThemeButton } from "../toggle-theme-button";

interface HeaderProps extends FlexProps {
  onOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpen, ...rest }) => {
  return (
    <Flex
      as="nav"
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("#ffffff40", "#20202380")}
      css={{ backdropFilter: "blur(10px)" }}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        icon={<FiMenu />}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
      />

      <HStack spacing={{base: '1', md: '6'}}>
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />}/>
        <Flex alignItems="center">
            <Menu>
                <MenuButton py={2} transform="all 0.3s" _focus={{boxShadow: 'none'}}>
                    <HStack>
                        <Avatar size="sm" name="Arthur Ming"></Avatar>
                    </HStack>
                </MenuButton>
            </Menu>
        </Flex>
        <ToggleThemeButton />
      </HStack>
    </Flex>
  );
};
