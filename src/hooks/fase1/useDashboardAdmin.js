import { useState } from "react";

import {
    getAlertsColumbiaAPI
} from '../../api/fase1/dashboardAdminPage';
import { useAuth } from "../useAuth";

export function useDashboardAdmin() {
    const [alertsColumbia, setAlertsColumbia] = useState(undefined);
    const [loadingAlertsColumbia, setLoadingAlertsColumbia] = useState(false)
    const [errorAlertsColumbia, setErrorAlertsColumbia] = useState(undefined);
    const { auth } = useAuth();

    const getAlertsColumbia = async () => {
        try {
            setLoadingAlertsColumbia(true);
            const response = await getAlertsColumbiaAPI(auth.token);
            setAlertsColumbia(response);
            setLoadingAlertsColumbia(false);
        } catch (error) {
            setErrorAlertsColumbia(error);
            setLoadingAlertsColumbia(false);
        }
    };

    return{
        alertsColumbia,
        loadingAlertsColumbia,
        errorAlertsColumbia,
        getAlertsColumbia,
    }
}