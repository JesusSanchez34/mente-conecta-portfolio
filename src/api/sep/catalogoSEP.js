import { BASE_API_SEP_V1 } from '../../utils/constants';

export async function getTiposPacienteSeP(token) {
  try {
    const url = `${BASE_API_SEP_V1}/catalogo/tipo_paciente_opciones/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener tipos de paciente SEP");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}


export async function getHospitalesSeP(token) {
  const url = `${BASE_API_SEP_V1}/catalogo/hospitales/`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await response.json();
}

/**
 * Obtiene opciones de categorías disponibles en SEP
 */
export async function getCategoriesSeP(token) {
  const url = `${BASE_API_SEP_V1}/catalogo/categorias/`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await response.json();
}
