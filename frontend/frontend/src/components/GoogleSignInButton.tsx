import React, { useEffect, useRef, useCallback } from 'react';
import api from '../services/api';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  variant?: 'header' | 'modal';
  action?: 'signin' | 'signup';
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess, variant = 'modal', action = 'signin' }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const onSuccessRef = useRef(onSuccess);

  // Actualizar ref cuando onSuccess cambia para evitar reinicializaciones del useEffect
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  // Manejar la respuesta de Google credencial
  const handleCredentialResponse = useCallback(async (response: any) => {
    const id_token = response?.credential;
    if (!id_token) {
      console.error('[GoogleSignInButton] No credential en respuesta de Google');
      return;
    }
    try {
      console.log('[GoogleSignInButton] Enviando id_token a backend /auth/google/verify...');
      const resp = await api.post('/auth/google/verify', { id_token });
      console.log('[GoogleSignInButton] Respuesta del servidor:', resp.data);
      
      // Manejar correctamente la respuesta - puede ser {access_token: ".."} o solo la cadena
      const token = resp.data?.access_token || resp.data;
      if (!token) {
        console.error('[GoogleSignInButton] No se recibió token en la respuesta:', resp.data);
        alert('Error: No se recibió token del servidor');
        return;
      }
      
      console.log('[GoogleSignInButton] Token recibido, guardando en localStorage...');
      const tokenStr = typeof token === 'string' ? token : token;
      localStorage.setItem('token', tokenStr);
      
      try {
        const decoded = JSON.parse(atob(tokenStr.split('.')[1]));
        if (decoded?.user_id) {
          localStorage.setItem('user_id', decoded.user_id);
          console.log('[GoogleSignInButton] User ID guardado:', decoded.user_id);
        }
      } catch (e) {
        console.warn('[GoogleSignInButton] No se pudo decodificar token:', e);
      }
      
      console.log('[GoogleSignInButton] Token guardado correctamente');
      
      // Ejecutar el callback con la referencia actualizada
      if (onSuccessRef.current) {
        console.log('[GoogleSignInButton] Ejecutando onSuccess callback');
        onSuccessRef.current();
      } else {
        console.log('[GoogleSignInButton] No hay onSuccess, redirigiendo a /');
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    } catch (err: any) {
      console.error('[GoogleSignInButton] Error en Google verify:', err);
      console.error('[GoogleSignInButton] Status:', err.response?.status);
      console.error('[GoogleSignInButton] Data:', err.response?.data);
      alert('Error al autenticar con Google: ' + (err.response?.data?.detail || err.message));
    }
  }, []);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('[GoogleSignInButton] VITE_GOOGLE_CLIENT_ID no está configurado en .env');
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
      console.log('[GoogleSignInButton] Inicializando Google Identity Services...');
      // @ts-ignore
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        console.warn('[GoogleSignInButton] Google Identity Services no cargó correctamente');
        return;
      }
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      console.log('[GoogleSignInButton] Google inicializado, renderizando botón...');
      // Render button into our container for header variant only
      if (variant === 'header') {
        if (divRef.current) {
          // @ts-ignore
          window.google.accounts.id.renderButton(divRef.current, {
            theme: 'filled_blue',
            size: 'medium',
            width: '200',
            text: action === 'signup' ? 'signup_with' : 'signin_with',
          });
          console.log('[GoogleSignInButton] Botón GSI renderizado en header container');
        } else {
          console.warn('[GoogleSignInButton] divRef.current no está disponible');
        }
      } else {
        // Para modal usaremos un botón HTML personalizado (para poder controlar el texto)
        console.log('[GoogleSignInButton] GSI inicializado (modal usará botón personalizado)');
      }
    }
  }, []); // Solo ejecutar al montar - handleCredentialResponse está en useCallback con dependencias vacías

  // Handler para el botón personalizado del modal
  const handleModalClick = () => {
    // @ts-ignore
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        // Mostrar prompt/flux de Google Identity
        // @ts-ignore
        window.google.accounts.id.prompt();
      } catch (e) {
        console.warn('[GoogleSignInButton] Error al invocar prompt de Google:', e);
      }
    } else {
      console.warn('[GoogleSignInButton] Google Identity Services no está disponible');
    }
  };

  if (variant === 'modal') {
    const label = action === 'signup' ? 'Registrarse con Google' : 'Iniciar sesión con Google';
    return (
      <div className="flex justify-center">
        <button
          onClick={handleModalClick}
          className="w-full max-w-md flex items-center justify-center gap-3 px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors duration-150"
        >
          <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
          <span className="text-sm font-medium text-gray-800">{label}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={divRef}
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        minHeight: '44px',
        alignItems: 'center',
      }}
      className="google-signin-container"
    />
  );
};

export default GoogleSignInButton;
