/**
 * CuestionariosSeguimientoPage.jsx
 * ============================================================
 * "Sala de espera" — Pantalla que muestra los cuestionarios
 * derivados que el backend solicitó completar tras detectar
 * un resultado de riesgo.
 *
 * Recibe via location.state:
 *   cuestionariosDeriados  — Array [{ cuestionario_id, ... }]
 *   seccionId              — ID de la sección original (para
 *                            el botón de regreso si aplica)
 *
 * Comportamiento:
 *   - Los cuestionarios se pueden contestar en CUALQUIER orden.
 *   - El botón "Ver Resultados" permanece disabled hasta que
 *     TODOS tienen estatus_finalizado === 1.
 *   - Al regresar de un cuestionario individual, se hace
 *     refetch automático del estado.
 * ============================================================
 */

import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiCheck, FiClock } from 'react-icons/fi';
import { Spinner } from 'react-bootstrap';
import { ModalResultadoGrave, ModalInicioCuestionario, ModalExito } from '../../../components/isem/cuestionarios';

import { AuthContext } from '../../../context';
import { useSeguimientoStatus } from '../../../hooks/useSeguimientoStatus';
import './CuestionariosSeguimientoPage.css';

export function CuestionariosSeguimientoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);

  // ── Datos recibidos del flujo previo ────────────────────────
  const cuestionariosDeriadosRaw = location.state?.cuestionariosDeriados ?? [];
  // Aseguramos que no haya cuestionarios duplicados por el mismo id
  const cuestionariosDeriados = cuestionariosDeriadosRaw.filter(
    (v, i, a) => a.findIndex((t) => t.cuestionario_id === v.cuestionario_id) === i
  );
  const seccionId = location.state?.seccionId ?? null;

  // ── Estado del modal grave ──────────────────────────────────
  const [showModalGrave, setShowModalGrave] = useState(location.state?.showGraveModal ?? false);

  // ── Estados para modal de inicio de cuestionario ────────────
  const [selectedCuestionario, setSelectedCuestionario] = useState(null);
  const [showInicioModal, setShowInicioModal] = useState(false);
  const [showExitoModal, setShowExitoModal] = useState(false);

  // ── Hook: gestiona estado de completitud en paralelo ────────
  const { cuestionarios, loading, error, refetch, todosCompletos } =
    useSeguimientoStatus(cuestionariosDeriados, auth?.me?.id, auth?.token);

  // SEO: Título de la pestaña
  useEffect(() => {
    document.title = 'Cuestionarios de seguimiento · ISEM';
    return () => { document.title = 'Mente Conecta'; };
  }, []);

  // Refetch cuando el usuario regresa a esta página (ej. después de completar un cuestionario)
  useEffect(() => {
    const handleFocus = () => { refetch(); };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  // ── Guardia: si llegó sin datos, redirigir ──────────────────
  useEffect(() => {
    if (!cuestionariosDeriados.length) {
      navigate('/isem/bienvenida', { replace: true });
    }
  }, [cuestionariosDeriados.length, navigate]);

  // ── Handlers ────────────────────────────────────────────────

  /** Al hacer clic en una tarjeta: mostrar modal de inicio o el de éxito si ya está completo */
  const handleCardClick = (cuestionario) => {
    setSelectedCuestionario(cuestionario);
    const completado = cuestionario.estatus_finalizado === 1;
    if (!completado) {
      setShowInicioModal(true);
    } else {
      setShowExitoModal(true);
    }
  };

  const handleComenzar = () => {
    setShowInicioModal(false);
    if (selectedCuestionario) {
      navigate(`/isem/cuestionario/${selectedCuestionario.id}`, {
        state: {
          returnTo: '/isem/seguimiento',
          cuestionariosDeriados,
          seccionId,
        },
      });
    }
  };

  /** Ver resultados consolidados de todos los cuestionarios completados */
  const handleVerResultados = () => {
    navigate('/isem/resultados-consolidados', {
      state: {
        cuestionariosDeriados: cuestionarios,
        seccionId,
      },
    });
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="seguimiento-page">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="seguimiento-page__header">
        <button
          type="button"
          id="btn-seguimiento-regresar"
          className="seguimiento-page__back"
          onClick={() =>
            navigate(seccionId ? `/isem/cuestionarios/${seccionId}` : '/isem/bienvenida')
          }
        >
          <FiChevronLeft className="seguimiento-page__back-icon" />
          Regresar
        </button>
        <h1 className="seguimiento-page__title">Cuestionarios Resultados</h1>
      </div>

      {/* ── Estado de carga ─────────────────────────────────── */}
      {loading && (
        <div className="seguimiento-page__loading">
          <Spinner animation="border" className="seguimiento-page__spinner" />
          <p className="seguimiento-page__loading-text">
            Verificando cuestionarios...
          </p>
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────── */}
      {error && !loading && (
        <div className="seguimiento-page__error">
          <p className="seguimiento-page__error-text">{error}</p>
          <button
            type="button"
            className="seguimiento-page__btn-retry"
            onClick={refetch}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── Lista de cuestionarios derivados ────────────────── */}
      {!loading && !error && (
        <>
          <div className="seguimiento-page__cards">
            {cuestionarios.map((cuestionario) => {
              const completado = cuestionario.estatus_finalizado === 1;
              return (
                <button
                  key={cuestionario.id}
                  type="button"
                  id={`btn-seguimiento-cuestionario-${cuestionario.id}`}
                  className={`seguimiento-card ${completado ? 'seguimiento-card--completed' : ''}`}
                  onClick={() => handleCardClick(cuestionario)}
                  aria-label={
                    completado
                      ? `${cuestionario.titulo} - Completado`
                      : `Realizar ${cuestionario.titulo}`
                  }
                >
                  <span className="seguimiento-card__nombre">
                    {cuestionario.titulo?.toUpperCase()}
                  </span>

                  <div className="seguimiento-card__action">
                    <div className="seguimiento-card__icon-wrapper">
                      {completado
                        ? <FiCheck size={18} className="seguimiento-card__icon--check" />
                        : <FiClock size={18} className="seguimiento-card__icon--pending" />
                      }
                    </div>
                    <span className="seguimiento-card__action-text">
                      {completado ? 'COMPLETO' : 'REALIZAR'}
                    </span>
                  </div>
                </button>
              );
            })}

            {cuestionarios.length === 0 && (
              <div className="seguimiento-page__empty">
                <p>No se encontraron cuestionarios de seguimiento.</p>
              </div>
            )}
          </div>

          {/* ── Botón Ver Resultados (bloqueado hasta completar todos) ─ */}
          <div className="seguimiento-page__footer">
            <button
              type="button"
              id="btn-seguimiento-ver-resultados"
              className="seguimiento-page__btn-resultados"
              disabled={!todosCompletos}
              onClick={handleVerResultados}
              title={
                todosCompletos
                  ? 'Ver resultados consolidados'
                  : 'Completa todos los cuestionarios para continuar'
              }
            >
              Ver Resultados
            </button>

            {!todosCompletos && (
              <p className="seguimiento-page__hint">
                Completa todos los cuestionarios para habilitar los resultados
              </p>
            )}
          </div>
        </>
      )}

      {/* ── Modal de Resultado Grave (derivación del backend) ────── */}
      <ModalResultadoGrave
        show={showModalGrave}
        onOkay={() => setShowModalGrave(false)}
      />

      {/* ── Modal de Inicio de Cuestionario ──────────────────────── */}
      {selectedCuestionario && (
        <ModalInicioCuestionario
          show={showInicioModal}
          onClose={() => setShowInicioModal(false)}
          onComenzar={handleComenzar}
          titulo={selectedCuestionario.titulo}
          descripcion={selectedCuestionario.descripcion}
        />
      )}

      {/* ── Modal de Éxito de Seguimiento ── */}
      {selectedCuestionario && (
        <ModalExito
          show={showExitoModal}
          onAceptar={() => setShowExitoModal(false)}
          isSeguimiento={true}
        />
      )}
    </div>
  );
}
