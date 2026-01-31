'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href: string;
  label?: string;
}

export function BackButton({ href, label = 'Back' }: BackButtonProps) {
  return (
    <Link 
      href={href} 
      className="text-sm font-semibold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </Link>
  );
}
