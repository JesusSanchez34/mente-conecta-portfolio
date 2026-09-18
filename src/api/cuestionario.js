import { BASE_API_MCPS, BASE_API_SEGURIDAD } from '../utils/constants';

const getBaseUrl = () => {
    const typeLogin = sessionStorage.getItem('typeLogin');
    return Number(typeLogin) === 7 ? BASE_API_SEGURIDAD : BASE_API_MCPS;
};

// 1. Obtener los cuestionarios de una sección (por ejemplo, sección 2 = Salud Mental)
export async function getCuestionariosPorSeccionApi(token, idSeccion) {
    try {
        const url = `${getBaseUrl()}/cuestionario/cuestionario/obtenerCuestionarioPorSeccionId/${idSeccion}/?_t=${new Date().getTime()}`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept-Language': (localStorage.getItem('i18nextLng') || 'es').split('-')[0],
            },
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error('Error al obtener los cuestionarios de la sección');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// 2. Obtener las preguntas y respuestas de un cuestionario específico
export async function getPreguntasCuestionarioApi(token, idCuestionario) {
    try {
        const url = `${getBaseUrl()}/cuestionario/cuestionario/obtenerPreguntas/${idCuestionario}/?_t=${new Date().getTime()}`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept-Language': (localStorage.getItem('i18nextLng') || 'es').split('-')[0],
            },
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error('Error al obtener las preguntas del cuestionario');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// 3. Obtener las respuestas previas guardadas por el usuario para un cuestionario
export async function getRespuestasUsuarioApi(token, idUser, idCuestionario, idParentesco) {
    try {
        const url = `${getBaseUrl()}/user/usuariorespuestas/obtener/`;
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': (localStorage.getItem('i18nextLng') || 'es').split('-')[0],
            },
            body: JSON.stringify({
                id_usuario: idUser,
                id_cuestionario: idCuestionario,
                id_parentesco: idParentesco,
            }),
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error('Error al obtener respuestas del usuario');
        }
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        throw error;
    }
}

// 4. Guardar respuestas del usuario por primera vez (POST)
export async function guardarRespuestasUsuarioApi(token, respuestasData) {
    try {
        const url = `${getBaseUrl()}/user/usuariorespuestas/`;
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': (localStorage.getItem('i18nextLng') || 'es').split('-')[0],
            },
            body: JSON.stringify(respuestasData),
        };
        const response = await fetch(url, params);
        if (response.status !== 201 && response.status !== 200) {
            throw new Error('Error al guardar las respuestas del cuestionario');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// 5. Modificar respuestas del usuario ya existentes (PUT)
export async function modificarRespuestasUsuarioApi(token, idRespuesta, respuestasData) {
    try {
        const url = `${getBaseUrl()}/user/usuariorespuestas/${idRespuesta}/`;
        const params = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': (localStorage.getItem('i18nextLng') || 'es').split('-')[0],
            },
            body: JSON.stringify(respuestasData),
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error('Error al modificar las respuestas del cuestionario');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// 6. Obtener resultados/diagnóstico a partir de las respuestas (Especialista)
export async function obtenerResultadosCuestionarioApi(token, respuestasJson) {
    try {
        const url = `${getBaseUrl()}/user/usuariorespuestas/especialista/`;
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': (localStorage.getItem('i18nextLng') || 'es').split('-')[0],
            },
            body: JSON.stringify({ preguntas: respuestasJson }),
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error('Error al obtener los resultados de la evaluación');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// 7. Obtener resultado sumatoria (para cuestionarios de tipo sumatoria)
export async function obtenerResultadoSumatoriaApi(token, respuestasJson) {
    try {
        const url = `${getBaseUrl()}/user/usuariorespuestas/obtener-perzonalisadas/`;
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': (localStorage.getItem('i18nextLng') || 'es').split('-')[0],
            },
            body: JSON.stringify({ respuesta: respuestasJson }),
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error('Error al obtener la sumatoria del cuestionario');
        }
        const res = await response.json();
        return res.resultado;
    } catch (error) {
        throw error;
    }
}

// 8. Guardar resultado final de diagnóstico o sumatoria en el registro de respuestas del usuario
export async function guardarResultadoFinalApi(token, idUsuarioRespuestas, resultData) {
    try {
        const url = `${getBaseUrl()}/user/usuariorespuestas/${idUsuarioRespuestas}/`;
        const params = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept-Language': (localStorage.getItem('i18nextLng') || 'es').split('-')[0],
            },
            body: JSON.stringify(resultData),
        };
        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error('Error al guardar el resultado de la evaluación');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}
