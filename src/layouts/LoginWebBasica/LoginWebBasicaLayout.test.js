import {
  isSepWebBasicaSession,
  shouldShowBackButton,
  TITLE_OVERRIDES,
} from "./LoginWebBasicaLayout";
import { RECOVERY_TITLE_BY_STEP } from "../../pages/webBasica/LoginWebBasica/OlvideContraseña/OlvideContrasena";

describe("encabezado de SEP Web Básica", () => {
  test("reconoce como interna solo la sesion de SEP Basica", () => {
    expect(isSepWebBasicaSession({ token: "token", typeLogin: 4 })).toBe(true);
    expect(isSepWebBasicaSession({ token: "token", typeLogin: 5 })).toBe(false);
    expect(isSepWebBasicaSession({ token: "", typeLogin: 4 })).toBe(false);
  });

  test("usa los títulos solicitados para Chatbot y Noticias", () => {
    expect(TITLE_OVERRIDES["/login-sep/chatbot"]).toEqual({
      es: "Chatbot",
      en: "Chatbot",
    });
    expect(TITLE_OVERRIDES["/login-sep/actualizaciones"]).toEqual({
      es: "Noticias",
      en: "News",
    });
  });

  test("mantiene Cambio de contraseña en los pasos finales", () => {
    expect(RECOVERY_TITLE_BY_STEP[4]).toBe("titulos.cambioContrasena");
    expect(RECOVERY_TITLE_BY_STEP[5]).toBe("titulos.cambioContrasena");
  });

  test("oculta la flecha sólo durante el cambio de contraseña", () => {
    expect(shouldShowBackButton("titulos.cambioContrasena")).toBe(false);
    expect(shouldShowBackButton("titulos.verificacion")).toBe(true);
    expect(shouldShowBackButton("titulos.registro")).toBe(true);
    expect(shouldShowBackButton("titulos.perfil")).toBe(true);
  });
});
