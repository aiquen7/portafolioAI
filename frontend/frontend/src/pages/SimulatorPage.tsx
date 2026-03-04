import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SimulatorPageProps {
  portfolio: any;
}

interface SimulationResult {
  finalValue: number;
  profit: number;
  profitPercentage: number;
  bestCase: number;
  worstCase: number;
  volatility: number;
  sharpeRatio: number;
}

// Mock de activos recomendados igual que RecommendationsPage
interface AssetType {
  id: string;
  name: string;
  ticker: string;
  icon: string;
  color: string;
  expectedReturn: number;
  volatility: number;
  description: string;
}

const ASSET_TYPES: AssetType[] = [
  {
    id: 'nvda',
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    icon: 'fa-chart-line',
    color: 'teal',
    expectedReturn: 0.185,
    volatility: 0.35,
    description: 'Líder en semiconductores y AI.'
  },
  {
    id: 'aapl',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    icon: 'fa-chart-line',
    color: 'cyan',
    expectedReturn: 0.12,
    volatility: 0.25,
    description: 'Empresa tecnológica global.'
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    ticker: 'BTC',
    icon: 'fa-bitcoin',
    color: 'amber',
    expectedReturn: 0.08,
    volatility: 0.65,
    description: 'Criptomoneda principal, reserva digital.'
  },
  {
    id: 'al30',
    name: 'Bonar 2030',
    ticker: 'AL30',
    icon: 'fa-file-invoice-dollar',
    color: 'yellow',
    expectedReturn: 0.075,
    volatility: 0.18,
    description: 'Bono soberano argentino.'
  },
  {
    id: 'spy',
    name: 'SPDR S&P 500 ETF',
    ticker: 'SPY',
    icon: 'fa-layer-group',
    color: 'blue',
    expectedReturn: 0.10,
    volatility: 0.20,
    description: 'ETF que replica el S&P 500.'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    ticker: 'ETH',
    icon: 'fa-bitcoin',
    color: 'purple',
    expectedReturn: 0.06,
    volatility: 0.60,
    description: 'Plataforma líder de contratos inteligentes.'
  },
  {
    id: 'xau',
    name: 'Oro',
    ticker: 'XAU',
    icon: 'fa-coins',
    color: 'yellow',
    expectedReturn: 0.05,
    volatility: 0.10,
    description: 'Activo refugio ante volatilidad.'
  },
  {
    id: 'tsla',
    name: 'CEDEAR Tesla',
    ticker: 'TSLA',
    icon: 'fa-globe',
    color: 'rose',
    expectedReturn: 0.09,
    volatility: 0.30,
    description: 'Acción internacional vía CEDEAR.'
  },
  {
    id: 'alpha',
    name: 'FCI Alpha Renta Fija',
    ticker: 'ALPHA',
    icon: 'fa-piggy-bank',
    color: 'emerald',
    expectedReturn: 0.07,
    volatility: 0.08,
    description: 'Fondo común de inversión conservador.'
  },
  {
    id: 'bma',
    name: 'BMA',
    ticker: 'BMA',
    icon: 'fa-chart-line',
    color: 'indigo',
    expectedReturn: 0.07,
    volatility: 0.22,
    description: 'Banco líder en Argentina.'
  }
];

// Helper para clases de botón de activo (evita clases dinámicas con Tailwind)
const getAssetButtonClasses = (selected: boolean) => selected ? 'p-4 rounded-lg border-2 transition-all duration-300 text-left border-blue-500 bg-blue-50 shadow-lg' : 'p-4 rounded-lg border transition-all duration-200 text-left border-gray-200 bg-white hover:border-gray-300';

