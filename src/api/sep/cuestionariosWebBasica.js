import { BASE_API_SEP_V1 } from "../../utils/constants";

function buildSepUrl(endpoint) {
  if (!BASE_API_SEP_V1) {
    throw new Error("No esta configurada la URL base SEP.");
  }

  return `${BASE_API_SEP_V1.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
}

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.detail ||
        data?.error ||
        `Error de API SEP (${response.status})`,
    );
  }

  return data;
}

export async function obtenerSeccionesCuestionarios(token, edad = 1) {
  return fetchJson(buildSepUrl(`cuestionario/seccion/?edad=${edad}`), {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function obtenerCuestionariosPorSeccion(token, idSeccion) {
  return fetchJson(
    buildSepUrl(
      `cuestionario/cuestionario/obtenerCuestionarioPorSeccionId/${idSeccion}/`,
    ),
    {
      method: "GET",
      headers: authHeaders(token),
    },
  );
}

export async function obtenerPreguntasCuestionario(token, idCuestionario) {
  return fetchJson(
    buildSepUrl(
      `cuestionario/cuestionario/obtenerPreguntas/${idCuestionario}/`,
    ),
    {
      method: "GET",
      headers: authHeaders(token),
    },
  );
}

export async function obtenerRespuestasUsuario(
  token,
  { idUsuario, idCuestionario, idParentesco = 0 },
) {
  const data = await fetchJson(buildSepUrl("user/usuariorespuestas/obtener/"), {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      id_usuario: idUsuario,
      id_cuestionario: idCuestionario,
      id_parentesco: idParentesco,
    }),
  });

  return data || {
    respuestas_json: "",
    id_usuario_id: 0,
    id_cuestionario_id: 0,
  };
}

export async function guardarRespuestasUsuario(
  token,
  respuestasUsuario,
  encuestador = 0,
) {
  return fetchJson(buildSepUrl("user/usuariorespuestas/"), {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      ...respuestasUsuario,
      encuestador,
    }),
  });
}

export async function modificarRespuestasUsuario(
  token,
  idRespuesta,
  respuestasUsuario,
) {
  return fetchJson(buildSepUrl(`user/usuariorespuestas/${idRespuesta}/`), {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(respuestasUsuario),
  });
}

export async function actualizarDatosPaciente(token, respuestasRegistro) {
  return fetchJson(
    buildSepUrl("paciente/paciente/actualizarDatosPaciente/"),
    {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(respuestasRegistro),
    },
  );
}

export async function verificarInstruccionesSeccion(usuarioId, seccionId) {
  return fetchJson(
    buildSepUrl(
      `paciente/paciente/verificar_instrucciones/?usuario_id=${usuarioId}&seccion_id=${seccionId}`,
    ),
    { method: "GET" },
  );
}

export async function aceptarInstruccionesSeccion(usuarioId, seccionId) {
  return fetchJson(buildSepUrl("paciente/paciente/checkbox_instrucciones/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario_id: usuarioId,
      status_instrucciones: true,
      seccion_id: seccionId,
    }),
  });
}
