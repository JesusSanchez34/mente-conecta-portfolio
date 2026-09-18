import { BASE_API_MCPS, BASE_API_SEGURIDAD } from '../utils/constants';

const getBaseUrl = () => {
    const typeLogin = sessionStorage.getItem('typeLogin');
    return Number(typeLogin) === 7 ? BASE_API_SEGURIDAD : BASE_API_MCPS;
};

/**
 * Genera y descarga el PDF de resultados MTSP para un usuario.
 * Abre el reporte en una nueva pestaña del navegador.
 * 
 * @param {string} token - JWT de autenticación
 * @param {number|string} idUsuario - ID del usuario a reportar
 * @returns {Promise<void>}
 */
export async function generarPDFResultadosApi(token, idUsuario, lang = 'es') {
    const url = `${getBaseUrl()}/dashboard/pdf/generarPDF/${idUsuario}/?lang=${lang}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        let mensaje = 'Error al generar el PDF';
        try {
            const json = await response.json();
            mensaje = json.error || mensaje;
        } catch (_) {}
        throw new Error(mensaje);
    }

    // Convertir la respuesta en un Blob (archivo binario PDF)
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // Abrir en nueva pestaña
    const link = document.createElement('a');
    link.href = blobUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    // También forzar descarga con nombre
    link.download = `Reporte_MTSP_${idUsuario}_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Liberar memoria
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
}
