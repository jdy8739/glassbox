'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { LocalizedLink } from '@/components/LocalizedLink';
import { GlassboxIcon } from '@/components/glassbox-icon';
import { useTranslation } from 'react-i18next';

export default function PasswordResetPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate password reset email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSent(true);
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
              {t('auth.reset.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {t('auth.reset.subtitle')}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
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
                      <span>{t('auth.reset.submit')}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-600 dark:text-green-400 text-sm">
                {t('auth.reset.success-message')}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {t('auth.reset.check-email')}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <LocalizedLink href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('auth.reset.back-to-login')}
            </LocalizedLink>
          </div>
        </div>
      </div>
    </main>
  );
}
