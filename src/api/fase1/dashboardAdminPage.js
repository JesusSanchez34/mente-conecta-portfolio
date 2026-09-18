import { BASE_API_F1 } from "../../utils/constants";

export async function getAlertsColumbiaAPI(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/ConteoGeneralAlertaColumbia/`;
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