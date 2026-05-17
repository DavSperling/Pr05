import { createContext, useCallback, useRef, useState } from "react";

const STORAGE_KEY = "dataCache";

export const DataContext = createContext(null);

function loadInitial() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? new Map(JSON.parse(raw)) : new Map();
  } catch {
    return new Map();
  }
}

function persist(cache) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...cache]));
  } catch {
    // sessionStorage is best-effort; ignore failures
  }
}

export function DataProvider({ children }) {
  const cacheRef = useRef(loadInitial());
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);

  const get = useCallback((key) => cacheRef.current.get(key), []);

  const set = useCallback((key, value) => {
    cacheRef.current.set(key, value);
    persist(cacheRef.current);
    bump();
  }, []);

  const invalidate = useCallback((prefix) => {
    let changed = false;
    for (const k of [...cacheRef.current.keys()]) {
      if (k.startsWith(prefix)) {
        cacheRef.current.delete(k);
        changed = true;
      }
    }
    if (changed) {
      persist(cacheRef.current);
      bump();
    }
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
    persist(cacheRef.current);
    bump();
  }, []);

  return (
    <DataContext.Provider value={{ get, set, invalidate, clear, version }}>
      {children}
    </DataContext.Provider>
  );
}
