import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * Prevents scrollbar layout shift by adding padding when scrollbar is hidden
 *
 * @param isLocked - Whether scroll should be locked
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Get scrollbar width before hiding it
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Lock scroll
      document.body.style.overflow = 'hidden';

      // Prevent layout shift by adding padding equal to scrollbar width
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Unlock scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isLocked]);
};
