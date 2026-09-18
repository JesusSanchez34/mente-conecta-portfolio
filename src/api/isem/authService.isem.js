/**
 * authService.isem.js
 * ============================================================
 * Servicio de autenticación para el portal ISEM (typeLogin = 1)
 *
 * MODO ACTUAL:  MOCK (simulación frontend, sin backend)
 * MODO FUTURO:  API real → cambiar USE_MOCK = false
 *
 * Para activar API real:
 *   1. Asegúrate que REACT_APP_API_URL esté configurado en .env.development
 *   2. Cambia USE_MOCK a false abajo
 *   3. El endpoint esperado: POST /auth/login/ → { access: "<jwt>" }
 * ============================================================
 */

import { BASE_API } from '../../utils/constants';

// ─── CONTROL DE MODO ─────────────────────────────────────────
// true  → usa credenciales mock (sin servidor)
// false → llama a la API real configurada en .env
const USE_MOCK = false;

// ─── CREDENCIALES MOCK ────────────────────────────────────────
// ⚠️  Solo para desarrollo. Eliminar o deshabilitar en producción.
const MOCK_USERS = [
  {
    username: 'admin',
    password: '123456',
    userData: {
      id: 1,
      username: 'admin',
      first_name: 'Administrador',
      last_name: 'ISEM',
      email: 'admin@isem.gob.mx',
      is_superuser: false,
      is_staff: true,
      role: 'admin_isem',
    },
  },
  {
    username: 'superadmin',
    password: 'admin2025',
    userData: {
      id: 2,
      username: 'superadmin',
      first_name: 'Super',
      last_name: 'Administrador',
      email: 'superadmin@isem.gob.mx',
      is_superuser: true,
      is_staff: true,
      role: 'superadmin_isem',
    },
  },
];

/**
 * Genera un token JWT-like falso para el mock.
 * Estructura: header.payload.signature (base64)
 */
function generateMockToken(userData) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      user_id: userData.id,
      username: userData.username,
      // Expira en 8 horas desde ahora
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
      iat: Math.floor(Date.now() / 1000),
      // Marca clara de que es mock
      _mock: true,
    })
  );
  const signature = btoa('mock-signature-isem');
  return `${header}.${payload}.${signature}`;
}

/**
 * Simula delay de red para realismo.
 * @param {number} ms - milisegundos de espera
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── SERVICIO PRINCIPAL ───────────────────────────────────────

/**
 * loginISEM
 * Autenticación del portal ISEM.
 *
 * @param {{ username: string, password: string }} formValue
 * @returns {{ access: string, user: object }} — token + datos usuario
 * @throws Error si credenciales inválidas o falla de red
 */
export async function loginISEM(formValue) {
  if (USE_MOCK) {
    return _loginMock(formValue);
  }
  return _loginAPI(formValue);
}

/**
 * getMeISEM
 * Obtiene los datos del usuario autenticado.
 * En mock, decodifica del token. En API real, llama al endpoint /auth/me/
 *
 * @param {string} token - JWT token
 * @returns {object} datos del usuario
 */
export async function getMeISEM(token) {
  if (USE_MOCK) {
    return _getMeMock(token);
  }
  return _getMeAPI(token);
}

// ─── IMPLEMENTACIÓN MOCK ──────────────────────────────────────

async function _loginMock({ username, password }) {
  // Simula latencia de red (600-1000ms)
  await delay(600 + Math.random() * 400);

  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    // Simula error 400 del servidor
    throw new Error('Usuario o contraseña incorrectos');
  }

  const access = generateMockToken(user.userData);

  console.info(
    '[authService.isem] 🟡 MODO MOCK — Login exitoso para:',
    username
  );

  return {
    access,
    user: user.userData,
  };
}

function _getMeMock(token) {
  try {
    // Decodifica el payload del mock token
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token inválido');
    const payload = JSON.parse(atob(parts[1]));

    // Busca el usuario en el mock por username
    const mockUser = MOCK_USERS.find(
      (u) => u.userData.username === payload.username
    );

    return mockUser?.userData ?? null;
  } catch {
    return null;
  }
}

// ─── IMPLEMENTACIÓN API REAL ──────────────────────────────────
// ⬇️  Estas funciones se activarán cuando USE_MOCK = false

async function _loginAPI(formValue) {
  const url = `${BASE_API}/auth/login/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formValue),
  });

  if (!response.ok) {
    // Intenta extraer mensaje de error del servidor
    let message = 'Usuario o contraseña incorrectos';
    try {
      const err = await response.json();
      message = err?.detail || err?.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

async function _getMeAPI(token) {
  const url = `${BASE_API}/auth/me/`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener datos del usuario: ${response.status}`);
  }

  return response.json();
}

/**
 * sendRecoveryEmail
 * Envía el correo de recuperación al email especificado.
 */
export async function sendRecoveryEmail(email) {
  if (USE_MOCK) {
    await delay(1200);
    console.info('[authService.isem] 🟡 MODO MOCK — Código de verificación enviado a:', email);
    return { detail: 'Instrucciones enviadas' };
  }
  
  const url = `${BASE_API}/auth/notificacion/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    let message = 'Error al enviar el correo de recuperación';
    try {
      const err = await response.json();
      message = err?.detail || err?.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

/**
 * verifyRecoveryCode
 * Valida el código de verificación ingresado.
 */
export async function verifyRecoveryCode(code) {
  if (USE_MOCK) {
    await delay(1000);
    // Simular que el código correcto es '123456' en modo mock
    if (code === '123456' || code === '000000') {
      console.info('[authService.isem] 🟡 MODO MOCK — Código verificado correctamente:', code);
      return { detail: 'Código válido' };
    }
    throw new Error('El código ingresado es incorrecto o ha expirado');
  }

  const url = `${BASE_API}/user/users/validar_token/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: code }),
  });

  if (!response.ok) {
    let message = 'El código ingresado es incorrecto o ha expirado';
    try {
      const err = await response.json();
      message = err?.detail || err?.message || message;
    } catch {}
    throw new Error(message);
  }

  // Si retorna vacío o texto plano
  return response.status === 200 ? { success: true } : response.json();
}

/**
 * resetPassword
 * Establece la nueva contraseña para el usuario.
 */
export async function resetPassword(email, newPassword) {
  if (USE_MOCK) {
    await delay(1200);
    console.info('[authService.isem] 🟡 MODO MOCK — Contraseña restablecida con éxito para:', email);
    return { detail: 'Contraseña restablecida con éxito' };
  }

  const url = `${BASE_API}/user/users/establecer_nuevo_password/`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, new_password: newPassword }),
  });

  if (!response.ok) {
    let message = 'Error al restablecer la contraseña';
    try {
      const err = await response.json();
      message = err?.detail || err?.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}
