import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  onToken: (idToken: string) => void;
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export const GoogleLoginButton = ({ onToken }: GoogleLoginButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!clientId || !containerRef.current) return;

    let cancelled = false;
    const render = () => {
      if (cancelled || !window.google || !containerRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => onToken(response.credential),
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
      });
    };

    if (window.google) {
      render();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          render();
        }
      }, 100);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }
    return () => {
      cancelled = true;
    };
  }, [onToken]);

  if (!clientId) return null;
  return <div ref={containerRef} />;
};
