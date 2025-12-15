import { useMemo } from 'react';
import { useTheme } from 'next-themes';

export const useColorModeValue = <T>(lightValue: T, darkValue: T): T => {
  const { theme } = useTheme();

  const value = useMemo(() => {
    if (theme === 'light') {
      return lightValue;
    } else if (theme === 'dark') {
      return darkValue;
    } else {
      return lightValue;
    }
  }, [theme]);

  return value;
};
