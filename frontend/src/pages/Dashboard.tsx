import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import DashboardOverview from '../components/DashboardOverview';
import RecommendationsPage from './RecommendationsPage';
import MyPortfolioPage from './MyPortfolioPage';
import SimulatorPage from './SimulatorPage';
import EducationPage from './EducationPage';
import NewsPage from './NewsPage';
import SupportPage from './SupportPage';
import { Route, Routes, useLocation } from 'react-router-dom';

interface DashboardProps {
  onLogout: () => void;
  portfolio: any;
  isAdmin?: boolean;
  userName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, portfolio, isAdmin, userName }) => {
  const location = useLocation();
  const [activePage, setActivePage] = useState<string>(
    location.pathname.split('/')[2] || 'overview'
  );

  const getPageTitle = (page: string) => {
    switch (page) {
      case 'overview': return 'Resumen';
      case 'recommendations': return 'Recomendaciones';
      case 'my-portfolio': return 'Mi Portafolio';
      case 'simulator': return 'Simulador';
      case 'education': return 'Educación';
      case 'news': return 'Noticias';
      case 'support': return 'Soporte';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f1419] relative">
      {/* Fondo con efecto de circuitos */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-transparent to-amber-900/20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} isAdmin={isAdmin} userName={userName} />
      
      {/* Main Content con margen para el Sidebar */}
      <div className="flex-1 flex flex-col ml-72 relative z-10">
        <header className="bg-gray-900/50 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">{getPageTitle(activePage)}</h1>
          {/* Aquí podrías añadir elementos del header como notificaciones o perfil de usuario */}
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="overview" element={<DashboardOverview portfolio={portfolio} />} />
            <Route path="recommendations" element={<RecommendationsPage portfolio={portfolio} />} />
            <Route path="my-portfolio" element={<MyPortfolioPage portfolio={portfolio} />} />
            <Route path="simulator" element={<SimulatorPage portfolio={portfolio} />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="*" element={<DashboardOverview portfolio={portfolio} />} /> {/* Default route */}
          </Routes>
        </main>
      </div>
    </div>
  );
};
//esto es para hacer el PR
export default Dashboard;
