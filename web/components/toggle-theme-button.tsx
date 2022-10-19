import {
  Box, Button, useColorMode, useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { useEffect } from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';
import { useSystemColorMode } from '../hooks/useSystemColorMode';

const themes = ['light', 'dark'];

export function ToggleThemeButton() {
  const systemColorMode = useSystemColorMode();
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  const bg = useColorModeValue('rgb(253 186 116 / 1)', 'rgba(82 82 91 / 1)');
  useEffect(() => {
    setColorMode(systemColorMode);
  }, [systemColorMode]);

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      p="1px"
      h="2.125rem"
      borderRadius="1.5rem"
      fontSize="1rem"
      bg={bg}
    >
      {themes.map((theme) => {
        const checked = colorMode === theme;
        return (
          <Button
            key={theme}
            p="2px"
            m="0"
            h="2rem"
            w="2rem"
            fontFamily="inherit"
            fontSize="100%"
            color={checked ? 'rgb(0 0 0 / 1)' : undefined}
            bgColor={checked ? 'rgb(255 255 255 / 1)' : 'transparent'}
            borderRadius="1.5rem"
            cursor="pointer"
            minW={2}
            _before={{
              boxSizing: 'border-box',
            }}
            _hover={{
              bgColor: checked ? 'rgb(255 255 255 / 1)' : 'transparent',
            }}
            onClick={toggleColorMode}
          >
            {theme === 'light' ? <IoSunny /> : <IoMoon />}
          </Button>
        );
      })}
    </Box>
  );
}
