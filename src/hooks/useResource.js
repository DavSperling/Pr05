import { useContext, useEffect, useState } from "react";
import { DataContext } from "../contexts/DataContext.jsx";

// Manages asynchronous data fetching by immediately returning cached data if available, or requesting fresh data from the server while handling loading and error states.
export function useResource(key, fetcher) {
  // ctx - the data context, which provides access to the cache.
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useResource must be used inside DataProvider");

  const cached = key ? ctx.get(key) : undefined;
  const [data, setData] = useState(cached);
  const [loading, setLoading] = useState(cached === undefined && key !== null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!key) return;
    const cachedValue = ctx.get(key);
    if (cachedValue !== undefined) {
      setData(cachedValue);
      setLoading(false);
      setError(null);
      return;
    }
    // In case of a cache miss, we need to fetch the data from the server.
    let active = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((value) => {
        if (!active) return;
        ctx.set(key, value);
        setData(value);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
        setLoading(false);
      });
    return () => {
      active = false;
    };
    // version - a state counter that increments on every cache modification, forcing React to re-render and synchronize components with the updated cache data.
  }, [key, ctx.version]);

  return { data, loading, error };
}
