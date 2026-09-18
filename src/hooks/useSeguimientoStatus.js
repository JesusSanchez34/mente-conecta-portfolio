/**
 * useSeguimientoStatus.js — src/hooks/
 * ============================================================
 * Hook personalizado que gestiona el estado de completitud de
 * los cuestionarios de seguimiento (derivados).
 * ============================================================
 */

import { useState, useEffect, useCallback } from 'react';
import {
  obtenerCuestionarioPorId,
  obtenerRespuestasUsuario,
} from '../api/isem/cuestionarios';

/**
 * @param {Array}  cuestionariosDeriados  - Array del backend [{ cuestionario_id, ... }]
 * @param {number} idUsuario              - ID del usuario autenticado
 * @param {string} token                  - Token JWT
 */
export function useSeguimientoStatus(cuestionariosDeriados, idUsuario, token) {
  const [cuestionarios, setCuestionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. EL TRUCO: Convertimos el arreglo a texto para detener el bucle infinito
  const derivadosString = JSON.stringify(cuestionariosDeriados);

  const fetchStatus = useCallback(async () => {
    // Guardia: no hacer nada si faltan datos esenciales
    if (!cuestionariosDeriados?.length || !idUsuario || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Para cada cuestionario derivado obtenemos en paralelo:
      // 1. Metadatos (título)
      // 2. Respuestas del usuario (para saber si está completado)
      const resultados = await Promise.allSettled(
        cuestionariosDeriados.map(async (item) => {
          const id = item.cuestionario_id;

          const [meta, respuesta] = await Promise.allSettled([
            obtenerCuestionarioPorId(id, token),
            obtenerRespuestasUsuario(
              { id_usuario: idUsuario, id_cuestionario: id, id_parentesco: 0 },
              token
            ),
          ]);

          const titulo =
            meta.status === 'fulfilled' && meta.value?.titulo
              ? meta.value.titulo
              : `Cuestionario ${id}`;

          const descripcion =
            meta.status === 'fulfilled' && meta.value?.descripcion
              ? meta.value.descripcion
              : '';

          const estatus_finalizado =
            meta.status === 'fulfilled' && meta.value?.estatus_finalizado === 1
              ? 1
              : respuesta.status === 'fulfilled' &&
                respuesta.value?.estatus_finalizado === 1
              ? 1
              : 0;

          return {
            ...item,
            id,
            titulo,
            descripcion,
            estatus_finalizado,
          };
        })
      );

      const cuestionariosEnriquecidos = resultados
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);

      setCuestionarios(cuestionariosEnriquecidos);
    } catch (err) {
      console.error('[useSeguimientoStatus] Error al cargar estado:', err);
      setError('No se pudo verificar el estado de los cuestionarios.');
    } finally {
      setLoading(false);
    }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derivadosString, idUsuario, token]); // <--- El comentario va justo arriba de esta línea

  // Ejecutar al montar y cuando cambien las dependencias
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Todos completos si el array tiene elementos y todos tienen estatus 1
  const todosCompletos =
    cuestionarios.length > 0 &&
    cuestionarios.every((c) => c.estatus_finalizado === 1);

  return {
    cuestionarios,
    loading,
    error,
    refetch: fetchStatus,
    todosCompletos,
  };
}