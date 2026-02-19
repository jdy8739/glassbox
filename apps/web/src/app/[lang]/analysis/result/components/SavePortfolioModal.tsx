'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';

interface SavePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  error?: string | null;
}

export function SavePortfolioModal({ isOpen, onClose, onSave, error }: SavePortfolioModalProps) {
  const { t } = useTranslation();
  const [portfolioName, setPortfolioName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset name when modal opens
  useEffect(() => {
    if (isOpen) {
      setPortfolioName('');
    }
  }, [isOpen]);

  // Lock scroll when modal is open
  useScrollLock(isOpen);

  // Validation (duplicate check is now server-side)
  const trimmedName = portfolioName.trim();
  const isTooShort = trimmedName.length > 0 && trimmedName.length < 3;
  const isTooLong = trimmedName.length > 50;
  const isValid = trimmedName.length >= 3 && !isTooLong;

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (isValid) {
      setIsLoading(true);
      try {
        await onSave(trimmedName);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 border border-cyan-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-500">
            <Check className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('portfolio.save-modal.title')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {t('portfolio.save-modal.description')}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('portfolio.save-modal.label')}</label>
            <span className={`text-xs ${trimmedName.length > 40 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'}`}>
              {trimmedName.length}/50
            </span>
          </div>

          <input
            type="text"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('portfolio.save-modal.placeholder')}
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
              <span>{t('portfolio.save-modal.error-short')}</span>
            </div>
          )}

          {isTooLong && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3 h-3" />
              <span>{t('portfolio.save-modal.error-long')}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3 h-3" />
              <span>{error}</span>
            </div>
          )}

          {isValid && !error && (
            <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400">
              <Check className="w-3 h-3" />
              <span>{t('portfolio.save-modal.success')}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 transition-colors"
          >
            {t('portfolio.save-modal.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('portfolio.save-modal.loading') : t('portfolio.save-modal.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
