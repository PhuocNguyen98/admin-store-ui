import { useState, useEffect } from 'react';

export default function useDebounce(value, deplay) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setDebounceValue(value);
    }, deplay);
    return () => clearTimeout(timeId);
  }, [value]);

  return debounceValue;
}
