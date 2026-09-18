import { BASE_API_SEP_V1 } from '../../utils/constants';

// ==================== PACIENTES SENSIBLES SEP ====================

/**
 * Obtiene lista de pacientes identificados en riesgo para SEP
 */
export async function getPacientesSensiblesSeP(token) {
  try {
    const url = `${BASE_API_SEP_V1}/paciente2/pacientes/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener pacientes sensibles SEP");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Marca un paciente con atención especial en SEP
 */
export async function marcarAtencionEspecialSeP(idPaciente, data, token) {
  try {
    const url = `${BASE_API_SEP_V1}/paciente2/pacientes/${idPaciente}/`;
    const params = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al marcar atención especial para paciente SEP");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
