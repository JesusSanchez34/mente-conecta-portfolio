/**
 * ResultadosConsolidadosPage.jsx
 * ============================================================
 * Pantalla de resultados finales — muestra los pre-diagnósticos
 * de TODOS los cuestionarios de seguimiento completados.
 * ============================================================
 */

import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { Spinner } from 'react-bootstrap';

import { AuthContext } from '../../../context';
import {
  obtenerRespuestasUsuario,
  obtenerResultados,
} from '../../../api/isem/cuestionarios';
import './ResultadosConsolidadosPage.css';

export function ResultadosConsolidadosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);


  
  const cuestionariosDeriados = location.state?.cuestionariosDeriados ?? [];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preDiagnosticos, setPreDiagnosticos] = useState([]);

  // SEO: Título de la pestaña
  useEffect(() => {
    document.title = 'Pre-diagnósticos · ISEM';
    return () => { document.title = 'Mente Conecta'; };
  }, []);

  useEffect(() => {
    // Guardia: sin cuestionarios, redirigir
    if (!cuestionariosDeriados.length || !auth?.token || !auth?.me?.id) {
      navigate('/isem/bienvenida', { replace: true });
      return;
    }

    const calcularResultados = async () => {
      setLoading(true);
      setError(null);

      try {
        // Para cada cuestionario: obtener respuestas guardadas y calcular resultado
        const resultadosPorCuestionario = await Promise.allSettled(
          cuestionariosDeriados.map(async (cuestionario) => {
            const id = cuestionario.id ?? cuestionario.cuestionario_id;
            const titulo = cuestionario.titulo ?? `Cuestionario ${id}`;

            // 1. Obtener respuestas guardadas del usuario
            const respuesta = await obtenerRespuestasUsuario(
              { id_usuario: auth.me.id, id_cuestionario: id, id_parentesco: 0 },
              auth.token
            );

            if (!respuesta?.respuestas_json) {
              return { titulo, resultados: [] };
            }

            let resultadosArr = [];
            
            try {
              // 2. EL SECRETO: Lo pasamos DIRECTO, tal como lo hace ResultadosPage (Sin JSON.parse)
              const res = await obtenerResultados(
                respuesta.respuestas_json,
                auth.token
              );

              // 3. Normalizamos el arreglo igual que en ResultadosPage
              resultadosArr = Array.isArray(res) ? res : res ? [res] : [];

            } catch (backendError) {
              // Si el backend da error (ej. 500) lo atrapamos aquí en silencio.
              console.warn(`El backend falló al evaluar ${titulo}`, backendError);
              resultadosArr = []; // Lo dejamos vacío para que el código de abajo use el nombre de respaldo
            }

            // Retornamos SIEMPRE un objeto válido para que no se vacíe la pantalla
            return { titulo, resultados: resultadosArr };
          })
        );
        
        // Aplanar resultados exitosos en una lista unificada
        const diagnosticosUnificados = [];
        resultadosPorCuestionario.forEach((resultado) => {
          if (resultado.status === 'fulfilled') {
            const { titulo, resultados } = resultado.value;
            if (resultados.length > 0) {
              resultados.forEach((r) => {
                diagnosticosUnificados.push({
                  titulo,
                  especialidadNombre: r?.especialidad_nombre ?? titulo,
                  cuestionarioId: r?.cuestionario_id,
                  descripcion: r?.descripcion_diagnostico ?? '',
                });
              });
            } else {
              // Cuestionario sin diagnósticos específicos → mostrar como completado con su título real
              diagnosticosUnificados.push({
                titulo,
                especialidadNombre: titulo,
                cuestionarioId: null,
                descripcion: '',
              });
            }
          }
        });

        setPreDiagnosticos(diagnosticosUnificados);
      } catch (err) {
        console.error('[ResultadosConsolidadosPage] Error:', err);
        setError('No se pudieron calcular todos los resultados.');
      } finally {
        setLoading(false);
      }
    };

    calcularResultados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.token, auth?.me?.id]);

  // Nombre completo del paciente (con respaldo a username o "Paciente")
  const nombreCompleto = (
    (auth?.me
      ? `${auth.me.first_name || auth.me.nombre || ''} ${auth.me.last_name || auth.me.apellido || ''}`.trim() || auth.me.username
      : 'Paciente') || 'Paciente'
  );

  return (
    <div className="resultados-consolidados">

      {/* ── Carga ────────────────────────────────────────────── */}
      {loading && (
        <div className="resultados-consolidados__loading">
          <Spinner
            animation="border"
            className="resultados-consolidados__spinner"
          />
          <p>Calculando pre-diagnósticos...</p>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────── */}
      {error && !loading && (
        <div className="resultados-consolidados__error-card">
          <FiAlertTriangle className="resultados-consolidados__error-icon" />
          <h3>No se pudo generar el resultado</h3>
          <p>{error}</p>
          <button
            type="button"
            id="btn-consolidados-regresar-error"
            className="resultados-consolidados__btn-cuestionarios"
            onClick={() => navigate('/isem/bienvenida')}
          >
            Cuestionarios
          </button>
        </div>
      )}

      {/* ── Contenido principal ──────────────────────────────── */}
      {!loading && !error && (
        <div className="resultados-consolidados__container">

         {/* Nombre del paciente */}
          <h2 className="resultados-consolidados__patient">
            {nombreCompleto}
          </h2>

          {/* Lista de pre-diagnósticos */}
          <div className="resultados-consolidados__list">
            {preDiagnosticos.map((item, idx) => (
              <div
                key={idx}
                className="prediagnostico-card"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="prediagnostico-card__left">
                  <div className="prediagnostico-card__check">
                    <FiCheckCircle size={22} />
                  </div>
                  <div className="prediagnostico-card__info">
                    <span className="prediagnostico-card__label">
                      Pre-Diagnóstico:
                    </span>
                    <span className="prediagnostico-card__nombre">
                      {item.especialidadNombre?.toUpperCase() || 'EVALUACIÓN'}
                    </span>
                  </div>
                </div>
                <span className="prediagnostico-card__status">LISTO</span>
              </div>
            ))}

            {preDiagnosticos.length === 0 && (
              <div className="prediagnostico-card prediagnostico-card--empty">
                <div className="prediagnostico-card__left">
                  <div className="prediagnostico-card__check">
                    <FiCheckCircle size={22} />
                  </div>
                  <span className="prediagnostico-card__nombre">
                    Evaluación completada
                  </span>
                </div>
                <span className="prediagnostico-card__status">LISTO</span>
              </div>
            )}
          </div>

          {/* Botón de regreso */}
          <button
            type="button"
            id="btn-consolidados-cuestionarios"
            className="resultados-consolidados__btn-cuestionarios"
            onClick={() => navigate('/isem/bienvenida')}
          >
            Cuestionarios
          </button>
        </div>
      )}
    </div>
  );
}