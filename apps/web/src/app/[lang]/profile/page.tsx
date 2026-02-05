'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { User as UserIcon, Trash2, Edit2, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as userApi from '@/lib/api/user';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { signOut } from 'next-auth/react';
import type { UserProfile } from '@glassbox/types';

interface ProfileFormData {
  name: string;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Fetch user profile with 401 handling
  const { data: user, isLoading, error } = useQuery<UserProfile>({
    queryKey: ['user', 'profile'],
    queryFn: userApi.getProfile,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 - redirect to login instead
      if (error?.status === 401) {
        router.push('/login');
        return false;
      }
      return failureCount < 3;
    },
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
    },
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  // Update username mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => userApi.updateProfile(data.name),
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user', 'profile'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['user', 'profile']);

      // Optimistically update
      queryClient.setQueryData(['user', 'profile'], (old: any) => ({
        ...old,
        name: newData.name,
      }));

      setIsEditing(false);

      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['user', 'profile'], context.previous);
      }
      // Re-open edit mode on error
      setIsEditing(true);
    },
    onSuccess: () => {
      // Refresh data from server to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });

  // Delete account mutation with feedback
  const deleteMutation = useMutation({
    mutationFn: userApi.deleteAccount,
    onSuccess: async () => {
      // Close dialog immediately
      setShowDeleteDialog(false);

      // Clear all user-related cache
      queryClient.clear();

      // Sign out from NextAuth to clear session
      await signOut({ redirect: false });

      // Show success message briefly before redirect
      setTimeout(() => {
        router.push('/');
      }, 1500);
    },
  });

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (updateMutation.isSuccess) {
      const timer = setTimeout(() => {
        updateMutation.reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [updateMutation.isSuccess, updateMutation]);

  const onSubmit = (data: ProfileFormData) => {
    // Sanitize input by trimming whitespace
    const sanitizedData = {
      name: data.name.trim(),
    };
    updateMutation.mutate(sanitizedData);
  };

  const handleCancel = () => {
    reset({ name: user?.name || '' });
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <main className="min-h-screen px-6 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/60 dark:text-white/60">{t('common.loading')}</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-6 py-12 flex items-center justify-center">
        <div className="glass-panel p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black dark:text-white mb-2">
            {t('profile.error.title')}
          </h2>
          <p className="text-black/60 dark:text-white/60 mb-4">
            {t('profile.error.description')}
          </p>
          <Link href="/" className="glass-button inline-flex items-center justify-center">
            {t('common.button.back-home')}
          </Link>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const memberSince = new Date(user.createdAt).getFullYear();

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            {t('profile.title')}
          </h1>
          <p className="text-lg text-black/60 dark:text-white/60">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Success/Error Messages */}
        {updateMutation.isSuccess && (
          <div className="glass-panel p-4 border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300">
              {t('profile.success.updated')}
            </p>
          </div>
        )}

        {updateMutation.isError && (
          <div className="glass-panel p-4 border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {t('profile.error.update-failed')}
              </p>
              {updateMutation.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {(updateMutation.error as any).message || 'Unknown error'}
                </p>
              )}
            </div>
          </div>
        )}

        {deleteMutation.isSuccess && (
          <div className="glass-panel p-4 border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300">
              {t('profile.success.deleted')}
            </p>
          </div>
        )}

        {deleteMutation.isError && (
          <div className="glass-panel p-4 border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {t('profile.error.delete-failed')}
              </p>
              {deleteMutation.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {(deleteMutation.error as any).message || 'Unknown error'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="glass-panel p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-1 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
              <UserIcon className="w-10 h-10 text-slate-400" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h3 className="font-bold text-2xl text-black dark:text-white">{user.name}</h3>
            <p className="text-sm text-black/60 dark:text-white/60">{user.email}</p>
            <p className="text-xs text-black/50 dark:text-white/50">
              {t('profile.member-since', { year: memberSince })}
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black dark:text-white">
              {t('profile.section.personal')}
            </h2>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={deleteMutation.isPending}
                className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit2 className="w-4 h-4" />
                {t('common.button.edit')}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  {t('common.button.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!isDirty || updateMutation.isPending}
                  className="px-3 py-1.5 text-sm font-medium bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('common.button.saving')}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {t('common.button.save')}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-black/70 dark:text-white/70">
                {t('profile.field.fullname')}
              </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    {...register('name', {
                      required: t('profile.validation.name-required'),
                      minLength: {
                        value: 2,
                        message: t('profile.validation.name-min-length'),
                      },
                      maxLength: {
                        value: 50,
                        message: t('profile.validation.name-max-length'),
                      },
                      pattern: {
                        value: /^[a-zA-Z\s'\-\.]+$/,
                        message: t('profile.validation.name-pattern'),
                      },
                      validate: {
                        noOnlySpaces: (value) =>
                          value.trim().length > 0 || t('profile.validation.name-no-spaces'),
                      },
                    })}
                    className="glass-input w-full"
                    autoFocus
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </>
              ) : (
                <div className="px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 text-black dark:text-white">
                  {user.name}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-black/70 dark:text-white/70">
                {t('profile.field.email')}
              </label>
              <div className="px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50">
                {user.email}
              </div>
              <p className="text-xs text-black/40 dark:text-white/40">
                {t('profile.field.email-note')}
              </p>
            </div>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="glass-panel p-8 border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 space-y-6">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
            {t('profile.section.danger')}
          </h2>
          <p className="text-sm text-black/60 dark:text-white/60">
            {t('profile.danger.desc')}
          </p>
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteMutation.isPending || updateMutation.isPending}
            className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                {t('profile.danger.deleting')}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {t('profile.danger.delete')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setShowDeleteDialog(false);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title={t('profile.delete.confirm-title')}
        message={t('profile.delete.confirm-message')}
        confirmText={t('profile.delete.confirm-button')}
        cancelText={t('common.button.cancel')}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </main>
  );
}
