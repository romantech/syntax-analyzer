import { DevTools, DevToolsProps } from 'jotai-devtools';

if (import.meta.env.DEV) import('jotai-devtools/styles.css');

export function JotaiDevTools({ theme = 'dark', ...props }: DevToolsProps) {
  if (!import.meta.env.DEV) return null;
  return <DevTools theme={theme} {...props} />;
}
