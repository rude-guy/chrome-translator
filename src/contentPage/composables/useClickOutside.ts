import { RefObject, useEffect } from 'react';

/**
 * 点击除当前元素以外的区域
 */
export const useClickOutside = (ref: RefObject<HTMLDivElement>, callback: () => void) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
};
