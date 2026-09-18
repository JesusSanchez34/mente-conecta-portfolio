import { BASE_API_NX } from "../../utils/constants";

export async function getTableDataAlertsColumbiaAPI(token) {
  try {
    const url = `${BASE_API_NX}/dashboards/Dashbord_Admin/TablaPacientesAlertaColumbia/`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function setMarkPatientSeenAPI(token, idRegister) {
  try {
    const url = `${BASE_API_NX}/user/columbia-pacientes/MarcarPacienteAtendido/${idRegister}/`;
    const params = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, params);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}
