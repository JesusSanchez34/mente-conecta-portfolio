import { useState } from "react";
import { useAuth } from "../useAuth";
import { getNivelRiesgoBySede } from "../../api/conasama/nivelRiesgoBySede";

export function useNivelRiesgoBySede() {
  const { auth } = useAuth();

  const [dataBySede, setDataBySede] = useState({});
  const [loadingBySede, setLoadingBySede] = useState(false);
  const [errorBySede, setErrorBySede] = useState(null);

  const getSedeData = async (sedeId) => {
    if (!sedeId || !auth?.token) return;

    try {
      setLoadingBySede(true);
      setErrorBySede(null);

      const response = await getNivelRiesgoBySede(auth.token, sedeId);

      setDataBySede((prev) => ({
        ...prev,
        [sedeId]: response || [],
      }));

      return response;
    } catch (error) {
      setErrorBySede(error);
      console.error(error);
    } finally {
      setLoadingBySede(false);
    }
  };

  return {
    dataBySede,
    loadingBySede,
    errorBySede,
    getSedeData,
  };
}