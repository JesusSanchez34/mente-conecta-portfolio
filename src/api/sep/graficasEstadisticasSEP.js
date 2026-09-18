import { BASE_API_SEP_V1 } from '../../utils/constants';

// ==================== GRÁFICAS Y ESTADÍSTICAS SEP ====================

/**
 * Transforma datos de la API al formato esperado por InitialDashboard
 * Maneja dos formatos:
 * 1. Formato correcto (CONASAMA/SEP v2): [{ title: "X", data: [...] }, ...] ← ya está listo
 * 2. Formato simple (SEP v1): [{ Cuestionario: "X", score: 0 }, ...] ← necesita transformación
 */
function transformarDatosGraficas(datosArray) {
  if (!Array.isArray(datosArray) || datosArray.length === 0) {
    return [];
  }

  // Si ya está en formato correcto (con title y data anidado)
  if (datosArray[0]?.title && datosArray[0]?.data) {
    return datosArray;
  }

  // Si es un array de cuestionarios simple (fallback para versión antigua)
  if (datosArray[0]?.Cuestionario && datosArray[0]?.score !== undefined) {
    return datosArray.map(item => ({
      title: item.Cuestionario,
      data: [
        {
          name: item.Cuestionario,
          score: item.score,
          id_cuestionario: item.id_cuestionario
        }
      ]
    }));
  }

  return datosArray;
}

/**
 * Obtiene conteo por nivel de riesgo y categoría para SuperGestor por sede
 */
export async function getConteoPorNivelRiesgoCategoriaBySedeSeP(idSede, token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/ConteoPorNivelRiesgoCategoria/${idSede}/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener conteo por nivel y categoría SEP");
    }
    const data = await response.json();
    return transformarDatosGraficas(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene conteo por nivel de riesgo y categoría para Gestor Admin de su sede
 */
export async function getConteoPorNivelRiesgoCategoriaSeP(token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/ConteoPorNivelRiesgoCategoria/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener conteo por nivel y categoría para admin SEP");
    }
    const data = await response.json();
    return transformarDatosGraficas(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene datos de gráficas por preguntas para SuperGestor por sede
 */
export async function getGraficasPreguntasBySedeSeP(idSede, token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/GraficaPreguntas/${idSede}/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener gráficas de preguntas por sede SEP");
    }
    const data = await response.json();
    return transformarDatosGraficas(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene datos de gráficas por preguntas para Gestor Admin de su sede
 */
export async function getGraficasPreguntasSeP(token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/GraficaPreguntas/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener gráficas de preguntas para admin SEP");
    }
    const data = await response.json();
    return transformarDatosGraficas(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene rango de preguntas para SuperGestor por sede
 */
export async function getRangoDePreguntasBySedeSeP(idSede, token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/getRangoPreguntas/${idSede}/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener rango de preguntas por sede SEP");
    }
    const data = await response.json();
    return transformarDatosGraficas(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene rango de preguntas para Gestor Admin de su sede
 */
export async function getRangoDePreguntasSeP(token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/getRangoPreguntas/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener rango de preguntas para admin SEP");
    }
    const data = await response.json();
    return transformarDatosGraficas(data);
  } catch (error) {
    throw error;
  }
}
