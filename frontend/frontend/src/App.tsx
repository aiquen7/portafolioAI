          {/* <Route path="/admin/config" element={isAuthenticated && isAdmin ? <SystemConfig /> : <Navigate to="/" />} /> */}
// import SystemConfig from './pages/Admin/SystemConfig';
// Componente principal de la aplicación
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import RiskProfileForm from './components/RiskProfileForm';
import AnimatedBackground from './components/AnimatedBackground';
import { getAuthToken, removeAuthToken, fetchCurrentUser, fetchUserPortfolio } from './services/api';
import AboutUs from './pages/AboutUs';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AuthCallback from './pages/AuthCallback';
// Importar componentes de admin
import AdminDashboard from './pages/Admin/AdminDashboard';
// Eliminar referencias a LogsAudit y SupportMessages
function App() {
  // Estado para controlar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAuthToken());
  // Estado para controlar si el modal de autenticación está abierto
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  // Estado para controlar si el modal debe abrir en modo registro
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  // Estado para almacenar el portafolio del usuario
  const [portfolio, setPortfolio] = useState<any>(null);
  // Estado para almacenar el nombre del usuario
  const [userName, setUserName] = useState<string>('');
  // Estado para mostrar carga
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Estado para saber si el usuario es admin
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Función para obtener el portafolio y rol del usuario desde el backend
  const fetchPortfolio = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      // Primero obtenemos el usuario actual
      const response = await fetchCurrentUser();
      console.log('Respuesta de /auth/me:', response.data); // LOG para depuración
      // Guardar el nombre del usuario
      if (response.data && response.data.name) {
        setUserName(response.data.name);
      } else {
        setUserName('');
      }
      // Verificar si el usuario es admin (ajusta según tu backend)
      const isAdminUser = response.data?.role === 'admin';
      setIsAdmin(isAdminUser);
      console.log('Valor de isAdmin:', isAdminUser); // LOG para depuración

      // Obtener el user_id y luego el portafolio
      const userId = response.data?._id || response.data?.id || response.data?.user_id;
      if (userId) {
        const portfolioRes = await fetchUserPortfolio(userId);
        setPortfolio(portfolioRes.data);
      } else {
        setPortfolio(null);
      }
    } catch (err: any) {
      console.error("Error fetching user portfolio:", err);
      // Si el error es 401 (Unauthorized), limpiar el token y cerrar sesión
      if (err.response?.status === 401) {
        console.log("Token inválido o expirado. Cerrando sesión...");
        removeAuthToken();
        setIsAuthenticated(false);
        setPortfolio(null);
        setIsAdmin(false);
        return;
      }
      setPortfolio(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Efecto para cargar el portafolio cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && !portfolio) {
      fetchPortfolio();
    }
  }, [isAuthenticated, portfolio, fetchPortfolio]);

  const navigate = useNavigate();
  // Función llamada cuando la autenticación es exitosa
  const handleLoginSuccess = async (source: 'login' | 'register') => {
    console.log('[handleLoginSuccess] Iniciando con source:', source);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    try {
      console.log('[handleLoginSuccess] Obteniendo usuario actual...');
      const me = await fetchCurrentUser();
      console.log('[handleLoginSuccess] Usuario obtenido:', me.data);
      
      const isAdminUser = me.data?.role === 'admin';
      setIsAdmin(isAdminUser); // Actualiza el estado global
      // Guardar el nombre del usuario
      if (me.data && me.data.name) {
        setUserName(me.data.name);
      } else {
        setUserName('');
      }
      
      console.log('[handleLoginSuccess] isAdminUser:', isAdminUser);
      if (isAdminUser) {
        console.log('[handleLoginSuccess] Redirigiendo a /admin');
        navigate('/admin');
        return;
      }
      if (source === 'register') {
        console.log('[handleLoginSuccess] Redirigiendo a /risk-profile-form (registro)');
        navigate('/risk-profile-form');
        return;
      }
      const hasPortfolio = !!me.data?.portfolio;
      console.log('[handleLoginSuccess] hasPortfolio:', hasPortfolio);
      if (hasPortfolio) {
        console.log('[handleLoginSuccess] Redirigiendo a /dashboard/overview');
        navigate('/dashboard/overview');
      } else {
        console.log('[handleLoginSuccess] Redirigiendo a /risk-profile-form (sin portafolio)');
        navigate('/risk-profile-form');
      }
    } catch (err: any) {
      console.error('[handleLoginSuccess] Error:', err);
      if (err.response?.status === 401) {
        console.error("Token inválido después del login:", err);
        removeAuthToken();
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }
      // No redirigir a '/'
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setPortfolio(null);
    setUserName('');
    window.location.href = '/';
  };

  // Función llamada cuando se genera un portafolio
  const handlePortfolioGenerated = async (_newPortfolio: any) => {
    await fetchPortfolio();
    navigate('/dashboard/overview');
  };

  // Función para abrir el modal de autenticación y luego ir al cuestionario
  const handleOpenAuthModalForQuestionnaire = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  // Función para abrir modal en modo login
  const handleOpenAuthModalLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  // Función para abrir modal en modo registro
  const handleOpenAuthModalRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] font-montserrat text-[var(--color-text-light)]">
      <AnimatedBackground />
      <Routes>
        <Route path="/" element={
          <Home
            onOpenAuthModalLogin={handleOpenAuthModalLogin}
            onOpenAuthModalRegister={handleOpenAuthModalRegister}
            onOpenAuthModalForQuestionnaire={handleOpenAuthModalForQuestionnaire}
            isAuthenticated={isAuthenticated}
            portfolio={portfolio}
            isLoading={isLoading}
            isAdmin={isAdmin}
          />
        } />
        {/* Rutas protegidas que requieren autenticación */}
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} portfolio={portfolio} isAdmin={isAdmin} userName={userName} /> : null}
        />
        <Route
          path="/risk-profile-form"
          element={isAuthenticated ? <RiskProfileForm onPortfolioGenerated={handlePortfolioGenerated} /> : null}
        />
        {/* Rutas de administración, solo para admin */}
        <Route path="/admin/*" element={isAuthenticated && isAdmin ? <AdminDashboard onLogout={handleLogout} /> : null} />
        {/* Páginas públicas */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* Otras rutas públicas o de error */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={null} />
      </Routes>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default App;
