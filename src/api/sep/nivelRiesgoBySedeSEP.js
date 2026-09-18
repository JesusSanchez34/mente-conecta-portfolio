import { BASE_API_SEP_V1 } from '../../utils/constants';

// ==================== NIVEL DE RIESGO POR SEDE SEP ====================

/**
 * Obtiene nivel de riesgo para una sede en SEP
 * Cachea resultados por ID de sede
 */
export async function getNivelRiesgoBySedeSeP(idSede, token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/NivelRiesgo/${idSede}/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener nivel de riesgo por sede SEP");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene nivel de riesgo para la sede del gestor admin en SEP
 */
export async function getNivelRiesgoAdminSeP(token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/NivelRiesgo/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener nivel de riesgo para admin SEP");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
