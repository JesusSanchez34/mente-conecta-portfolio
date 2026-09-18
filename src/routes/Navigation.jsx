import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import routes from "./routes";
import ChatBot from "../components/Chat/ChatBot";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../hooks";
import {
  applyTheme,
  clearSepTheme,
  getStoredTheme,
  getThemeUserIdentifier,
} from "../utils/theme";

const RUTAS_SIN_CHATBOT = [
  "/registro-sep",
  "/login-sep",
  "/login-sep/olvide-contrasena",
  "/login-sep/verificacion",
  "/login-sep/quien-realiza",
  "/login-sep/consentimiento",
  "/login-sep/perfil_screen",
  "/login-sep/configuracion",
  "/login-sep/chatbot",
  "/login-sep/actualizaciones",
];

const isSepRoute = (pathname) =>
  pathname === "/registro-sep" || pathname.startsWith("/login-sep");

const ENV_EXACT_ROUTES = new Set([
  "/preview",
  "/tutorial",
  "/loginmen",
  "/registro",
  "/quien-lo-realiza",
  "/consentimiento",
  "/asentimiento",
  "/inicio-paciente",
  "/secciones",
  "/olvide-contrasena",
  "/verificar-codigo",
  "/nueva-contrasena",
  "/perfil-paciente",
  "/configuracion",
  "/marcadores-biologicos",
  "/CuestionarioEdadCelularPantalla",
  "/ValorLongitudRelativa",
  "/Cuestionario_Glucosa",
  "/Deterioro_Cognitivo",
  "/semaforo-deterioro-cognitivo",
  "/envejecimiento-saludable",
  "/secuenciavistas",
  "/ResultadoSecuenciasVistasScreen",
  "/genotipo",
]);

const isEnvRoute = (pathname) =>
  ENV_EXACT_ROUTES.has(pathname) ||
  pathname.startsWith("/envejecimiento/") ||
  pathname.startsWith("/preguntas/") ||
  pathname.startsWith("/reporte/");

const getUserSettingKey = (userId, setting) =>
  userId ? `u_${userId}_${setting}` : null;

const getStoredUserSetting = (userId, setting, fallback) => {
  const key = getUserSettingKey(userId, setting);
  return key ? localStorage.getItem(key) : fallback;
};

function clearSepPreferences() {
  clearSepTheme();
  document.body.classList.remove("sep-dyslexia-font", "dyslexia-font");
}

function clearEnvPreferences() {
  document.documentElement.style.removeProperty("--env-font-size");
  document.body.classList.remove("env-dark-mode", "env-dyslexia-font");
}

function RoutePreferencesSync() {
  const { pathname } = useLocation();
  const { auth } = useAuth();
  const { fontSize, isDarkMode, isDyslexiaFont } = useSettings();

  useEffect(() => {
    const sepRoute = isSepRoute(pathname);
    const envRoute = isEnvRoute(pathname);

    if (sepRoute) {
      clearEnvPreferences();

      const userThemeId = getThemeUserIdentifier({
        token: auth?.token,
        user: auth?.me,
      });

      applyTheme(getStoredTheme(userThemeId));

      const storedFontSize = getStoredUserSetting(userThemeId, "fontSize", "16");
      const storedDyslexia =
        getStoredUserSetting(userThemeId, "isDyslexiaFont", "false") === "true";

      document.documentElement.style.fontSize = `${storedFontSize || "16"}px`;
      document.body.classList.toggle("sep-dyslexia-font", storedDyslexia);
      document.body.classList.remove("dyslexia-font");
      return;
    }

    if (envRoute) {
      clearSepPreferences();
      document.documentElement.style.setProperty("--env-font-size", `${fontSize}px`);
      document.documentElement.style.fontSize = `${fontSize}px`;
      document.body.classList.toggle("env-dark-mode", isDarkMode);
      document.body.classList.toggle("env-dyslexia-font", isDyslexiaFont);
      return;
    }

    clearSepPreferences();
    clearEnvPreferences();
    document.documentElement.style.fontSize = "";
  }, [auth?.me, auth?.token, fontSize, isDarkMode, isDyslexiaFont, pathname]);

  return null;
}

function AppRoutes() {
  const { pathname } = useLocation();
  const ocultarChat =
    RUTAS_SIN_CHATBOT.includes(pathname) || pathname.startsWith("/login-sep/");

  return (
    <>
      <RoutePreferencesSync />
      <Routes>
        {routes.map((route, index) => {
          const Component = route.component;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <route.layout>
                  <Component {...(route.props || {})} />
                </route.layout>
              }
            />
          );
        })}
      </Routes>
      {!ocultarChat && <ChatBot />}
    </>
  );
}

export function Navigation() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
