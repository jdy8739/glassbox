import { useState } from 'react';

/**
 * Dialog state management hook
 * Manages boolean state for all confirmation/modal dialogs
 */
export function useDialogs() {
  const [showTodayWarning, setShowTodayWarning] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return {
    // Today warning dialog
    showTodayWarning,
    setShowTodayWarning,

    // Auth required dialog
    showAuthDialog,
    setShowAuthDialog,

    // Clear confirmation dialog
    showClearConfirm,
    setShowClearConfirm,
  };
}
