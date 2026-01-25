'use client';

import { useState, useEffect } from 'react';

interface SavePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function SavePortfolioModal({ isOpen, onClose, onSave }: SavePortfolioModalProps) {
  const [portfolioName, setPortfolioName] = useState('');

  // Reset name when modal opens
  useEffect(() => {
    if (isOpen) {
      setPortfolioName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 border border-white/10">
        <h3 className="text-xl font-bold text-black dark:text-white">Save Portfolio</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-black/70 dark:text-white/70">Portfolio Name</label>
          <input
            type="text"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            placeholder="e.g., My Tech Portfolio"
            className="glass-input w-full"
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(portfolioName)}
            disabled={!portfolioName.trim()}
            className="glass-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
