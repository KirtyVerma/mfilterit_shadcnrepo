'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UnauthorizedError } from '@/common/errors';

interface SessionCheckProps {
  children: React.ReactNode;
}

export const SessionCheck: React.FC<SessionCheckProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSessionExpired = () => {
    try {
      // Store the current path for redirect after login
      if (pathname !== '/') {
        sessionStorage.setItem('redirectPath', pathname);
      }
      
      // Clear all session data
      sessionStorage.clear();
      localStorage.clear(); // Also clear localStorage just in case
      
      // Force a complete page reload to clear any cached states
      window.location.href = '/';
    } catch (error) {
      console.error('Error during session cleanup:', error);
      // Force reload as fallback
      window.location.reload();
    }
  };

  const checkSession = () => {
    try {
      const accessToken = sessionStorage.getItem('AccessToken');
      const idToken = sessionStorage.getItem('IdToken') || sessionStorage.getItem('IDToken');

      if (!accessToken || !idToken) {
        throw new UnauthorizedError('Session expired');
        
      }

      // Verify token expiration
      if (accessToken) {
        const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
        // Add buffer time (5 minutes) before actual expiration
        if ((tokenData.exp * 1000) - 300000 < Date.now()) {
          throw new UnauthorizedError('Session expired due to token ');
        }
      }
    } catch (error) {
      console.log(error);
      handleSessionExpired();
    }
  };

  useEffect(() => {
    // Skip session check for login page
    if (pathname === '/') return;

    // Check immediately
    checkSession();

    // Check every 30 seconds instead of every minute
    const interval = setInterval(checkSession, 30000);

    // Add visibility change listener to check session when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);

  return <>{children}</>;
};
