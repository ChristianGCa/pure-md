import { useCallback, useEffect, useRef, useState } from 'react';

/** A boolean that turns on when triggered and resets itself after `durationMs`. */
export function useTimedFlag(durationMs = 2000): [boolean, () => void] {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const trigger = useCallback(() => {
    // Restart the timer so repeated triggers keep the flag on for the full duration.
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActive(true);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setActive(false);
    }, durationMs);
  }, [durationMs]);

  return [active, trigger];
}
