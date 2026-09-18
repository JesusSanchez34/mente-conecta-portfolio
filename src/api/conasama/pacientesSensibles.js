import { BASE_API_CONASAMA_V1 } from "../../utils/constants";

// Marcar atención a paciente sensible (nuevo body)
export async function marcarAtencionPacienteSensibleApi(token, evaluacionId) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/Super-Gestores/paciente-riesgo/marcar-atencion/`;
        const params = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ evaluacion_id: evaluacionId })
        };
        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

// API PARA PACIENTES SENSIBLES CONASAMA
export async function getPacientesSensiblesApi(token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/paciente2/pacientes/sencible/`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}
