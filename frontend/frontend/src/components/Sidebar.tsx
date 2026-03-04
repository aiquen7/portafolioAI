import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import GoogleSignInButton from './GoogleSignInButton';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout, isAdmin: _isAdmin, userName }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: '📊', path: 'overview' },
    { name: 'Recomendaciones', icon: '🎯', path: 'recommendations' },
    { name: 'Mi Portafolio', icon: '💼', path: 'my-portfolio' },
    { name: 'Simulador', icon: '📈', path: 'simulator' },
    { name: 'Educación', icon: '📚', path: 'education' },
    { name: 'Noticias', icon: '📰', path: 'news' },
    { name: 'Soporte', icon: '🆘', path: 'support' },
  ];

  const handleNavigation = (path: string) => {
    setActivePage(path);
    navigate(`/dashboard/${path}`);
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-6 flex flex-col fixed h-full m-4 border border-gray-200">
      <div className="text-2xl font-bold text-blue-900 mb-2 text-center">PortafolioAI</div>
      <div className="text-xs text-gray-500 text-center mb-6 font-semibold">Professional Portfolio Management</div>
      {userName && (
        <div className="text-sm text-gray-700 mb-6 text-center font-medium border-b border-gray-200 pb-4">👤 {userName}</div>
      )}
      <nav className="flex-grow">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={clsx(
                  "w-full flex items-center p-3 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-all duration-200 text-sm",
                  activePage === item.path && "bg-blue-100 text-blue-900 font-semibold border-l-4 border-blue-900"
                )}
              >
                <span className="mr-3 text-base">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8 border-t border-gray-200 pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded text-red-600 hover:bg-red-50 transition-all duration-200 text-sm font-medium"
        >
          <span className="mr-3 text-base">🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

