'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

interface AuthRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

/**
 * Authentication required dialog
 * Shows when user tries to analyze without being logged in
 */
export function AuthRequiredDialog({ isOpen, onClose, pathname }: AuthRequiredDialogProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 border border-slate-200 dark:border-cyan-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
            <Rocket className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('auth.required.title')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('auth.required.message')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
            className="w-full px-4 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white transition-colors font-medium shadow-lg text-center"
          >
            {t('nav.signin')}
          </Link>
          <Link
            href={`/signup?callbackUrl=${encodeURIComponent(pathname)}`}
            className="w-full px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors font-medium text-center"
          >
            {t('nav.signup')}
          </Link>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors font-medium"
          >
            {t('common.button.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
