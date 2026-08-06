'use client';

import { useEffect, useRef } from 'react';
import { recordAnalyticsEvent } from '@/lib/api';

export function useTracker(portfolioId?: string) {
  const secondsSpent = useRef(0);

  useEffect(() => {
    if (!portfolioId) return;

    // Heartbeat timer every 10 seconds
    const interval = setInterval(() => {
      secondsSpent.current += 10;
      recordAnalyticsEvent(portfolioId, {
        duration_seconds: secondsSpent.current,
      });
    }, 10000);

    // Event listener for project clicks
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-project-name]');
      if (target) {
        const projectName = target.getAttribute('data-project-name');
        if (projectName) {
          recordAnalyticsEvent(portfolioId, {
            project_clicked: projectName,
            duration_seconds: secondsSpent.current,
          });
        }
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleClick);
    };
  }, [portfolioId]);
}
