// HOOK PARA PACIENTES SENSIBLES CONASAMA

import { useState } from "react";
import { useAuth } from "../useAuth";
import { getPacientesSensiblesApi } from '../../api/conasama/pacientesSensibles';

export function usePacientesSensibles() {
    const { auth } = useAuth();
    const [pacientesSensibles, setPacientesSensibles] = useState([]);
    const [loadingPacientes, setLoadingPacientes] = useState(false);
    const [errorPacientes, setErrorPacientes] = useState(null);

    const getPacientesSensibles = async () => {
        try {
            setLoadingPacientes(true);
            setErrorPacientes(null);
            const response = await getPacientesSensiblesApi(auth.token);
            setPacientesSensibles(response);
            setLoadingPacientes(false);
        } catch (error) {
            setLoadingPacientes(false);
            setErrorPacientes(error);
        }
    };

    return {
        pacientesSensibles,
        loadingPacientes,
        errorPacientes,
        getPacientesSensibles,
    }
}
