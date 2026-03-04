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
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      </div>

      {/* Contenedor del formulario */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 md:p-10 max-w-2xl w-full animate-fade-in relative z-10">
        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-2">Perfil de Riesgo</h2>
        <p className="text-center text-gray-600 mb-8">Responde 5 preguntas para que la IA genere tu portafolio personalizado</p>

        {/* Indicador de progreso */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentQuestion
                  ? 'w-8 bg-blue-900'
                  : index < currentQuestion
                  ? 'w-2 bg-green-600'
                  : 'w-2 bg-gray-300'
              }`}
            ></div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Pregunta {currentQuestion + 1} de {questions.length}
            </label>
            <p className="text-base font-medium text-gray-700 mb-4">{currentQ.question}</p>
            {
              currentQ.type === "select" && (
                <select
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition duration-200 bg-white"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  required
                >
                  <option value="" disabled>Selecciona una opción</option>
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
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition duration-200"
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
                <div className="space-y-3">
                  {currentQ.options?.map(option => {
                    if (typeof option === 'string') {
                      return (
                        <label 
                          key={option}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition duration-200 ${
                            answers[currentQ.id] === option
                              ? 'bg-blue-50 border-blue-900 shadow-sm'
                              : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name={currentQ.id}
                            value={option}
                            checked={answers[currentQ.id] === option}
                            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                            className="h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900"
                            required
                          />
                          <span className="ml-3 text-base text-gray-900">{option}</span>
                        </label>
                      );
                    } else {
                      return (
                        <label 
                          key={option.value}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition duration-200 ${
                            answers[currentQ.id] === option.value
                              ? 'bg-blue-50 border-blue-900 shadow-sm'
                              : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name={currentQ.id}
                            value={option.value}
                            checked={answers[currentQ.id] === option.value}
                            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                            className="h-5 w-5 text-blue-900 border-gray-300 focus:ring-blue-900"
                            required
                          />
                          <span className="ml-3 text-base text-gray-900">{option.label}</span>
                        </label>
                      );
                    }
                  })}
                </div>
              )
            }
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
              ⚠️ {error}
            </div>
          )}

          <div className="flex justify-between mt-8 gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentQuestion === 0 || loading}
              className="bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-400"
            >
              ← Anterior
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading || !answers[currentQ.id]}
                className="bg-blue-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !answers[currentQ.id]}
                className="bg-blue-900 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generando...' : 'Generar Portafolio'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiskProfileForm;
