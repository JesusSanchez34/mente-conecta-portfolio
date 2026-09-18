import { InitialDashboard } from "../dashboard/InitialDashboard";

export default function GraficasGrid({ graficas, loading }) {
  if (loading) return <p>Cargando gráficas...</p>;
  
  // Validar que graficas sea un array
  if (!graficas || !Array.isArray(graficas) || graficas.length === 0) {
    return <p style={{ textAlign: "center", color: "#999" }}>No hay gráficas para mostrar</p>;
  }

  return (
    <div className="graficas-grid-responsive">
      {graficas.map((grafica, index) => (
        <div key={index} className="grafica-card">
          <div className="h-100">
            <InitialDashboard
              title={grafica?.title || "Sin título"}
              data={grafica?.data || []}
            />
          </div>
        </div>
      ))}
    </div>
  );
}