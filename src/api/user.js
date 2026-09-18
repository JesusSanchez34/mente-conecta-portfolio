import { jwtDecode } from "jwt-decode";
import {
  BASE_API,
  BASE_API_F1,
  BASE_API_NX,
  BASE_API_CONASAMA_V1,
  BASE_API_SEP_V1,
  BASE_API_SEP_SUPERIOR_V1,
  BASE_API_ENVEJECIMIENTO,
  BASE_API_MCPS,
  BASE_API_SEGURIDAD,
} from "../utils/constants";

export async function loginApiISEM(formValue) {
  try {
    const url = `${BASE_API}/auth/login/`;

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function loginApiFase1(formValue) {
  if (!BASE_API_F1) {
    throw new Error(
      "La variable REACT_APP_BASE_URL_F1 no está configurada. Revisa tu archivo .env.development.",
    );
  }

  try {
    const url = `${BASE_API_F1}/auth/log/`;

    const params = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function registerApiFase1(formData) {
  if (!BASE_API_F1) {
    throw new Error(
      "La variable REACT_APP_BASE_URL_F1 no está configurada. Revisa tu archivo .env.development.",
    );
  }

  try {
    const url = `${BASE_API_F1}/user/users/`;
    const params = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    const response = await fetch(url, params);

    let result = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const textBody = await response.text();
      console.warn("Unexpected non-JSON response body:", textBody);
    }

    if (response.status !== 201 && response.status !== 200) {
      let errorMsg = "";
      if (result && typeof result === "object") {
        const messages = [];
        for (const [key, value] of Object.entries(result)) {
          const fieldName = key.replace("_", " ");
          const fieldErrors = Array.isArray(value)
            ? value.join(", ")
            : String(value);
          messages.push(`${fieldName}: ${fieldErrors}`);
        }
        errorMsg = messages.join(" | ");
      } else {
        errorMsg = `Error del servidor (${response.status}). Por favor, verifica que los servicios del backend estén activos y que la URL de devtunnels sea la correcta.`;
      }
      throw new Error(errorMsg);
    }
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getEdadesFase1() {
  try {
    const url = `${BASE_API_F1}/catalogo/edad/`;
    const response = await fetch(url, { credentials: "include" });
    if (response.status !== 200) {
      throw new Error("Error al obtener catálogo de edades");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getEmpresasFase1() {
  try {
    const url = `${BASE_API_F1}/catalogo/empresas/`;
    const response = await fetch(url, { credentials: "include" });
    if (response.status !== 200) {
      throw new Error("Error al obtener catálogo de empresas");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function loginApiConasama(formValue) {
  try {
    const url = `${BASE_API_CONASAMA_V1}/auth/login/`;

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function loginApiSEP(formValue) {
  try {
    const url = `${BASE_API_SEP_V1}/auth/login/`;

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function loginApiMCSEP(formValue) {
  try {
    const url = `${BASE_API_SEP_SUPERIOR_V1}/auth/login/`;

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function loginApiMCSP(formValue) {
  try {
    const url = `${BASE_API_SEGURIDAD}/auth/login/`;

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValue),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

// export async function registerApiMCSP(formData){
//     try{
//         const url = `${BASE_API_MCPS}/paciente/paciente/altaPacienteBeta/`;
//         const bodyData = {
//             username: formData.correo.split("@")[0], // Usar la parte antes del @ como username
//             email: formData.correo,
//             password: formData.password,
//             nombre: formData.nombre,
//             apellidoPaterno: formData.apellidoPaterno,
//             apellidoMaterno: formData.apellidoMaterno,
//             curp: formData.curp,
//             edad: parseInt(formData.edad),
//             empresa: formData.empresa,
//         };
//         const params = {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(bodyData),
//             };

//             const response = await fetch(url, params);
//             const result = await response.json();

//             if(response.status !== 200 && response.status !== 201){
//                 throw new Error(result.message || "Error al registrar el usuario");
//             }
//             return result;
//         }catch(error){
//             throw error;
//         }
//     }

export async function registerApiMCSP(formData) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    console.log("registerApiMCSP: starting registration process...");
    // ✅ Mismo backend que la APK
    const url = `${BASE_API_SEGURIDAD}/paciente/paciente/altaPacienteBeta/`;
    console.log("registerApiMCSP: fetch URL is:", url);

    const bodyData = {
      // ✅ Exactamente las mismas llaves que el toJson() de la APK:
      password: formData.password,
      nombre: formData.nombre,
      apellido_paterno: formData.apellidoPaterno, // ← snake_case como la APK
      apellido_materno: formData.apellidoMaterno, // ← snake_case como la APK
      username: formData.correo.split("@")[0],
      curp: formData.curp,
      email: formData.correo,
      genero: "MASCULINO", // ← requerido por backend
      ocupacion: "POLICIA", // ← requerido por backend
      telefono_movil: "5555555555", // ← requerido por backend
      telefono_casa: "5555555555", // ← requerido por backend
      direccion: "Domicilio Conocido", // ← requerido por backend
      municipio: "Toluca", // ← requerido por backend
      terminos_condiciones: true,
      role: 2, // ← 2 = Paciente, igual que APK
      edades: 1, // ← ID fijo, igual que APK
      hospital: parseInt(formData.empresa), // ← ID numérico del select
    };
    console.log("registerApiMCSP: bodyData to send is:", bodyData);

    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
      signal: controller.signal,
    };

    console.log("registerApiMCSP: performing fetch...");
    const response = await fetch(url, params);
    clearTimeout(timeoutId);
    console.log("registerApiMCSP: fetch finished. Status:", response.status);

    const result = await response.json();
    console.log("registerApiMCSP: parsed JSON response is:", result);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(
        result.respuesta ||
          result.message ||
          JSON.stringify(result) ||
          "Error al registrar el usuario",
      );
    }
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      console.error("registerApiMCSP: request timed out after 15 seconds.");
      throw new Error(
        "El servidor tardó demasiado en responder (Timeout). Por favor, verifique su conexión e intente de nuevo.",
      );
    }
    console.error("registerApiMCSP: caught exception:", error);
    throw error;
  }
}

export async function registerEmpresaApi(formValue) {
  try {
    const url = `${BASE_API_SEGURIDAD}/catalogo/hospitales/`;

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: formValue.nombreEmpresa,
        empleados: formValue.numeroEmpleados,
        municipio: "SEGURIDAD PUBLICA",
      }),
    };

    const response = await fetch(url, params);
    if (response.status !== 200 && response.status !== 201) {
      const result = await response.json();
      let errorMessage = "";
      if (result.detail) {
        errorMessage = result.detail;
      } else if (typeof result === "object") {
        errorMessage = Object.entries(result)
          .map(([key, errors]) => `${key}: ${errors.join(", ")}`)
          .join(" | ");
      } else {
        errorMessage = "Error al registrar la empresa";
      }
      throw new Error(errorMessage);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getEmpresasMCPSApi() {
  try {
    const url = `${BASE_API_SEGURIDAD}/catalogo/hospitales/`;
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error("Error al obtener el catálogo de empresas");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function loginApiEnvejecimiento(formValue) {
  const url = `${BASE_API_ENVEJECIMIENTO}/auth/login/`;

  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValue),
  };

  // No envolvemos en try/catch para que el componente reciba el status real
  const response = await fetch(url, params);
  const data = await response.json().catch(() => ({}));

  if (response.status === 200) {
    return data; // { access: "...", ... }
  }

  // Devolver el status como propiedad para que el componente decida qué mostrar
  const error = new Error(
    data.detail || data.message || `Error ${response.status}`,
  );
  error.status = response.status;
  throw error;
}

export async function registerApiEnvejecimiento(formValue) {
  try {
    // Endpoint correcto de Envejecimiento (altaPacienteAngeles)
    const url = `${BASE_API_ENVEJECIMIENTO}/paciente/paciente/altaPacienteAngeles/`;

    // Construir el payload exacto que espera el backend para este endpoint (AltaPacienteModel)
    const payload = {
      nombre: formValue.nombre,
      apellido_paterno: formValue.apellido_paterno,
      apellido_materno: formValue.apellido_materno || "",
      fecha_nacimiento: formValue.fecha_nacimiento,
      celular_paciente: formValue.celular_paciente,
      password: formValue.password,
    };

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(url, params);
    if (response.status !== 200 && response.status !== 201) {
      const errorData = await response.json().catch(() => ({}));
      // Si el backend devuelve un mensaje de validación o un error estructurado, mostrarlo
      throw new Error(
        errorData.detail ||
          errorData.message ||
          (errorData.respuesta && typeof errorData.respuesta === "string"
            ? errorData.respuesta
            : null) ||
          "Error al registrarse. Verifica los datos ingresados.",
      );
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

const ME_URL_MAP = {
  1: `${BASE_API}/auth/me/`,
  2: `${BASE_API_F1}/auth/me/`,
  3: `${BASE_API_CONASAMA_V1}/auth/me/`,
  4: `${BASE_API_SEP_V1}/auth/me/`,
  5: `${BASE_API_SEP_SUPERIOR_V1}/auth/me/`,
  6: `${BASE_API_ENVEJECIMIENTO}/auth/me/`,
  7: `${BASE_API_SEGURIDAD}/auth/me/`,
  8: `${BASE_API_NX}/auth/me/`,
};

export async function getMeApi(token, typeLogin) {
  try {
    // Para Fase 1 (typeLogin === 2), obtenemos los datos completos del usuario usando su ID del token, igual que en la app móvil.
    if (Number(typeLogin) === 2) {
      const decoded = jwtDecode(token);
      const userId = decoded?.user_id;
      if (userId) {
        const url = `${BASE_API_F1}/user/users/${userId}/`;
        const params = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch(url, params);
        if (response.status === 200) {
          const result = await response.json();
          return result;
        }
      }
    }

    const url = ME_URL_MAP[typeLogin] ?? ME_URL_MAP[1];
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error(`Error al obtener datos del usuario: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getParentescosFase1() {
  try {
    const url = `${BASE_API_F1}/catalogo/parentesco/`;
    const response = await fetch(url, { credentials: "include" });
    if (response.status !== 200) {
      throw new Error("Error al obtener catálogo de parentescos");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getFamiliaresFase1(token, userId) {
  try {
    const url = `${BASE_API_F1}/user/usuariorelacion/userId/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_usuario: userId }),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener la lista de familiares");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function registrarFamiliarFase1(token, data) {
  try {
    const url = `${BASE_API_F1}/user/usuariorelacion/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, params);
    if (response.status !== 201 && response.status !== 200) {
      const errResult = await response.json().catch(() => ({}));
      const errMsg =
        errResult.detalle ||
        errResult.error ||
        `Error ${response.status} al registrar familiar`;
      throw new Error(errMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function eliminarFamiliarFase1(token, id) {
  try {
    const url = `${BASE_API_F1}/user/usuariorelacion/${id}/`;
    const params = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 204 && response.status !== 200) {
      throw new Error(`Error al eliminar el familiar: ${response.status}`);
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function getCuidadoresFase1(token, userId) {
  try {
    const url = `${BASE_API_F1}/user/usuariorelacion/cuidador/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_usuario: userId }),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener la lista de cuidadores");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function registrarCuidadorFase1(token, data) {
  try {
    const url = `${BASE_API_F1}/user/usuariorelacion/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, params);
    if (response.status !== 201 && response.status !== 200) {
      const errResult = await response.json().catch(() => ({}));
      const errMsg =
        errResult.detalle ||
        errResult.error ||
        `Error ${response.status} al registrar cuidador`;
      throw new Error(errMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function requestPasswordReset(email) {
  try {
    const url = `${BASE_API_F1}/auth/notificacion/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al enviar el correo de recuperación.");
    }
    return await response.json().catch(() => ({}));
  } catch (error) {
    throw error;
  }
}

export async function validateResetToken(token) {
  try {
    const url = `${BASE_API_F1}/user/users/validar_token/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("El token de verificación es inválido o ha expirado.");
    }
    return await response.json().catch(() => ({}));
  } catch (error) {
    throw error;
  }
}

export async function setNewPassword(email, new_password) {
  try {
    const url = `${BASE_API_F1}/user/users/establecer_nuevo_password/`;
    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, new_password }),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al establecer la nueva contraseña.");
    }
    return await response.json().catch(() => ({}));
  } catch (error) {
    throw error;
  }
}

// ---------------------------------------------------------
// FUNCIONES DE SECCIONES (ENVEJECIMIENTO)
// ---------------------------------------------------------

export async function obtenerSeccionesCuestionario(edad = 65) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/cuestionario/seccion/?edad=${edad}`;
    const params = {
      method: "GET",
      headers: getAuthHeaders(),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error(`Error al obtener secciones: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// ---------------------------------------------------------
// FUNCIONES DE RECUPERACIÓN DE CONTRASEÑA (ENVEJECIMIENTO)
// ---------------------------------------------------------

/**
 * Paso 1: Enviar correo para solicitar código de verificación.
 * NOTA: Ajustar la ruta del endpoint si el backend usa una diferente.
 */
export async function postEmailRecuperacion(email, languageCode = "es") {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/auth/notificacion/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, lang_code: languageCode }),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      const data = await response.json().catch(() => ({}));
      const error = new Error(
        data.message ||
          "El correo electrónico ingresado no está asociado a una cuenta.",
      );
      error.status = response.status;
      throw error;
    }
    return await response.json().catch(() => ({}));
  } catch (error) {
    throw error;
  }
}

/**
 * Paso 2: Validar el código OTP de 6 dígitos.
 * NOTA: Ajustar la ruta del endpoint. Puede que el backend requiera el email también.
 */
export async function validarCodigoRecuperacion(codigo) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/users/validar_token/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: codigo }),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      const data = await response.json().catch(() => ({}));
      const error = new Error(
        data.message ||
          "El Código proporcionado es incorrecto o ya ha expirado.",
      );
      error.status = response.status;
      throw error;
    }
    return await response.json().catch(() => ({}));
  } catch (error) {
    throw error;
  }
}

/**
 * Paso 3: Establecer la nueva contraseña.
 * NOTA: Ajustar la ruta del endpoint.
 */
export async function establecerNuevaContrasena(email, newPassword) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/users/establecer_nuevo_password/`;
    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, new_password: newPassword }),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      const data = await response.json().catch(() => ({}));
      const error = new Error(
        data.message || "Ocurrió un error al actualizar la contraseña.",
      );
      error.status = response.status;
      throw error;
    }
    return await response.json().catch(() => ({}));
  } catch (error) {
    throw error;
  }
}

export async function obtenerPreguntasRespuestasUsuario(usuarioId, moduloId) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestasenvejecimiento/obtenerPreguntasRespuestasUsuario/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario_id: usuarioId, modulo_id: moduloId }),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      throw new Error("Error al obtener el estado del cuestionario");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUsuarioCuestionario(usuarioId) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestasenvejecimiento/get-usuario-cuestionario/${usuarioId}/`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (response.status === 404) return [];
    if (response.status !== 200) {
      throw new Error("Error al obtener el historial de cuestionarios");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export async function obtenerCuestionarioPorId(cuestionarioId) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/cuestionario/cuestionario/${cuestionarioId}/`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (response.status !== 200) return null;
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function verificarInstruccionesSecciones(usuarioId, seccionId) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/paciente/paciente/verificar_instrucciones/?usuario_id=${usuarioId}&seccion_id=${seccionId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (response.status === 200) return await response.json();
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function postCheckboxInstrucciones(usuarioId, seccionId) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/paciente/paciente/checkbox_instrucciones/`;
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        usuario_id: usuarioId,
        status_instrucciones: true,
        seccion_id: seccionId,
      }),
    });
    if (response.status === 200) return await response.json();
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function obtenerCuestionariosPorSeccion(seccionId) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/cuestionario/cuestionario/obtenerCuestionarioPorSeccionId/${seccionId}/`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (response.status !== 200) {
      throw new Error(`Error al obtener cuestionarios: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function obtenerPreguntasPorCuestionario(cuestionarioId) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/cuestionario/cuestionario/obtenerPreguntas/${cuestionarioId}/`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (response.status !== 200) {
      throw new Error(`Error al obtener preguntas: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function guardarRespuestasEnvejecimiento(payload) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestas/`;
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Error al guardar respuestas: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function actualizarRespuestasEnvejecimiento(id, payload) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestas/${id}/`;
    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (response.status !== 200) {
      throw new Error(`Error al actualizar respuestas: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function obtenerRespuestasGuardadas(usuarioId, cuestionarioId) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestas/obtener/`;
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        id_usuario: usuarioId,
        id_cuestionario: cuestionarioId,
        id_parentesco: 0,
      }),
    });
    if (response.status === 200) {
      const text = await response.text();
      if (!text) return null;
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function obtenerResultadosEnvejecimiento(respuestasJson) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestas/especialista/`;
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ preguntas: respuestasJson }),
    });
    if (response.status !== 200) return [];
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function obtenerResultadoSumatoriaEnvejecimiento(respuestasJson) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestas/obtener-perzonalisadas/`;
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ respuesta: respuestasJson }),
    });
    if (response.status !== 200) return null;
    const data = await response.json();
    return data.resultado ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function guardarResultadoEnvejecimiento(
  id,
  diagnostico,
  calificacion,
) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestas/${id}/`;
    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ diagnostico, calificacion }),
    });
    if (response.status !== 200) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function postRespuestasEnvejecimientoEspecial(payload) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestasenvejecimiento/`;
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDatosPuntuacionFecha(usuarioId) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestasenvejecimiento/DatosPuntuacion-Fecha/${usuarioId}/`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (response.status !== 200) return [];
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUsuarioRespuestasEnvejecimiento(usuarioId) {
  try {
    const url = `${BASE_API_ENVEJECIMIENTO}/user/usuariorespuestasenvejecimiento/get-usuario-respuestas/${usuarioId}/`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (response.status !== 200) return [];
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function registerConasamaApi(patientData) {
  try {
    const url = `${BASE_API_CONASAMA_V1}/paciente2/pacientes/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    };

    const response = await fetch(url, params);
    const result = await response.json();
    if (response.status !== 201 && response.status !== 200) {
      let errorMessage = "Error al registrar el paciente.";
      if (result) {
        if (result.message) errorMessage = result.message;
        else if (result.error) errorMessage = result.error;
        else if (result.detail) errorMessage = result.detail;
        else if (typeof result === "object") {
          const fields = Object.keys(result);
          const errors = fields.map((field) => {
            const fieldErrors = result[field];
            return `${field}: ${Array.isArray(fieldErrors) ? fieldErrors.join(", ") : JSON.stringify(fieldErrors)}`;
          });
          if (errors.length > 0) {
            errorMessage = errors.join(" | ");
          }
        }
      }
      throw new Error(errorMessage);
    }
    return result;
  } catch (error) {
    throw error;
  }
}

export async function sendOtpConasamaApi(email, password) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `${BASE_API_CONASAMA_V1}/auth/login-otp/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      signal: controller.signal,
    };

    const response = await fetch(url, params);
    clearTimeout(timeoutId);
    if (response.status !== 200) {
      let errorMsg = "Error al enviar el código de verificación al correo.";
      try {
        const errData = await response.json();
        errorMsg =
          errData.message ||
          errData.error ||
          errData.detail ||
          JSON.stringify(errData);
      } catch (_) {}
      throw new Error(errorMsg);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Failed to fetch (timeout)");
    }
    throw error;
  }
}

export async function validateOtpConasamaApi(code, sessionOtp) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `${BASE_API_CONASAMA_V1}/auth/verify-otp/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: code,
        otp_session: sessionOtp,
      }),
      signal: controller.signal,
    };

    const response = await fetch(url, params);
    clearTimeout(timeoutId);
    if (response.status !== 200) {
      throw new Error("El código de verificación es incorrecto o ha expirado.");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Failed to fetch (timeout)");
    }
    throw error;
  }
}

export async function sendRecoveryEmailApi(email) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `${BASE_API_CONASAMA_V1}/auth/notificacion/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        correo: email,
      }),
      signal: controller.signal,
    };

    const response = await fetch(url, params);
    clearTimeout(timeoutId);
    if (response.status !== 200 && response.status !== 201) {
      let errorMsg = "Error al enviar el correo de recuperación.";
      try {
        const errData = await response.json();
        errorMsg =
          errData.message ||
          errData.error ||
          errData.detail ||
          JSON.stringify(errData);
      } catch (_) {}
      throw new Error(errorMsg);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Failed to fetch (timeout)");
    }
    throw error;
  }
}

export async function validateRecoveryOtpApi(email, code) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `${BASE_API_CONASAMA_V1}/user/users/validar_token/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        correo: email,
        token: code,
        code: code,
        otp: code,
      }),
      signal: controller.signal,
    };

    const response = await fetch(url, params);
    clearTimeout(timeoutId);
    if (response.status !== 200) {
      let errorMsg = "El código es incorrecto o ha expirado.";
      try {
        const errData = await response.json();
        errorMsg =
          errData.message ||
          errData.error ||
          errData.detail ||
          JSON.stringify(errData);
      } catch (_) {}
      throw new Error(errorMsg);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Failed to fetch (timeout)");
    }
    throw error;
  }
}

export async function resetPasswordApi(email, code, newPassword) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url = `${BASE_API_CONASAMA_V1}/user/users/establecer_nuevo_password/`;
    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        correo: email,
        token: code,
        code: code,
        otp: code,
        password: newPassword,
        new_password: newPassword,
        establecer_password: newPassword,
      }),
      signal: controller.signal,
    };

    const response = await fetch(url, params);
    clearTimeout(timeoutId);
    if (response.status !== 200) {
      let errorMsg = "Error al restablecer la contraseña.";
      try {
        const errData = await response.json();
        errorMsg =
          errData.message ||
          errData.error ||
          errData.detail ||
          JSON.stringify(errData);
      } catch (_) {}
      throw new Error(errorMsg);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Failed to fetch (timeout)");
    }
    throw error;
  }
}

export async function aceptarConsentimientoApi(token) {
  try {
    const url = `${BASE_API_CONASAMA_V1}/paciente2/pacientes/consentimiento/`;
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      let errorMsg = "Error al aceptar el consentimiento informado.";
      try {
        const errData = await response.json();
        errorMsg =
          errData.message ||
          errData.error ||
          errData.detail ||
          JSON.stringify(errData);
      } catch (_) {}
      throw new Error(errorMsg);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function cancelarConsentimientoApi(userId, token) {
  try {
    const url = `${BASE_API_CONASAMA_V1}/paciente/paciente/desactivar-consentimiento/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ usuario_id: userId }),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      let errorMsg = "Error al cancelar el consentimiento informado.";
      try {
        const errData = await response.json();
        errorMsg =
          errData.message ||
          errData.error ||
          errData.detail ||
          JSON.stringify(errData);
      } catch (_) {}
      throw new Error(errorMsg);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function obtenerDatosUsuarioPacienteApi(userId, token, typeLogin) {
  try {
    const meUrl = ME_URL_MAP[typeLogin] ?? ME_URL_MAP[1];
    const base = meUrl.replace("auth/me/", "");
    const url = `${base}paciente/paciente/obtener-datos-usuario/?usuario_id=${userId}`;

    const params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    let response = await fetch(url, params);
    let isFallback = false;
    if (response.status === 404) {
      const fallbackUrl = `${base}user/users/${userId}/`;
      response = await fetch(fallbackUrl, params);
      isFallback = true;
    }

    if (response.status !== 200) {
      let errorMsg = `Código ${response.status}`;
      try {
        const errData = await response.json();
        errorMsg =
          errData.message ||
          errData.error ||
          errData.detail ||
          JSON.stringify(errData);
      } catch (_) {
        try {
          const txt = await response.text();
          if (txt) errorMsg = txt.slice(0, 80);
        } catch (__) {}
      }
      throw new Error(errorMsg);
    }
    const result = await response.json();
    if (isFallback && result && !result.data) {
      return { data: result };
    }
    return result;
  } catch (error) {
    throw error;
  }
}

export async function ActualizarDatosUsuarioPacienteApi(
  userId,
  email,
  celular,
  token,
  typeLogin,
) {
  try {
    const meUrl = ME_URL_MAP[typeLogin] ?? ME_URL_MAP[1];
    const base = meUrl.replace("auth/me/", "");
    const url = `${base}paciente/paciente/ActualizarDatosUsuario/`;

    const params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usuario_id: userId,
        email: email,
        celular_paciente: celular,
      }),
    };

    const response = await fetch(url, params);
    if (response.status !== 200 && response.status !== 201) {
      let errorMsg = "Error al actualizar los datos.";
      try {
        const errData = await response.json();
        errorMsg =
          errData.message ||
          errData.error ||
          errData.detail ||
          JSON.stringify(errData);
      } catch (_) {}
      throw new Error(errorMsg);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

// ---------------------------------------------------------
// FUNCIONES DE NEUROXPAND
// ---------------------------------------------------------

async function extractErrorMessage(response, defaultMessage) {
  try {
    const errorData = await response.json();

    if (errorData && typeof errorData === "object") {
      if (errorData.fail) return errorData.fail; 
      if (errorData.error) return errorData.error;
      if (errorData.detail) return errorData.detail;
      if (errorData.detalle) return errorData.detalle;
      if (errorData.message) return errorData.message;

      const messages = [];
      for (const [key, value] of Object.entries(errorData)) {
        const fieldName = key.replace("_", " ");
        const fieldErrors = Array.isArray(value)
          ? value.join(", ")
          : String(value);
        messages.push(`${fieldName}: ${fieldErrors}`);
      }
      if (messages.length > 0) return messages.join(" | ");
    }
  } catch (e) {
    try {
      const textError = await response.text();
      if (textError) return textError;
    } catch (textErr) {
    }
  }

  return defaultMessage;
}

export async function loginApiNeuroXpand(formValue) {
  if (!BASE_API_NX) {
    throw new Error(
      "La variable REACT_APP_API_NX_URL no está configurada. Revisa tu archivo .env.development.",
    );
  }

  try {
    const url = `${BASE_API_NX}/auth/log/`;
    const params = {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValue),
    };

    const response = await fetch(url, params);
    if (response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        "Usuario o contraseña incorrectos",
      );
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function registerApiNeuroXpand(formData) {
  if (!BASE_API_NX) {
    throw new Error(
      "La variable REACT_APP_API_NX_URL no está configurada. Revisa tu archivo .env.development.",
    );
  }

  try {
    const url = `${BASE_API_NX}/user/users/`;
    const params = {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };

    const response = await fetch(url, params);

    if (response.status !== 201 && response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        `Error del servidor (${response.status}). Verifica que el backend esté activo.`,
      );
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getEdadesNeuroXpand() {
  try {
    const url = `${BASE_API_NX}/catalogo/edad/`;
    const response = await fetch(url, { credentials: "include" });
    if (response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        "Error al obtener catálogo de edades",
      );
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getEmpresasNeuroXpand() {
  try {
    const url = `${BASE_API_NX}/catalogo/empresas/`;
    const response = await fetch(url, { credentials: "include" });
    if (response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        "Error al obtener catálogo de empresas",
      );
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getMeApiNeuroXpand(token, typeLogin) {
  try {
    if (Number(typeLogin) === 2) {
      const decoded = jwtDecode(token);
      const userId = decoded?.user_id;
      if (userId) {
        const url = `${BASE_API_NX}/user/users/${userId}/`;
        const params = { headers: { Authorization: `Bearer ${token}` } };
        const response = await fetch(url, params);

        if (response.status !== 200) {
          const errorMsg = await extractErrorMessage(
            response,
            `Error al obtener datos del usuario: ${response.status}`,
          );
          throw new Error(errorMsg);
        }
        return await response.json();
      }
    }

    const url = ME_URL_MAP[typeLogin] ?? ME_URL_MAP[8];
    const params = { headers: { Authorization: `Bearer ${token}` } };
    const response = await fetch(url, params);

    if (response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        `Error al obtener datos del usuario: ${response.status}`,
      );
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getParentescosNeuroXpand() {
  try {
    const url = `${BASE_API_NX}/catalogo/parentesco/`;
    const response = await fetch(url, { credentials: "include" });
    if (response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        "Error al obtener catálogo de parentescos",
      );
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getFamiliaresNeuroXpand(token, userId) {
  try {
    const url = `${BASE_API_NX}/user/usuariorelacion/userId/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_usuario: userId }),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        "Error al obtener la lista de familiares",
      );
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function registrarFamiliarNeuroXpand(token, data) {
  try {
    const url = `${BASE_API_NX}/user/usuariorelacion/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, params);
    if (response.status !== 201 && response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        `Error ${response.status} al registrar familiar`,
      );
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function eliminarFamiliarNeuroXpand(token, id) {
  try {
    const url = `${BASE_API_NX}/user/usuariorelacion/${id}/`;
    const params = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, params);
    if (response.status !== 204 && response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        `Error al eliminar el familiar: ${response.status}`,
      );
      throw new Error(errorMsg);
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function getCuidadoresNeuroXpand(token, userId) {
  try {
    const url = `${BASE_API_NX}/user/usuariorelacion/cuidador/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_usuario: userId }),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        "Error al obtener la lista de cuidadores",
      );
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function registrarCuidadorNeuroXpand(token, data) {
  try {
    const url = `${BASE_API_NX}/user/usuariorelacion/`;
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, params);
    if (response.status !== 201 && response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        `Error ${response.status} al registrar cuidador`,
      );
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function requestPasswordResetNeuroXpand(email) {
  try {
    const url = `${BASE_API_NX}/auth/notificacion/`;
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    };
    const response = await fetch(url, params);

    if (response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        "Error al enviar el correo de recuperación.",
      );
      throw new Error(errorMsg);
    }

    return await response.json().catch(() => ({}));
  } catch (error) {
    throw error;
  }
}

export async function validateResetTokenNeuroXpand(token) {
  try {
    const url = `${BASE_API_NX}/user/users/validar_token/`;
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        "El token de verificación es inválido o ha expirado.",
      );
      throw new Error(errorMsg);
    }
    return await response.json().catch(() => ({}));
  } catch (error) {
    throw error;
  }
}

export async function setNewPasswordNeuroXpand(email, new_password) {
  try {
    const url = `${BASE_API_NX}/user/users/establecer_nuevo_password/`;
    const params = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, new_password }),
    };
    const response = await fetch(url, params);
    if (response.status !== 200) {
      const errorMsg = await extractErrorMessage(
        response,
        "Error al establecer la nueva contraseña.",
      );
      throw new Error(errorMsg);
    }
    return await response.json().catch(() => ({}));
  } catch (error) {
    throw error;
  }
}
