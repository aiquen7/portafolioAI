import React, { useState } from 'react';
// importación eliminada: AIChatWidget
interface Article {
  category: string;
  title: string;
  summary: string;
  tags: string[];
  fullContent: string;
}

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-blue-200 hover:border-blue-600 hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between mb-3">
      <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold text-blue-900 bg-blue-100 rounded-full uppercase tracking-wide">
        <i className="fas fa-graduation-cap"></i>
        {article.category}
      </span>
      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <i className="fas fa-book-reader text-slate-600 group-hover:text-blue-900"></i>
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mt-4 mb-3 leading-tight group-hover:text-blue-900 transition-colors">{article.title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed mb-6">{article.summary}</p>
    <button 
      onClick={onClick}
      className="text-blue-900 hover:text-blue-700 text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all group-hover:translate-x-1"
    >
      Leer Más <i className="fas fa-arrow-right"></i>
    </button>
  </div>
);

const EducationPage: React.FC = () => {
    // Función para cerrar el modal
    const closeModal = () => setSelectedArticle(null);
  const [filter, setFilter] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  // const [isChatOpen, setIsChatOpen] = useState(false);

  const articles: Article[] = [
    {
      category: 'Básico',
      title: '¿Qué son las Acciones y Cómo Funcionan?',
      summary: 'Una guía para principiantes sobre el mundo de las acciones, su compra, venta y el potencial de ganancias.',
      tags: ['acciones', 'básico', 'mercado'],
      fullContent: `
        <h2>Introducción a las Acciones</h2>
        <p>Las acciones representan una parte de propiedad en una empresa. Cuando compras acciones, te conviertes en accionista y adquieres ciertos derechos sobre la compañía.</p>
        
        <h3>¿Cómo Funcionan?</h3>
        <p>Las empresas emiten acciones para recaudar capital. Los inversionistas compran estas acciones esperando que la empresa crezca y el valor de sus acciones aumente. Existen dos formas principales de ganar dinero:</p>
        <ul>
          <li><strong>Apreciación del capital:</strong> Cuando el precio de la acción sube y la vendes a un precio mayor.</li>
          <li><strong>Dividendos:</strong> Algunas empresas reparten parte de sus ganancias a los accionistas.</li>
        </ul>

        <h3>Tipos de Acciones</h3>
        <ul>
          <li><strong>Acciones Comunes:</strong> Dan derecho a voto en las juntas de accionistas.</li>
          <li><strong>Acciones Preferentes:</strong> Tienen prioridad en el pago de dividendos pero generalmente no dan derecho a voto.</li>
        </ul>

        <h3>Riesgos</h3>
        <p>El valor de las acciones puede fluctuar significativamente. Es importante diversificar y no invertir más de lo que puedes permitirte perder.</p>
      `
    },
    {
      category: 'Intermedio',
      title: 'Entendiendo los Bonos: Renta Fija para tu Portafolio',
      summary: 'Explora los diferentes tipos de bonos, sus riesgos y cómo pueden estabilizar tus inversiones.',
      tags: ['bonos', 'renta fija', 'intermedio'],
      fullContent: `
        <h2>¿Qué son los Bonos?</h2>
        <p>Los bonos son instrumentos de deuda que emiten gobiernos y empresas para financiarse. Al comprar un bono, estás prestando dinero a cambio de pagos de intereses periódicos.</p>
        
        <h3>Características Principales</h3>
        <ul>
          <li><strong>Valor nominal:</strong> El monto que recibirás al vencimiento.</li>
          <li><strong>Cupón:</strong> La tasa de interés que pagará el bono.</li>
          <li><strong>Vencimiento:</strong> La fecha en que se devolverá el capital.</li>
        </ul>

        <h3>Tipos de Bonos</h3>
        <ul>
          <li><strong>Bonos Gubernamentales:</strong> Emitidos por gobiernos, considerados de bajo riesgo.</li>
          <li><strong>Bonos Corporativos:</strong> Emitidos por empresas, ofrecen mayor rendimiento pero con más riesgo.</li>
          <li><strong>Bonos Municipales:</strong> Emitidos por gobiernos locales, a menudo tienen beneficios fiscales.</li>
        </ul>

        <h3>Ventajas de los Bonos</h3>
        <p>Proporcionan ingresos predecibles y ayudan a reducir la volatilidad del portafolio. Son especialmente útiles para inversionistas conservadores.</p>
      `
    },
    {
      category: 'Avanzado',
      title: 'ETFs vs. Fondos Mutuos: ¿Cuál es Mejor para Ti?',
      summary: 'Compara las características, ventajas y desventajas de los ETFs y los fondos mutuos para tomar decisiones informadas.',
      tags: ['etf', 'fondos mutuos', 'avanzado'],
      fullContent: `
        <h2>Diferencias Clave</h2>
        <p>Tanto los ETFs como los fondos mutuos permiten diversificar, pero tienen diferencias importantes en estructura y funcionamiento.</p>
        
        <h3>ETFs (Exchange-Traded Funds)</h3>
        <ul>
          <li>Se negocian en bolsa como acciones</li>
          <li>Comisiones generalmente más bajas</li>
          <li>Mayor flexibilidad en la compra/venta</li>
          <li>Transparencia diaria de holdings</li>
        </ul>

        <h3>Fondos Mutuos</h3>
        <ul>
          <li>Se compran/venden al valor del activo neto (NAV) al cierre del mercado</li>
          <li>Pueden tener gestión activa o pasiva</li>
          <li>Mínimos de inversión iniciales</li>
          <li>Algunas opciones de reinversión automática de dividendos</li>
        </ul>

        <h3>¿Cuál Elegir?</h3>
        <p>Los ETFs son ideales para traders activos y quienes buscan costos bajos. Los fondos mutuos pueden ser mejores para inversiones automáticas periódicas y quienes prefieren gestión activa.</p>
      `
    },
    {
      category: 'Estrategias',
      title: 'La Importancia de la Diversificación en tu Inversión',
      summary: 'Descubre por qué no debes poner todos tus huevos en la misma canasta y cómo diversificar eficazmente.',
      tags: ['diversificación', 'estrategia'],
      fullContent: `
        <h2>El Principio de la Diversificación</h2>
        <p>"No pongas todos los huevos en la misma canasta" es el principio fundamental de la diversificación. Distribuir tus inversiones reduce el riesgo total del portafolio.</p>
        
        <h3>¿Por Qué Diversificar?</h3>
        <ul>
          <li>Reduce el impacto de la volatilidad de un solo activo</li>
          <li>Protege contra pérdidas significativas</li>
          <li>Permite participar en diferentes sectores y mercados</li>
          <li>Mejora la relación riesgo-retorno</li>
        </ul>

        <h3>Formas de Diversificar</h3>
        <ul>
          <li><strong>Por clase de activo:</strong> Acciones, bonos, bienes raíces, materias primas</li>
          <li><strong>Por geografía:</strong> Mercados nacionales e internacionales</li>
          <li><strong>Por sector:</strong> Tecnología, salud, finanzas, consumo, etc.</li>
          <li><strong>Por tamaño de empresa:</strong> Large-cap, mid-cap, small-cap</li>
        </ul>

        <h3>Evita la Sobre-Diversificación</h3>
        <p>Demasiada diversificación puede diluir los retornos y hacer difícil el seguimiento. Encuentra el balance adecuado para tu perfil.</p>
      `
    },
    {
      category: 'Estrategias',
      title: 'Dollar Cost Averaging: Invierte de Forma Constante',
      summary: 'Aprende cómo invertir montos fijos regularmente puede reducir el impacto de la volatilidad del mercado.',
      tags: ['estrategia', 'intermedio'],
      fullContent: `
        <h2>¿Qué es Dollar Cost Averaging?</h2>
        <p>El Dollar Cost Averaging (DCA) o Promedio de Costo en Dólares es una estrategia que consiste en invertir una cantidad fija de dinero a intervalos regulares, independientemente del precio del activo.</p>
        
        <h3>¿Cómo Funciona?</h3>
        <p>En lugar de invertir todo tu capital de una vez, divides la inversión en partes iguales a lo largo del tiempo. Por ejemplo, invertir $500 mensuales durante 12 meses en lugar de $6,000 de una sola vez.</p>

        <h3>Ventajas del DCA</h3>
        <ul>
          <li><strong>Reduce el riesgo de timing:</strong> No necesitas predecir el mejor momento para comprar</li>
          <li><strong>Suaviza la volatilidad:</strong> Compras más acciones cuando los precios bajan y menos cuando suben</li>
          <li><strong>Disciplina de inversión:</strong> Crea un hábito constante de ahorro e inversión</li>
          <li><strong>Reduce el estrés emocional:</strong> Evita tomar decisiones impulsivas basadas en el miedo o la codicia</li>
        </ul>

        <h3>Ejemplo Práctico</h3>
        <p>Si inviertes $100 mensuales en un fondo:</p>
        <ul>
          <li>Mes 1: Precio $10 → compras 10 acciones</li>
          <li>Mes 2: Precio $8 → compras 12.5 acciones</li>
          <li>Mes 3: Precio $12 → compras 8.33 acciones</li>
        </ul>
        <p>Tu costo promedio por acción será menor que si hubieras comprado todo en el mes 3.</p>

        <h3>¿Cuándo Usar DCA?</h3>
        <p>Es especialmente útil para inversores principiantes, en mercados volátiles, o cuando recibes ingresos periódicos que deseas invertir.</p>
      `
    },
    {
      category: 'Estrategias',
      title: 'Análisis Técnico vs Fundamental: Dos Enfoques Diferentes',
      summary: 'Comprende las diferencias entre el análisis técnico y fundamental para elegir tu estrategia de inversión.',
      tags: ['estrategia', 'avanzado', 'análisis'],
      fullContent: `
        <h2>Dos Filosofías de Inversión</h2>
        <p>Los inversores utilizan principalmente dos tipos de análisis para tomar decisiones: técnico y fundamental. Cada uno tiene sus propias herramientas y enfoques.</p>
        
        <h3>Análisis Fundamental</h3>
        <p>Se enfoca en el valor intrínseco de una empresa evaluando factores económicos y financieros:</p>
        <ul>
          <li><strong>Estados financieros:</strong> Ingresos, ganancias, deudas, flujo de caja</li>
          <li><strong>Ratios financieros:</strong> P/E, ROE, deuda/capital</li>
          <li><strong>Gestión de la empresa:</strong> Calidad del equipo directivo</li>
          <li><strong>Ventajas competitivas:</strong> Posición en el mercado, marca, tecnología</li>
          <li><strong>Industria y economía:</strong> Tendencias del sector, ciclos económicos</li>
        </ul>

        <h3>Análisis Técnico</h3>
        <p>Se basa en el estudio de patrones de precios y volúmenes históricos:</p>
        <ul>
          <li><strong>Gráficos de precios:</strong> Velas japonesas, líneas, barras</li>
          <li><strong>Indicadores:</strong> Medias móviles, RSI, MACD, Bandas de Bollinger</li>
          <li><strong>Patrones:</strong> Soportes, resistencias, triángulos, cabeza y hombros</li>
          <li><strong>Volumen:</strong> Confirmación de tendencias</li>
        </ul>

        <h3>¿Cuál Usar?</h3>
        <table>
          <tr>
            <th>Análisis Fundamental</th>
            <th>Análisis Técnico</th>
          </tr>
          <tr>
            <td>Inversiones a largo plazo</td>
            <td>Trading a corto/medio plazo</td>
          </tr>
          <tr>
            <td>Evalúa el "por qué"</td>
            <td>Evalúa el "cuándo"</td>
          </tr>
          <tr>
            <td>Basado en valor</td>
            <td>Basado en momentum</td>
          </tr>
        </table>

        <h3>Combinando Ambos Enfoques</h3>
        <p>Muchos inversores exitosos combinan ambos: usan el análisis fundamental para identificar buenas empresas y el técnico para encontrar puntos óptimos de entrada y salida.</p>
      `
    },
    {
      category: 'Economía',
      title: 'Inflación y su Impacto en tus Ahorros',
      summary: 'Aprende qué es la inflación, cómo afecta tu poder adquisitivo y estrategias para proteger tus inversiones.',
      tags: ['inflación', 'economía'],
      fullContent: `
        <h2>Entendiendo la Inflación</h2>
        <p>La inflación es el aumento generalizado y sostenido de los precios de bienes y servicios en una economía durante un período de tiempo. Reduce el poder adquisitivo de tu dinero.</p>
        
        <h3>¿Cómo Te Afecta?</h3>
        <p>Si tienes $1,000 en una cuenta de ahorro con 1% de interés anual, pero la inflación es del 3%, tu dinero pierde poder adquisitivo. Al final del año, aunque tengas $1,010, este dinero compra menos que los $1,000 originales.</p>

        <h3>Causas de la Inflación</h3>
        <ul>
          <li><strong>Inflación por demanda:</strong> Demasiado dinero persiguiendo pocos bienes</li>
          <li><strong>Inflación por costos:</strong> Aumento en los costos de producción</li>
          <li><strong>Inflación monetaria:</strong> Exceso de dinero en circulación</li>
        </ul>

        <h3>Cómo Proteger tus Inversiones</h3>
        <ul>
          <li><strong>Acciones:</strong> Históricamente superan la inflación a largo plazo</li>
          <li><strong>Bienes raíces:</strong> Los valores de propiedad tienden a subir con la inflación</li>
          <li><strong>Bonos indexados a la inflación:</strong> Como los TIPS en EE.UU.</li>
          <li><strong>Materias primas:</strong> Oro, plata y otros commodities</li>
        </ul>

        <h3>La Inflación en Diferentes Economías</h3>
        <p>Las economías emergentes suelen tener tasas de inflación más altas que las desarrolladas. Es crucial considerar esto al invertir internacionalmente.</p>
      `
    },
    {
      category: 'Economía',
      title: 'Ciclos Económicos: Entendiendo las Fases del Mercado',
      summary: 'Descubre cómo identificar las diferentes fases del ciclo económico y ajustar tu estrategia de inversión.',
      tags: ['economía', 'intermedio', 'mercado'],
      fullContent: `
        <h2>Las Cuatro Fases del Ciclo Económico</h2>
        <p>La economía se mueve en ciclos predecibles que afectan tus inversiones. Entender estas fases te ayuda a tomar mejores decisiones.</p>
        
        <h3>1. Expansión</h3>
        <p>Características:</p>
        <ul>
          <li>El PIB crece</li>
          <li>Aumenta el empleo</li>
          <li>Confianza del consumidor alta</li>
          <li>Las empresas expanden operaciones</li>
          <li>Tasas de interés bajas a moderadas</li>
        </ul>
        <p><strong>Estrategia de inversión:</strong> Acciones de crecimiento, tecnología, consumo discrecional</p>

        <h3>2. Pico</h3>
        <p>Características:</p>
        <ul>
          <li>Máximo nivel de actividad económica</li>
          <li>Pleno empleo</li>
          <li>Presiones inflacionarias</li>
          <li>Los bancos centrales pueden subir tasas</li>
        </ul>
        <p><strong>Estrategia de inversión:</strong> Comenzar a ser más conservador, aumentar efectivo</p>

        <h3>3. Contracción (Recesión)</h3>
        <p>Características:</p>
        <ul>
          <li>El PIB se contrae (dos trimestres consecutivos = recesión)</li>
          <li>Aumenta el desempleo</li>
          <li>Caen las ventas y ganancias corporativas</li>
          <li>Baja la confianza del consumidor</li>
        </ul>
        <p><strong>Estrategia de inversión:</strong> Bonos gubernamentales, acciones defensivas (utilities, salud), oro</p>

        <h3>4. Valle</h3>
        <p>Características:</p>
        <ul>
          <li>Punto más bajo del ciclo</li>
          <li>Altas tasas de desempleo</li>
          <li>Bajos niveles de producción</li>
          <li>Preparación para la recuperación</li>
        </ul>
        <p><strong>Estrategia de inversión:</strong> Oportunidad de compra, acciones de valor, sectores cíclicos</p>

        <h3>Indicadores Económicos Clave</h3>
        <ul>
          <li><strong>PIB:</strong> Mide el crecimiento económico</li>
          <li><strong>Tasa de desempleo:</strong> Indica salud del mercado laboral</li>
          <li><strong>Índice de Precios al Consumidor (IPC):</strong> Mide inflación</li>
          <li><strong>Curva de rendimiento:</strong> Relación entre tasas de corto y largo plazo</li>
          <li><strong>PMI manufacturero:</strong> Indica actividad industrial</li>
        </ul>

        <h3>Rotación Sectorial</h3>
        <p>Los diferentes sectores se desempeñan mejor en diferentes fases del ciclo. Una estrategia sofisticada implica rotar tu portafolio según la fase actual.</p>
      `
    },
    {
      category: 'Economía',
      title: 'Política Monetaria y su Efecto en los Mercados',
      summary: 'Entiende cómo las decisiones de los bancos centrales sobre tasas de interés impactan tus inversiones.',
      tags: ['economía', 'avanzado', 'política monetaria'],
      fullContent: `
        <h2>¿Qué es la Política Monetaria?</h2>
        <p>La política monetaria son las acciones que toman los bancos centrales (como la Reserva Federal en EE.UU.) para controlar la oferta monetaria y las tasas de interés con el objetivo de mantener la estabilidad económica.</p>
        
        <h3>Herramientas Principales</h3>
        
        <h4>1. Tasas de Interés</h4>
        <p>La herramienta más visible y poderosa:</p>
        <ul>
          <li><strong>Subida de tasas:</strong> Encarece el crédito, reduce el gasto, controla la inflación</li>
          <li><strong>Bajada de tasas:</strong> Abarata el crédito, estimula el gasto, impulsa el crecimiento</li>
        </ul>

        <h4>2. Operaciones de Mercado Abierto</h4>
        <p>Compra y venta de bonos gubernamentales para inyectar o retirar dinero de la economía.</p>

        <h4>3. Requisitos de Reserva</h4>
        <p>Porcentaje de depósitos que los bancos deben mantener como reserva.</p>

        <h4>4. Quantitative Easing (QE)</h4>
        <p>Programa de compra masiva de activos para inyectar liquidez en momentos de crisis.</p>

        <h3>Impacto en Diferentes Activos</h3>
        
        <h4>Acciones</h4>
        <ul>
          <li><strong>Tasas bajas:</strong> Favorecen acciones (crédito barato, mayor crecimiento empresarial)</li>
          <li><strong>Tasas altas:</strong> Perjudican acciones (mayores costos, competencia de bonos)</li>
        </ul>

        <h4>Bonos</h4>
        <ul>
          <li><strong>Tasas suben:</strong> Precios de bonos existentes bajan (relación inversa)</li>
          <li><strong>Tasas bajan:</strong> Precios de bonos existentes suben</li>
        </ul>

        <h4>Divisas</h4>
        <ul>
          <li><strong>Tasas altas:</strong> Fortalecen la moneda (atraen capital extranjero)</li>
          <li><strong>Tasas bajas:</strong> Debilitan la moneda</li>
        </ul>

        <h4>Bienes Raíces</h4>
        <ul>
          <li><strong>Tasas bajas:</strong> Hipotecas más accesibles, aumenta demanda</li>
          <li><strong>Tasas altas:</strong> Hipotecas más caras, enfría el mercado</li>
        </ul>

        <h3>Anticipando Cambios de Política</h3>
        <p>Los mercados se mueven antes de los cambios oficiales. Sigue:</p>
        <ul>
          <li>Declaraciones de los banqueros centrales</li>
          <li>Minutas de reuniones de política monetaria</li>
          <li>Indicadores económicos clave (inflación, empleo, PIB)</li>
          <li>Las expectativas del mercado sobre futuras tasas</li>
        </ul>

        <h3>Política Expansiva vs Restrictiva</h3>
        <table>
          <tr>
            <th>Expansiva (Acomodaticia)</th>
            <th>Restrictiva (Contractiva)</th>
          </tr>
          <tr>
            <td>Tasas bajas</td>
            <td>Tasas altas</td>
          </tr>
          <tr>
            <td>Estimula crecimiento</td>
            <td>Controla inflación</td>
          </tr>
          <tr>
            <td>Favorece activos de riesgo</td>
            <td>Favorece activos seguros</td>
          </tr>
          <tr>
            <td>Debilita la moneda</td>
            <td>Fortalece la moneda</td>
          </tr>
        </table>

        <h3>Ejemplo Reciente: 2020-2024</h3>
        <p>Durante la pandemia de COVID-19, los bancos centrales bajaron tasas a niveles históricos y aplicaron QE masivo. Esto llevó a un rally en acciones y activos de riesgo. Posteriormente, para combatir la inflación post-pandemia, iniciaron un ciclo agresivo de subidas de tasas, causando volatilidad en los mercados.</p>

        <h3>Cómo Ajustar tu Portafolio</h3>
        <ul>
          <li><strong>Entorno de tasas bajas:</strong> Mayor peso en acciones, especialmente tecnología y crecimiento</li>
          <li><strong>Entorno de tasas altas:</strong> Mayor peso en bonos de corto plazo, value stocks, sectores defensivos</li>
          <li><strong>Transición:</strong> Mantén flexibilidad y diversificación</li>
        </ul>
      `
    },
  ];

  const filteredArticles = articles.filter(article => 
    filter === 'all' ? true : article.tags.includes(filter)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Modal para mostrar el artículo completo */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Fondo difuminado */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"></div>
          {/* Modal principal */}
          <div className="relative z-10 max-w-2xl w-full mx-4">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 p-10 pt-16 animate-fade-in flex flex-col" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Cerrar"
              >
                <span className="text-2xl font-bold">&times;</span>
              </button>
              <h2 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 drop-shadow-2xl text-center tracking-tight">
                {selectedArticle.title}
              </h2>
              <div className="prose prose-slate max-w-none text-slate-900 text-xl leading-relaxed">
                {/* Renderizar el contenido con estilos mejorados para subtítulos */}
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.fullContent.replace(/<h2>/g, '<h2 class=\"text-3xl font-bold text-blue-600 mb-4 mt-8\">').replace(/<h3>/g, '<h3 class=\"text-2xl font-semibold text-blue-700 mb-2 mt-6\">').replace(/<ul>/g, '<ul class=\"list-disc ml-6 mb-4\">').replace(/<li>/g, '<li class=\"mb-2\">') }} />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <i className="fas fa-graduation-cap text-[200px] text-blue-600"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent relative z-10">
            <i className="fas fa-book-open mr-4"></i>Centro Educativo
          </h1>
          <p className="text-slate-600 text-xl relative z-10 mb-6">
            Aprende sobre inversión inteligente con recursos curados por IA
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-blue-200 shadow-sm">
              <i className="fas fa-book text-blue-600"></i>
              {filteredArticles.length} Artículos
            </span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-blue-200 shadow-sm">
              <i className="fas fa-certificate text-blue-600"></i>
              Certificación disponible
            </span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-blue-200 shadow-sm">
              <i className="fas fa-star text-blue-600"></i>
              Calidad premium
            </span>
          </div>
        </div>

        {/* Filtros como pills con iconos mejorados */}
        <div className="mb-12 bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
            <i className="fas fa-filter mr-2"></i>Filtrar por nivel
          </h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-blue-200 hover:border-blue-600'
              }`}
            >
              <i className="fas fa-th mr-2"></i>Todos
            </button>
            <button 
              onClick={() => setFilter('básico')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'básico' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-blue-200 hover:border-blue-600'
              }`}
            >
              <i className="fas fa-seedling mr-2"></i>Básico
            </button>
            <button 
              onClick={() => setFilter('intermedio')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'intermedio' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-blue-200 hover:border-blue-600'
              }`}
            >
              <i className="fas fa-layer-group mr-2"></i>Intermedio
            </button>
            <button 
              onClick={() => setFilter('avanzado')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'avanzado' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-blue-200 hover:border-blue-600'
              }`}
            >
              <i className="fas fa-rocket mr-2"></i>Avanzado
            </button>
            <button 
              onClick={() => setFilter('estrategia')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'estrategia' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-blue-200 hover:border-blue-600'
              }`}
            >
              <i className="fas fa-chess mr-2"></i>Estrategias
            </button>
            <button 
              onClick={() => setFilter('economía')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                filter === 'economía' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-blue-200 hover:border-blue-600'
              }`}
            >
              <i className="fas fa-chart-line mr-2"></i>Economía
            </button>
          </div>
        </div>

        {/* Grid de Artículos */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <ArticleCard 
                key={index} 
                article={article} 
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <i className="fas fa-search text-6xl text-slate-300 mb-4"></i>
            <p className="text-xl text-slate-500">No se encontraron artículos para este filtro</p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-users text-4xl text-blue-600 mb-3"></i>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">10,000+</h3>
            <p className="text-slate-600">Estudiantes activos</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-trophy text-4xl text-blue-600 mb-3"></i>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">98%</h3>
            <p className="text-slate-600">Tasa de satisfacción</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 text-center hover:border-blue-600 transition-all shadow-sm hover:shadow-md">
            <i className="fas fa-clock text-4xl text-blue-600 mb-3"></i>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">24/7</h3>
            <p className="text-slate-600">Acceso ilimitado</p>
          </div>
        </div>
      </div>

      {/* Botón y widget de chat IA eliminados */}
    </div>
  );
};

export default EducationPage;
