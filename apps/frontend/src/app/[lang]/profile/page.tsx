'use client';

import { useTranslation } from 'react-i18next';
import { User, Mail, Shield, Settings, CreditCard, LogOut, Trash2, Camera } from 'lucide-react';
import { LocalizedLink } from '@/components/LocalizedLink';

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            {t('profile.title')}
          </h1>
          <p className="text-lg text-black/60 dark:text-white/60">
            {t('profile.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Sidebar Navigation */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="glass-panel p-6 flex flex-col items-center text-center space-y-4">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                    <User className="w-10 h-10 text-slate-400" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-black dark:text-white">John Doe</h3>
                <p className="text-sm text-black/50 dark:text-white/50">Member since 2024</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="glass-panel p-2 space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-black/5 dark:bg-white/10 text-black dark:text-white font-medium transition-colors">
                <User className="w-4 h-4" />
                {t('profile.nav.account')}
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                <Shield className="w-4 h-4" />
                {t('profile.nav.security')}
              </button>
            </nav>
          </div>

          {/* Right Column: Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="glass-panel p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  {t('profile.section.personal')}
                </h2>
                <button className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
                  {t('common.button.edit')}
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-black/70 dark:text-white/70">
                    {t('profile.field.fullname')}
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="glass-input w-full"
                    readOnly
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-black/70 dark:text-white/70">
                    {t('profile.field.email')}
                  </label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="glass-input w-full"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-panel p-8 border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 space-y-6">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                {t('profile.section.danger')}
              </h2>
              <p className="text-sm text-black/60 dark:text-white/60">
                {t('profile.danger.desc')}
              </p>
              <button className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                {t('profile.danger.delete')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
