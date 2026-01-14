import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Safely parse JSON; return fallback on error.
 */
function safeJsonParse(raw, fallbackValue) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

/**
 * useLocalStorage hook (no backend). Loads once and exposes setter.
 */
// PUBLIC_INTERFACE
export function useLocalStorage(key, initialValue) {
  const didInit = useRef(false);
  const [value, setValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const raw = window.localStorage.getItem(key);
    if (raw == null) {
      setValue(initialValue);
      setIsHydrated(true);
      return;
    }

    setValue(safeJsonParse(raw, initialValue));
    setIsHydrated(true);
  }, [initialValue, key]);

  const setAndPersist = useCallback(
    (nextValue) => {
      setValue(nextValue);
      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      } catch {
        // Ignore quota or serialization errors; app still functions for the session.
      }
    },
    [key]
  );

  return { value, setValue: setAndPersist, isHydrated };
}
