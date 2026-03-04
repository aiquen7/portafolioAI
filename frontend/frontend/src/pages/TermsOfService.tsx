import React from 'react';
import Footer from '../components/Footer';

const TermsOfService: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-[var(--color-primary-bg)] text-[var(--color-text-light)]">
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-teal-400">Términos de Servicio</h1>
      <div className="max-w-2xl text-lg text-left text-[var(--color-text-muted)]">
        <p className="mb-4">Al utilizar PortafolioAI, aceptas los siguientes términos de servicio. La plataforma se ofrece "tal cual" y no garantiza resultados específicos de inversión. El usuario es responsable de sus decisiones financieras.</p>
        <p className="mb-4">No compartas tu información de acceso. PortafolioAI no se responsabiliza por pérdidas derivadas del uso de la plataforma. Consulta siempre con un asesor financiero profesional antes de tomar decisiones importantes.</p>
        <p>Para más información, contáctanos a través de nuestros canales oficiales.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default TermsOfService;
