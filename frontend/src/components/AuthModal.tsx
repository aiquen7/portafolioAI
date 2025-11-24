// Componente de autenticación simple
import React, { useState, useEffect, useRef } from 'react';
import { loginUser, registerUser } from '../services/api';
import { FaUser, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';

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
        await registerUser({ name, email, password });
        const loginResponse = await loginUser({ email, password });
        localStorage.setItem('token', loginResponse.data.access_token);
        const decodedToken = JSON.parse(atob(loginResponse.data.access_token.split('.')[1]));
        localStorage.setItem('user_id', decodedToken.user_id);
        setRegisterSuccess(true);
        onLoginSuccess('register');
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
      className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      ref={modalRef}
    >
      {/* Fondo de circuitos tecnológicos */}
      <div className="absolute inset-0 bg-[#0a0e14]">
        {/* Gradiente base */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-[#0a0e14] to-amber-900/30"></div>
        
        {/* Grid de circuitos */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.15)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.08)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        {/* Puntos de conexión animados */}
        <div className="absolute top-32 left-32 w-2 h-2 bg-teal-400 rounded-full animate-pulse-slow shadow-[0_0_15px_rgba(20,184,166,0.6)]"></div>
        <div className="absolute top-64 right-40 w-2 h-2 bg-amber-400 rounded-full animate-pulse-slower shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
        <div className="absolute bottom-40 left-48 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.6)]"></div>
        <div className="absolute bottom-32 right-32 w-2 h-2 bg-teal-400 rounded-full animate-pulse-slow shadow-[0_0_15px_rgba(20,184,166,0.6)]"></div>
        
        {/* Líneas de circuito SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circuitGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(20,184,166,0)" />
              <stop offset="50%" stopColor="rgba(20,184,166,0.4)" />
              <stop offset="100%" stopColor="rgba(20,184,166,0)" />
            </linearGradient>
            <linearGradient id="circuitGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(245,158,11,0)" />
              <stop offset="50%" stopColor="rgba(245,158,11,0.3)" />
              <stop offset="100%" stopColor="rgba(245,158,11,0)" />
            </linearGradient>
          </defs>
          <path d="M 150 250 L 500 250 L 500 450 L 850 450" stroke="url(#circuitGrad1)" strokeWidth="2" fill="none" />
          <path d="M 950 150 L 700 350 L 400 350 L 150 650" stroke="url(#circuitGrad2)" strokeWidth="2" fill="none" />
          <path d="M 1100 550 L 850 650 L 500 650 L 250 850" stroke="url(#circuitGrad1)" strokeWidth="2" fill="none" />
          <circle cx="500" cy="250" r="4" fill="#14b8a6" opacity="0.6" />
          <circle cx="850" cy="450" r="4" fill="#f59e0b" opacity="0.6" />
          <circle cx="400" cy="350" r="4" fill="#06b6d4" opacity="0.6" />
        </svg>
        
        {/* Orbes de luz difusa */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        {/* Overlay para mejor contraste del modal */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Modal Card */}
      <div className="relative bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg px-4 sm:px-8 py-8 sm:py-10 animate-fade-in border border-teal-500/30">
        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-teal-400 text-2xl focus:outline-none transition-colors duration-200"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <FaTimes />
        </button>
        {/* Título */}
        <h2 className="text-3xl font-bold text-white mb-7 text-center tracking-tight">
          {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </h2>

        {/* Mensaje de éxito tras registro */}
        {registerSuccess && (
          <div className="mb-4 p-3 bg-teal-900/50 text-teal-300 rounded-lg text-center text-sm border border-teal-500/30">
            Registro exitoso. ¡Bienvenido!
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-300 mb-1">Nombre</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400"><FaUser /></span>
                <input
                  type="text"
                  id="name"
                  className={`pl-9 pr-3 py-2 w-full bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-500 ${touched.name && !validateName(name) ? 'border-red-400' : 'border-gray-700'}`}
                  value={name}
                  onChange={e => { setName(e.target.value); setTouched(t => ({ ...t, name: true })); }}
                  required
                  minLength={2}
                  autoFocus={isRegister}
                  placeholder="Tu nombre"
                />
              </div>
              {touched.name && !validateName(name) && (
                <span className="text-xs text-red-400">El nombre debe tener al menos 2 caracteres</span>
              )}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-1">Correo electrónico</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400"><FaEnvelope /></span>
              <input
                type="email"
                id="email"
                className={`pl-9 pr-3 py-2 w-full bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-500 ${touched.email && !validateEmail(email) ? 'border-red-400' : 'border-gray-700'}`}
                value={email}
                onChange={e => { setEmail(e.target.value); setTouched(t => ({ ...t, email: true })); }}
                required
                autoFocus={!isRegister}
                placeholder="correo@ejemplo.com"
              />
            </div>
            {touched.email && !validateEmail(email) && (
              <span className="text-xs text-red-400">Correo electrónico inválido</span>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-300 mb-1">Contraseña</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400"><FaLock /></span>
              <input
                type="password"
                id="password"
                className={`pl-9 pr-3 py-2 w-full bg-gray-800/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-500 ${touched.password && !validatePassword(password) ? 'border-red-400' : 'border-gray-700'}`}
                value={password}
                onChange={e => { setPassword(e.target.value); setTouched(t => ({ ...t, password: true })); }}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {touched.password && !validatePassword(password) && (
              <span className="text-xs text-red-400">La contraseña debe tener al menos 6 caracteres</span>
            )}
            {!isRegister && (
              <div className="text-right mt-1">
                <button
                  type="button"
                  className="text-xs text-teal-400 hover:text-teal-300 underline"
                  onClick={() => setShowForgot(true)}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
                {/* Modal de recuperación de contraseña */}
                {showForgot && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
                    <div className="bg-gray-900 rounded-xl p-8 w-full max-w-sm shadow-xl border border-teal-500/30 relative">
                      <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-teal-400 text-xl"
                        onClick={() => { setShowForgot(false); setForgotEmail(''); setForgotSent(false); setForgotError(null); }}
                        aria-label="Cerrar"
                      >
                        <FaTimes />
                      </button>
                      <h3 className="text-xl font-bold text-white mb-4 text-center">Recuperar contraseña</h3>
                      <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <input
                          type="email"
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Correo electrónico"
                          value={forgotEmail}
                          onChange={e => setForgotEmail(e.target.value)}
                          required
                        />
                        {forgotError && <p className="text-red-400 text-xs text-center">{forgotError}</p>}
                        <button
                          type="submit"
                          className="w-full bg-teal-600 text-white font-bold py-2 rounded-lg hover:bg-teal-700 transition duration-200"
                        >
                          Enviar instrucciones
                        </button>
                        {forgotSent && <p className="text-teal-400 text-xs text-center mt-2">Si el correo existe, recibirás instrucciones para recuperar tu contraseña.</p>}
                      </form>
                    </div>
                  </div>
                )}
          </div>
          {error && <p className="text-red-400 text-xs text-center bg-red-900/20 border border-red-500/30 rounded-lg py-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition duration-200 disabled:opacity-50 shadow-lg shadow-teal-900/50 text-base sm:text-lg"
            disabled={loading}
          >
            {loading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Entrar')}
          </button>
        </form>

        {/* Alternar login/registro */}
        <div className="mt-7 text-center">
          <p className="text-xs text-gray-400">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-teal-400 hover:text-teal-300 font-semibold underline"
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
