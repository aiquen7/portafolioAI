import React from 'react';
import Footer from '../components/Footer';

const PrivacyPolicy: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-[var(--color-primary-bg)] text-[var(--color-text-light)]">
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-teal-400">Política de Privacidad</h1>
      <div className="max-w-2xl text-lg text-left text-[var(--color-text-muted)]">
        <p className="mb-4">En PortafolioAI valoramos tu privacidad. Toda la información personal que nos brindas es protegida y utilizada únicamente para mejorar tu experiencia en la plataforma.</p>
        <p className="mb-4">No compartimos tus datos con terceros sin tu consentimiento. Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento.</p>
        <p>Para dudas sobre privacidad, contáctanos a través de nuestros canales oficiales.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default PrivacyPolicy;
