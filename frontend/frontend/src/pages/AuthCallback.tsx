import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded && decoded.user_id) {
          localStorage.setItem('user_id', decoded.user_id);
        }
      } catch (e) {
        // ignore
      }
    }
    // Redirigir a inicio para que App recargue estado
    window.location.href = '/';
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-lg text-slate-600">Procesando inicio de sesión...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
