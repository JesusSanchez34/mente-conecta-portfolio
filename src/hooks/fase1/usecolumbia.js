import { useState } from "react";

import {
    getTableDataAlertsColumbiaAPI,
    setMarkPatientSeenAPI
} from '../../api/fase1/columbiaCuestionarie';
import { useAuth } from "../useAuth";

export function useColumbia() {
    const [ columbiaPatiensInAlert, setColumbiaPatiensInAlert ] = useState(undefined)
    const [ loadingColumbia, setLoadingColumbia ] = useState(false)
    const [ errorColumbia, setErrorColumbia ] = useState(undefined);
    const { auth } = useAuth();

    const getTableDataAlertsColumbia = async () => {
        try {
            setLoadingColumbia(true);
            const response = await getTableDataAlertsColumbiaAPI(auth.token);
            setColumbiaPatiensInAlert(response);
            setLoadingColumbia(false);
        } catch (error) {
            setErrorColumbia(error);
            setLoadingColumbia(false);
        }
    };

    const setMarkPatientSeen = async (idRegister) => {
        try {
            setLoadingColumbia(true);
            await setMarkPatientSeenAPI(auth.token, idRegister);
            setLoadingColumbia(false);
        } catch (error) {
            setErrorColumbia(error);
            setLoadingColumbia(false);
        }
    }

    return {
        columbiaPatiensInAlert,
        loadingColumbia,
        errorColumbia,
        getTableDataAlertsColumbia,
        setMarkPatientSeen
    }
}