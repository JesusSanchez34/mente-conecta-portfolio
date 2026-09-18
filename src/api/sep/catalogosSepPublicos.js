import { BASE_API_SEP_V1 } from '../../utils/constants';

const DEFAULT_ENDPOINTS = {
  paises: '/catalogo/pais/',
  estados: '/catalogo/estado/bypais/:paisId/',
  ciudades: '/catalogo/ciudad/byestado/:estadoId/',
  sedes: '/catalogo/hospitales/',
};

const ENV_ENDPOINTS = {
  REACT_APP_CAT_PAISES_ENDPOINT: process.env.REACT_APP_CAT_PAISES_ENDPOINT,
  REACT_APP_CAT_ESTADOS_ENDPOINT: process.env.REACT_APP_CAT_ESTADOS_ENDPOINT,
  REACT_APP_CAT_CIUDADES_ENDPOINT: process.env.REACT_APP_CAT_CIUDADES_ENDPOINT,
  REACT_APP_CAT_SEDES_ENDPOINT: process.env.REACT_APP_CAT_SEDES_ENDPOINT,
};

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const normalizeEndpoint = (endpoint, fallback) => {
  const value = endpoint || fallback;
  return value.startsWith('/') ? value : `/${value}`;
};

const getApiBaseUrl = () => {
  const baseUrl = BASE_API_SEP_V1 || process.env.REACT_APP_BASE_URL_SEP_V1;

  if (!baseUrl) {
    throw new Error('No se encontrÃ³ la URL base del API SEP.');
  }

  return trimTrailingSlash(baseUrl);
};

const getEndpoint = (envName, fallback, replacements = {}) => {
  let endpoint = normalizeEndpoint(ENV_ENDPOINTS[envName], fallback);
  const hadPathParams = Object.keys(replacements).some((key) => endpoint.includes(`:${key}`));

  Object.entries(replacements).forEach(([key, value]) => {
    endpoint = endpoint.replace(`:${key}`, encodeURIComponent(value));
  });

  return { endpoint, hadPathParams };
};

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${getApiBaseUrl()}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const normalizeCatalogItem = (item) => ({
  id: item.id,
  label: item.descripcion || item.nombre || item.name || String(item.id),
  raw: item,
});

const getCatalogList = (data) => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];

  const candidates = [
    data.results,
    data.data,
    data.items,
    data.respuesta,
    data.response,
    data.catalogo,
    data.catalogos,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === 'object') {
      const nested = getCatalogList(candidate);
      if (nested.length) return nested;
    }
  }

  return [];
};

const normalizeCatalogResponse = (data) => {
  const list = getCatalogList(data);

  return list
    .filter((item) => item && item.id !== undefined && item.id !== null)
    .map(normalizeCatalogItem);
};

const fetchCatalog = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || 'No se pudieron cargar los datos. Intenta nuevamente.');
  }

  return normalizeCatalogResponse(data);
};

const getRawValue = (raw, key) => {
  const value = raw?.[key];

  if (value && typeof value === 'object') {
    return value.id ?? value.pk ?? value.value;
  }

  return value;
};

const filterByRawId = (items, keys, expectedId) => {
  const normalizedExpectedId = String(expectedId);
  const hasFilterableKey = items.some((item) => {
    return keys.some((key) => getRawValue(item.raw, key) !== undefined && getRawValue(item.raw, key) !== null);
  });

  if (!hasFilterableKey) return items;

  const filtered = items.filter((item) => {
    return keys.some((key) => {
      const value = getRawValue(item.raw, key);
      return value !== undefined && value !== null && String(value) === normalizedExpectedId;
    });
  });

  return filtered;
};

export const obtenerPaises = () => {
  const { endpoint } = getEndpoint('REACT_APP_CAT_PAISES_ENDPOINT', DEFAULT_ENDPOINTS.paises);
  return fetchCatalog(buildUrl(endpoint));
};

export const obtenerEstadosPorPais = (paisId) => {
  const { endpoint, hadPathParams } = getEndpoint('REACT_APP_CAT_ESTADOS_ENDPOINT', DEFAULT_ENDPOINTS.estados, { paisId });
  const params = hadPathParams ? {} : { pais_id: paisId };
  return fetchCatalog(buildUrl(endpoint, params));
};

export const obtenerCiudadesPorEstado = (estadoId) => {
  const { endpoint, hadPathParams } = getEndpoint('REACT_APP_CAT_CIUDADES_ENDPOINT', DEFAULT_ENDPOINTS.ciudades, { estadoId });
  const params = hadPathParams ? {} : { estado_id: estadoId };
  return fetchCatalog(buildUrl(endpoint, params));
};

export const obtenerSedesPorCiudad = async (ciudadId) => {
  const { endpoint, hadPathParams } = getEndpoint('REACT_APP_CAT_SEDES_ENDPOINT', DEFAULT_ENDPOINTS.sedes, { ciudadId });
  const params = hadPathParams ? {} : { ciudad_id: ciudadId };
  const sedes = await fetchCatalog(buildUrl(endpoint, params));

  return filterByRawId(sedes, ['ciudad_id', 'id_ciudad', 'ciudad', 'municipio_id', 'id_municipio', 'municipio'], ciudadId);
};
