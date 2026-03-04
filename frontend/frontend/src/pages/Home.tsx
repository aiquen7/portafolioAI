// Página de inicio de la aplicación
import React from 'react';
import Footer from '../components/Footer';

// Props para el componente Home
interface HomeProps {
  onOpenAuthModalLogin: () => void;
  onOpenAuthModalRegister: () => void;
  onOpenAuthModalForQuestionnaire: () => void;
  isAuthenticated: boolean;
  portfolio: any;
  isLoading: boolean;
  isAdmin?: boolean;
}

const Home: React.FC<HomeProps> = ({ onOpenAuthModalLogin, onOpenAuthModalRegister, onOpenAuthModalForQuestionnaire: _onOpenAuthModalForQuestionnaire, isAuthenticated: _isAuthenticated, portfolio: _portfolio, isLoading, isAdmin: _isAdmin }) => {


  // Solo permite registro desde el botón principal
  const handleMainButtonClick = () => {
    onOpenAuthModalRegister();
  };

  // Función para obtener el texto del botón según el estado
  const getButtonText = () => {
    if (isLoading) {
      return "Cargando...";
    }
    return "Crear mi Portafolio Gratis";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-primary-bg)]">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <div className="text-2xl font-bold text-blue-900">PortafolioAI</div>
        <nav className="flex gap-3 items-center">
          <button
            onClick={onOpenAuthModalLogin}
            className="bg-transparent text-blue-900 border border-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={onOpenAuthModalRegister}
            className="bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300"
          >
            Registrarse
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section 
        className="flex-grow flex items-center justify-center relative overflow-hidden p-8 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl"></div>
        
        {/* Content */}
        <div className="text-center max-w-3xl z-10 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-blue-900">
            Gestiona tu Portafolio de Inversión Inteligentemente
          </h1>
          <p className="text-xl md:text-lg mb-10 text-gray-700">
            Utiliza inteligencia artificial para optimizar tus inversiones. Crea un portafolio personalizado y alcanza tus objetivos financieros con confianza.
          </p>
          <button
            onClick={handleMainButtonClick}
            className="bg-blue-900 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-800 hover:shadow-lg transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {getButtonText()}
          </button>
          
          {/* Features preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Análisis Profundo</h3>
              <p className="text-gray-600 text-sm">Análisis detallado del mercado con datos en tiempo real.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold text-gray-900 mb-2">Recomendaciones IA</h3>
              <p className="text-gray-600 text-sm">Recomendaciones personalizadas basadas en tus objetivos.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Educación Continua</h3>
              <p className="text-gray-600 text-sm">Aprende sobre inversiones con nuestro centro educativo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
