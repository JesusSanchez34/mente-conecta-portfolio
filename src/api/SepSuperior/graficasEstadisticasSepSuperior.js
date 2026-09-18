import { BASE_API_SEP_SUPERIOR_V1 } from '../../utils/constants';

function transformarDatosGraficas(datosArray) {
  if (!Array.isArray(datosArray) || datosArray.length === 0) return [];
  if (datosArray[0]?.title && datosArray[0]?.data) return datosArray;
  if (datosArray[0]?.Cuestionario && datosArray[0]?.score !== undefined) {
    return datosArray.map(item => ({
      title: item.Cuestionario,
      data: [{ name: item.Cuestionario, score: item.score, id_cuestionario: item.id_cuestionario }]
    }));
  }
  return datosArray;
}

export async function getConteoPorNivelRiesgoCategoriaBySedeSePS(idSede, token) {
  try {
    const url = `${BASE_API_SEP_SUPERIOR_V1}/dashboard/Dashbord_Admin/ConteoPorNivelRiesgoCategoria/${idSede}/`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (response.status !== 200) throw new Error("Error al obtener conteo SEP Superior");
    const data = await response.json();
    return transformarDatosGraficas(data);
  } catch (error) {
    throw error;
  }
}

export async function getGraficasPreguntasBySedeSePS(idSede, token) {
  try {
    const url = `${BASE_API_SEP_SUPERIOR_V1}/dashboard/Dashbord_Admin/GraficaPreguntas/${idSede}/`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (response.status !== 200) throw new Error("Error al obtener gráficas SEP Superior");
    const data = await response.json();
    return transformarDatosGraficas(data);
  } catch (error) {
    throw error;
  }
}

export async function getRangoDePreguntasBySedeSePS(idSede, token) {
  try {
    const url = `${BASE_API_SEP_SUPERIOR_V1}/dashboard/Dashbord_Admin/getRangoPreguntas/${idSede}/`;
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (response.status !== 200) throw new Error("Error al obtener rango SEP Superior");
    const data = await response.json();
    return transformarDatosGraficas(data);
  } catch (error) {
    throw error;
  }
}