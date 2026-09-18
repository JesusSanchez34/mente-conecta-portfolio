// HOOKS PARA GRAFICAS DE CONASAMA

import { useState } from "react";
import { useAuth } from "../useAuth";
import { 
    getConteoPorNivelRiesgoCategoriaBySedeApi, 
    getGraficasPreguntasBySedeApi, 
    getRangoDePreguntasBySedeApi,
    getConteoPorNivelRiesgoCategoriaApi,
    getGraficasPreguntasApi,
    getRangoDePreguntasApi
} from "../../api/conasama/graficasEstadisticas";

export function useGraficasConasama() {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [pacientes, setPacientes] = useState(null);

    //////////////////////////////////////
    //     GRAFICAS DEL SUPERGESTOR     //
    //////////////////////////////////////

    const getConteoPorNivelRiesgoCategoriaBySede = async (idSede) => {
        setLoading(true);
        try {
            const result = await getConteoPorNivelRiesgoCategoriaBySedeApi(auth.token, idSede);
            setPacientes(result);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getGraficasPreguntasBySede = async (idSede) => {
        setLoading(true);
        try {
            const result = await getGraficasPreguntasBySedeApi(auth.token, idSede);
            setPacientes(result);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getRangoDePreguntasBySede = async (idSede) => {
        setLoading(true);
        try {
            const result = await getRangoDePreguntasBySedeApi(auth.token, idSede);
            setPacientes(result);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    ///////////////////////////////////////
    //        GRAFICAS DEL GESTOR        //
    ///////////////////////////////////////

    const getConteoPorNivelRiesgoCategoria = async () => {
        setLoading(true);
        try {
            const result = await getConteoPorNivelRiesgoCategoriaApi(auth.token);
            setPacientes(result);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getGraficasPreguntas = async () => {
        setLoading(true);
        try {
            const result = await getGraficasPreguntasApi(auth.token);
            setPacientes(result);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getRangoDePreguntas = async () => {
        setLoading(true);
        try {
            const result = await getRangoDePreguntasApi(auth.token);
            setPacientes(result);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        pacientes,
        getConteoPorNivelRiesgoCategoriaBySede,
        getGraficasPreguntasBySede,
        getRangoDePreguntasBySede,
        getConteoPorNivelRiesgoCategoria,
        getGraficasPreguntas,
        getRangoDePreguntas
    };
}