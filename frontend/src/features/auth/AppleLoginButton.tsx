import { useEffect } from 'react';
import { Button } from '@/components/Button';

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<{ authorization: { id_token: string } }>;
      };
    };
  }
}

interface AppleLoginButtonProps {
  onToken: (idToken: string) => void;
}

const clientId = import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined;
const redirectURI = (import.meta.env.VITE_APPLE_REDIRECT_URI as string | undefined) ?? window.location.origin;

export const AppleLoginButton = ({ onToken }: AppleLoginButtonProps) => {
  useEffect(() => {
    if (!clientId || !window.AppleID) return;
    window.AppleID.auth.init({ clientId, scope: 'email', redirectURI, usePopup: true });
  }, []);

  if (!clientId) return null;

  const handleClick = async () => {
    if (!window.AppleID) return;
    const result = await window.AppleID.auth.signIn();
    onToken(result.authorization.id_token);
  };

  return (
    <Button type="button" variant="secondary" onClick={handleClick}>
      Continue with Apple
    </Button>
  );
};
