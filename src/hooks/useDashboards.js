import { useState } from "react";

import {
    getDashBoardGeneralApi,
    getDashBoardInterpretacionesApi,
    getTotalPacientesPorHospitalApi
} from '../api/dashboards';
import { useAuth } from "./useAuth";

export function useDashboards() {
    const [dashboard, setDashboards] = useState(undefined);
    const [dashboardInterpretaciones, setDashboardsInterpretaciones] = useState(undefined);
    const [pacientes, setPacientes] = useState(undefined);
    const [loadingDashboard, setLoadingDashboard] = useState(false);
    const [errorDashboard, setErrorDashboard] = useState(undefined);
    const { auth } = useAuth()

    const getGeneralDashboard = async () => {
        try {
            setLoadingDashboard(true)
            const response = await getDashBoardGeneralApi(auth.token);
            setDashboards(response);
            setLoadingDashboard(false)
            return response;
        } catch (error) {
            setLoadingDashboard(false)
            setErrorDashboard(error)
            throw error;
        }
    }

    const getTotalPacientesPorHospital = async () => {
        try {
            setLoadingDashboard(true)
            const response = await getTotalPacientesPorHospitalApi(auth.token);
            setPacientes(response);
            setLoadingDashboard(false)
            return response;
        } catch (error) {
            setLoadingDashboard(false)
            setErrorDashboard(error)
            throw error;
        }
    }

    const getTotalPacientesPorInterpretacion = async () => {
        try {
            setLoadingDashboard(true)
            const response = await getDashBoardInterpretacionesApi(auth.token);
            setDashboardsInterpretaciones(response);
            setLoadingDashboard(false)
            return response;
        } catch (error) {
            setLoadingDashboard(false)
            setErrorDashboard(error)
            throw error;
        }
    }

    return {
        dashboard,
        dashboardInterpretaciones,
        pacientes,
        loadingDashboard,
        errorDashboard,
        getGeneralDashboard,
        getTotalPacientesPorHospital,
        getTotalPacientesPorInterpretacion,
    }
}