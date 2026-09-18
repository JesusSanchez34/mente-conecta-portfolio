import React, { createContext, useState, useContext } from 'react';
import {
    obtenerSeccionesApi,
    obtenerCuestionariosPorSeccionApi,
    obtenerPreguntasRespuestasApi,
    obtenerRespuestasUsuarioApi,
    guardarRespuestasUsuarioApi,
    modificarRespuestasUsuarioApi,
    guardarDatosPacienteApi
} from '../api/cuestionarios';

export const CuestionarioContext = createContext();

export function CuestionarioProvider({ children }) {
    const [secciones, setSecciones] = useState([]);
    const [cuestionarios, setCuestionarios] = useState([]);
    const [nombreSeccion, setNombreSeccion] = useState("");
    const [seccionId, setSeccionId] = useState(null);
    const [preguntas, setPreguntas] = useState([]);
    const [respuestasUser, setRespuestasUser] = useState([]);
    const [respuestasBack, setRespuestasBack] = useState(null);
    const [registroTabla, setRegistroTabla] = useState({});
    const [cuestionarioId, setCuestionarioId] = useState(null);
    const [generaResultado, setGeneraResultado] = useState(0);
    const [generaResultadoSumatoria, setGeneraResultadoSumatoria] = useState(0);
    const [instrucciones, setInstrucciones] = useState("");
    const [dinamico, setDinamico] = useState(false);

    const getSecciones = async (edad, token) => {
        const res = await obtenerSeccionesApi(edad, token);
        setSecciones(res);
        return res;
    };

    const getCuestionariosPorSeccion = async (id, nombre, token) => {
        const res = await obtenerCuestionariosPorSeccionApi(id, token);
        setNombreSeccion(nombre);
        setSeccionId(id);
        setCuestionarios(res);
        return res;
    };

    const getPreguntasRespuestas = async (id, token) => {
        setPreguntas([]);
        setRespuestasUser([]);
        const res = await obtenerPreguntasRespuestasApi(id, token);
        setPreguntas(res);
        return res;
    };

    const loadRespuestasUsuario = async (userId, idQuest, token) => {
        setRespuestasBack(null);
        const res = await obtenerRespuestasUsuarioApi(userId, idQuest, token);
        if (res) {
            setRespuestasBack(res);
            try {
                if (res.respuestas_json) {
                    const parsed = JSON.parse(res.respuestas_json);
                    setRespuestasUser(parsed);
                } else {
                    setRespuestasUser([]);
                }
            } catch (e) {
                setRespuestasUser([]);
            }
        } else {
            setRespuestasUser([]);
        }
        return res;
    };

    const setRespuesta = (respuestaId, preguntaId, respuestasUserVal, calificacion, respuestaMultiOpcion, preguntaRegistro, keyRegistro, respuestaOpcion) => {
        setRespuestasUser(prev => {
            const index = prev.findIndex(item => item.preguntaId === preguntaId);
            const cleanRespVal = respuestasUserVal !== undefined ? respuestasUserVal : "";
            const payload = {
                preguntaId,
                respuestaId,
                respuestasUser: cleanRespVal,
                calificacion,
                respuestaMultiOpcion: respuestaMultiOpcion || "",
                respuestaOpcion: respuestaOpcion || ""
            };

            let updated = [...prev];
            if (index !== -1) {
                updated[index] = payload;
            } else {
                updated.push(payload);
            }
            return updated;
        });

        if (preguntaRegistro && keyRegistro) {
            const val = respuestasUserVal || respuestaOpcion || "";
            setRegistroTabla(prev => ({
                ...prev,
                [keyRegistro]: val
            }));
        }
    };

    const saveRespuestasUsuario = async (userId, idQuest, statusFinalizado, token, encuestador = 0) => {
        const payload = {
            // Matches Flutter UsuarioRespuestasModel.toJson() + encuestador field
            respuestas_json: JSON.stringify(respuestasUser.filter(r => r.preguntaId !== 0)),
            estatus_finalizado: statusFinalizado,
            id_usuario:        userId,
            id_sub_usuario:    null,
            id_seccion:        seccionId || null,
            id_cuestionario:   idQuest,
            encuestador:       encuestador,
        };
        // 🔍 LOG TEMPORAL — verificar payload antes de enviar
        console.log('%c[CuestionarioContext] saveRespuestasUsuario → PAYLOAD', 'color:#07afb8;font-weight:bold', payload);
        console.log('%c[CuestionarioContext] respuestasUser (raw)', 'color:#07afb8', respuestasUser);
        const res = await guardarRespuestasUsuarioApi(payload, token);
        // 🔍 LOG TEMPORAL — respuesta del servidor
        console.log('%c[CuestionarioContext] saveRespuestasUsuario → RESPUESTA SERVIDOR', 'color:#3aaa5c;font-weight:bold', res);
        return res;
    };

    const modificarRespuestasUsuario = async (respuestasId, userId, idQuest, statusFinalizado, token, encuestador = 0) => {
        const payload = {
            // Matches Flutter UsuarioRespuestasModel.toJson()
            respuestas_json: JSON.stringify(respuestasUser.filter(r => r.preguntaId !== 0)),
            estatus_finalizado: statusFinalizado,
            id_usuario:        userId,
            id_sub_usuario:    null,
            id_seccion:        seccionId || null,
            id_cuestionario:   idQuest,
            encuestador:       encuestador,
        };
        // 🔍 LOG TEMPORAL — verificar payload antes de modificar
        console.log('%c[CuestionarioContext] modificarRespuestasUsuario → ID', 'color:#f5a623;font-weight:bold', respuestasId);
        console.log('%c[CuestionarioContext] modificarRespuestasUsuario → PAYLOAD', 'color:#f5a623;font-weight:bold', payload);
        const res = await modificarRespuestasUsuarioApi(respuestasId, payload, token);
        // 🔍 LOG TEMPORAL — respuesta del servidor
        console.log('%c[CuestionarioContext] modificarRespuestasUsuario → RESPUESTA SERVIDOR', 'color:#3aaa5c;font-weight:bold', res);
        return res;
    };

    const saveDatosPaciente = async (userId, token) => {
        if (Object.keys(registroTabla).length === 0) return true;
        const payload = {
            ...registroTabla,
            usuario_id: userId
        };
        const res = await guardarDatosPacienteApi(payload, token);
        return res;
    };

    return (
        <CuestionarioContext.Provider value={{
            secciones,
            cuestionarios,
            nombreSeccion,
            seccionId,
            preguntas,
            respuestasUser,
            respuestasBack,
            registroTabla,
            cuestionarioId,
            generaResultado,
            generaResultadoSumatoria,
            instrucciones,
            dinamico,
            setCuestionarios,
            setNombreSeccion,
            setSeccionId,
            setPreguntas,
            setRespuestasUser,
            setRespuestasBack,
            setRegistroTabla,
            setCuestionarioId,
            setGeneraResultado,
            setGeneraResultadoSumatoria,
            setInstrucciones,
            setDinamico,
            getSecciones,
            getCuestionariosPorSeccion,
            getPreguntasRespuestas,
            loadRespuestasUsuario,
            setRespuesta,
            saveRespuestasUsuario,
            modificarRespuestasUsuario,
            saveDatosPaciente
        }}>
            {children}
        </CuestionarioContext.Provider>
    );
}

export function useCuestionario() {
    return useContext(CuestionarioContext);
}
