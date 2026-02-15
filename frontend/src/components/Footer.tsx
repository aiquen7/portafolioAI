import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-700 p-8 mt-auto border-t border-gray-200">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4 text-blue-900">PortafolioAI</h3>
          <p className="text-gray-600 text-sm">
            Plataforma profesional de gestión de portafolios de inversión.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-blue-900">Enlaces</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="text-gray-600 hover:text-blue-900 transition duration-300">Sobre Nosotros</a></li>
            <li><a href="/terms" className="text-gray-600 hover:text-blue-900 transition duration-300">Términos de Servicio</a></li>
            <li><a href="/privacy" className="text-gray-600 hover:text-blue-900 transition duration-300">Política de Privacidad</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-blue-900">Contacto</h3>
          <div className="flex space-x-4 text-sm">
            <a href="#" className="text-gray-600 hover:text-blue-900 transition duration-300">LinkedIn</a>
            <a href="#" className="text-gray-600 hover:text-blue-900 transition duration-300">Twitter</a>
            <a href="#" className="text-gray-600 hover:text-blue-900 transition duration-300">Email</a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8 pt-8 border-t border-gray-200 text-xs">
        &copy; {new Date().getFullYear()} PortafolioAI. Todos los derechos reservados.
        <p className="text-xs mt-2">Aviso: Este sitio es solo para fines educativos y no constituye asesoramiento financiero.</p>
      </div>
    </footer>
  );
};

export default Footer;
