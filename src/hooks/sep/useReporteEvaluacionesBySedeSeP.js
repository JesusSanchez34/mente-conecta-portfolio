import { useState, useCallback } from 'react';
import { useAuth } from '../useAuth';
import {
  getReporteEvaluacionesBySedeSeP,
  getReporteEvaluacionesAdminSeP,
  exportReporteSeP,
} from '../../api/sep';

/**
 * Hook para reportes de evaluaciones en SEP
 * Propósito: Reportes por sede con caché
 */
export function useReporteEvaluacionesBySedeSeP() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingBySede, setLoadingBySede] = useState({});
  const [dataBySede, setDataBySede] = useState({});
  const [error, setError] = useState(null);
  const [errorBySede, setErrorBySede] = useState({});

  const getSedeData = useCallback(
    async (sedeId) => {
      // Retornar del caché si existe
      if (dataBySede[sedeId]) {
        return dataBySede[sedeId];
      }

      try {
        setLoadingBySede((prev) => ({ ...prev, [sedeId]: true }));
        setErrorBySede((prev) => ({ ...prev, [sedeId]: null }));

        const data = await getReporteEvaluacionesBySedeSeP(sedeId, auth.token);
        setDataBySede((prev) => ({ ...prev, [sedeId]: data }));
        return data;
      } catch (err) {
        setErrorBySede((prev) => ({ ...prev, [sedeId]: err.message }));
        throw err;
      } finally {
        setLoadingBySede((prev) => ({ ...prev, [sedeId]: false }));
      }
    },
    [auth.token, dataBySede]
  );

  const getAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReporteEvaluacionesAdminSeP(auth.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  const exportarReporte = useCallback(
    async (idSede, formato = 'xlsx') => {
      try {
        setLoading(true);
        setError(null);
        const blob = await exportReporteSeP(idSede, formato, auth.token);
        // Iniciar descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reporte-sep-${idSede}.${formato}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        return blob;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  return {
    loading,
    loadingBySede,
    dataBySede,
    error,
    errorBySede,
    getSedeData,
    getAdminData,
    exportarReporte,
  };
}
