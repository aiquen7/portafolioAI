export const adminReplySupportMessage = (messageId: string, reply: string) =>
  api.patch(`/admin/support/messages/${messageId}/reply`, reply, { headers: { 'Content-Type': 'application/json' } });
// Recuperación de contraseña
export const forgotPasswordRequest = (email: string) => api.post('/auth/forgot-password', { email });
// Regenerar portafolio (admin)
export const adminRegeneratePortfolio = (userId: string) => api.post('/optimize', { user_id: userId });
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si recibimos un 401, limpiar el token automáticamente
    if (error.response?.status === 401) {
      console.log("Token inválido o expirado. Limpiando localStorage...");
      removeAuthToken();
      localStorage.removeItem('user_id');
      // Si estamos en una ruta protegida, redirigir al home
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Funciones de autenticación
export const registerUser = (userData: any) => api.post('/auth/register', userData);
export const loginUser = (credentials: any) => api.post('/auth/login', credentials);
export const fetchCurrentUser = () => api.get('/auth/me');

// Funciones de perfil y portafolio
export const saveRiskProfile = (profileData: any) => api.post('/risk-profile', profileData);
export const optimizePortfolio = (portfolioData: any) => api.post('/optimize', portfolioData);
export const fetchUserPortfolio = (userId: string) => api.get(`/portfolio/${userId}`);
export const simulatePortfolio = (simulationData: any) => api.post('/simulate', simulationData);

// Funciones de soporte y noticias
export const submitContactForm = (contactData: any) => api.post('/support/contact', contactData);
export const fetchNews = () => api.get('/news');

// Funciones de IA
// Función de chatbot eliminada

// Funciones de datos de acciones
export const fetchStockData = (tickers: string[]) => api.post('/stock-data', { tickers });

// --- Funciones ADMIN ---
// Usuarios
export const adminFetchUsers = () => api.get('/admin/users');
export const adminGetUser = (userId: string) => api.get(`/admin/users/${userId}`);
export const adminUpdateUser = (userId: string, data: any) => api.patch(`/admin/users/${userId}`, data);
export const adminDeleteUser = (userId: string) => api.delete(`/admin/users/${userId}`);
export const adminBlockUser = (userId: string) => api.post(`/admin/users/${userId}/block`);
export const adminUnblockUser = (userId: string) => api.post(`/admin/users/${userId}/unblock`);
export const adminResetPassword = (userId: string) => api.post(`/admin/users/${userId}/reset-password`);
export const adminUserActivity = (userId: string) => api.get(`/admin/users/${userId}/activity`);

// Portafolios
export const adminFetchPortfolios = () => api.get('/admin/portfolios');
export const adminGetPortfolio = (portfolioId: string) => api.get(`/admin/portfolios/${portfolioId}`);
export const adminUpdatePortfolio = (portfolioId: string, data: any) => api.put(`/admin/portfolios/${portfolioId}`, data);
export const adminDeletePortfolio = (portfolioId: string) => api.delete(`/admin/portfolios/${portfolioId}`);
export const adminGetUserPortfolios = (userId: string) => api.get(`/admin/portfolios/user/${userId}`);

// Simulaciones
export const adminFetchSimulations = () => api.get('/admin/simulations');
export const adminGetSimulationsForPortfolio = (portfolioId: string) => api.get(`/admin/simulations/portfolio/${portfolioId}`);
export const adminDeleteSimulation = (portfolioId: string, timestamp: string) => api.delete(`/admin/simulations/${portfolioId}/${timestamp}`);

// Contenido
export const adminFetchContent = () => api.get('/admin/content');
export const adminCreateContent = (data: any) => api.post('/admin/content', data);
export const adminUpdateContent = (contentId: string, data: any) => api.put(`/admin/content/${contentId}`, data);
export const adminDeleteContent = (contentId: string) => api.delete(`/admin/content/${contentId}`);
export const adminAssignSupportMessage = (messageId: string, adminId: string) =>
  api.patch(`/admin/support/messages/${messageId}/assign`, adminId, { headers: { 'Content-Type': 'application/json' } });

// Soporte
export const adminFetchSupportMessages = () => api.get('/admin/support/messages');
export const adminDeleteSupportMessage = (messageId: string) => api.delete(`/admin/support/messages/${messageId}`);

export const adminMarkSupportResolved = (messageId: string) =>
  api.patch(`/admin/support/messages/${messageId}/resolve`);

// Configuración
export const adminFetchConfig = () => api.get('/admin/config');
export const adminUpdateConfig = (data: any) => api.put('/admin/config', data);

// Logs
export const adminFetchLogs = () => api.get('/admin/logs');
export const adminGetLog = (logId: string) => api.get(`/admin/logs/${logId}`);
export const adminDeleteLog = (logId: string) => api.delete(`/admin/logs/${logId}`);

export default api;
