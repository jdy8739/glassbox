'use client';

import { useState, useEffect } from 'react';

interface HealthStatus {
  isHealthy: boolean;
  lastChecked?: Date;
}

export function useSystemHealth() {
  const [status, setStatus] = useState<HealthStatus>({
    isHealthy: true, // Start optimistic
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
          method: 'GET',
          cache: 'no-store',
        });

        const data = await response.json();

        // Backend returns { status: 'ok' | 'error', python: boolean }
        const isHealthy = response.ok && data.status === 'ok' && data.python === true;

        setStatus({
          isHealthy,
          lastChecked: new Date()
        });
      } catch {
        setStatus({
          isHealthy: false,
          lastChecked: new Date()
        });
      }
    };

    // Check immediately
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return status;
}
