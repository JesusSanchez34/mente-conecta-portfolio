import { useState, useCallback } from 'react';
import { useAuth } from '../useAuth';
import {
  getConteoPorNivelRiesgoCategoriaBySedeSeP as fetchConteoPorSedeSeP,
  getConteoPorNivelRiesgoCategoriaSeP as fetchConteoSeP,
  getGraficasPreguntasBySedeSeP as fetchGraficasBySedeSeP,
  getGraficasPreguntasSeP as fetchGraficasSeP,
  getRangoDePreguntasBySedeSeP as fetchRangoBySedeSeP,
  getRangoDePreguntasSeP as fetchRangoSeP,
} from '../../api/sep';

/**
 * Hook para gráficas y estadísticas en SEP
 * Propósito: Cargar datos para visualización de estadísticas
 * Variantes: Por sede (SuperGestor) o su sede (Gestor Admin)
 */
export function useGraficasSeP() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============= CONTEO POR NIVEL DE RIESGO =============

  /**
   * SuperGestor: Obtiene datos por sede específica
   */
  const getConteoPorNivelRiesgoCategoriaBySedeSeP = useCallback(
    async (idSede) => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchConteoPorSedeSeP(
          idSede,
          auth.token
        );
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  /**
   * Gestor Admin: Obtiene datos de su sede
   */
  const getConteoPorNivelRiesgoCategoriaSeP = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchConteoSeP(auth.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  // ============= GRÁFICAS POR PREGUNTAS =============

  /**
   * SuperGestor: Gráficas por sede específica
   */
  const getGraficasPreguntasBySedeSeP = useCallback(
    async (idSede) => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGraficasBySedeSeP(idSede, auth.token);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  /**
   * Gestor Admin: Gráficas de su sede
   */
  const getGraficasPreguntasSeP = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGraficasSeP(auth.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  // ============= RANGO DE PREGUNTAS =============

  /**
   * SuperGestor: Rango por sede específica
   */
  const getRangoDePreguntasBySedeSeP = useCallback(
    async (idSede) => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRangoBySedeSeP(idSede, auth.token);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  /**
   * Gestor Admin: Rango de su sede
   */
  const getRangoDePreguntasSeP = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRangoSeP(auth.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  return {
    loading,
    error,
    // SuperGestor methods
    getConteoPorNivelRiesgoCategoriaBySedeSeP,
    getGraficasPreguntasBySedeSeP,
    getRangoDePreguntasBySedeSeP,
    // Gestor Admin methods
    getConteoPorNivelRiesgoCategoriaSeP,
    getGraficasPreguntasSeP,
    getRangoDePreguntasSeP,
  };
}
