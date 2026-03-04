
import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';



const COLORS = ['#003366', '#0056b3', '#0077cc', '#0099ff', '#1e88e5', '#1565c0', '#1976d2', '#1e8449', '#2e7d32', '#388e3c'];



interface DashboardOverviewProps {
  portfolio: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ portfolio }) => {
  // Si no hay portafolio, muestra mensaje
  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">No tienes portafolio generado</h2>
          <p className="text-gray-600 mb-4">Haz la encuesta para generar tu portafolio personalizado.</p>
          <Link to="/risk-profile-form">
            <button className="bg-blue-900 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-800 transition">Ir a la encuesta</button>
          </Link>
        </div>
      </div>
    );
  }

  // Extraer métricas y activos del portafolio real
  const metrics = portfolio.metrics ?? { expected_return: 0, risk: 0 };
  const assets = portfolio.assets ?? [];
  // Selección de activos principales para Overview (top 3 por porcentaje)
  const mainAssets = [...assets]
    .sort((a, b) => (b.allocation_pct ?? 0) - (a.allocation_pct ?? 0))
    .slice(0, 3);
  const chartData = mainAssets.map(asset => ({
    name: asset.name,
    value: parseFloat((asset.allocation_pct ?? 0).toFixed(2)),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-2 sm:px-4 md:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-blue-900">Tu Portafolio Actual</h1>
          <p className="text-gray-600 text-base sm:text-lg">Basado en tu perfil de riesgo, estos son los activos recomendados para tu inversión</p>
          <div className="mt-4 flex flex-col sm:flex-row items-start gap-3">
            <Link to="/risk-profile-form">
              <button className="flex items-center gap-2 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-900 bg-white hover:bg-blue-50 transition-colors duration-200 shadow-sm">
                ↻ Actualizar mi portafolio
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Métricas Clave */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📈 Retorno Esperado Anual
              </h3>
              <p className="text-4xl sm:text-5xl font-bold text-blue-900">{(metrics.expected_return * 100).toFixed(2)}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🛡️ Nivel de Riesgo
              </h3>
              <p className="text-4xl sm:text-5xl font-bold text-orange-600">{(metrics.risk * 100).toFixed(2)}%</p>
            </div>
            <div className="mt-6">
              <Link to="/dashboard/recommendations">
                <button className="w-full bg-blue-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition duration-300 shadow-md">
                  Ver Estrategia Completa
                </button>
              </Link>
            </div>
          </div>

          {/* Distribución de Activos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución de Activos Recomendados</h3>
            <div className="flex flex-col items-center gap-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#374151',
                        border: '1px solid #4b5563',
                        borderRadius: '8px',
                        color: '#e5e7eb'
                      }}
                      formatter={(value) => `${value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 sm:space-y-4 w-full">
                {mainAssets.map((asset, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 shadow-md gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-gray-200 text-sm sm:text-base font-medium">{asset.name}</span>
                      <span className="text-xs text-gray-400">({asset.ticker})</span>
                    </div>
                    <span className="text-white font-bold text-base sm:text-lg">{asset.allocation_pct?.toFixed(2) ?? '0.00'}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
