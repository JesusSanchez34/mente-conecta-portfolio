import { BASE_API } from "../utils/constants";
import { BASE_API_CONASAMA_V1 } from "../utils/constants";

/**
 * Obtiene el estado de los cuestionarios del paciente
 * (cuáles ya completó, cuáles faltan).
 *
 * TODO: Confirmar endpoint con backend.
 */
export async function getEstadoCuestionariosApi(token) {
    try {
        const url = `${BASE_API}/cuestionarios/estado/`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Error al obtener estado de cuestionarios');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Envía las respuestas de un cuestionario específico.
 *
 * @param {string} token - JWT
 * @param {string} cuestionarioId - ID del cuestionario (ej: 'sintomatologia-psiquiatrica')
 * @param {Object} respuestas - Solo los datos estrictamente necesarios
 * @param {string} tipoRealizador - 'personal' | 'encuestador'
 *
 * TODO: Confirmar endpoint y payload con backend.
 */
export async function enviarCuestionarioApi(token, cuestionarioId, respuestas, tipoRealizador) {
    try {
        const url = `${BASE_API}/cuestionarios/${cuestionarioId}/`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...respuestas,
                tipo_realizador: tipoRealizador,
            }),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.detail || 'Error al enviar cuestionario');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function obtenerSeccionesApi(edad, token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/cuestionario/seccion/?edad=${edad}`;
        const params = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
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

export async function obtenerCuestionariosPorSeccionApi(seccionId, token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/cuestionario/cuestionario/obtenerCuestionarioPorSeccionId/${seccionId}/`;
        const params = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error(`Error al obtener cuestionarios: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function obtenerPreguntasRespuestasApi(cuestionarioId, token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/cuestionario/cuestionario/obtenerPreguntas/${cuestionarioId}/`;
        const params = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error(`Error al obtener preguntas: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function obtenerRespuestasUsuarioApi(userId, cuestionarioId, token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/user/usuariorespuestas/obtener/`;
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_usuario: userId,
                id_cuestionario: cuestionarioId,
                id_parentesco: null,
            }),
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            return null;
        }
        const text = await response.text();
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        return null;
    }
}

export async function guardarRespuestasUsuarioApi(respuestasData, token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/user/usuariorespuestas/`;
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            // Payload matches Flutter UsuarioRespuestasModel.toJson() + encuestador
            body: JSON.stringify(respuestasData),
        };
        const response = await fetch(url, params);
        if (response.status !== 201 && response.status !== 200) {
            const errorBody = await response.text();
            throw new Error(`No se pudieron guardar las respuestas: ${response.status} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function modificarRespuestasUsuarioApi(respuestasId, respuestasData, token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/user/usuariorespuestas/${respuestasId}/`;
        const params = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(respuestasData),
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            const errorBody = await response.text();
            throw new Error(`No se pudieron modificar las respuestas: ${response.status} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function guardarDatosPacienteApi(datos, token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/paciente/paciente/actualizarDatosPaciente/`;
        const params = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(datos),
        };
        const response = await fetch(url, params);
        return response.status === 200;
    } catch (error) {
        throw error;
    }
}

export async function obtenerReportePacienteApi(userId, token, lang = 'es') {
    try {
        const action = lang === 'en' ? 'ReporteCuestionariosPorUsuariosEN' : 'ReporteCuestionariosPorUsuariosEs';
        const url = `${BASE_API_CONASAMA_V1}/cuestionario/respuesta/${action}/${userId}/`;
        const params = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error(`Error al obtener reporte: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}
