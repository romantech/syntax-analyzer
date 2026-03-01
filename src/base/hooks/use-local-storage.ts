import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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
  } catch {
    logError('setting', key);
  }
};

const safeGetItem = <T>(key: string, defaultValue: T) => {
  if (!isLocalStorageAvailable()) return defaultValue;

  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) return JSON.parse(storedValue) as T;
  } catch {
    logError('getting', key);
  }

  return defaultValue;
};

/**
 * A custom hook that allows storing and retrieving values in local storage.
 *
 * @param {string} key - The key under which the value will be stored in local storage.
 * @param {T} defaultValue - The default value to be returned if no value is found in local storage.
 * @return {[T, React.Dispatch<React.SetStateAction<T>>]} - A tuple containing the current value and a function to update the value.
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(() => safeGetItem(key, defaultValue));

  useEffect(() => {
    safeSetItem(key, value);
  }, [key, value]);

  return [value, setValue];
};
