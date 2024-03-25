'use client';

import {
  Box, Button, useColorMode, useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { useEffect } from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';
import { useSystemColorMode } from '../hooks/useSystemColorMode';

declare global {
  interface Document {
    startViewTransition: (params: () => void) => { ready: Promise<void> };
  }
}

const themes = ['light', 'dark'];

export const ToggleThemeButton: React.FC = () => {
  const systemColorMode = useSystemColorMode();
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  const bg = useColorModeValue('rgb(253 186 116 / 1)', 'rgba(82 82 91 / 1)');

  const viewTransitionAnimate = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      // eslint-disable-next-line no-restricted-globals
      Math.max(x, innerWidth - x),
      // eslint-disable-next-line no-restricted-globals
      Math.max(y, innerHeight - y),
    );
    const isDark = colorMode === 'dark';
    const root = document.documentElement;
    const transition = document.startViewTransition(() => {
      root.classList.remove(isDark ? 'chakra-ui-dark' : 'chakra-ui-light');
      root.classList.add(!isDark ? 'chakra-ui-dark' : 'chakra-ui-light');
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      );
      toggleColorMode();
    });
  };

  useEffect(() => {
    setColorMode(systemColorMode);
  }, [setColorMode, systemColorMode]);

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
            aria-label={theme === 'light' ? 'switch to light mode' : 'switch to dark mode'}
            // onClick={toggleColorMode}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              if (!document || !('startViewTransition' in document)) {
                toggleColorMode();
                return;
              }
              viewTransitionAnimate(event);
            }}
          >
            {theme === 'light' ? <IoSunny /> : <IoMoon />}
          </Button>
        );
      })}
    </Box>
  );
};
