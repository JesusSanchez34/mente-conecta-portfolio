const BASE_URL = process.env.REACT_APP_BASE_URL_SEP_V1 + "/";
const ENDPOINTS_ACEPTACION = {
  consentimiento: "paciente2/pacientes/consentimiento/",
  asentimiento: "paciente2/pacientes/asentimiento/",
};

export const SEP_WEB_BASICA_LOGIN_TYPE = 4;
export const SEP_DEMO = {
  enabled: process.env.REACT_APP_DEMO_MODE === "true",
  email: "demo@menteconecta.test",
  password: "demo123",
  otp: "123456",
  otpSession: "demo-sep-otp-session",
  accessToken: "demo-sep-access-token",
};

function buildSepUrl(endpoint) {
  const baseUrl = process.env.REACT_APP_BASE_URL_SEP_V1;

  if (!baseUrl) {
    throw new Error("No esta configurada la URL base SEP.");
  }

  return `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
}

async function parseApiResponse(response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch (error) {
    return {};
  }
}

// ── Login con OTP (2 pasos) ──────────────────────────────────

/**
 * Paso 1 del login: manda email + password y recibe otp_session
 * @returns {{ otp_session: string } | { status: number, message: string }}
 */
export async function loginOtp(email, password) {
  if (
    SEP_DEMO.enabled &&
    email?.trim().toLowerCase() === SEP_DEMO.email &&
    password === SEP_DEMO.password
  ) {
    return {
      otp_session: SEP_DEMO.otpSession,
      demo: true,
    };
  }

  const response = await fetch(`${BASE_URL}auth/login-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email, // ← de vuelta a email
      password,
      lang_code: "es",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Credenciales incorrectas");
  }

  return data;
}

/**
 * Paso 2 del login: valida el OTP y recibe access + refresh tokens
 * @returns {{ access: string, refresh: string, decoded: object }}
 */
export async function verificarOtpLogin(otp, otpSession) {
  if (SEP_DEMO.enabled && otpSession === SEP_DEMO.otpSession) {
    if (otp !== SEP_DEMO.otp) {
      throw new Error("Código demo incorrecto.");
    }

    return {
      access: SEP_DEMO.accessToken,
      demo: true,
    };
  }

  const response = await fetch(`${BASE_URL}auth/verify-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      otp,
      otp_session: otpSession,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Código incorrecto o expirado");
  }

  return data; // { access, refresh, decoded, status }
}

/**
 * Acepta consentimiento/asentimiento del flujo Web Basica SEP.
 * Flutter usa GET con Bearer token y no envia body en estos endpoints.
 */
export async function aceptarTerminosWebBasica(payload, token) {
  const tipoConsentimiento =
    payload?.tipo_consentimiento || payload?.tipoConsentimiento;
  const endpoint = ENDPOINTS_ACEPTACION[tipoConsentimiento];

  if (!endpoint) {
    throw new Error("Tipo de consentimiento invalido.");
  }

  if (!token) {
    throw new Error("No se encontro una sesion activa.");
  }

  const response = await fetch(buildSepUrl(endpoint), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseApiResponse(response);

  // Estos endpoints mutan la aceptación mediante GET. En la primera llamada
  // pueden devolver el valor previo en `success`, aunque el HTTP 2xx confirma
  // que la operación se procesó correctamente.
  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "No se pudieron aceptar los terminos y condiciones.",
    );
  }

  return {
    ...data,
    status: response.status,
  };
}

// ── Olvidé contraseña ────────────────────────────────────────

/**
 * Paso 1: Envía correo con código de recuperación
 */
export async function enviarCorreoRecuperacion(email) {
  const response = await fetch(`${BASE_URL}auth/notificacion/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      lang_code: "es",
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "Error al enviar el correo");
  }

  return response.status; // 200
}

/**
 * Paso 2: Valida el token/código OTP de recuperación
 */
export async function validarTokenRecuperacion(token) {
  const response = await fetch(`${BASE_URL}user/users/validar_token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error("Código inválido o expirado");
  }

  return response.status; // 200
}

/**
 * Paso 3: Establece la nueva contraseña
 */
export async function establecerNuevoPassword(email, new_password) {
  const response = await fetch(
    `${BASE_URL}user/users/establecer_nuevo_password/`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, new_password }),
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "Error al cambiar la contraseña");
  }

  return response.status; // 200
}

