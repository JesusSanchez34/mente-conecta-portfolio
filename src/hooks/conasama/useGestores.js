import { useState } from "react";
import { useAuth } from "..";
import { getOptionsCatalogoApi, getHospitalesApi } from "../../api/conasama/catalogo";
import { registerGestorApi, getGestoresApi } from "../../api/conasama/gestores";

export function useGestores() {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [gestores, setGestores] = useState(null);
    const [hospitales, setHospitales] = useState(null);

    const getCatalogosGestores = async () => {
        setLoading(true);
        try {
            const result = await getOptionsCatalogoApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getHospitales = async () => {
        setLoading(true);
        try {
            const result = await getHospitalesApi(auth.token);
            setHospitales(result);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getGestores = async () => {
        setLoading(true);
        try {
            const result = await getGestoresApi(auth.token);
            setGestores(result);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const nuevoGestor = async (data) => {
        setLoading(true);
        try {
            const result = await registerGestorApi(data, auth.token);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        gestores,
        hospitales,
        getCatalogosGestores,
        getHospitales,
        getGestores,
        nuevoGestor
    }
}