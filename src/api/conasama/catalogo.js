import { BASE_API_CONASAMA_V1 } from "../../utils/constants";

export async function getOptionsCatalogoApi(token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/catalogo/tipo_paciente_opciones/`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error("Error al obtener los catálogos");
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getHospitalesApi(token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/catalogo/hospitales/`;
        const params = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);
        if (response.status !== 200) {
            throw new Error("Error al obtener los hospitales");
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}
