/**
 * CuestionarioPage.jsx — src/pages/isem/cuestionarios/
 * ============================================================
 * Motor principal del sistema de cuestionarios dinámicos ISEM.
 */

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Button, Spinner } from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';

import { AuthContext } from '../../../context';
import {
  obtenerPreguntas,
  obtenerCuestionarioPorId,
  obtenerRespuestasUsuario,
  guardarRespuestas,
  modificarRespuestas,
} from '../../../api/isem/cuestionarios';
import {
  PreguntaItem,
  PaginadorSecciones,
  ModalAdvertencia,
  ModalInstrucciones,
  ModalExito,
  ModalConfirmarSalida,
} from '../../../components/isem/cuestionarios';
import { obtenerResultados } from '../../../api/isem/cuestionarios';

import './CuestionarioPage.css';

// ─── Constantes ───────────────────────────────────────────────
const PREGUNTAS_POR_PAGINA = 10;

// ─── Helpers ──────────────────────────────────────────────────
function getEncuestador() {
  const tipo = sessionStorage.getItem('tipoRealizador');
  return tipo === 'encuestador' ? 1 : 0;
}

function buildInitialValues(preguntas, respuestasPrevias) {
  const values = {};
  preguntas.forEach((p) => {
    const key = `pregunta_${p.id}`;
    values[key] = '';
    if (p.especificar_respuesta) {
      values[`${key}_text`] = '';
    }
  });

  if (!respuestasPrevias) return values;

  try {
    const parsed = JSON.parse(respuestasPrevias.respuestas_json || '[]');
    parsed.forEach((resp) => {
      const key = `pregunta_${resp.preguntaId}`;
      if (key in values) {
        const pregunta = preguntas.find((p) => p.id === resp.preguntaId);
        if (pregunta?.opcion_multiple) {
          const prev = values[key];
          const prevIds = prev?.ids || [];
          const prevItems = prev?.items || [];
          values[key] = {
            ids: [...prevIds, resp.respuestaId],
            items: [
              ...prevItems,
              { id: resp.respuestaId, calificacion: resp.calificacion, texto: resp.respuestaMultiOpcion || '' },
            ],
          };
        } else {
          values[key] = { id: resp.respuestaId, calificacion: resp.calificacion, texto: resp.respuestasUser || '' };
        }
        if (`${key}_text` in values) {
          values[`${key}_text`] = resp.respuestasUser || '';
        }
      }
    });
  } catch (e) {
    console.warn('[CuestionarioPage] No se pudieron parsear respuestas previas:', e);
  }
  return values;
}

function serializeRespuestas(values, preguntas) {
  const resultado = [];
  preguntas.forEach((p) => {
    const key = `pregunta_${p.id}`;
    const val = values[key];
    const textVal = values[`${key}_text`] || '';

    if (!val) return;

    if (p.opcion_multiple && val?.ids?.length > 0) {
      val.items.forEach((item) => {
        resultado.push({ ponderacionId: 0, respuestaId: item.id, respuestaMultiOpcion: item.texto, preguntaId: p.id, respuestasUser: '', calificacion: item.calificacion });
      });
    } else if (val?.id !== undefined) {
      resultado.push({ ponderacionId: 0, respuestaId: val.id, respuestaMultiOpcion: '', preguntaId: p.id, respuestasUser: textVal, calificacion: val.calificacion ?? 0 });
    }
  });
  return resultado;
}

// ─── LÓGICA ESTRICTA DE VALIDACIÓN ────────────────────────────
function esPreguntaRespondida(pregunta, valorFormik) {
  if (valorFormik === undefined || valorFormik === null || valorFormik === '') return false;
  
  // Opción múltiple (checkboxes)
  if (pregunta.opcion_multiple) {
    return Array.isArray(valorFormik?.ids) && valorFormik.ids.length > 0;
  }
  
  // Pregunta abierta (sin opciones de respuesta) — basta con que tenga texto
  if (!pregunta.respuestas || pregunta.respuestas.length === 0) {
    if (typeof valorFormik === 'string') return valorFormik.trim() !== '';
    if (valorFormik?.texto) return valorFormik.texto.trim() !== '';
    // id: 0 es un pseudo-id válido para preguntas abiertas
    return valorFormik?.id !== undefined && valorFormik?.id !== null;
  }
  
  // Pregunta cerrada (radio) — debe tener un ID de respuesta seleccionado
  return valorFormik?.id !== undefined && valorFormik?.id !== null;
}

