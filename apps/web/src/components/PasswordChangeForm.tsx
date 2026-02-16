'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Save, X, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import * as userApi from '@/lib/api/user';
import {
  calculatePasswordStrength,
  PASSWORD_REQUIREMENTS,
  isCommonPassword,
} from '@/lib/utils/password-strength';
import { cn } from '@/lib/utils';

interface PasswordChangeFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordChangeForm({
  onCancel,
  onSuccess,
}: PasswordChangeFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');
  const currentPassword = watch('currentPassword');
  const passwordStrength = calculatePasswordStrength(newPassword || '');

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      userApi.changePassword(data),
    onSuccess: () => {
      reset();
      onSuccess();
      // Invalidate user profile to refresh data
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    // Sanitize inputs by trimming whitespace
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword.trim(),
      newPassword: data.newPassword.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Current Password */}
      <div className="space-y-2">
        <label
          htmlFor="current-password"
          className="text-sm font-medium text-black/70 dark:text-white/70"
        >
          {t('profile.security.current-password')}
        </label>
        <div className="relative">
          <input
            id="current-password"
            type={showCurrentPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className={cn(
              'glass-input w-full pr-10',
              errors.currentPassword && 'border-red-500 focus:ring-red-500'
            )}
            {...register('currentPassword', {
              required: t('profile.validation.current-password-required'),
            })}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors"
            tabIndex={-1}
          >
            {showCurrentPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="text-sm font-medium text-black/70 dark:text-white/70"
        >
          {t('profile.security.new-password')}
        </label>
        <div className="relative">
          <input
            id="new-password"
            type={showNewPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className={cn(
              'glass-input w-full pr-10',
              errors.newPassword && 'border-red-500 focus:ring-red-500'
            )}
            {...register('newPassword', {
              required: t('profile.validation.new-password-required'),
              minLength: {
                value: 8,
                message: t('profile.validation.password-min-length'),
              },
              validate: {
                hasUppercase: (value) =>
                  /[A-Z]/.test(value) ||
                  t('profile.validation.password-uppercase'),
                hasLowercase: (value) =>
                  /[a-z]/.test(value) ||
                  t('profile.validation.password-lowercase'),
                hasNumber: (value) =>
                  /[0-9]/.test(value) || t('profile.validation.password-number'),
                notSameAsCurrent: (value) =>
                  value !== currentPassword ||
                  t('profile.validation.password-same'),
                notCommon: (value) =>
                  !isCommonPassword(value) ||
                  t('profile.validation.password-common'),
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors"
            tabIndex={-1}
          >
            {showNewPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {errors.newPassword.message}
          </p>
        )}

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 flex-1 rounded-full transition-all',
                    i <= passwordStrength.score
                      ? passwordStrength.color
                      : 'bg-slate-200 dark:bg-slate-700'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-black/60 dark:text-white/60">
              {t('profile.security.strength')}:{' '}
              {t(`profile.security.strength.${passwordStrength.label}`)}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className="text-sm font-medium text-black/70 dark:text-white/70"
        >
          {t('profile.security.confirm-password')}
        </label>
        <div className="relative">
          <input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className={cn(
              'glass-input w-full pr-10',
              errors.confirmPassword && 'border-red-500 focus:ring-red-500'
            )}
            {...register('confirmPassword', {
              required: t('profile.validation.confirm-password-required'),
              validate: {
                matches: (value) =>
                  value === newPassword ||
                  t('profile.validation.passwords-mismatch'),
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Requirements Checklist */}
      <div className="rounded-lg bg-black/5 dark:bg-white/5 p-4">
        <p className="text-sm font-medium text-black/70 dark:text-white/70 mb-3">
          {t('profile.security.requirements')}
        </p>
        <ul className="space-y-2">
          {PASSWORD_REQUIREMENTS.map((req) => {
            const isMet = req.test(newPassword || '');
            return (
              <li key={req.id} className="flex items-center gap-2">
                {isMet ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
                <span
                  className={cn(
                    'text-sm',
                    isMet
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-black/60 dark:text-white/60'
                  )}
                >
                  {t(req.translationKey)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Error Message */}
      {changePasswordMutation.isError && (
        <div className="glass-panel p-4 border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
          <p className="text-sm text-red-700 dark:text-red-300">
            {(changePasswordMutation.error as any)?.response?.status === 401
              ? t('profile.validation.current-password-incorrect')
              : (changePasswordMutation.error as any)?.response?.status === 429
              ? t('profile.error.rate-limited')
              : t('profile.error.password-change-failed')}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={changePasswordMutation.isPending}
          className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          {t('profile.security.button.cancel')}
        </button>
        <button
          type="submit"
          disabled={!isDirty || changePasswordMutation.isPending}
          className="px-4 py-2 text-sm font-medium bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {changePasswordMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t('common.button.saving')}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {t('profile.security.button.update')}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
