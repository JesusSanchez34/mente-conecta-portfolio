import { BASE_API_CONASAMA_V1 } from "../../utils/constants";

export async function registerGestorApi(data, token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/Super-Gestores/gestores/`;
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        };

        const response = await fetch(url, params);
        const result = await response.json();
        if (response.status !== 200 && response.status !== 201) {
            const errorMessage = result.email?.[0] || result.message || "Error al registrar";
            throw new Error(errorMessage);
        }
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getGestoresApi(token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/Super-Gestores/gestores/`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error("Error al obtener la lista de gestores");
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

//super Admin Conasama

export async function getConteoNivelRiesgoApi(id, token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/dashboard/Dashbord_Admin/ConteoPorNivelRiesgo/${id}/`;

        const params = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);
        const result = await response.json();

        if (response.status !== 200) {
            throw new Error(result.message || "Error al obtener el conteo de nivel de riesgo");
        }

        return result;
    } catch (error) {
        throw error;
    }
}

//Admin Conasama

export async function getConteoNivelRiesgoAdminApi(token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/dashboard/Dashbord_Admin/ConteoPorNivelRiesgo/`;
        const params = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);
        const result = await response.json();

        if (response.status !== 200) {
            throw new Error(result.message || "Error al obtener datos de Admin");
        }
        return result;
    } catch (error) {
        throw error;
    }
}
