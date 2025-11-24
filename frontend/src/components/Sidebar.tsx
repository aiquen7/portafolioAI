import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout, isAdmin, userName }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', icon: '📊', path: 'overview' },
    { name: 'Recomendaciones', icon: '💡', path: 'recommendations' },
    { name: 'Mi Portafolio', icon: '💼', path: 'my-portfolio' },
    { name: 'Simulador', icon: '📈', path: 'simulator' },
    { name: 'Educación', icon: '📚', path: 'education' },
    { name: 'Noticias', icon: '📰', path: 'news' },
    { name: 'Soporte', icon: '💬', path: 'support' },
  ];

  const handleNavigation = (path: string) => {
    setActivePage(path);
    navigate(`/dashboard/${path}`);
  };

  return (
    <div className="w-64 bg-gray-800 rounded-2xl shadow-2xl p-6 flex flex-col fixed h-full m-4 border border-gray-700">
      <div className="text-3xl font-bold text-teal-400 mb-2 text-center">PortafolioAI</div>
      {userName && (
        <div className="text-lg text-gray-200 mb-6 text-center">👤 {userName}</div>
      )}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={clsx(
                  "w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-teal-400 transition-colors duration-200",
                  activePage === item.path && "bg-teal-600 text-white font-semibold"
                )}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {/* Panel Admin eliminado para usuarios admin */}
      <div className="mt-8">
        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors duration-200"
        >
          <span className="mr-3 text-xl">➡️</span>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

