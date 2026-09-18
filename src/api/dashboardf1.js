import { BASE_API_F1 } from "../utils/constants";

// 1
export async function getDashBoardHasAlzheimerRiskApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasAlzheimerRisk/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getDashBoardHasAlcoholEvaluationApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasAlcoholEvaluation/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getDashBoardHasColumbiaQuestionnaireApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasColumbiaQuestionnaire/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getDashBoardHasDrugsQuestionnaireApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasDrugsQuestionnaire/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

// 2

export async function getDashBoardHasEatingBehaviorApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasEatingBehavior/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getDashBoardHasGAD7Api(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasGAD7/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getDashBoardHasPSL5QuestionnaireApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasPSL5Questionnaire/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getDashBoardHasPhysicalActivityApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasPhysicalActivity/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

// 3

export async function getDashBoardHasPlutchickQuestionnaireApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasPlutchickQuestionnaire/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getDashBoardHasPsychiatricSymptomsApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasPsychiatricSymptoms/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getDashBoardHasSleepQualityApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasSleepQuality/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getDashBoardHasTraumaticEventsApi(token) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasTraumaticEvents/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getOpcionesPreguntaUsuariosApi(token, id) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/GetOpcionesPreguntaUsuarios/${id}/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

// funciona

export async function getHasPHQ9sApi(token, id) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasPHQ9/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getHasResilienceScaleApi(token, id) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasResilienceScale/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getHasTobaccoEvaluationApi(token, id) {
    try {
        const url = `${BASE_API_F1}/dashboards/Dashbord_Admin/HasTobaccoEvaluation/`;
        const params = {
            headers: {},
        };

        const response = await fetch(url, params);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}