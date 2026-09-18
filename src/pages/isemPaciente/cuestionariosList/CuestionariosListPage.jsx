import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';

import { CuestionarioCard } from '../../../components/isemPaciente';
import { ModalExito, ModalInicioCuestionario } from '../../../components/isem/cuestionarios';
import { obtenerCuestionariosPorSeccion, obtenerRespuestasUsuario, obtenerResultados } from '../../../api/isem/cuestionarios';
import { AuthContext } from '../../../context';
import './CuestionariosListPage.css';

/**
 * CuestionariosListPage
 * ============================================================
 * Muestra la lista de cuestionarios de una sección específica.
 *
 * Recibe el ID numérico de la sección desde la URL (:seccionId).
 * Hace fetch a la API para obtener los cuestionarios reales.
 *
 * Al hacer clic en una tarjeta, en lugar de navegar directo:
 * • Si está incompleto: muestra diálogo informativo con descripción antes de comenzar.
 * • Si está completo y genera resultados: muestra diálogo verde con acceso a los resultados.
 * • Si está completo y no genera resultados: muestra diálogo de éxito simple de "Finalizado".
 * ============================================================
 */
export function CuestionariosListPage() {
  const { seccionId } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  // ── Estados principales ───────────────────────────────────
  const [cuestionarios, setCuestionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Estados para Modals (UX similar a Flutter QuickAlert) ──
  const [selectedCuestionario, setSelectedCuestionario] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showExitoResultadosModal, setShowExitoResultadosModal] = useState(false);
  const [showExitoSimpleModal, setShowExitoSimpleModal] = useState(false);
  const [prefetching, setPrefetching] = useState(false);

  // SEO: Título de la pestaña
  useEffect(() => {
    document.title = 'Cuestionarios · ISEM';
    return () => { document.title = 'Mente Conecta'; };
  }, []);

  // ── Fetch cuestionarios de la API ────────────────────────
  useEffect(() => {
    if (!seccionId || !auth?.token) {
      setLoading(false);
      return;
    }

    const fetchCuestionarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await obtenerCuestionariosPorSeccion(seccionId, auth.token);
        const cuestionariosBase = Array.isArray(data) ? data : [];

        if (auth?.me?.id && cuestionariosBase.length > 0) {
          const promesasRespuestas = cuestionariosBase.map((c) =>
            obtenerRespuestasUsuario(
              {
                id_usuario: auth.me.id,
                id_cuestionario: c.id,
                id_parentesco: 0,
              },
              auth.token
            ).catch(() => null)
          );

          const respuestasUsuario = await Promise.all(promesasRespuestas);

          const cuestionariosCompletos = cuestionariosBase.map((cuestionario, index) => {
            const miRespuesta = respuestasUsuario[index];
            return {
              ...cuestionario,
              estatus_finalizado: miRespuesta?.estatus_finalizado === 1 ? 1 : 0,
              respuestas_json: miRespuesta?.respuestas_json,
            };
          });

          setCuestionarios(cuestionariosCompletos);
        } else {
          setCuestionarios(cuestionariosBase);
        }
      } catch (err) {
        console.error('[CuestionariosListPage] Error al cargar cuestionarios:', err);
        setError('No se pudieron cargar los cuestionarios de esta sección.');
      } finally {
        setLoading(false);
      }
    };

    fetchCuestionarios();
  }, [seccionId, auth?.token, auth?.me?.id]);

  // ── Controlador de click en Tarjeta (Gap Analysis UX) ─────
  const handleCardClick = (cuestionario) => {
    setSelectedCuestionario(cuestionario);
    
    if (cuestionario.estatus_finalizado === 1) {
      if (cuestionario.genera_resultados === 1 || cuestionario.genera_resultados_sumatoria === 1) {
        setShowExitoResultadosModal(true);
      } else {
        setShowExitoSimpleModal(true);
      }
    } else {
      setShowInfoModal(true);
    }
  };

  // Acción de comenzar cuestionario (Con efecto pre-loader)
  const handleComenzar = () => {
    setShowInfoModal(false);
    setPrefetching(true);
    
    // Simular pre-carga de preguntas para feedback interactivo
    setTimeout(() => {
      setPrefetching(false);
      navigate(`/isem/cuestionario/${selectedCuestionario.id}`);
    }, 800);
  };

  const handleVerResultados = async () => {
    setShowExitoResultadosModal(false);

    if (selectedCuestionario.respuestas_json) {
      setPrefetching(true);
      try {
        const resultadosBackend = await obtenerResultados(
          selectedCuestionario.respuestas_json,
          auth.token
        );
        const derivados = Array.isArray(resultadosBackend)
          ? resultadosBackend.filter((r) => r.cuestionario_id)
          : [];

        if (derivados.length > 0) {
          navigate('/isem/seguimiento', {
            state: {
              cuestionariosDeriados: derivados,
              seccionId: seccionId,
              showGraveModal: true,
            },
          });
          return;
        }
      } catch (err) {
        console.error('[CuestionariosListPage] Error verificando derivación:', err);
      } finally {
        setPrefetching(false);
      }
    }

    // Si no hay derivación o hubo error, ir a la pantalla de resultados normal
    navigate(`/isem/resultados/${selectedCuestionario.id}`);
  };

  return (
    <div className="cuestionarios-list">
      {/* ── Header ────────────────────────────── */}
      <div className="cuestionarios-list__header">
        <button
          type="button"
          className="cuestionarios-list__back"
          onClick={() => navigate('/isem/bienvenida')}
          id="btn-regresar-bienvenida"
        >
          <FiChevronLeft className="cuestionarios-list__back-icon" />
          Regresar
        </button>
        <h1 className="cuestionarios-list__title">
          Cuestionarios Disponibles
        </h1>
      </div>

      {/* ── Estado de carga (Esqueleto Shimmer Effect en CSS) ── */}
      {loading && (
        <div className="cuestionarios-list__cards">
          {[1, 2, 3].map((n) => (
            <div key={n} className="cuestionario-card-skeleton">
              <div className="cuestionario-card-skeleton__title"></div>
              <div className="cuestionario-card-skeleton__action"></div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ──── */}
      {error && !loading && (
        <div className="cuestionarios-list__error-wrapper">
          <p className="cuestionarios-list__error-text">
            {error}
          </p>
        </div>
      )}

      {/* ── Lista de cuestionarios ────────────── */}
      {!loading && !error && (
        <div className="cuestionarios-list__cards">
          {cuestionarios.map((cuestionario) => (
            <CuestionarioCard
              key={cuestionario.id}
              nombre={cuestionario.titulo || cuestionario.nombre || cuestionario.descripcion}
              completado={cuestionario.estatus_finalizado === 1}
              onClick={() => handleCardClick(cuestionario)}
            />
          ))}
          
          {cuestionarios.length === 0 && (
            <div className="cuestionarios-list__empty">
              <div className="cuestionarios-list__empty-icon">📋</div>
              <p>No se encontraron cuestionarios en esta sección</p>
            </div>
          )}
        </div>
      )}

      {/* ── MODAL INFORMATIVO PREVIO A INICIAR ── */}
      {selectedCuestionario && (
        <ModalInicioCuestionario
          show={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          onComenzar={handleComenzar}
          titulo={selectedCuestionario.titulo}
          descripcion={selectedCuestionario.descripcion}
        />
      )}

      {/* ── MODAL ÉXITO RESULTADOS ── */}
      {selectedCuestionario && (
        <ModalExito
          show={showExitoResultadosModal}
          onVerResultados={handleVerResultados}
          generaResultados={true}
        />
      )}

      {/* ── MODAL ÉXITO SIMPLE ── */}
      {selectedCuestionario && (
        <ModalExito
          show={showExitoSimpleModal}
          onAceptar={() => setShowExitoSimpleModal(false)}
          generaResultados={false}
        />
      )}

      {/* ── OVERLAY DE PRE-LOADER FLUTTER (QuickAlert.loading paridad) ── */}
      {prefetching && (
        <div className="qalert-loading-overlay">
          <div className="qalert-loading-box">
            <div className="qalert-loading-header">
              <div className="qalert-loading-dots">
                <span className="dot dot--1"></span>
                <span className="dot dot--2"></span>
                <span className="dot dot--3"></span>
                <span className="dot dot--4"></span>
              </div>
            </div>
            <div className="qalert-loading-body">
              <h3>Cargando preguntas</h3>
              <p>...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}