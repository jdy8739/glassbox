'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, User } from 'lucide-react';
import { LocalizedLink } from '@/components/LocalizedLink';
import { GlassboxIcon } from '@/components/glassbox-icon';
import { useTranslation } from 'react-i18next';

export default function SignupPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate signup
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4 bg-slate-50 dark:bg-slate-950">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 dark:bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 perspective-1000">
        <div className="glass-panel p-8 md:p-10 backdrop-blur-xl border-white/40 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="w-16 h-16 mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
              <GlassboxIcon />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('auth.signup.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {t('auth.signup.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                  {t('auth.signup.fullname')}
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="glass-input w-full pl-10 transition-all duration-200 focus:scale-[1.01]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                  {t('auth.login.email')}
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="glass-input w-full pl-10 transition-all duration-200 focus:scale-[1.01]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                  {t('auth.login.password')}
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="glass-input w-full pl-10 transition-all duration-200 focus:scale-[1.01]"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="glass-button w-full group relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{t('auth.signup.submit')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('auth.signup.divider')}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <button className="glass-button-outline w-full py-2.5 hover:bg-white/40 dark:hover:bg-slate-800/60 group transition-all duration-300">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm">{t('auth.signup.google')}</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('auth.signup.has-account')}{' '}
              <LocalizedLink href="/login" className="font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 hover:underline transition-colors">
                {t('auth.signup.signin-link')}
              </LocalizedLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