const SimulatorPage: React.FC<SimulatorPageProps> = ({ portfolio }) => {
  const [amount, setAmount] = useState(10000);
  const [horizon, setHorizon] = useState(12); // Meses
  const [riskAversion, setRiskAversion] = useState(50); // 0-100
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [inflationRate, setInflationRate] = useState(3); // % anual
  const [selectedAsset, setSelectedAsset] = useState<string>('tech'); // Activo seleccionado
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    runSimulation();
  }, [amount, horizon, riskAversion, portfolio, monthlyContribution, inflationRate, selectedAsset]);

  // Función para generar número aleatorio con distribución normal (Box-Muller)
  const randomNormal = (mean: number, stdDev: number): number => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + stdDev * z0;
  };

  const runSimulation = () => {
    // Obtener características del activo seleccionado
    const asset = ASSET_TYPES.find(a => a.id === selectedAsset) || ASSET_TYPES[0];
    
    // Usar valores del activo seleccionado o del portafolio
    const baseReturn = asset.expectedReturn;
    const baseRisk = asset.volatility;

    // Ajustar retorno y riesgo según tolerancia al riesgo del usuario
    const riskFactor = riskAversion / 100; // 0-1
    const annualReturn = baseReturn * (0.5 + riskFactor * 0.8); // Entre 40% y 120% del retorno base
    const annualVolatility = baseRisk * (1.5 - riskFactor * 0.8); // Volatilidad inversamente proporcional a aversión
    
    // Convertir a tasas mensuales
    const monthlyReturn = annualReturn / 12;
    const monthlyVolatility = annualVolatility / Math.sqrt(12);

    // Ejecutar múltiples simulaciones Monte Carlo (100 iteraciones)
    const numSimulations = 100;
    const allSimulations: number[][] = [];
    
    for (let sim = 0; sim < numSimulations; sim++) {
      const simulation: number[] = [];
      let currentValue = amount;
      
      for (let month = 0; month <= horizon; month++) {
        if (month > 0) {
          // Generar retorno aleatorio con distribución normal
          const randomReturn = randomNormal(monthlyReturn, monthlyVolatility);
          currentValue = currentValue * (1 + randomReturn) + monthlyContribution;
        }
        simulation.push(currentValue);
      }
      allSimulations.push(simulation);
    }

    // Calcular estadísticas en cada punto temporal
    const chartData = [];
    let finalValues: number[] = [];
    
    for (let month = 0; month <= horizon; month++) {
      const valuesAtMonth = allSimulations.map(sim => sim[month]);
      const avg = valuesAtMonth.reduce((sum, val) => sum + val, 0) / numSimulations;
      const sorted = [...valuesAtMonth].sort((a, b) => a - b);
      const percentile10 = sorted[Math.floor(numSimulations * 0.1)];
      const percentile90 = sorted[Math.floor(numSimulations * 0.9)];
      
      chartData.push({
        name: month === 0 ? 'Inicio' : `Mes ${month}`,
        'Escenario Optimista': Math.round(percentile90),
        'Escenario Esperado': Math.round(avg),
        'Escenario Pesimista': Math.round(percentile10),
      });
      
      if (month === horizon) {
        finalValues = valuesAtMonth;
      }
    }

    // Calcular métricas finales
    const avgFinalValue = finalValues.reduce((sum, val) => sum + val, 0) / numSimulations;
    const totalInvested = amount + (monthlyContribution * horizon);
    const profit = avgFinalValue - totalInvested;
    const profitPercentage = (profit / totalInvested) * 100;
    
    const sortedFinal = [...finalValues].sort((a, b) => a - b);
    const bestCase = sortedFinal[Math.floor(numSimulations * 0.95)];
    const worstCase = sortedFinal[Math.floor(numSimulations * 0.05)];
    
    // Calcular volatilidad
    const variance = finalValues.reduce((sum, val) => sum + Math.pow(val - avgFinalValue, 2), 0) / numSimulations;
    const volatility = Math.sqrt(variance) / avgFinalValue * 100;
    
    // Calcular Sharpe Ratio (asumiendo tasa libre de riesgo del 2% anual)
    const riskFreeRate = 0.02;
    const excessReturn = annualReturn - riskFreeRate;
    const sharpeRatio = excessReturn / annualVolatility;

    setSimulationData(chartData);
    setResults({
      finalValue: avgFinalValue,
      profit,
      profitPercentage,
      bestCase,
      worstCase,
      volatility,
      sharpeRatio
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-6">
            <i className="fas fa-chart-line text-[200px] text-blue-100"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent relative z-10">
            <i className="fas fa-calculator mr-4 text-blue-700"></i>Simulador de Inversiones
          </h1>
          <p className="text-slate-600 text-xl relative z-10">
            Proyecta el crecimiento de tu portafolio con análisis Monte Carlo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Controles del Simulador (tema profesional) */}
          <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-xl border-2 border-blue-100 shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <i className="fas fa-sliders-h text-blue-600"></i>
                Parámetros
              </h2>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-blue-600 hover:text-blue-500 font-bold transition-colors"
              >
                {showAdvanced ? 'Básico' : 'Avanzado'}
              </button>
            </div>

          {/* Selector de Tipo de Activo (mapeado a tema azul) */}
          <div className="mb-6 p-4 bg-white rounded-xl border-2 border-blue-100 max-h-64 overflow-y-auto">
            <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fas fa-layer-group text-blue-600"></i>
              Tipo de Activo a Simular
            </label>
            <div className="grid grid-cols-1 gap-3">
              {ASSET_TYPES.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset.id)}
                  className={getAssetButtonClasses(selectedAsset === asset.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                      <i className={`fas ${asset.icon} text-white text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-sm">{asset.name}</h3>
                      <p className="text-xs text-slate-500">{asset.ticker}</p>
                    </div>
                    {selectedAsset === asset.id && (
                      <i className="fas fa-check-circle text-blue-600 text-xl"></i>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{asset.description}</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">
                      <i className="fas fa-arrow-up mr-1"></i>
                      Retorno: {(asset.expectedReturn * 100).toFixed(0)}%
                    </span>
                    <span className="text-amber-400">
                      <i className="fas fa-chart-area mr-1"></i>
                      Volatilidad: {(asset.volatility * 100).toFixed(0)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Monto Inicial */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fas fa-dollar-sign text-blue-600"></i>
                Monto Inicial
              </span>
              <span className="text-blue-600 text-lg">${amount.toLocaleString()}</span>
            </label>
            <input
              type="range"
              id="amount"
              min="1000" max="100000" step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              style={{
                background: `linear-gradient(to right, #1e88e5 0%, #1e88e5 ${((amount - 1000) / (100000 - 1000)) * 100}%, #e6eef8 ${((amount - 1000) / (100000 - 1000)) * 100}%, #e6eef8 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$1,000</span>
              <span>$100,000</span>
            </div>
          </div>
          
          {/* Horizonte de Inversión */}
          <div>
            <label htmlFor="horizon" className="block text-sm font-semibold text-gray-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fas fa-calendar-alt text-blue-600"></i>
                Horizonte
              </span>
              <span className="text-blue-600 text-lg">{horizon} meses</span>
            </label>
            <input
              type="range"
              id="horizon"
              min="6" max="60" step="6"
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              style={{
                background: `linear-gradient(to right, #1e88e5 0%, #1e88e5 ${((horizon - 6) / (60 - 6)) * 100}%, #e6eef8 ${((horizon - 6) / (60 - 6)) * 100}%, #e6eef8 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>6 meses</span>
              <span>5 años</span>
            </div>
          </div>
          
          {/* Aversión al Riesgo */}
          <div>
            <label htmlFor="riskAversion" className="block text-sm font-semibold text-gray-200 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fas fa-shield-alt text-amber-400"></i>
                Tolerancia al Riesgo
              </span>
              <span className="text-amber-400 text-lg">{riskAversion}%</span>
            </label>
            <input
              type="range"
              id="riskAversion"
              min="0" max="100" step="10"
              value={riskAversion}
              onChange={(e) => setRiskAversion(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              style={{
                background: `linear-gradient(to right, #1e88e5 0%, #1e88e5 ${riskAversion}%, #e6eef8 ${riskAversion}%, #e6eef8 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Conservador</span>
              <span>Agresivo</span>
            </div>
          </div>

          {/* Parámetros Avanzados */}
          {showAdvanced && (
            <>
              {/* Aporte Mensual */}
              <div className="pt-4 border-t border-gray-600">
                <label htmlFor="monthlyContribution" className="block text-sm font-semibold text-gray-200 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <i className="fas fa-piggy-bank text-cyan-400"></i>
                    Aporte Mensual
                  </span>
                  <span className="text-cyan-400 text-lg">${monthlyContribution.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  id="monthlyContribution"
                  min="0" max="5000" step="100"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(monthlyContribution / 5000) * 100}%, #4b5563 ${(monthlyContribution / 5000) * 100}%, #4b5563 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span>
                  <span>$5,000</span>
                </div>
              </div>

              {/* Tasa de Inflación */}
              <div>
                <label htmlFor="inflationRate" className="block text-sm font-semibold text-gray-200 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <i className="fas fa-percentage text-purple-400"></i>
                    Inflación Anual
                  </span>
                  <span className="text-purple-400 text-lg">{inflationRate}%</span>
                </label>
                <input
                  type="range"
                  id="inflationRate"
                  min="0" max="10" step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(inflationRate / 10) * 100}%, #4b5563 ${(inflationRate / 10) * 100}%, #4b5563 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>
            </>
          )}

          {/* Botón de nueva simulación */}
          <button
            onClick={runSimulation}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-lg hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <i className="fas fa-sync-alt"></i>
            Nueva Simulación
          </button>
        </div>

        {/* Resultados del Simulador - Panel Ampliado */}
        <div className="lg:col-span-2 space-y-6">
          {/* Métricas principales (tarjetas claras) */}
          <div className="bg-white p-6 rounded-xl border-2 border-blue-100 shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <i className="fas fa-chart-bar text-blue-600"></i>
                Resultados Proyectados
              </h2>
              {/* Badge del activo seleccionado */}
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                <i className={`fas ${ASSET_TYPES.find(a => a.id === selectedAsset)?.icon} text-blue-600`}></i>
                <span className="text-sm font-bold text-slate-900">
                  {ASSET_TYPES.find(a => a.id === selectedAsset)?.name}
                </span>
                <span className="text-xs text-slate-500">
                  ({ASSET_TYPES.find(a => a.id === selectedAsset)?.ticker})
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valor Final Esperado */}
              <div className="bg-white p-6 rounded-xl border-2 border-blue-100 hover:border-blue-200 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-dollar-sign text-white text-2xl"></i>
                  </div>
                  <i className="fas fa-chart-line text-4xl text-blue-600/20"></i>
                </div>
                <p className="text-slate-600 text-sm mb-2">Valor Final Esperado</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${results?.finalValue.toLocaleString(undefined, {maximumFractionDigits: 0}) || 'N/A'}
                </p>
              </div>
              
              {/* Ganancia/Pérdida */}
              <div className="bg-white p-6 rounded-xl border-2 border-blue-100 hover:border-green-500 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${ (results?.profit || 0) >= 0 ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-red-600 to-rose-600'} rounded-xl flex items-center justify-center shadow-lg`}>
                    <i className={`fas fa-arrow-${(results?.profit || 0) >= 0 ? 'up' : 'down'} text-white text-2xl`}></i>
                  </div>
                  <i className={`fas fa-percentage text-4xl ${(results?.profit || 0) >= 0 ? 'text-green-400/20' : 'text-red-400/20'}`}></i>
                </div>
                <p className="text-slate-600 text-sm mb-2">Ganancia Estimada</p>
                <p className={`text-3xl font-bold ${(results?.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${results?.profit.toLocaleString(undefined, {maximumFractionDigits: 0}) || 'N/A'}
                  <span className="text-lg ml-2">({results?.profitPercentage.toFixed(1)}%)</span>
                </p>
              </div>

              {/* Mejor Caso */}
              <div className="bg-white p-6 rounded-xl border-2 border-blue-100 hover:border-amber-500 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-trophy text-white text-2xl"></i>
                  </div>
                  <i className="fas fa-star text-4xl text-amber-400/20"></i>
                </div>
                <p className="text-slate-600 text-sm mb-2">Mejor Escenario (95%)</p>
                <p className="text-3xl font-bold text-amber-400">
                  ${results?.bestCase.toLocaleString(undefined, {maximumFractionDigits: 0}) || 'N/A'}
                </p>
              </div>

              {/* Peor Caso */}
              <div className="bg-white p-6 rounded-xl border-2 border-blue-100 hover:border-red-500 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
                  </div>
                  <i className="fas fa-shield-alt text-4xl text-red-400/20"></i>
                </div>
                <p className="text-slate-600 text-sm mb-2">Peor Escenario (5%)</p>
                <p className="text-3xl font-bold text-red-400">
                  ${results?.worstCase.toLocaleString(undefined, {maximumFractionDigits: 0}) || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Métricas avanzadas */}
          {showAdvanced && results && (
            <div className="bg-white p-6 rounded-xl border-2 border-blue-100 shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-brain text-blue-600"></i>
                Análisis Avanzado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-blue-50 text-center">
                  <i className="fas fa-wave-square text-2xl text-blue-600 mb-2"></i>
                  <p className="text-slate-500 text-xs mb-1">Volatilidad</p>
                  <p className="text-xl font-bold text-slate-900">{results.volatility.toFixed(2)}%</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-50 text-center">
                  <i className="fas fa-balance-scale text-2xl text-blue-600 mb-2"></i>
                  <p className="text-slate-500 text-xs mb-1">Sharpe Ratio</p>
                  <p className="text-xl font-bold text-slate-900">{results.sharpeRatio.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-50 text-center">
                  <i className="fas fa-coins text-2xl text-amber-400 mb-2"></i>
                  <p className="text-slate-500 text-xs mb-1">Inversión Total</p>
                  <p className="text-xl font-bold text-slate-900">${(amount + monthlyContribution * horizon).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Gráfico de Evolución del Portafolio con 3 Escenarios */}
        <div className="mt-8 bg-white p-8 rounded-xl border-2 border-blue-100 shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <i className="fas fa-chart-line text-blue-600"></i>
              Proyección de Crecimiento
            </h2>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <i className="fas fa-info-circle text-blue-400"></i>
              <span className="text-sm text-slate-500">Basado en 100 simulaciones Monte Carlo</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={450}>
            <LineChart
              data={simulationData}
              margin={{
                top: 10, right: 40, left: 20, bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorOptimista" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEsperado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e88e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1e88e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPesimista" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6eef8" opacity={0.7} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                style={{ fontSize: '12px', fontWeight: 'bold' }}
                tick={{ fill: '#64748b' }}
              />
              <YAxis 
                stroke="#64748b" 
                style={{ fontSize: '12px', fontWeight: 'bold' }}
                tick={{ fill: '#64748b' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #dbeafe',
                  borderRadius: '12px',
                  color: '#0f172a',
                  padding: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
                }}
                labelStyle={{ color: '#1e88e5', fontWeight: 'bold', marginBottom: '8px' }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '30px' }}
                iconType="line"
                formatter={(value) => <span style={{ color: '#e5e7eb', fontWeight: 'bold' }}>{value}</span>}
              />
              
              {/* Línea Pesimista */}
              <Line 
                type="monotone" 
                dataKey="Escenario Pesimista" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
              />
              
              {/* Línea Esperada - Principal (azul) */}
              <Line 
                type="monotone" 
                dataKey="Escenario Esperado" 
                stroke="#1e88e5" 
                strokeWidth={4}
                dot={{ fill: '#1e88e5', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#1e88e5', stroke: '#fff', strokeWidth: 3 }}
              />
              
              {/* Línea Optimista */}
              <Line 
                type="monotone" 
                dataKey="Escenario Optimista" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Leyenda explicativa */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-green-100 hover:border-green-200 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-1 bg-green-500"></div>
                <span className="text-green-600 font-bold">Escenario Optimista</span>
              </div>
              <p className="text-slate-500 text-xs">Top 10% de resultados - Condiciones favorables del mercado</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-100 hover:shadow-lg hover:shadow-blue-900/10 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-1 bg-blue-500"></div>
                <span className="text-blue-600 font-bold">Escenario Esperado</span>
              </div>
              <p className="text-slate-500 text-xs">Promedio de todas las simulaciones - Resultado más probable</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-red-100 hover:border-red-200 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-1 bg-red-500"></div>
                <span className="text-red-600 font-bold">Escenario Pesimista</span>
              </div>
              <p className="text-slate-500 text-xs">Bottom 10% de resultados - Condiciones adversas del mercado</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <i className="fas fa-exclamation-triangle text-amber-600 text-3xl flex-shrink-0"></i>
            <div>
              <h3 className="text-lg font-bold text-amber-600 mb-2">Aviso Importante</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Esta simulación es solo para fines educativos y no constituye asesoramiento financiero. Los resultados están basados en modelos matemáticos y supuestos que pueden no reflejar el comportamiento real del mercado. El rendimiento pasado no garantiza resultados futuros. Consulta con un asesor financiero profesional antes de tomar decisiones de inversión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;
