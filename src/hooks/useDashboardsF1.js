import { useState } from "react";
import { useAuth } from ".";
import { getDashBoardHasAlcoholEvaluationApi, getDashBoardHasAlzheimerRiskApi, getDashBoardHasColumbiaQuestionnaireApi, getDashBoardHasDrugsQuestionnaireApi, getDashBoardHasEatingBehaviorApi, getDashBoardHasGAD7Api, getDashBoardHasPhysicalActivityApi, getDashBoardHasPlutchickQuestionnaireApi, getDashBoardHasPSL5QuestionnaireApi, getDashBoardHasPsychiatricSymptomsApi, getDashBoardHasSleepQualityApi, getDashBoardHasTraumaticEventsApi, getHasPHQ9sApi, getHasResilienceScaleApi, getHasTobaccoEvaluationApi, getOpcionesPreguntaUsuariosApi } from "../api/dashboardf1";


export function useDashboardsF1() {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [pacientes, setPacientes] = useState(undefined);


    const getDashBoardHasAlzheimerRisk = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasAlzheimerRiskApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getDashBoardHasAlcoholEvaluation = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasAlcoholEvaluationApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getDashBoardHasColumbiaQuestionnaire = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasColumbiaQuestionnaireApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getDashBoardHasDrugsQuestionnaire = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasDrugsQuestionnaireApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getDashBoardHasEatingBehavior = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasEatingBehaviorApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getDashBoardHasGAD7 = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasGAD7Api(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getDashBoardHasPSL5Questionnaire = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasPSL5QuestionnaireApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getDashBoardHasPhysicalActivity = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasPhysicalActivityApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getDashBoardHasPlutchickQuestionnaire = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasPlutchickQuestionnaireApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getDashBoardHasPsychiatricSymptoms = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasPsychiatricSymptomsApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getDashBoardHasSleepQuality = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasSleepQualityApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getDashBoardHasTraumaticEvents = async () => {
        setLoading(true);
        try {
            const result = await getDashBoardHasTraumaticEventsApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const getOpcionesPreguntaUsuarios = async (id) => {
        setLoading(true);
        try {
            const result = await getOpcionesPreguntaUsuariosApi(auth.token, id);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    // funciona
    const getHasPHQ9s = async () => {
        setLoading(true);
        try {
            const result = await getHasPHQ9sApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getHasResilienceScale = async () => {
        setLoading(true);
        try {
            const result = await getHasResilienceScaleApi(auth.token);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getHasTobaccoEvaluation = async () => {
        setLoading(true);
        try {
            const result = await getHasTobaccoEvaluationApi(auth.token);
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
        getDashBoardHasColumbiaQuestionnaire,
        getDashBoardHasDrugsQuestionnaire,
        getDashBoardHasEatingBehavior,
        getDashBoardHasGAD7,
        getDashBoardHasPSL5Questionnaire,
        getDashBoardHasPhysicalActivity,
        getDashBoardHasPlutchickQuestionnaire,
        getDashBoardHasPsychiatricSymptoms,
        getDashBoardHasSleepQuality,
        getDashBoardHasTraumaticEvents,
        getOpcionesPreguntaUsuarios,
        getDashBoardHasAlzheimerRisk,
        getDashBoardHasAlcoholEvaluation,
        getHasPHQ9s,
        getHasResilienceScale,
        getHasTobaccoEvaluation,
    }
}