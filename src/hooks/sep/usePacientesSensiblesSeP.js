import { useState, useCallback } from 'react';
import { useAuth } from '../useAuth';
import {
  getPacientesSensiblesSeP,
  marcarAtencionEspecialSeP,
} from '../../api/sep';

/**
 * Hook para monitoreo de pacientes sensibles en SEP
 * Propósito: Listar pacientes identificados en riesgo
 */
export function usePacientesSensiblesSeP() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState(null);

  const getPacientesSensibles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPacientesSensiblesSeP(auth.token);
      setPacientes(data || []);
      return data;
    } catch (err) {
      // No lanzar el error, solo mostrarlo en el estado
      console.error("Error al cargar pacientes sensibles SEP:", err);
      setError(err.message || "Error al obtener pacientes sensibles");
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  const marcarAtencion = useCallback(
    async (idPaciente, data) => {
      try {
        setLoading(true);
        setError(null);
        const response = await marcarAtencionEspecialSeP(
          idPaciente,
          data,
          auth.token
        );
        // Actualizar el paciente en la lista
        setPacientes((prev) =>
          prev.map((p) => (p.id === idPaciente ? response : p))
        );
        return response;
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
    pacientes,
    error,
    getPacientesSensibles,
    marcarAtencion,
  };
}
