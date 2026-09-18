import { BASE_API_CONASAMA_V1 } from "../../utils/constants";

export async function getNoticiasApi(token) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/catalogo/noticias/`;
        const params = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response = await fetch(url, params);
        if (response.status !== 200) throw new Error("Error al obtener las noticias");
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function createNoticiaApi(token, data) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/catalogo/noticias/`;
        const params = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        const response = await fetch(url, params);
        if (response.status !== 201 && response.status !== 200) {
            throw new Error("Error al crear la noticia");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function deleteNoticiaApi(token, idNoticia) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/catalogo/noticias/${idNoticia}/`; 
        const params = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch(url, params);
        if (response.status !== 204 && response.status !== 200) {
            throw new Error("Error al eliminar la noticia");
        }
        return true;
    } catch (error) {
        throw error;
    }
}