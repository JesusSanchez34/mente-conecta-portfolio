const BASE_URL = process.env.REACT_APP_BASE_URL_SEP_V1 + "/";
const NOTICIAS_TIMEOUT_MS = 10000;

const fetchNoticias = async (url, options) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NOTICIAS_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

// ── Perfil ───────────────────────────────────────────────────

/**
 * Obtiene los datos del paciente autenticado
 */
export async function obtenerPerfil(token) {
  const response = await fetch(`${BASE_URL}paciente2/pacientes/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al cargar los datos del usuario");
  }

  const data = await response.json();
  return data[0]; // devuelve el primer paciente
}

/**
 * Actualiza email del usuario
 */
export async function actualizarPerfil(token, usuarioId, email) {
  const response = await fetch(
    `${BASE_URL}paciente/paciente/ActualizarDatosUsuario/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usuario_id: usuarioId,
        email: email,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Error al guardar los cambios");
  }

  return response.status;
}

// ── Noticias ─────────────────────────────────────────────────

/**
 * Obtiene la lista de noticias
 */
export async function obtenerNoticias(token) {
  const response = await fetchNoticias(`${BASE_URL}catalogo/noticias/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar las noticias");
  }

  return response.json();
}

/**
 * Obtiene el detalle de una noticia
 */
export async function obtenerNoticia(token, id) {
  const response = await fetchNoticias(`${BASE_URL}catalogo/noticias/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al cargar la noticia");
  }

  return response.json();
}
