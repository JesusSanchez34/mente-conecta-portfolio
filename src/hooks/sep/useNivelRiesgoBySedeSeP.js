import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../useAuth';
import {
  getNivelRiesgoBySedeSeP,
  getNivelRiesgoAdminSeP,
} from '../../api/sep';

/**
 * Hook para obtener nivel de riesgo por sede en SEP
 * Propósito: Indicadores de riesgo por sede con caché
 */
export function useNivelRiesgoBySedeSeP() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingBySede, setLoadingBySede] = useState({});
  const [dataBySede, setDataBySede] = useState({});
  const [error, setError] = useState(null);
  const [errorBySede, setErrorBySede] = useState({});
  
  // Usar ref para evitar que getSedeData se recree constantemente
  const cacheRef = useRef({});

  const getSedeData = useCallback(
    async (sedeId) => {
      // Si ya está en caché, retornar directamente sin actualizar estado
      if (cacheRef.current[sedeId]) {
        return cacheRef.current[sedeId];
      }

      try {
        setLoadingBySede((prev) => ({ ...prev, [sedeId]: true }));
        setErrorBySede((prev) => ({ ...prev, [sedeId]: null }));

        const data = await getNivelRiesgoBySedeSeP(sedeId, auth.token);
        
        // Guardar en caché
        cacheRef.current[sedeId] = data;
        // Guardar en estado para disparar re-renders
        setDataBySede((prev) => ({ ...prev, [sedeId]: data }));
        
        return data;
      } catch (err) {
        console.error(`Error al obtener datos de la sede ${sedeId}:`, err);
        setErrorBySede((prev) => ({ ...prev, [sedeId]: err.message }));
        throw err;
      } finally {
        setLoadingBySede((prev) => ({ ...prev, [sedeId]: false }));
      }
    },
    [auth.token]
  );

  const getAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNivelRiesgoAdminSeP(auth.token);
      return data;
    } catch (err) {
      console.error('Error al obtener datos de admin:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  return {
    loading,
    loadingBySede,
    dataBySede,
    error,
    errorBySede,
    getSedeData,
    getAdminData,
  };
}
