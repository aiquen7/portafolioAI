import React, { useEffect, useRef } from 'react';
import axios from 'axios';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  variant?: 'header' | 'modal';
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess, variant = 'modal' }) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID no está configurado en .env');
      return;
    }

    const existing = document.getElementById('google-identity-script');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-identity-script';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => initializeGSI(clientId);
    } else {
      initializeGSI(clientId);
    }

    function initializeGSI(clientId: string) {
      // @ts-ignore
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      // Render button into our container
      if (divRef.current) {
        // @ts-ignore
        window.google.accounts.id.renderButton(divRef.current, {
          theme: variant === 'header' ? 'filled_blue' : 'outline',
          size: variant === 'header' ? 'medium' : 'large',
          width: variant === 'header' ? '200' : '100%',
        });
      }
    }

    async function handleCredentialResponse(response: any) {
      const id_token = response?.credential;
      if (!id_token) return;
      try {
        const resp = await axios.post('/api/auth/google/verify', { id_token });
        const token = resp.data?.access_token || resp.data;
        if (token) {
          localStorage.setItem('token', token);
          try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            if (decoded?.user_id) localStorage.setItem('user_id', decoded.user_id);
          } catch (e) {
            // ignore
          }
          // Callback o redirigir
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = '/';
          }
        }
      } catch (err) {
        console.error('Google verify failed', err);
      }
    }
  }, [onSuccess]);

  return <div ref={divRef} />;
};

export default GoogleSignInButton;
