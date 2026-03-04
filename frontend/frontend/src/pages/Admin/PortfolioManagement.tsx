
import { useEffect, useState } from "react";
import { adminFetchPortfolios, adminDeletePortfolio, adminRegeneratePortfolio } from "../../services/api";

const PortfolioManagement = () => {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  const fetchPortfolios = () => {
    setLoading(true);
    adminFetchPortfolios()
      .then((res) => {
        setPortfolios(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Error al cargar portafolios");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleDelete = async (portfolioId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este portafolio?")) return;
    setDeletingId(portfolioId);
    setSuccessMsg(null);
    setError(null);
    try {
      await adminDeletePortfolio(portfolioId);
      setSuccessMsg("Portafolio eliminado correctamente.");
      fetchPortfolios();
    } catch {
      setError("Error al eliminar portafolio");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRegenerate = async (userId: string) => {
    setRegeneratingId(userId);
    setSuccessMsg(null);
    setError(null);
    try {
      await adminRegeneratePortfolio(userId);
      setSuccessMsg("Portafolio regenerado correctamente.");
      fetchPortfolios();
    } catch {
      setError("Error al regenerar portafolio");
    } finally {
      setRegeneratingId(null);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Gestión de Portafolios</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <input
          className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]"
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value)}
        >
          <option value="">Todos los riesgos</option>
          <option value="bajo">Bajo</option>
          <option value="medio">Medio</option>
          <option value="alto">Alto</option>
        </select>
        <button className="ml-auto bg-teal-600 text-white px-4 py-2 rounded" onClick={() => {
          const headers = ["Usuario", "Fecha", "Perfil de riesgo", "# Activos"];
          const rows = portfolios.map(p => [
            p.user_id,
            p.generated_at ? (typeof p.generated_at === 'string' || typeof p.generated_at === 'number' ? new Date(p.generated_at).toLocaleDateString() : (p.generated_at.$date ? new Date(p.generated_at.$date).toLocaleDateString() : '-')) : '-',
            p.metrics?.risk_level || '-',
            p.assets ? p.assets.length : 0
          ]);
          const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'portafolios.csv';
          a.click();
          URL.revokeObjectURL(url);
        }}>Exportar CSV</button>
      </div>
      <div className="overflow-x-auto mb-8 text-[var(--color-text-light)]">
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
            <table className="min-w-full bg-[var(--color-card-bg)] text-[var(--color-text-light)] rounded shadow">
              <thead>
                <tr className="bg-[var(--color-secondary-bg)] text-[var(--color-text-light)]">
                  <th className="py-4 px-6 text-center align-middle font-semibold">Usuario</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Email</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Perfil de riesgo</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold"># Activos</th>
                  <th className="py-4 px-6 text-center align-middle font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Filtrar y buscar portafolios */}
                {(() => {
                  const filtered = portfolios.filter(p => {
                    const matchesSearch = searchTerm.trim() === "" || (p.user_id && p.user_id.toLowerCase().includes(searchTerm.toLowerCase())) || (p.user_email && p.user_email.toLowerCase().includes(searchTerm.toLowerCase()));
                    // Buscar el nivel de riesgo en p.risk_level o p.metrics.risk_level
                    const riskValue = (p.risk_level || p.metrics?.risk_level || "").toString().toLowerCase();
                    const matchesRisk = riskFilter === "" || riskValue === riskFilter;
                    return matchesSearch && matchesRisk;
                  });
                  if (filtered.length === 0) {
                    return <tr><td colSpan={5} className="text-center py-4">No hay portafolios registrados.</td></tr>;
                  }
                  return filtered.map((p, idx) => {
                    const riskValueRaw = (p.risk_level || p.metrics?.risk_level || "-");
                    const riskValue = riskValueRaw.toString().toLowerCase();
                    let riskText = riskValueRaw;
                    if (riskValue === "bajo") riskText = "bajo";
                    else if (riskValue === "medio") riskText = "medio";
                    else if (riskValue === "alto") riskText = "alto";
                    return (
                      <tr key={p._id || idx} className="border-b border-[var(--color-secondary-bg)] hover:bg-gray-800 transition-all">
                        <td className="py-4 px-6 text-center align-middle">{p.user_id}</td>
                        <td className="py-4 px-6 text-center align-middle">{p.user_email || '-'}</td>
                        <td className="py-4 px-6 text-center align-middle">{riskText || '-'}</td>
                        <td className="py-4 px-6 text-center align-middle">{p.assets ? p.assets.length : 0}</td>
                        <td className="py-4 px-6 text-center align-middle flex gap-2 justify-center">
                          <button className="text-blue-600 hover:underline" onClick={() => setSelectedPortfolio(p)}>Ver</button>
                          <button className="text-red-600 hover:underline" onClick={() => handleDelete(p._id)} disabled={deletingId === p._id}>
                            {deletingId === p._id ? "Eliminando..." : "Eliminar"}
                          </button>
                          <button className="text-yellow-600 hover:underline" onClick={() => handleRegenerate(p.user_id)} disabled={regeneratingId === p.user_id}>
                            {regeneratingId === p.user_id ? "Regenerando..." : "Regenerar"}
                          </button>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </>
        )}
      </div>
      {/* Modal para ver detalles del portafolio */}
      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[var(--color-card-bg)] rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
              onClick={() => setSelectedPortfolio(null)}
            >
              &times;
            </button>
            <h3 className="font-bold text-lg mb-4">Detalles del Portafolio</h3>
            <div className="mb-2"><strong>Usuario:</strong> {selectedPortfolio.user_id}</div>
            <div className="mb-2"><strong>Email:</strong> {selectedPortfolio.user_email || '-'}</div>
            <div className="mb-2"><strong>Perfil de riesgo:</strong> {
              (() => {
                const riskValueRaw = (selectedPortfolio.risk_level || selectedPortfolio.metrics?.risk_level || "-");
                const riskValue = riskValueRaw.toString().toLowerCase();
                if (riskValue === "bajo") return "bajo";
                if (riskValue === "medio") return "medio";
                if (riskValue === "alto") return "alto";
                return riskValueRaw;
              })()
            }</div>
            <div className="mb-2"><strong>Fecha de generación:</strong> {selectedPortfolio.generated_at ? (typeof selectedPortfolio.generated_at === 'string' || typeof selectedPortfolio.generated_at === 'number' ? new Date(selectedPortfolio.generated_at).toLocaleDateString() : (selectedPortfolio.generated_at.$date ? new Date(selectedPortfolio.generated_at.$date).toLocaleDateString() : '-')) : '-'}</div>
            <div className="mb-2"><strong>Activos:</strong></div>
            <ul className="list-disc pl-5">
              {selectedPortfolio.assets && selectedPortfolio.assets.length > 0 ? (
                selectedPortfolio.assets.map((asset: any, i: number) => (
                  <li key={i}>{asset.ticker || asset.name || JSON.stringify(asset)}</li>
                ))
              ) : (
                <li>No hay activos en este portafolio.</li>
              )}
            </ul>
            {selectedPortfolio.metrics && (
              <div className="mt-4">
                <strong>Métricas:</strong>
                <pre className="bg-gray-900 rounded p-2 text-xs mt-2 overflow-x-auto">{JSON.stringify(selectedPortfolio.metrics, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="bg-[var(--color-card-bg)] rounded-lg shadow p-6 text-[var(--color-text-light)]">
        <h3 className="font-semibold text-lg mb-2">Estadísticas y Métricas</h3>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          <li>Distribución de perfiles de riesgo (ejemplo: bajo 1, medio 1, alto 1).</li>
          <li>Activos más recomendados (ejemplo: Apple, Tesla, Bitcoin).</li>
          <li>Gráficos de portafolios por día/mes (próximamente).</li>
        </ul>
      </div>
    </div>
  );
};

export default PortfolioManagement;
