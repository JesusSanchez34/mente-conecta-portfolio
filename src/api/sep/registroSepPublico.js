import { BASE_API_SEP_V1 } from '../../utils/constants';

const DEFAULT_REGISTRO_ENDPOINT = '/pacientes/';

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const normalizeEndpoint = (endpoint = DEFAULT_REGISTRO_ENDPOINT) => {
  if (!endpoint) return DEFAULT_REGISTRO_ENDPOINT;
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
};

const getApiBaseUrl = () => {
  const baseUrl = process.env.REACT_APP_REGISTRO_SEP_BASE_URL || BASE_API_SEP_V1;

  if (!baseUrl) {
    throw new Error(
      'No se encontró la URL base del API. Configura REACT_APP_BASE_URL_SEP_V1 o REACT_APP_REGISTRO_SEP_BASE_URL en .env.development.'
    );
  }

  return trimTrailingSlash(baseUrl);
};

const getRegistroEndpoint = () => {
  return normalizeEndpoint(process.env.REACT_APP_REGISTRO_SEP_ENDPOINT || DEFAULT_REGISTRO_ENDPOINT);
};

export const formatPhoneWithCountryCode = (phone = '', countryCode = '+52') => {
  const cleanPhone = String(phone).replace(/[^0-9+]/g, '');
  const cleanCountryCode = String(countryCode || '+52').replace(/[^0-9+]/g, '') || '+52';

  if (cleanPhone.startsWith('+')) return cleanPhone;

  const digitsOnly = cleanPhone.replace(/\D/g, '');

  return digitsOnly ? `${cleanCountryCode}${digitsOnly}` : '';
};

const parseRequiredId = (value, fieldName) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Selecciona un valor válido para ${fieldName}.`);
  }

  return id;
};

export const buildRegistroSepPayload = (formData) => {
  const phone = formatPhoneWithCountryCode(
    formData.contactoTelefono,
    formData.contactoLada,
  );
  const paisId = parseRequiredId(formData.paisId, 'país');
  const estadoId = parseRequiredId(formData.estadoId, 'estado');
  const ciudadId = parseRequiredId(formData.ciudadId, 'ciudad');
  const sedeId = parseRequiredId(formData.sedeId, 'sede');

  return {
    nombre: formData.nombre.trim(),
    apellido_paterno: formData.apellidoPaterno.trim(),
    apellido_materno: formData.apellidoMaterno.trim(),
    fecha_nacimiento: formData.fechaNacimiento,
    celular_paciente: phone,
    email_paciente: formData.correo.trim().toLowerCase(),
    username: formData.correo.trim().toLowerCase(),
    password: formData.password,
    terminos: Boolean(formData.aceptaConsentimiento),
    pais_id: paisId,
    estado_id: estadoId,
    ciudad_id: ciudadId,
    sede_id: sedeId,
    pais: formData.paisNombre || formData.pais,
    estado: formData.estadoNombre || formData.estado,
    ciudad: formData.ciudadNombre || formData.ciudad,
    contacto_emergencia: [
      {
        nombre_completo: formData.contactoNombre.trim(),
        parentesco: formData.contactoParentesco.trim(),
        celular: phone,
      },
    ],
  };
};

const DUPLICATE_ACCOUNT_MESSAGE =
  'Ya existe una cuenta con ese correo electrónico. Inicia sesión o utiliza otro correo para registrarte.';
const INVALID_DATA_MESSAGE =
  'No pudimos completar el registro. Revisa la información capturada e intenta nuevamente.';
const SERVICE_ERROR_MESSAGE =
  'El servicio de registro no está disponible por el momento. Intenta nuevamente más tarde.';
const NETWORK_ERROR_MESSAGE =
  'No pudimos conectar con el servicio de registro. Revisa tu conexión e intenta nuevamente.';

const serializeErrorBody = (errorBody) => {
  if (typeof errorBody === 'string') return errorBody;

  try {
    return JSON.stringify(errorBody || {});
  } catch (_) {
    return '';
  }
};

const getFriendlyErrorMessage = (errorBody, status) => {
  const serverText = serializeErrorBody(errorBody).toLocaleLowerCase('es-MX');
  const duplicatePattern =
    /(already exists|already registered|duplicate|duplicad|ya existe|registrad|unique).*(email|correo|username|usuario)|(email|correo|username|usuario).*(already exists|already registered|duplicate|duplicad|ya existe|registrad|unique)/i;

  if (status === 409 || duplicatePattern.test(serverText)) {
    return DUPLICATE_ACCOUNT_MESSAGE;
  }

  if (status >= 500) return SERVICE_ERROR_MESSAGE;
  return INVALID_DATA_MESSAGE;
};

const getErrorMessage = async (response) => {
  let errorBody = null;

  try {
    errorBody = await response.json();
  } catch (error) {
    try {
      errorBody = await response.text();
    } catch (_) {
      errorBody = null;
    }
  }

  return getFriendlyErrorMessage(errorBody, response.status);
};

export const registrarPacienteSep = async (formData) => {
  const url = `${getApiBaseUrl()}${getRegistroEndpoint()}`;
  const payload = buildRegistroSepPayload(formData);

  let response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (_) {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }

  const text = await response.text();

  if (!text) return { ok: true };

  try {
    return JSON.parse(text);
  } catch (error) {
    return { ok: true, raw: text };
  }
};
