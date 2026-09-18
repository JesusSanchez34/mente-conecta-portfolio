import { useState, useCallback } from 'react';
import { useAuth } from '../useAuth';
import {
  getGestoresSeP,
  registerGestorSeP,
  getConteoNivelRiesgoSePBySedeApi,
  getConteoNivelRiesgoSePAdminApi,
  getCiudadesByEstadoApi,
} from '../../api/sep';
import { getTiposPacienteSeP, getHospitalesSeP, getPaisApi,getEstadosByPaisApi} from '../../api/sep';

/**
 * Hook para gestión de gestores en SEP
 * Propósito: Listar, registrar y configurar gestores
 */
export function useGestoresSEP() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gestores, setGestores] = useState([]);
  const [hospitales, setHospitales] = useState([]);
  const [error, setError] = useState(null);

  const getCatalogosGestores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tipos = await getTiposPacienteSeP(auth.token);
      // Aquí puedes procesar los tipos si es necesario
      return tipos;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  const getHospitales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHospitalesSeP(auth.token);
      setHospitales(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  const getGestores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGestoresSeP(auth.token);
      setGestores(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  const nuevoGestor = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError(null);
        const response = await registerGestorSeP(data, auth.token);
        // Actualizar lista de gestores
        await getGestores();
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );

  const getConteoNivelRiesgo = useCallback(
    async (idSede) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getConteoNivelRiesgoSePBySedeApi(idSede, auth.token);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [auth.token]
  );
  const getPaises=useCallback(async ()=>{
        setLoading(true);
        try{
            const result=  await getPaisApi();
            return result;

        }
        catch(error){
            console.log(error);
            throw error;
        }finally {
            setLoading(false);
        }
    });

    const getEstadosByPais= useCallback(async (idPais ) => {
      setLoading(true);
      try{
        const result=await getEstadosByPaisApi(idPais);
        return result;
      }
      catch(error){
            console.log(error);
            throw error;
        }finally {
            setLoading(false);
        }
    });
    const getCiudadesByEstado =useCallback(async (idEstado) => {
      setLoading(true);
      try{
        const result=await getCiudadesByEstadoApi(idEstado);
        return result;
      }
      catch(error){
            console.log(error);
            throw error;
        }finally {
            setLoading(false);
        }
    });
  const getConteoNivelRiesgoAdmin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConteoNivelRiesgoSePAdminApi(auth.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  return {
    loading,
    gestores,
    hospitales,
    error,
    getCatalogosGestores,
    getHospitales,
    getGestores,
    nuevoGestor,
    getConteoNivelRiesgo,
    getConteoNivelRiesgoAdmin,
    getPaises,
    getEstadosByPais,
    getCiudadesByEstado,
  };
}
