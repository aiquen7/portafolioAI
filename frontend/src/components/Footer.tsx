import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 p-8 mt-auto border-t border-gray-800">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-teal-400">PortafolioAI</h3>
          <p className="text-gray-400">
            Tu compañero inteligente para decisiones financieras.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="text-gray-400 hover:text-teal-400 transition duration-300">Sobre Nosotros</a></li>
            <li><a href="/terms" className="text-gray-400 hover:text-teal-400 transition duration-300">Términos de Servicio</a></li>
            <li><a href="/privacy" className="text-gray-400 hover:text-teal-400 transition duration-300">Política de Privacidad</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Síguenos</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300 text-xl"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300 text-xl"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-300 text-xl"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8 pt-8 border-t border-gray-800">
        &copy; {new Date().getFullYear()} PortafolioAI. Todos los derechos reservados.
        <p className="text-sm mt-2">Disclaimer: Este sitio es solo para fines educativos y no constituye asesoramiento financiero.</p>
      </div>
    </footer>
  );
};

export default Footer;
