import { BASE_API_SEP_V1 } from '../../utils/constants';

// ==================== GESTORES SEP ====================

/**
 * Obtiene la lista de gestores registrados en SEP
 * Solo SuperGestores pueden acceder
 */
export async function getGestoresSeP(token) {
  try {
    const url = `${BASE_API_SEP_V1}/Super-Gestores/gestores/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener la lista de gestores SEP");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Registra un nuevo gestor en SEP
 */
export async function registerGestorSeP(data, token) {
  try {
    const url = `${BASE_API_SEP_V1}/Super-Gestores/gestores/`;
    const params = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, params);
    if (response.status !== 201) {
      throw new Error("Error al registrar gestor SEP");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene conteo por nivel de riesgo para SuperGestor por sede
 */
/**
 * Obtiene conteo por nivel de riesgo para SuperGestor por sede
 */
export async function getConteoNivelRiesgoSePBySedeApi(id, token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/ConteoPorNivelRiesgo/${id}/`;

    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);

    if (response.status !== 200) {
      throw new Error("Error al obtener conteo por nivel de riesgo SEP");
    }

    let result = await response.json();

    // Si la respuesta está vacía, retornar estructura de cuestionarios con score 0
    if (!result || (Array.isArray(result) && result.length === 0)) {
      result = [
        { id_cuestionario: 1, Cuestionario: "Alcohol", score: 0 },
        { id_cuestionario: 2, Cuestionario: "Ansiedad", score: 0 },
        { id_cuestionario: 3, Cuestionario: "Conducta Alimentaria", score: 0 },
        { id_cuestionario: 4, Cuestionario: "Depresión", score: 0 },
        { id_cuestionario: 5, Cuestionario: "Drogas", score: 0 },
        { id_cuestionario: 6, Cuestionario: "Riesgo de Suicidio", score: 0 },
        { id_cuestionario: 7, Cuestionario: "Tabaco", score: 0 },
      ];
    }

    return result;
  } catch (error) {
    console.error("[getConteoNivelRiesgoSePBySedeApi] Error:", error);
    // En caso de error, retornar estructura de cuestionarios con score 0
    return [
      { id_cuestionario: 1, Cuestionario: "Alcohol", score: 0 },
      { id_cuestionario: 2, Cuestionario: "Ansiedad", score: 0 },
      { id_cuestionario: 3, Cuestionario: "Conducta Alimentaria", score: 0 },
      { id_cuestionario: 4, Cuestionario: "Depresión", score: 0 },
      { id_cuestionario: 5, Cuestionario: "Drogas", score: 0 },
      { id_cuestionario: 6, Cuestionario: "Riesgo de Suicidio", score: 0 },
      { id_cuestionario: 7, Cuestionario: "Tabaco", score: 0 },
    ];
  }
}

/**
 * Obtiene conteo por nivel de riesgo para Gestor Admin de su sede
 */
export async function getConteoNivelRiesgoSePAdminApi(token) {
  try {
    const url = `${BASE_API_SEP_V1}/dashboard/Dashbord_Admin/ConteoPorNivelRiesgo/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);

    if (response.status !== 200) {
      throw new Error("Error al obtener conteo por nivel de riesgo para admin SEP");
    }

    let result = await response.json();

    // Si la respuesta está vacía, retornar estructura de cuestionarios con score 0
    if (!result || (Array.isArray(result) && result.length === 0)) {
      result = [
        { id_cuestionario: 1, Cuestionario: "Alcohol", score: 0 },
        { id_cuestionario: 2, Cuestionario: "Ansiedad", score: 0 },
        { id_cuestionario: 3, Cuestionario: "Conducta Alimentaria", score: 0 },
        { id_cuestionario: 4, Cuestionario: "Depresión", score: 0 },
        { id_cuestionario: 5, Cuestionario: "Drogas", score: 0 },
        { id_cuestionario: 6, Cuestionario: "Riesgo de Suicidio", score: 0 },
        { id_cuestionario: 7, Cuestionario: "Tabaco", score: 0 },
      ];
    }

    return result;
  } catch (error) {
    console.error("[getConteoNivelRiesgoSePAdminApi] Error:", error);
    // En caso de error, retornar estructura de cuestionarios con score 0
    return [
      { id_cuestionario: 1, Cuestionario: "Alcohol", score: 0 },
      { id_cuestionario: 2, Cuestionario: "Ansiedad", score: 0 },
      { id_cuestionario: 3, Cuestionario: "Conducta Alimentaria", score: 0 },
      { id_cuestionario: 4, Cuestionario: "Depresión", score: 0 },
      { id_cuestionario: 5, Cuestionario: "Drogas", score: 0 },
      { id_cuestionario: 6, Cuestionario: "Riesgo de Suicidio", score: 0 },
      { id_cuestionario: 7, Cuestionario: "Tabaco", score: 0 },
    ];
  }
}
export async function getPaisApi() {
  try {
    const url = `${BASE_API_SEP_V1}/catalogo/pais/`
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();
    if (response.status !== 200) {
      throw new Error(result.message || "Error al obtener datos de pais");
    }
    return result;
  }
  catch (error) {
    throw error;
  }
}
export async function getEstadosByPaisApi(idPais) {
  try {
    const url = `${BASE_API_SEP_V1}/catalogo/estado/bypais/${idPais}/`
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();
    if (response.status !== 200) {
      throw new Error(result.message || "Error al obtener datos de pais");
    }
    return result;
  }
  catch (error) {
    throw error;
  }
}
export async function getCiudadesByEstadoApi(idEstado) {
  try {
    const url = `${BASE_API_SEP_V1}/catalogo/ciudad/byestado/${idEstado}/`
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, params);
    const result = await response.json();
    if (response.status !== 200) {
      throw new Error(result.message || "Error al obtener datos de pais");
    }
    return result;
  }
  catch (error) {
    throw error;
  }
}