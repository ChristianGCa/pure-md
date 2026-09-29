import { useCallback, useRef, useState } from 'react';

type StoredValue = { value: string; storageError: boolean; readBlocked: boolean };
type SetValue = (value: string | ((previous: string) => string)) => void;

export function useLocalStorage(key: string, initialValue: string): [string, SetValue, boolean] {
  const [stored, setStored] = useState<StoredValue>(() => {
    if (typeof window === 'undefined') return { value: initialValue, storageError: false, readBlocked: false };

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return { value: initialValue, storageError: false, readBlocked: false };

      try {
        const parsed: unknown = JSON.parse(item);
        if (typeof parsed === 'string') return { value: parsed, storageError: false, readBlocked: false };
      } catch {
        // Keep the original bytes available in the editor for recovery.
      }

      console.warn(`Invalid localStorage value for "${key}"; showing the original text`);
      return { value: item, storageError: true, readBlocked: false };
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return { value: initialValue, storageError: true, readBlocked: true };
    }
  });
  const valueRef = useRef(stored.value);
  const readBlockedRef = useRef(stored.readBlocked);

  const setValue = useCallback<SetValue>((value) => {
    const next = typeof value === 'function' ? value(valueRef.current) : value;
    valueRef.current = next;

    if (readBlockedRef.current) {
      // An unreadable existing draft must not be overwritten by a fallback value.
      setStored({ value: next, storageError: true, readBlocked: true });
      return;
    }

    let storageError = false;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch (error) {
      storageError = true;
      console.warn(`Error setting localStorage key "${key}":`, error);
    }

    setStored({ value: next, storageError, readBlocked: false });
  }, [key]);

  return [stored.value, setValue, stored.storageError];
}
