import { BASE_API_CONASAMA_V1 } from "../../utils/constants";

//////////////////////////////////////
//     GRAFICAS DEL SUPERGESTOR     //
//////////////////////////////////////

export async function getConteoPorNivelRiesgoCategoriaBySedeApi(token, idSede) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/dashboard/Dashbord_Admin/ConteoPorNivelRiesgoCategoria/${idSede}/`;

        const params = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);

        if (!response.ok) {
            throw new Error("Error al obtener las graficas de cuestionarios del supergestor");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getGraficasPreguntasBySedeApi(token, idSede) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/dashboard/Dashbord_Admin/GraficaPreguntas/${idSede}/`;

        const params = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);

        if (!response.ok) {
            throw new Error("Error al obtener las graficas de preguntas del supergestor");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getRangoDePreguntasBySedeApi(token, idSede) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/dashboard/Dashbord_Admin/getRangoPreguntas/${idSede}/`;

        const params = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);

        if (!response.ok) {
            throw new Error("Error al obtener las graficas de rangos del supergestor");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}


///////////////////////////////////////
//        GRAFICAS DEL GESTOR        //
///////////////////////////////////////

export async function getConteoPorNivelRiesgoCategoriaApi(token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/dashboard/Dashbord_Admin/ConteoPorNivelRiesgoCategoria/`;

        const params = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);

        if (!response.ok) {
            throw new Error("Error al obtener las graficas de cuestionarios del gestor");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getGraficasPreguntasApi(token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/dashboard/Dashbord_Admin/GraficaPreguntas/`;

        const params = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);

        if (!response.ok) {
            throw new Error("Error al obtener las graficas de preguntas del gestor");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getRangoDePreguntasApi(token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/dashboard/Dashbord_Admin/getRangoPreguntas/`;

        const params = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);

        if (!response.ok) {
            throw new Error("Error al obtener las graficas de rangos del gestor");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}
