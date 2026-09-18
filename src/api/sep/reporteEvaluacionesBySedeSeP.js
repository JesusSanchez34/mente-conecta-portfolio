import { BASE_API_SEP_V1 } from '../../utils/constants';

// ==================== REPORTES EVALUACIONES POR SEDE SEP ====================

/**
 * Obtiene reportes de evaluaciones para una sede en SEP
 */
export async function getReporteEvaluacionesBySedeSeP(idSede, token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/Reportes/${idSede}/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener reportes evaluaciones por sede SEP");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene reportes de evaluaciones para la sede del gestor admin en SEP
 */
export async function getReporteEvaluacionesAdminSeP(token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/Reportes/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener reportes evaluaciones para admin SEP");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Exporta reportes en formato Excel para SEP
 */
export async function exportReporteSeP(idSede, formato = 'xlsx', token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/ExportarReportes/${idSede}/?formato=${formato}`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al exportar reporte SEP");
    }
    return await response.blob();
  } catch (error) {
    throw error;
  }
}
