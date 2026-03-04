import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStockData } from '../services/api';

interface MyPortfolioPageProps {
  portfolio: any;
}

interface StockData {
  ticker: string;
  name: string;
  current_price: number;
  previous_close: number;
  price_change: number;
  price_change_percent: number;
  currency: string;
  error?: string;
}

// Función mock para generar datos de rendimiento
const generatePerformanceData = () => {
  const data = [];
  let value = 10000; // Valor inicial del portafolio
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    value += Math.random() * 500 - 200; // Simula fluctuaciones
    data.push({
      name: date.toLocaleString('es-ES', { month: 'short', year: '2-digit' }),
      'Valor del Portafolio': Math.round(value),
    });
  }
  return data;
};

// Formatea nombres recibidos de la API: reemplaza '_' y '-' por espacios y los convierte a Title Case
const formatDisplayName = (name?: string) => {
  if (!name) return '';
  const cleaned = name.replace(/[_-]+/g, ' ').toLowerCase().trim();
  return cleaned.split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1) : '').join(' ');
};

const MyPortfolioPage: React.FC<MyPortfolioPageProps> = ({ portfolio }) => {
  const performanceData = generatePerformanceData();
  const [stocksData, setStocksData] = useState<Record<string, StockData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de Yahoo Finance cuando cambie el portfolio
  useEffect(() => {
    if (portfolio && portfolio.assets && portfolio.assets.length > 0) {
      loadStockData();
    }
  }, [portfolio]);

  const loadStockData = async () => {
    if (!portfolio?.assets) return;

    setLoading(true);
    setError(null);

    try {
      const tickers = portfolio.assets.map((asset: any) => asset.ticker);
      const response = await fetchStockData(tickers);
      
      // Crear un mapa de ticker -> datos
      const dataMap: Record<string, StockData> = {};
      response.data.stocks.forEach((stock: StockData) => {
        dataMap[stock.ticker] = stock;
      });
      
      setStocksData(dataMap);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Error al cargar datos de mercado. Mostrando información básica.');
    } finally {
      setLoading(false);
    }
  };

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Cargando Mi Portafolio...</h2>
          <p className="text-gray-600">Por favor, espera mientras cargamos los detalles de tu portafolio.</p>
        </div>
      </div>
    );
  }

  const { assets } = portfolio;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">
            Mi Portafolio
          </h1>
          <p className="text-gray-600 text-sm mt-1">Gestiona y monitorea tus inversiones</p>
        </div>
          
        {/* Botón de actualización */}
        <button
          onClick={loadStockData}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg border border-blue-900 hover:border-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
          {loading ? 'Actualizando...' : 'Actualizar Datos'}
        </button>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-lg p-4 flex items-center gap-3">
            <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Gráfico de Rendimiento */}
        <div className="mb-8 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <i className="fas fa-chart-line text-blue-900"></i>
            Rendimiento del Portafolio (Últimos 12 Meses)
          </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={performanceData}
            margin={{
              top: 10, right: 30, left: 0, bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#e5e7eb'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="Valor del Portafolio" 
              stroke="#14b8a6" 
              strokeWidth={2}
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de Holdings */}
      <div>
        <h2 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
          <i className="fas fa-list text-blue-900"></i>
          Mis Activos
        </h2>
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  <i className="fas fa-tag mr-2"></i>Ticker
                </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  <i className="fas fa-percentage mr-2"></i>Allocación
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  <i className="fas fa-dollar-sign mr-2"></i>Precio Actual
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  <i className="fas fa-chart-bar mr-2"></i>P/L
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assets.map((asset: any, index: number) => {
                const stockData = stocksData[asset.ticker];
                const realName = stockData?.name || asset.name;
                const currentPrice = stockData?.current_price || 0;
                const priceChange = stockData?.price_change || 0;
                const priceChangePercent = stockData?.price_change_percent || 0;
                const isProfit = priceChange >= 0;
                
                return (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors border-b border-gray-200`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                          {asset.ticker.substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-blue-900">{asset.ticker}</span>
                          <span className="text-xs text-slate-500">{formatDisplayName(realName)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-300 rounded-full h-2 max-w-[80px]">
                          <div 
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(asset.allocation_pct, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-900 font-bold">{asset.allocation_pct.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {currentPrice > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-bold">${currentPrice.toLocaleString()}</span>
                          <span className="text-xs text-gray-600">{stockData?.currency || 'USD'}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      {currentPrice > 0 ? (
                        <div className="flex flex-col items-start">
                          <span className={`flex items-center gap-1 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                            <i className={`fas ${isProfit ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                            {isProfit ? '+' : ''}{priceChange.toFixed(2)}
                          </span>
                          <span className={`text-xs ${isProfit ? 'text-green-300' : 'text-red-300'}`}>
                            ({isProfit ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">--</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MyPortfolioPage;
