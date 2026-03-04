import React from 'react';
import Footer from '../components/Footer';

const AboutUs: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-[var(--color-primary-bg)] text-[var(--color-text-light)]">
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-teal-400">Sobre Nosotros</h1>
      <div className="max-w-2xl text-lg text-center text-[var(--color-text-muted)]">
        <p className="mb-4">PortafolioAI es una plataforma creada por apasionados de la tecnología y las finanzas, dedicada a ayudar a las personas a tomar mejores decisiones de inversión usando inteligencia artificial.</p>
        <p className="mb-4">Nuestro objetivo es democratizar el acceso a herramientas avanzadas de análisis financiero, brindando asesoría personalizada y segura para todos los usuarios.</p>
        <p>¡Gracias por confiar en nosotros para tu futuro financiero!</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default AboutUs;
