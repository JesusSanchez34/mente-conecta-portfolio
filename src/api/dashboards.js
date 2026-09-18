import { BASE_API } from "../utils/constants";

export async function getDashBoardGeneralApi(token) {
    try {
        const url = `${BASE_API}dashboard/dashboard_admin/getGeneralTable/`;
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

export async function getDashBoardInterpretacionesApi(token) {
    try {
        const url = `${BASE_API}dashboard/dashboard_admin/GetScaleDataPatiens/`;
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


export async function getTotalPacientesPorHospitalApi(token) {
    try {
        const url = `${BASE_API}dashboard/dashboard_admin/getAllPatientsByHospital/`;
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