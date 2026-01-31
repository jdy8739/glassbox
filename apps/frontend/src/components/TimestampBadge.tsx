/**
 * TimestampBadge Component
 * Displays a timestamp badge with relative time and tooltip
 */

'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatRelativeTime, formatFullDateTime } from '@/lib/utils/date';

interface TimestampBadgeProps {
  date?: Date | string | null;
  isFresh?: boolean;
  freshLabel?: string;
  className?: string;
}

export const TimestampBadge = ({
  date,
  isFresh = false,
  freshLabel = 'Fresh Analysis',
  className = '',
}: TimestampBadgeProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update timestamp every minute for accurate relative time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (isFresh) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 backdrop-blur-sm ${className}`}>
        <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
        <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">{freshLabel}</span>
      </div>
    );
  }

  if (!date) {
    return null;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 backdrop-blur-sm ${className}`}>
      <Calendar className="w-3 h-3 text-black/70 dark:text-white/70" />
      <span
        className="text-xs font-semibold text-black/70 dark:text-white/70"
        title={formatFullDateTime(dateObj)}
        key={currentTime.getTime()}
      >
        Updated {formatRelativeTime(dateObj)}
      </span>
    </div>
  );
};
