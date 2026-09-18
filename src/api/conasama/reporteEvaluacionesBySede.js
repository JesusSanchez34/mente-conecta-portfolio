import { BASE_API_CONASAMA_V1 } from "../../utils/constants";

export async function getReporteEvaluacionesBySede(token, sedeId) {
    try {
        const url = `${BASE_API_CONASAMA_V1}/dashboard/Dashbord_Admin/ReportesEvaluacionesBySede/${sedeId}/`;
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