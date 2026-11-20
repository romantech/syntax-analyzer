import { useTheme } from 'next-themes';

export function useColorModeValue<T>(light: T, dark: T): T {
  return useTheme().theme === 'light' ? light : dark;
}
