// Componente de autenticación simple
import React, { useState, useEffect, useRef } from 'react';
import { loginUser, registerUser } from '../services/api';
import { FaUser, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import GoogleSignInButton from './GoogleSignInButton';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (source: 'login' | 'register') => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [touched, setTouched] = useState<{ email: boolean; password: boolean; name: boolean }>({ email: false, password: false, name: false });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsRegister(initialMode === 'register');
    setError(null);
    setRegisterSuccess(false);
    setEmail('');
    setPassword('');
    setName('');
    setTouched({ email: false, password: false, name: false });
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validaciones básicas
  const validateEmail = (value: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
  const validatePassword = (value: string) => value.length >= 6;
  const validateName = (value: string) => value.length >= 2;

  // Enviar solicitud de recuperación de contraseña
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSent(false);
    if (!validateEmail(forgotEmail)) {
      setForgotError('Correo electrónico inválido');
      return;
    }
    try {
      await import('../services/api').then(({ forgotPasswordRequest }) => forgotPasswordRequest(forgotEmail));
      setForgotSent(true);
    } catch (err: any) {
      setForgotError('No se pudo enviar el correo.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Validaciones front
    if (!validateEmail(email)) {
      setError('Correo electrónico inválido');
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }
    if (isRegister && !validateName(name)) {
      setError('El nombre debe tener al menos 2 caracteres');
      setLoading(false);
      return;
    }
    try {
      if (isRegister) {
        // Registrar usuario y mostrar mensaje de verificación (no auto-login)
        await registerUser({ name, email, password });
        setRegisterSuccess(true);
        // No hacer auto-login: esperar verificación por email
      } else {
        const response = await loginUser({ email, password });
        localStorage.setItem('token', response.data.access_token);
        const decodedToken = JSON.parse(atob(response.data.access_token.split('.')[1]));
        localStorage.setItem('user_id', decodedToken.user_id);
        onLoginSuccess('login');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Contraseña incorrecta');
      } else {
        setError(err.response?.data?.detail || 'Ocurrió un error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0 bg-black/30 backdrop-blur-sm"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      ref={modalRef}
    >
      {/* Modal Card - Professional Style */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md px-6 sm:px-8 py-8 animate-fade-in border border-gray-200">
        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl focus:outline-none transition-colors duration-200"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <FaTimes />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>

        {/* Mensaje de éxito tras registro */}
        {registerSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-center text-sm border border-green-200">
              ✓ Registro exitoso. Revisa tu correo para verificar la cuenta (si no llega, revisa carpeta de spam).
            </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900"><FaUser size={16} /></span>
                <input
                  type="text"
                  id="name"
                  className={`pl-9 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 placeholder-gray-500 ${touched.name && !validateName(name) ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                  value={name}
                  onChange={e => { setName(e.target.value); setTouched(t => ({ ...t, name: true })); }}
                  required
                  minLength={2}
                  autoFocus={isRegister}
                  placeholder="Tu nombre"
                />
              </div>
              {touched.name && !validateName(name) && (
                <span className="text-xs text-red-600 mt-1 block">El nombre debe tener al menos 2 caracteres</span>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900"><FaEnvelope size={16} /></span>
              <input
                type="email"
                id="email"
                className={`pl-9 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 placeholder-gray-500 ${touched.email && !validateEmail(email) ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                value={email}
                onChange={e => { setEmail(e.target.value); setTouched(t => ({ ...t, email: true })); }}
                required
                autoFocus={!isRegister}
                placeholder="correo@ejemplo.com"
              />
            </div>
            {touched.email && !validateEmail(email) && (
              <span className="text-xs text-red-600 mt-1 block">Correo electrónico inválido</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900"><FaLock size={16} /></span>
              <input
                type="password"
                id="password"
                className={`pl-9 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-gray-900 placeholder-gray-500 ${touched.password && !validatePassword(password) ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                value={password}
                onChange={e => { setPassword(e.target.value); setTouched(t => ({ ...t, password: true })); }}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {touched.password && !validatePassword(password) && (
              <span className="text-xs text-red-600 mt-1 block">La contraseña debe tener al menos 6 caracteres</span>
            )}
            {!isRegister && (
              <div className="text-right mt-2">
                <button
                  type="button"
                  className="text-xs text-blue-900 hover:text-blue-600 font-medium underline"
                  onClick={() => setShowForgot(true)}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Modal de recuperación de contraseña */}
            {showForgot && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg border border-gray-200 relative">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={() => { setShowForgot(false); setForgotEmail(''); setForgotSent(false); setForgotError(null); }}
                    aria-label="Cerrar"
                  >
                    <FaTimes />
                  </button>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Recuperar Contraseña</h3>
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <input
                      type="email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-500"
                      placeholder="Correo electrónico"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                    />
                    {forgotError && <p className="text-red-600 text-xs text-center">{forgotError}</p>}
                    <button
                      type="submit"
                      className="w-full bg-blue-900 text-white font-medium py-2 rounded-lg hover:bg-blue-800 transition duration-200"
                    >
                      Enviar Instrucciones
                    </button>
                    {forgotSent && <p className="text-green-700 text-xs text-center mt-2 bg-green-50 p-2 rounded">Si el correo existe, recibirás instrucciones para recuperar tu contraseña.</p>}
                  </form>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-600 text-xs text-center bg-red-50 border border-red-200 rounded-lg py-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition duration-200 disabled:opacity-50 text-base mt-6"
            disabled={loading}
          >
            {loading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Entrar')}
          </button>
        </form>

        {/* Botón de inicio con Google */}
        <div className="mt-4">
            <GoogleSignInButton variant="modal" action={isRegister ? 'signup' : 'signin'} onSuccess={() => onLoginSuccess('login')} />
        </div>

        {/* Alternar login/registro */}
        <div className="mt-6 text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-900 hover:text-blue-600 font-semibold underline"
            >
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default AuthModal;
