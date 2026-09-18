import { useContext } from "react";
import { CuestionarioContext } from "../context/CuestionarioContext";

export const useCuestionario = () => useContext(CuestionarioContext);
