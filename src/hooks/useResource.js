import { useContext, useEffect, useState } from "react";
import { DataContext } from "../contexts/DataContext.jsx";

export function useResource(key, fetcher) {
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
  }, [key, ctx.version]);

  return { data, loading, error };
}
