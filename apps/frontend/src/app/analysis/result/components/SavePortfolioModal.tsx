'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { getAllPortfolios } from '@/lib/api/portfolio';
import { useScrollLock } from '@/hooks/useScrollLock';

interface SavePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function SavePortfolioModal({ isOpen, onClose, onSave }: SavePortfolioModalProps) {
  const [portfolioName, setPortfolioName] = useState('');
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing portfolio names
  useEffect(() => {
    if (isOpen) {
      setPortfolioName('');
      setIsLoading(true);
      getAllPortfolios()
        .then(portfolios => {
          setExistingNames(portfolios.map(p => p.name.toLowerCase()));
        })
        .catch(err => {
          console.error('Failed to load portfolios:', err);
          setExistingNames([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  // Validation
  const trimmedName = portfolioName.trim();
  const isDuplicate = existingNames.includes(trimmedName.toLowerCase());
  const isTooShort = trimmedName.length > 0 && trimmedName.length < 3;
  const isTooLong = trimmedName.length > 50;
  const isValid = trimmedName.length >= 3 && !isDuplicate && !isTooLong;

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault();
      onSave(trimmedName);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSubmit = () => {
    if (isValid) {
      onSave(trimmedName);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 border border-cyan-500/20 bg-cyan-500/5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-500">
            <Check className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Save Portfolio</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Give your portfolio a name to save it to your library.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Portfolio Name</label>
            <span className={`text-xs ${trimmedName.length > 40 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'}`}>
              {trimmedName.length}/50
            </span>
          </div>

          <input
            type="text"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., My Tech Portfolio"
            className={`w-full rounded-lg border px-4 py-3 font-medium bg-white/60 dark:bg-slate-800/60 transition-all duration-200 focus:outline-none focus:ring-2 ${
              trimmedName.length > 0 && !isValid
                ? 'border-red-400/50 focus:border-red-500 focus:ring-red-500/20'
                : trimmedName.length > 0 && isValid
                ? 'border-cyan-400/50 focus:border-cyan-500 focus:ring-cyan-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20'
            } text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500`}
            autoFocus
            disabled={isLoading}
          />

          {/* Validation Messages */}
          {isTooShort && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3 h-3" />
              <span>Name must be at least 3 characters</span>
            </div>
          )}

          {isTooLong && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3 h-3" />
              <span>Name must be 50 characters or less</span>
            </div>
          )}

          {isDuplicate && !isTooShort && (
            <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
              <AlertCircle className="w-3 h-3" />
              <span>A portfolio with this name already exists</span>
            </div>
          )}

          {isValid && (
            <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400">
              <Check className="w-3 h-3" />
              <span>Ready to save</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
