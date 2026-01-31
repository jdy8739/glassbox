'use client';

/**
 * LocalizedLink Component
 *
 * Drop-in replacement for Next.js Link that automatically prefixes
 * href with the current language from the route.
 *
 * @example
 * <LocalizedLink href="/portfolio/new">Create Portfolio</LocalizedLink>
 * // In /en/*, renders: <Link href="/en/portfolio/new">
 * // In /ko/*, renders: <Link href="/ko/portfolio/new">
 */

import Link, { type LinkProps } from 'next/link';
import { useParams } from 'next/navigation';
import { type Language, DEFAULT_LANGUAGE } from '@/lib/i18n/config';
import { getLocalizedPath } from '@/lib/i18n/paths';
import { type AnchorHTMLAttributes, forwardRef } from 'react';

type LocalizedLinkProps = Omit<LinkProps, 'href'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
  };

export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  function LocalizedLink({ href, ...props }, ref) {
    const params = useParams();
    const currentLang = (params?.lang as Language) || DEFAULT_LANGUAGE;

    // Auto-prefix href with current language
    const localizedHref = getLocalizedPath(href, currentLang);

    return <Link ref={ref} href={localizedHref} {...props} />;
  }
);
