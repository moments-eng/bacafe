import { useEffect } from "react";

export function useDebounce(
  callback: () => void,
  dependencies: any[],
  delay: number
) {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [...dependencies]);
}
