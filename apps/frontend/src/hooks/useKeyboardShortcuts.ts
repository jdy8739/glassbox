import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  preventDefault?: boolean;
}

/**
 * Custom hook for managing keyboard shortcuts
 * @param shortcuts - Array of keyboard shortcut configurations
 * @param enabled - Whether shortcuts are enabled (default: true)
 */
export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        // Check if key matches (case insensitive)
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (!keyMatch) return;

        // Check if it's a cross-platform meta shortcut (Ctrl on Windows/Linux, Cmd on Mac)
        const isCrossPlatformShortcut = shortcut.ctrl && shortcut.meta;

        if (isCrossPlatformShortcut) {
          // For cross-platform shortcuts, accept either Ctrl or Meta
          const hasModifier = e.ctrlKey || e.metaKey;
          const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
          const altMatch = shortcut.alt ? e.altKey : !e.altKey;

          if (hasModifier && shiftMatch && altMatch) {
            if (shortcut.preventDefault !== false) {
              e.preventDefault();
            }
            shortcut.handler();
          }
        } else {
          // For specific modifier shortcuts
          const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
          const metaMatch = shortcut.meta ? e.metaKey : !e.metaKey;
          const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
          const altMatch = shortcut.alt ? e.altKey : !e.altKey;

          if (ctrlMatch && metaMatch && shiftMatch && altMatch) {
            if (shortcut.preventDefault !== false) {
              e.preventDefault();
            }
            shortcut.handler();
          }
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};
