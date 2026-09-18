/**
 * cuestionarios.js — src/api/isem/cuestionarios.js
 * ============================================================
 * Servicio HTTP para el motor de cuestionarios ISEM.
 * Actualizado para usar Fetch API en peticiones GET conflictivas
 * con DevTunnels, manteniendo Axios para POST/PUT.
 * ============================================================
 */

import axios from 'axios';
import { BASE_API } from '../../utils/constants';

// ─── TRUCO PARA LA DIAGONAL ──────────────────────────────────
// Nos aseguramos de que la URL base SIEMPRE termine con '/'
const API_URL = BASE_API.endsWith('/') ? BASE_API : `${BASE_API}/`;

// ─── INSTANCIA AXIOS (Para POST y PUT) ───────────────────────
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, 
  headers: { 'Content-Type': 'application/json' },
});

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

// Helper para construir el Header de Fetch
const fetchHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'X-Tunnel-Skip-AntiPhishing-Page': 'true' 
});


// ─── CUESTIONARIOS ────────────────────────────────────────────

export async function obtenerCuestionariosPorSeccion(seccionId, token) {
  const response = await fetch(`${API_URL}cuestionario/cuestionario/obtenerCuestionarioPorSeccionId/${seccionId}/`, {
    method: 'GET',
    headers: fetchHeaders(token)
  });
  
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return await response.json();
}

export async function obtenerCuestionarioPorId(id, token) {
  const response = await fetch(`${API_URL}cuestionario/cuestionario/${id}/`, {
    method: 'GET',
    headers: fetchHeaders(token)
  });
  
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return await response.json();
}


// ─── PREGUNTAS ────────────────────────────────────────────────

export async function obtenerPreguntas(idCuestionario, token) {
  const response = await fetch(`${API_URL}cuestionario/cuestionario/obtenerPreguntas/${idCuestionario}/`, {
    method: 'GET',
    headers: fetchHeaders(token)
  });
  
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return await response.json();
}


// ─── RESPUESTAS DEL USUARIO (POST/PUT) ────────────────────────

export async function obtenerRespuestasUsuario(body, token) {
  try {
    const { data } = await api.post(
      'user/usuariorespuestas/obtener/',
      body,
      { headers: authHeader(token) }
    );
    if (!data || (Array.isArray(data) && data.length === 0)) return null;
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

export async function guardarRespuestas(body, token) {
  const { data } = await api.post(
    'user/usuariorespuestas/',
    body,
    { headers: authHeader(token) }
  );
  return data;
}

export async function modificarRespuestas(idRespuesta, body, token) {
  const { data } = await api.put(
    `user/usuariorespuestas/${idRespuesta}/`,
    body,
    { headers: authHeader(token) }
  );
  return data;
}


// ─── RESULTADOS ───────────────────────────────────────────────

export async function obtenerResultados(respuestasJson, token) {
  const preguntasPayload = typeof respuestasJson === 'string' 
    ? respuestasJson 
    : JSON.stringify(respuestasJson);

  const { data } = await api.post(
    'user/usuariorespuestas/especialista/',
    { preguntas: preguntasPayload },
    { headers: authHeader(token) }
  );
  return data;
}


// ─── SECCIONES ────────────────────────────────────────────────

export async function obtenerSecciones(edad, token) {
  const response = await fetch(`${API_URL}cuestionario/seccion/?edad=${edad}`, {
    method: 'GET',
    headers: fetchHeaders(token)
  });
  
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return await response.json();
}