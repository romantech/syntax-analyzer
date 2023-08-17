import { useEffect, useState } from 'react';

const logError = (operation: string, key: string) => {
  console.error(`Error ${operation} data to localStorage for key "${key}".`);
};

const isLocalStorageAvailable = (): boolean => {
  if (!window.localStorage) {
    console.error('LocalStorage is not accessible.');
    return false;
  }
  return true;
};

const safeSetItem = <T>(key: string, value: T) => {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    logError('setting', key);
  }
};

const safeGetItem = <T>(key: string, defaultValue: T) => {
  if (!isLocalStorageAvailable()) return defaultValue;

  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) return JSON.parse(storedValue) as T;
  } catch (error) {
    logError('getting', key);
  }

  return defaultValue;
};

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState(() => safeGetItem(key, defaultValue));

  useEffect(() => {
    safeSetItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
