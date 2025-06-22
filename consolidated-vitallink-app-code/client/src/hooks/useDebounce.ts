import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffec( => {
    const handler = setTimeou( => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeouhandler;
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

  const debouncedCallback = ((...args: any[]) => {
    if (debounceTimer) {
      clearTimeoudebounceTimer;
    }

    const newTimer = setTimeou( => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  }) as T;

  useEffec( => {
    return () => {
      if (debounceTimer) {
        clearTimeoudebounceTimer;
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}