// ─── Componente Principal ─────────────────────────────────────
export function CuestionarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);

  const [preguntas, setPreguntas] = useState([]);
  const [cuestionarioMeta, setCuestionarioMeta] = useState(null);
  const [respuestasPrevias, setRespuestasPrevias] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showInstrucciones, setShowInstrucciones] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showExitoModal, setShowExitoModal] = useState(false);
  const [respuestasGuardadas, setRespuestasGuardadas] = useState(null);

  // ── Estados del flujo de derivación (resultado grave) ──────
  const [cuestionariosDeriados, setCuestionariosDeriados] = useState([]);

  // ── Estados de Intercepción (Confirmación de salida) ──
  const [showConfirmarSalida, setShowConfirmarSalida] = useState(false);

  // MODO SOLO LECTURA: Solo se bloquea si de verdad está en 1
  const esFinalizado = cuestionarioMeta?.estatus_finalizado === 1;

  // Intercepta retroceso del navegador (Botón físico/virtual de atrás)
  useEffect(() => {
    if (esFinalizado) return;

    // Empujar entrada en el historial con la misma URL para interceptar el botón atrás
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      // Re-empujar para mantener al usuario en la página
      window.history.pushState(null, '', window.location.href);
      setShowConfirmarSalida(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [esFinalizado]);

  useEffect(() => {
    if (!id || !auth?.token) return;

    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const [metaResult, preguntasResult, respuestasResult] = await Promise.allSettled([
          obtenerCuestionarioPorId(id, auth.token),
          obtenerPreguntas(id, auth.token),
          auth?.me?.id ? obtenerRespuestasUsuario({ id_usuario: auth.me.id, id_cuestionario: Number(id), id_parentesco: 0 }, auth.token) : Promise.resolve(null),
        ]);

        if (metaResult.status === 'fulfilled' && metaResult.value) {
          setCuestionarioMeta(metaResult.value);
        }

        if (preguntasResult.status === 'rejected') throw preguntasResult.reason;
        const data = preguntasResult.value;
        let preguntasArr = Array.isArray(data) ? data : data?.preguntas ? data.preguntas : [];
        preguntasArr.sort((a, b) => (a.posicion ?? 0) - (b.posicion ?? 0));
        console.log('[DEBUG] Preguntas cargadas:', preguntasArr);
        setPreguntas(preguntasArr);

        if (respuestasResult.status === 'fulfilled' && respuestasResult.value) {
          const previas = respuestasResult.value;
          setRespuestasPrevias(previas);
          if (previas?.estatus_finalizado === 1) {
            setCuestionarioMeta((prev) => ({ ...(prev ?? {}), estatus_finalizado: 1 }));
          }
        }
      } catch (err) {
        setError('No se pudieron cargar las preguntas. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id, auth?.token, auth?.me?.id]);

  const initialValues = useMemo(() => buildInitialValues(preguntas, respuestasPrevias), [preguntas, respuestasPrevias]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const respuestasArr = serializeRespuestas(values, preguntas);
        const respuestasJson = JSON.stringify(respuestasArr);

        // EVALUACIÓN ESTRICTA: Usa nuestra función para saber si TODO está contestado
        const noContestadas = preguntas.filter((p) => !esPreguntaRespondida(p, values[`pregunta_${p.id}`]));
        const todasRespondidas = noContestadas.length === 0;
        
        console.log('[DEBUG] Validación finalizada:', {
          todasRespondidas,
          totalPreguntas: preguntas.length,
          noContestadasCount: noContestadas.length,
          noContestadas: noContestadas.map(p => ({
            id: p.id,
            pregunta: p.pregunta?.substring(0, 60),
            opcion_multiple: p.opcion_multiple,
            tieneRespuestas: (p.respuestas?.length ?? 0) > 0,
            valorActual: values[`pregunta_${p.id}`],
          }))
        });
        const payload = {
          respuestas_json: respuestasJson,
          // 1 si están todas contestadas, 0 si es borrador guardado
          estatus_finalizado: todasRespondidas ? 1 : 0, 
          id_usuario: auth.me.id,
          id_sub_usuario: null,
          id_seccion: cuestionarioMeta?.seccion_id ?? null,
          id_cuestionario: Number(id),
          encuestador: getEncuestador(),
        };

        if (respuestasPrevias?.id) {
          await modificarRespuestas(respuestasPrevias.id, payload, auth.token);
        } else {
          const nuevo = await guardarRespuestas(payload, auth.token);
          setRespuestasPrevias(nuevo);
        }

        if (todasRespondidas) {
          setRespuestasGuardadas(respuestasJson);
          setCuestionarioMeta((prev) => ({ ...(prev ?? {}), estatus_finalizado: 1 }));

          // ── Consultar al backend si hay derivación (arquitectura: Frontend ciego) ──
          // El backend devuelve un array con cuestionario_id cuando detecta resultado grave.
          // Si el array está vacío, el resultado es normal → modal de éxito simple.
          try {
            const resultadosBackend = await obtenerResultados(respuestasJson, auth.token);
            const derivados = Array.isArray(resultadosBackend)
              ? resultadosBackend.filter((r) => r.cuestionario_id)
              : [];

            if (derivados.length > 0) {
              // GRAVE: el backend envió cuestionarios adicionales
              setCuestionariosDeriados(derivados);
              setShowExitoModal(true);
            } else {
              // NORMAL: sin derivación → cuestionario finalizado
              setCuestionariosDeriados([]);
              setShowExitoModal(true);
            }
          } catch (resultadosErr) {
            // Si el cálculo falla, tratamos como resultado normal (fail-safe)
            console.warn('[CuestionarioPage] No se pudo calcular resultado de derivación:', resultadosErr);
            setShowExitoModal(true);
          }
        } else {
          // Mensaje de éxito de borrador
          toast.success('Borrador guardado. Puedes continuar después.', { autoClose: 2500, position: 'top-center' });
        }
        setShowModal(false);
      } catch (err) {
        toast.error(err?.response?.data?.detail || 'Ocurrió un error al guardar. Intenta de nuevo.', { autoClose: 3500, position: 'top-center' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Intercepta salida involuntaria (Cierre de pestaña, refresco, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (esFinalizado) return;

      const hayRespuestas = preguntas.some((p) => esPreguntaRespondida(p, formik.values[`pregunta_${p.id}`]));
      if (hayRespuestas) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro de que deseas salir? Tus respuestas no guardadas se perderán.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [preguntas, formik.values, esFinalizado]);



  const totalPaginas = Math.ceil(preguntas.length / PREGUNTAS_POR_PAGINA);
  const preguntasPagina = preguntas.slice((paginaActual - 1) * PREGUNTAS_POR_PAGINA, paginaActual * PREGUNTAS_POR_PAGINA);

  const handleCambioPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuardar = () => {
    // EVALUACIÓN ESTRICTA para el Modal: Usa la misma función
    const preguntasVacias = preguntas.filter((p) => !esPreguntaRespondida(p, formik.values[`pregunta_${p.id}`]));

    console.log('[DEBUG handleGuardar]', {
      totalPreguntas: preguntas.length,
      respondidas: preguntas.length - preguntasVacias.length,
      sinResponder: preguntasVacias.length,
      preguntasVacias: preguntasVacias.map(p => ({
        id: p.id,
        pregunta: p.pregunta?.substring(0, 50),
        opcion_multiple: p.opcion_multiple,
        tieneRespuestas: (p.respuestas?.length ?? 0) > 0,
        valorFormik: formik.values[`pregunta_${p.id}`],
      })),
    });

    if (preguntasVacias.length > 0) {
      setShowModal(true);
    } else {
      formik.submitForm();
    }
  };

  const handleConfirmarModal = () => {
    setShowModal(false);
    formik.submitForm();
  };

  if (loading) {
    return (
      <div className="cuestionario-page__wrapper">
        <div className="cuestionario-page__center-box">
          <Spinner
            animation="border"
            className="cuestionario-page__loading-spinner"
          />
          <p className="cuestionario-page__loading-text">Cargando cuestionario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cuestionario-page__wrapper">
        <div className="cuestionario-page__center-box">
          <p className="cuestionario-page__error-text">{error}</p>
          <Button
            onClick={() => navigate(-1)}
            className="cuestionario-page__back-btn-loading"
          >
            Regresar
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cuestionario-page__wrapper">
      <header className="cuestionario-page__header">
        <h1 className="cuestionario-page__header-title">Preguntas</h1>
        <button
          type="button"
          onClick={() => setShowInstrucciones(true)}
          className="cuestionario-page__btn-instrucciones"
        >
          <FaInfoCircle size={14} style={{ color: '#a3395c' }} />
          <span style={{ color: '#a3395c' }}>Instrucciones</span>
        </button>
      </header>

      <main className="cuestionario-page__content">
        {esFinalizado && (
          <div className="cuestionario-page__readonly-banner">
            ✅ Este cuestionario ya fue completado. Solo lectura.
          </div>
        )}
        
        {totalPaginas > 1 && (
          <PaginadorSecciones
            total={totalPaginas}
            actual={paginaActual}
            onChange={handleCambioPagina}
          />
        )}
        
        <form onSubmit={formik.handleSubmit} noValidate>
          {preguntasPagina.map((pregunta, index) => (
            <PreguntaItem
              key={pregunta.id}
              pregunta={pregunta}
              index={(paginaActual - 1) * PREGUNTAS_POR_PAGINA + index}
              values={formik.values}
              setFieldValue={formik.setFieldValue}
              disabled={esFinalizado}
            />
          ))}
        </form>
        <div className="cuestionario-page__spacer" />
      </main>

      <footer className="cuestionario-page__footer">
        <div className="cuestionario-page__footer-inner">
          {totalPaginas > 1 && (
            <PaginadorSecciones
              total={totalPaginas}
              actual={paginaActual}
              onChange={handleCambioPagina}
            />
          )}
          {!esFinalizado && (
            <Button
              type="button"
              onClick={handleGuardar}
              disabled={submitting}
              className="cuestionario-page__btn-enviar"
            >
              {submitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{ marginRight: 8 }}
                  />
                  Guardando...
                </>
              ) : (
                'Guardar / Enviar'
              )}
            </Button>
          )}
        </div>
      </footer>

      <ModalExito
        show={showExitoModal}
        onVerResultados={() => {
          setShowExitoModal(false);
          if (cuestionariosDeriados.length > 0) {
            navigate('/isem/seguimiento', {
              state: {
                cuestionariosDeriados,
                seccionId: cuestionarioMeta?.seccion_id ?? null,
                showGraveModal: true,
              },
            });
          } else {
            navigate(`/isem/resultados/${id}`);
          }
        }}
        onAceptar={() => {
          setShowExitoModal(false);
          const returnTo = location.state?.returnTo;
          if (returnTo) {
            navigate(returnTo, {
              replace: true,
              state: {
                cuestionariosDeriados: location.state?.cuestionariosDeriados,
                seccionId: location.state?.seccionId,
              },
            });
          } else {
            navigate(-1);
          }
        }}
        generaResultados={cuestionarioMeta?.genera_resultados === 1 || cuestionarioMeta?.genera_resultados_sumatoria === 1}
        isSeguimiento={location.state?.returnTo === '/isem/seguimiento'}
      />

      <ModalAdvertencia
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmarModal}
      />

      <ModalInstrucciones
        show={showInstrucciones}
        onClose={() => setShowInstrucciones(false)}
        instrucciones={cuestionarioMeta?.instrucciones}
      />

      <ModalConfirmarSalida
        show={showConfirmarSalida}
        onClose={() => setShowConfirmarSalida(false)}
        onConfirm={() => {
          setShowConfirmarSalida(false);
          // Si el cuestionario fue abierto desde la sala de espera,
          // regresar allí con el state completo para no perder los datos.
          const returnTo = location.state?.returnTo;
          if (returnTo) {
            navigate(returnTo, {
              replace: true,
              state: {
                cuestionariosDeriados: location.state?.cuestionariosDeriados,
                seccionId: location.state?.seccionId,
              },
            });
          } else {
            const secId = cuestionarioMeta?.seccion_id;
            navigate(
              secId ? `/isem/cuestionarios/${secId}` : '/isem/bienvenida',
              { replace: true }
            );
          }
        }}
      />
    </div>
  );
}