'use client';

import { AlertCircle, Check } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'danger' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'warning',
  isLoading = false,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();
  const confirm = confirmText ?? t('common.button.confirm');
  const cancel = cancelText ?? t('common.button.cancel');
  // Lock scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const variantStyles = {
    warning: {
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      buttonBg: 'bg-orange-500 hover:bg-orange-600',
      border: 'border-orange-500/20',
      bg: 'bg-orange-500/5',
    },
    danger: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      buttonBg: 'bg-red-500 hover:bg-red-600',
      border: 'border-red-500/20',
      bg: 'bg-red-500/5',
    },
    info: {
      icon: Check,
      iconColor: 'text-cyan-500',
      buttonBg: 'bg-cyan-500 hover:bg-cyan-600',
      border: 'border-cyan-500/20',
      bg: 'bg-cyan-500/5',
    },
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 border ${style.border}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full bg-black/5 dark:bg-white/5 ${style.iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancel}
          </button>
          <button
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white transition-colors font-medium shadow-lg ${style.buttonBg} disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {confirm}
          </button>
        </div>
      </div>
    </div>
  );
};
