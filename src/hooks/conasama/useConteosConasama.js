// HOOKS PARA CONTEOS DE CONASAMA


/*import { useState } from "react";
import { useAuth } from "../useAuth";
import { getAlertsApi } from '../../api/fase1/dashboardAdminPage';

export function useDashboardAdmin() {
    const { auth } = useAuth();
    const [alerts, setAlerts] = useState(undefined);
    const [loadingAlerts, setLoadingAlerts] = useState(false)

    const getAlerts = async () => {
        try {
            setLoadingAlerts(true);
            const response = await getAlertsApi(auth.token);
            console.log('response: ',response)
            setAlerts(response);
            setLoadingAlerts(false);
        } catch (error) {
            setLoadingAlerts(false);
            console.log('error:',error);
        }
    };

    return{
        alerts,
        loadingAlerts,
        getAlerts,
    }
}*/