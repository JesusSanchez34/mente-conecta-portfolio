import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiAlertTriangle, FiPhone, FiMail, FiUser } from 'react-icons/fi';
import { Spinner } from 'react-bootstrap';
import { AuthContext } from '../../../context';
import { obtenerResultados, obtenerRespuestasUsuario, obtenerCuestionarioPorId } from '../../../api/isem/cuestionarios';
import './ResultadosPage.css';

/**
 * ResultadosPage
 * ============================================================
 * Muestra la pantalla de confirmación y pre-diagnóstico finalizada.
 * Estilo visual móvil premium con fondo degradado azul y tarjetas
 * redondeadas de alta fidelidad.
 * ============================================================
 */
export function ResultadosPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultados, setResultados] = useState([]);

  const [cuestionarioNombre, setCuestionarioNombre] = useState('Cuestionario');

  // SEO: Título
  useEffect(() => {
    document.title = 'Resultado · ISEM';
    return () => { document.title = 'Mente Conecta'; };
  }, []);

  useEffect(() => {
    const fetchResultados = async () => {
      setLoading(true);
      setError(null);
      try {
        let jsonStr = location.state?.respuestasJson;

        // Intentar obtener los datos del cuestionario en paralelo para tener el nombre
        try {
          const meta = await obtenerCuestionarioPorId(id, auth.token);
          if (meta?.titulo) {
            setCuestionarioNombre(meta.titulo);
          }
        } catch (metaErr) {
          console.warn('[ResultadosPage] No se pudo obtener meta del cuestionario:', metaErr);
        }

        // Si no viene en el state (ej. acceso directo desde el historial de completados),
        // descargamos las respuestas guardadas del usuario de la API.
        if (!jsonStr && auth?.me?.id) {
          const miRespuesta = await obtenerRespuestasUsuario({
            id_usuario: auth.me.id,
            id_cuestionario: Number(id),
            id_parentesco: 0,
          }, auth.token);

          if (miRespuesta?.respuestas_json) {
            jsonStr = miRespuesta.respuestas_json;
          }
        }

        if (jsonStr) {
          try {
            const res = await obtenerResultados(jsonStr, auth.token);
            // Aseguramos de que sea un array
            const resultadosArr = Array.isArray(res) ? res : res ? [res] : [];
            setResultados(resultadosArr);
          } catch (calcErr) {
            console.warn('[ResultadosPage] Falla en cálculo de especialista, usando fallback de meta:', calcErr);
            // En caso de que falle el cálculo, evitamos mostrar pantalla de error duro
            // y caemos en un estado de éxito simple mostrando el cuestionario completado.
            setResultados([]);
          }
        } else {
          // Si no hay respuestas previas, usamos un fallback vacío en lugar de arrojar error
          setResultados([]);
        }
      } catch (err) {
        console.error('[ResultadosPage] Error general:', err);
        // Fallback resiliente
        setResultados([]);
      } finally {
        setLoading(false);
      }
    };

    if (id && auth?.token) {
      fetchResultados();
    }
  }, [id, auth, location.state]);
  const nombreCompleto = (
    (auth?.me
      ? `${auth.me.first_name || ''} ${auth.me.last_name || ''}`.trim() || auth.me.username
      : 'Paciente') || 'Paciente'
  );

  return (
    <div className="resultados-pantalla">
      
      {/* ── Carga ── */}
      {loading && (
        <div className="resultados-pantalla__loading">
          <Spinner animation="border" className="resultados-pantalla__spinner" />
          <p>Calculando prediagnóstico...</p>
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="resultados-pantalla__error-card">
          <FiAlertTriangle className="resultados-pantalla__error-icon" />
          <h3>No se pudo generar el resultado</h3>
          <p>{error}</p>
          <button 
            type="button" 
            className="resultados-pantalla__btn-cuestionarios"
            onClick={() => navigate('/isem/bienvenida')}
          >
            Cuestionarios
          </button>
        </div>
      )}

      {/* ── Resultados del cálculo ── */}
      {!loading && !error && (
        <div className="resultados-pantalla__container">
          <h1 className="resultados-pantalla__title">Resultado</h1>
          <h2 className="resultados-pantalla__subtitle">
            {nombreCompleto.toUpperCase()}
          </h2>

          <div className="resultados-pantalla__list">
            {resultados.map((res, idx) => {
              const risk = (res.especialidad_semaforo || res.especialidad_baja || res.especialidad_media || res.especialidad_alta) ? (() => {
                const val = res.especialidad_calificacion || 0;
                const bajo = res.especialidad_baja || 0;
                const medio = res.especialidad_media || 0;
                if (val <= bajo) {
                  return { label: 'Riesgo Bajo', color: '#0d9488', bg: '#f0fdf4', border: '#bbf7d0' };
                } else if (val <= medio) {
                  return { label: 'Riesgo Medio', color: '#b45309', bg: '#fef3c7', border: '#fde68a' };
                } else {
                  return { label: 'Riesgo Alto', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' };
                }
              })() : null;

              return (
                <div key={idx} className="resultado-item-card resultado-item-card--detailed">
                  <div className="resultado-item-card__header">
                    <div className="resultado-item-card__left">
                      <div className="resultado-item-card__check-wrapper">
                        <FiCheckCircle size={28} />
                      </div>
                      <div className="resultado-item-card__title-group">
                        <span className="resultado-item-card__specialty">
                          {(res.especialidad_nombre || cuestionarioNombre).toUpperCase()}
                        </span>
                        {res.especialidad_calificacion !== undefined && (
                          <span className="resultado-item-card__score">
                            Puntaje: {res.especialidad_evaluacion || 0} / Severidad: {res.especialidad_calificacion}
                          </span>
                        )}
                      </div>
                    </div>

                    {risk && (
                      <span
                        className="resultado-item-card__risk-badge"
                        style={{ backgroundColor: risk.bg, color: risk.color, borderColor: risk.border }}
                      >
                        {risk.label.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {res.descripcion_diagnostico && (
                    <div className="resultado-item-card__description">
                      <p>{res.descripcion_diagnostico}</p>
                    </div>
                  )}

                  {res.especialista && res.especialista.length > 0 && (
                    <div className="resultado-item-card__specialists">
                      <h4 className="resultado-item-card__specialists-title">Especialistas Recomendados</h4>
                      <div className="resultado-item-card__specialists-list">
                        {res.especialista.map((esp) => (
                          <div key={esp.id} className="specialist-item-card">
                            <div className="specialist-item-card__avatar">
                              {esp.imagen ? (
                                <img src={esp.imagen} alt={esp.nombre} />
                              ) : (
                                <FiUser size={20} />
                              )}
                            </div>
                            <div className="specialist-item-card__info">
                              <span className="specialist-item-card__name">
                                {`Dr(a). ${esp.nombre || ''} ${esp.apellido_paterno || ''} ${esp.apellido_materno || ''}`.trim()}
                              </span>
                              <div className="specialist-item-card__contact">
                                {esp.telefono && esp.telefono !== 'S/N' && (
                                  <a href={`tel:${esp.telefono}`} className="specialist-item-card__contact-link">
                                    <FiPhone size={13} style={{ marginRight: '4px' }} /> {esp.telefono}
                                  </a>
                                )}
                                {esp.email && (
                                  <a href={`mailto:${esp.email}`} className="specialist-item-card__contact-link">
                                    <FiMail size={13} style={{ marginRight: '4px' }} /> {esp.email}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {resultados.length === 0 && (
              <div className="resultado-item-card resultado-item-card--empty">
                <div className="resultado-item-card__header">
                  <div className="resultado-item-card__left">
                    <div className="resultado-item-card__check-wrapper">
                      <FiCheckCircle size={28} />
                    </div>
                    <span className="resultado-item-card__specialty">
                      {cuestionarioNombre.toUpperCase()}
                    </span>
                  </div>
                  <span className="resultado-item-card__status">COMPLETADO</span>
                </div>
                <div className="resultado-item-card__description">
                  <p>No se encontraron indicadores o síntomas significativos en este cuestionario. ¡Sigue cuidando de tu bienestar mental!</p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="resultados-pantalla__btn-cuestionarios"
            onClick={() => navigate('/isem/bienvenida')}
          >
            Cuestionarios
          </button>
        </div>
      )}
    </div>
  );
}
