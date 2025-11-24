// Componente de formulario de perfil de riesgo
import React, { useState } from 'react';
import { optimizePortfolio, saveRiskProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Props del componente
interface RiskProfileFormProps {
  onPortfolioGenerated: (portfolio: any) => void;
}

const RiskProfileForm: React.FC<RiskProfileFormProps> = ({ onPortfolioGenerated }) => {
  const navigate = useNavigate();
  // Estado para controlar qué pregunta se muestra
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // Estado para almacenar las respuestas del usuario
  const [answers, setAnswers] = useState<any>({});
  // Estado para mostrar carga
  const [loading, setLoading] = useState(false);
  // Estado para mostrar errores
  const [error, setError] = useState<string | null>(null);

  // Lista de preguntas del cuestionario
  const questions = [
    {
      id: "country",
      question: "¿En qué país resides actualmente?",
      type: "select",
      options: [
        "Argentina", "Brasil", "Chile", "Uruguay", "Paraguay", "Bolivia", "Perú", "Ecuador", "Colombia", "Venezuela", "México", "Estados Unidos", "Canadá", "España", "Francia", "Alemania", "Italia", "Reino Unido", "China", "Japón", "India", "Australia", "Sudáfrica", "Rusia", "Turquía", "Egipto", "Arabia Saudita", "Israel", "Corea del Sur", "Nueva Zelanda", "Portugal", "Noruega", "Suecia", "Finlandia", "Dinamarca", "Suiza", "Bélgica", "Países Bajos", "Polonia", "Grecia", "Irlanda", "Hungría", "República Checa", "Austria", "Rumania", "Ucrania", "Tailandia", "Malasia", "Singapur", "Indonesia", "Filipinas", "Vietnam", "Pakistán", "Bangladesh", "Nigeria", "Kenya", "Marruecos", "Argelia", "Otros"
      ]
    },
    {
      id: "experience_level",
      question: "¿Cuál es tu nivel de experiencia en inversiones?",
      type: "radio",
      options: [
        { value: "beginner", label: "Principiante" },
        { value: "intermediate", label: "Intermedio" },
        { value: "advanced", label: "Avanzado" }
      ]
    },
    {
      id: "investment_goal",
      question: "¿Cuál es tu principal objetivo de inversión?",
      type: "radio",
      options: [
        { value: "retirement", label: "Jubilación" },
        { value: "house", label: "Ahorro para una casa" },
        { value: "growth", label: "Crecimiento de capital" },
        { value: "income", label: "Generación de ingresos" }
      ]
    },
    {
      id: "risk_tolerance",
      question: "¿Cómo describirías tu tolerancia al riesgo?",
      type: "radio",
      options: [
        { value: "low", label: "Baja (prefiero seguridad, aunque gane menos)" },
        { value: "medium", label: "Media (busco equilibrio entre riesgo y retorno)" },
        { value: "high", label: "Alta (dispuesto a asumir riesgos por mayores retornos)" }
      ]
    },
    {
      id: "investment_amount",
      question: "¿Cuánto capital inicial te gustaría invertir?",
      type: "number",
      placeholder: "Ej: 100000"
    }
  ];

  // Función para actualizar las respuestas cuando el usuario cambia un campo
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  // Función para avanzar a la siguiente pregunta
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Función para retroceder a la pregunta anterior
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Función para enviar el formulario y generar el portafolio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      setError("Usuario no autenticado. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    const riskProfileData = {
      risk_profile_answers: answers,
      country: answers.country,
      experience_level: answers.experience_level,
      investment_goal: answers.investment_goal,
      risk_level: answers.risk_tolerance,
      preferences: { amount: parseFloat(answers.investment_amount) }
    };

    try {
      // Guardar el perfil de riesgo
      await saveRiskProfile(riskProfileData);

      // Optimizar el portafolio
      const portfolioResponse = await optimizePortfolio(riskProfileData);

      // Obtener el portafolio actualizado desde el backend
      const userId = localStorage.getItem('user_id');
      let realPortfolio = portfolioResponse.data;
      if (userId) {
        try {
          const fetchPortfolio = await import('../services/api');
          const userPortfolioResp = await fetchPortfolio.fetchUserPortfolio(userId);
          if (userPortfolioResp.data) {
            realPortfolio = userPortfolioResp.data;
          }
        } catch (e) {
          // Si falla, usar el portafolio de optimizePortfolio
        }
      }
      onPortfolioGenerated(realPortfolio);
      // Redirigir al dashboard sin mostrar alerta
      navigate('/dashboard/overview');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al generar el portafolio. Por favor, intenta de nuevo.');
      console.error('Error generando portafolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
      {/* Fondo de circuitos tecnológicos */}
      <div className="absolute inset-0 z-0">
        {/* Gradiente base oscuro */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-[#0a0e14] to-amber-900/20"></div>
        
        {/* Grid de circuitos */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        {/* Puntos de conexión animados */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-teal-400 rounded-full animate-pulse-slow shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-amber-400 rounded-full animate-pulse-slower shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-teal-400 rounded-full animate-pulse-slow shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
        
        {/* Líneas de circuito SVG */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradRisk1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(20,184,166,0)" />
              <stop offset="50%" stopColor="rgba(20,184,166,0.3)" />
              <stop offset="100%" stopColor="rgba(20,184,166,0)" />
            </linearGradient>
            <linearGradient id="lineGradRisk2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(245,158,11,0)" />
              <stop offset="50%" stopColor="rgba(245,158,11,0.2)" />
              <stop offset="100%" stopColor="rgba(245,158,11,0)" />
            </linearGradient>
          </defs>
          <path d="M 100 200 L 400 200 L 400 400 L 700 400" stroke="url(#lineGradRisk1)" strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M 800 100 L 600 300 L 300 300 L 100 600" stroke="url(#lineGradRisk2)" strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M 900 500 L 700 600 L 400 600 L 200 800" stroke="url(#lineGradRisk1)" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
        
        {/* Orbes de luz difusa */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Contenedor del formulario */}
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 md:p-10 max-w-2xl w-full animate-fade-in relative z-10">
        {/* Título con icono */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <i className="fas fa-clipboard-list text-teal-400 text-3xl"></i>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Cuestionario de Perfil de Riesgo</h2>
        </div>
        
        <p className="text-center text-gray-400 mb-6">Responde estas 5 preguntas para que la IA pueda generar tu portafolio ideal.</p>

        {/* Indicador de progreso */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentQuestion
                  ? 'w-8 bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.5)]'
                  : index < currentQuestion
                  ? 'w-2 bg-teal-500'
                  : 'w-2 bg-gray-700'
              }`}
            ></div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xl font-semibold text-white mb-4">
              {currentQuestion + 1}. {currentQ.question}
            </label>
            {
              currentQ.type === "select" && (
                <select
                  className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 text-lg"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  required
                >
                  <option value="" disabled>Selecciona tu país</option>
                  {currentQ.options?.map((option: any) => (
                    typeof option === 'string'
                      ? <option key={option} value={option}>{option}</option>
                      : <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              )
            }
            {
              currentQ.type === "number" && (
                <input
                  type="number"
                  className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 text-lg"
                  placeholder={currentQ.placeholder}
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (currentQuestion < questions.length - 1 && answers[currentQ.id]) {
                        handleNext();
                      }
                    }
                  }}
                  required
                />
              )
            }
            {
              currentQ.type === "radio" && (
                <div className="mt-2 space-y-3">
                  {currentQ.options?.map(option => {
                    if (typeof option === 'string') {
                      return (
                        <label 
                          key={option}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition duration-200 ${
                            answers[currentQ.id] === option
                              ? 'bg-teal-600/20 border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]'
                              : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name={currentQ.id}
                            value={option}
                            checked={answers[currentQ.id] === option}
                            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                            className="form-radio h-5 w-5 text-teal-500 border-gray-500 focus:ring-teal-500 focus:ring-offset-gray-800"
                            required
                          />
                          <span className="ml-3 text-lg text-gray-200">{option}</span>
                        </label>
                      );
                    } else {
                      return (
                        <label 
                          key={option.value}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition duration-200 ${
                            answers[currentQ.id] === option.value
                              ? 'bg-teal-600/20 border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]'
                              : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name={currentQ.id}
                            value={option.value}
                            checked={answers[currentQ.id] === option.value}
                            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                            className="form-radio h-5 w-5 text-teal-500 border-gray-500 focus:ring-teal-500 focus:ring-offset-gray-800"
                            required
                          />
                          <span className="ml-3 text-lg text-gray-200">{option.label}</span>
                        </label>
                      );
                    }
                  })}
                </div>
              )
            }
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          )}

          <div className="flex justify-between mt-8 gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentQuestion === 0 || loading}
              className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600 hover:border-gray-500"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Anterior
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading || !answers[currentQ.id]}
                className="bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-teal-500/50"
              >
                Siguiente
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !answers[currentQ.id]}
                className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-teal-500/50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Generando Portafolio...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle mr-2"></i>
                    Generar Portafolio
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiskProfileForm;
