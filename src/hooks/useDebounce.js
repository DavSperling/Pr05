import { useEffect, useState } from "react";

// // Delays updating a value until a specified time has passed without any new changes, optimizing performance during user input.
export function useDebounce(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
