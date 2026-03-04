interface SidebarProps {
  onLogout: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, activeSection, onSectionChange }) => {
  return (
    <aside className="w-72 bg-[var(--color-card-bg)] border-r border-[var(--color-secondary-bg)] min-h-screen flex flex-col justify-between shadow-lg text-[var(--color-text-light)]">
      <div>
        <div className="p-6 text-2xl font-bold text-[var(--color-accent-teal)]">PortafolioAI Admin</div>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => onSectionChange('users')} 
                className={`w-full text-left flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${activeSection === 'users' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}
              >
                Gestión de Usuarios
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSectionChange('portfolios')} 
                className={`w-full text-left flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${activeSection === 'portfolios' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}
              >
                Gestión de Portafolios
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSectionChange('support')} 
                className={`w-full text-left flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${activeSection === 'support' ? 'bg-[var(--color-secondary-bg)] text-[var(--color-accent-teal)]' : 'text-[var(--color-text-light)] hover:bg-[var(--color-secondary-bg)]'}`}
              >
                Soporte / Mensajes
              </button>
            </li>
            {/* Logs y Auditoría eliminado */}
          </ul>
        </nav>
      </div>
      <div className="p-6 border-t border-[var(--color-secondary-bg)] flex items-center gap-3">
        <span className="font-semibold text-[var(--color-text-light)]">Admin</span>
        <button className="ml-auto flex items-center gap-2 text-red-400 hover:text-red-600" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
