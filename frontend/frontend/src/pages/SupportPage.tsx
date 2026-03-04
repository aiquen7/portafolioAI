import React, { useState } from 'react';
import { submitContactForm } from '../services/api';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-blue-200 hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md">
      <button
        className="flex justify-between items-center w-full text-left group focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors pr-4">{question}</span>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-all transform ${isOpen ? 'rotate-180' : ''}`}>
          <i className={`fas ${isOpen ? 'fa-minus' : 'fa-plus'} text-blue-600`}></i>
        </div>
      </button>
      {isOpen && (
        <div className="mt-4 pt-4 border-t-2 border-blue-200 animate-fade-in">
          <p className="text-slate-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllFAQs, setShowAllFAQs] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await submitContactForm(formData);
      setSuccess("Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto contigo pronto.");
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError("Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initialFaqs = [
    {
      question: "¿Cómo creo una cuenta en PortafolioAI?",
      answer: "Puedes crear una cuenta haciendo clic en el botón 'Iniciar Sesión / Registrarse' en la página de inicio y luego seleccionando la opción 'Regístrate'."
    },
    {
      question: "¿Es PortafolioAI un asesor financiero regulado?",
      answer: "PortafolioAI es una herramienta educativa y de simulación. No ofrecemos asesoramiento financiero regulado. Siempre consulta con un profesional antes de tomar decisiones de inversión."
    },
    {
      question: "¿Cómo se genera mi portafolio?",
      answer: "Tu portafolio se genera en base a las respuestas de un cuestionario de perfil de riesgo y tus preferencias, utilizando algoritmos de optimización y, opcionalmente, inteligencia artificial."
    },
    {
      question: "¿Puedo modificar mi portafolio una vez generado?",
      answer: "Sí, puedes ajustar tus preferencias y volver a generar un portafolio. También puedes usar el simulador para probar diferentes escenarios."
    },
  ];

  const additionalFaqs = [
    {
      question: "¿Qué datos necesito para crear mi perfil de inversión?",
      answer: "Necesitas proporcionar información sobre tu edad, ingresos, experiencia en inversiones, tolerancia al riesgo y objetivos financieros. Todos estos datos están protegidos y se utilizan únicamente para personalizar tus recomendaciones."
    },
    {
      question: "¿Cuánto cuesta usar PortafolioAI?",
      answer: "PortafolioAI ofrece un plan básico gratuito con funcionalidades limitadas. Los planes premium comienzan desde $9.99/mes e incluyen análisis avanzados, recomendaciones de IA personalizadas y acceso a herramientas profesionales de optimización."
    },
    {
      question: "¿Puedo conectar mis cuentas de inversión reales?",
      answer: "Actualmente, PortafolioAI funciona como un simulador educativo. No conectamos cuentas de inversión reales para mantener la seguridad de tus datos. Sin embargo, puedes ingresar manualmente tu portafolio actual para análisis y recomendaciones."
    },
    {
      question: "¿Con qué frecuencia se actualizan los precios y datos del mercado?",
      answer: "Los datos de mercado se actualizan cada 15 minutos durante las horas de operación de los mercados. Los análisis y recomendaciones se recalculan diariamente y cuando realizas cambios significativos en tu perfil."
    },
    {
      question: "¿Cómo funciona el simulador de escenarios?",
      answer: "El simulador te permite probar diferentes condiciones de mercado (alcistas, bajistas, volatilidad alta) y ver cómo reaccionaría tu portafolio. Utiliza datos históricos y modelos estadísticos para proyectar rendimientos potenciales bajo diferentes escenarios económicos."
    }
  ];

  const faqs = showAllFAQs ? [...initialFaqs, ...additionalFaqs] : initialFaqs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900 pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con diseño mejorado */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <i className="fas fa-headset text-[200px] text-blue-600"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent relative z-10">
            <i className="fas fa-headset mr-4"></i>Centro de Soporte
          </h1>
          <p className="text-slate-600 text-xl relative z-10 mb-6">
            Estamos aquí para ayudarte 24/7
          </p>
          
          {/* Opciones de contacto rápido */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <a href="#" className="bg-white px-6 py-3 rounded-full border-2 border-blue-200 hover:border-blue-600 transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
              <i className="fas fa-phone text-blue-600"></i>
              <span className="font-bold text-slate-900">+54 (800) 123-4567</span>
            </a>
            <a href="#" className="bg-white px-6 py-3 rounded-full border-2 border-blue-200 hover:border-blue-600 transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
              <i className="fas fa-envelope text-blue-600"></i>
              <span className="font-bold text-slate-900">soporte@portafolioai.com</span>
            </a>
            {/* Botón de 'Chat en vivo' eliminado */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Formulario de Contacto */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200 hover:border-blue-600 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <i className="fas fa-paper-plane text-white text-xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Contáctanos</h2>
            </div>
            <p className="text-slate-600 mb-6">Completa el formulario y te responderemos en menos de 24 horas</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                  <i className="fas fa-user mr-2 text-blue-600"></i>Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-blue-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                  <i className="fas fa-envelope mr-2 text-blue-600"></i>Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-blue-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="juan@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
                  <i className="fas fa-comment-dots mr-2 text-blue-600"></i>Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-blue-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                  placeholder="Describe tu consulta o problema..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              {success && (
                <div className="bg-green-50 border-2 border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                  <i className="fas fa-check-circle"></i>
                  <p className="text-sm">{success}</p>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                  <i className="fas fa-exclamation-circle"></i>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-lg hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Enviando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sección de Preguntas Frecuentes */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <i className="fas fa-question-circle text-white text-xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Preguntas Frecuentes</h2>
            </div>
            <p className="text-slate-600 mb-6">Encuentra respuestas rápidas a las preguntas más comunes</p>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            {/* Botón para ver más FAQs */}
            {!showAllFAQs && (
              <button 
                onClick={() => setShowAllFAQs(true)}
                className="mt-6 w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-6 rounded-xl border-2 border-blue-200 hover:border-blue-600 transition-all flex items-center justify-center gap-2 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <i className="fas fa-book-open"></i>
                Ver todas las preguntas frecuentes
                <i className="fas fa-chevron-down ml-2"></i>
              </button>
            )}
            {showAllFAQs && (
              <button 
                onClick={() => setShowAllFAQs(false)}
                className="mt-6 w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-6 rounded-xl border-2 border-blue-200 hover:border-blue-600 transition-all flex items-center justify-center gap-2 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <i className="fas fa-eye-slash"></i>
                Mostrar menos
                <i className="fas fa-chevron-up ml-2"></i>
              </button>
            )}
          </div>
        </div>

        {/* Stats footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-clock text-4xl text-blue-600 mb-3"></i>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">&lt;24h</h3>
            <p className="text-slate-600">Tiempo de respuesta</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-smile text-4xl text-blue-600 mb-3"></i>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">98%</h3>
            <p className="text-slate-600">Satisfacción</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-users text-4xl text-blue-600 mb-3"></i>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">50K+</h3>
            <p className="text-slate-600">Consultas resueltas</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-headset text-4xl text-blue-600 mb-3"></i>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">24/7</h3>
            <p className="text-slate-600">Soporte disponible</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
