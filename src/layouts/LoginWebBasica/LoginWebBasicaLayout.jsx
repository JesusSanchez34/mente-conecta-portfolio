import {
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import "./LoginWebBasicaLayout.scss";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { SepFloatingMenu } from "../../components/WebBasica/SepFloatingMenu";
import { useAuth } from "../../hooks";
import {
  applyTheme,
  clearSepTheme,
  getStoredTheme,
  getThemeUserIdentifier,
} from "../../utils/theme";
import { clearSepFlowSession } from "../../utils/sepSession";
import { MexicoFlag } from "../../components/WebBasica/MexicoFlag/MexicoFlag";
import { SEP_WEB_BASICA_LOGIN_TYPE } from "../../services/authServiceWebBasica";

const TITLES = {
  "/login-web-basica": "titulos.login",
  "/login-web-basica/olvide-contrasena": "titulos.olvideContrasena",
  "/login-web-basica/verificacion": "titulos.verificacion",
  "/login-sep": "titulos.login",
  "/login-sep/olvide-contrasena": "titulos.olvideContrasena",
  "/login-sep/verificacion": "titulos.verificacion",
  "/login-sep/quien-realiza": "titulos.quienRealiza",
  "/login-sep/consentimiento": "titulos.consentimiento",
  "/login-sep/bienvenido": "titulos.bienvenidoApp",
  "/login-sep/perfil_screen": "titulos.perfil",
  "/login-sep/ayuda_screen": "titulos.configuracion",
  "/login-sep/configuracion": "titulos.configuracion",
  "/login-sep/chatbot": "titulos.chatbot",
  "/login-sep/traductor": "titulos.configuracion",
  "/login-sep/actualizaciones": "titulos.noticias",
  "/login-sep/cuestionario": "titulos.cuestionario",
  "/login-sep/cuestionario-salud-mental": "titulos.saludMental",
};

const TITLE_FALLBACKS = {
  "/login-sep/bienvenido": {
    es: "¡Bienvenido/a!",
    en: "Welcome!",
  },
};

export const TITLE_OVERRIDES = {
  "/login-sep/ayuda_screen": {
    es: "Ayuda y configuraciones",
    en: "Help and configurations",
  },
  "/login-sep/configuracion": {
    es: "Ayuda y configuraciones",
    en: "Help and configurations",
  },
  "/login-sep/chatbot": {
    es: "Chatbot",
    en: "Chatbot",
  },
  "/login-sep/perfil_screen": {
    es: "Mi perfil",
    en: "My profile",
  },
  "/login-sep/traductor": {
    es: "Ayuda y configuraciones",
    en: "Help and configurations",
  },
  "/login-sep/actualizaciones": {
    es: "Noticias",
    en: "News",
  },
  "/login-sep/cuestionario": {
    es: "Cuestionarios",
    en: "Quizzes",
  },
  "/login-sep/cuestionario-salud-mental": {
    es: "Cuestionarios",
    en: "Quizzes",
  },
};

const PUBLIC_AUTH_PATHS = new Set([
  "/login-web-basica",
  "/login-web-basica/olvide-contrasena",
  "/login-web-basica/verificacion",
  "/login-sep",
  "/login-sep/olvide-contrasena",
  "/login-sep/verificacion",
]);

const SEP_PUBLIC_AUTH_PATHS = new Set([
  "/login-sep",
  "/login-sep/olvide-contrasena",
  "/login-sep/verificacion",
]);

const LoginWebBasicaTitleContext = createContext(null);

export const shouldShowBackButton = (titleKey) =>
  titleKey !== "titulos.cambioContrasena";

export function useLoginWebBasicaTitle(titleKey) {
  const context = useContext(LoginWebBasicaTitleContext);

  useEffect(() => {
    if (!context || !titleKey) return undefined;

    context.setHeaderTitleKey(titleKey);
    return () => context.setHeaderTitleKey("");
  }, [context, titleKey]);
}

export function useLoginWebBasicaHeaderAction(action) {
  const context = useContext(LoginWebBasicaTitleContext);

  useEffect(() => {
    if (!context) return undefined;

    context.setHeaderAction(action || null);
    return () => context.setHeaderAction(null);
  }, [action, context]);
}

const FLAG_US = () => (
  <svg
    width="24"
    height="16"
    viewBox="0 0 24 16"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="United States flag"
  >
    <rect width="24" height="16" fill="#B22234" />
    <rect y="2" width="24" height="2" fill="#FFFFFF" />
    <rect y="6" width="24" height="2" fill="#FFFFFF" />
    <rect y="10" width="24" height="2" fill="#FFFFFF" />
    <rect y="14" width="24" height="2" fill="#FFFFFF" />
    <rect width="10" height="8" fill="#3C3B6E" />
  </svg>
);

const IconGlobe = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconBack = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const clearSepVisualSettings = () => {
  clearSepTheme();
  document.documentElement.style.fontSize = "";
  document.body?.classList.remove("sep-dyslexia-font", "dyslexia-font");
};

const getSettingKey = (userId, setting) => (userId ? `u_${userId}_${setting}` : null);

const getStoredVisualSetting = (userId, setting) => {
  const key = getSettingKey(userId, setting);
  return key ? localStorage.getItem(key) : null;
};

const clampFontSize = (value, useDyslexiaFont) => {
  const min = useDyslexiaFont ? 10 : 16;
  const max = useDyslexiaFont ? 14 : 20;
  const numericValue = Number(value) || min;
  return Math.min(max, Math.max(min, numericValue));
};

export const isSepWebBasicaSession = (auth) => Boolean(
  auth?.token && Number(auth?.typeLogin) === SEP_WEB_BASICA_LOGIN_TYPE,
);

export function LoginWebBasicaLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { auth, logout } = useAuth();
  const [showLanguages, setShowLanguages] = useState(false);
  const [headerTitleKey, setHeaderTitleKey] = useState("");
  const [headerAction, setHeaderAction] = useState(null);
  const hasSepSession = isSepWebBasicaSession(auth);

  useEffect(() => {
    setHeaderTitleKey("");
    setHeaderAction(null);
  }, [pathname]);

  const isInternalSepPath =
    pathname.startsWith("/login-sep/") && !PUBLIC_AUTH_PATHS.has(pathname);

  useEffect(() => {
    if (isInternalSepPath && !hasSepSession) {
      navigate("/login-sep", { replace: true });
    }
  }, [hasSepSession, isInternalSepPath, navigate]);

  useEffect(() => {
    if (!auth?.token || !SEP_PUBLIC_AUTH_PATHS.has(pathname)) return;

    const completedVerificationNavigation =
      pathname === "/login-sep/verificacion" && navigationType !== "POP";

    if (!completedVerificationNavigation) {
      clearSepFlowSession();
      logout();
    }
  }, [auth?.token, logout, navigationType, pathname]);

  useEffect(() => clearSepVisualSettings, []);

  useEffect(() => {
    if (PUBLIC_AUTH_PATHS.has(pathname)) {
      clearSepVisualSettings();
      return;
    }

    const hasInternalSepRoute = pathname.startsWith("/login-sep/");
    if (!hasInternalSepRoute) return;

    const userId = getThemeUserIdentifier({
      token: auth?.token,
      user: auth?.me,
    });
    const storedTheme = getStoredTheme(userId);
    const useDyslexiaFont = getStoredVisualSetting(userId, "isDyslexiaFont") === "true";
    const storedFontSize = clampFontSize(
      parseFloat(getStoredVisualSetting(userId, "fontSize")),
      useDyslexiaFont,
    );

    applyTheme(storedTheme);
    document.documentElement.style.fontSize = `${storedFontSize}px`;
    document.body?.classList.toggle("sep-dyslexia-font", useDyslexiaFont);
    document.body?.classList.remove("dyslexia-font");
  }, [auth?.me, auth?.token, pathname]);

  const titleContextValue = useMemo(
    () => ({ setHeaderAction, setHeaderTitleKey }),
    [],
  );

  const titleKey = headerTitleKey || TITLES[pathname] || "titulos.registro";
  const titleOverride = headerTitleKey
    ? undefined
    : TITLE_OVERRIDES[pathname]?.[currentLanguage];
  const fallbackTitle = TITLE_FALLBACKS[pathname]?.[currentLanguage];
  const title = titleOverride || t(titleKey, fallbackTitle ? { defaultValue: fallbackTitle } : undefined);
  const showBackButton = shouldShowBackButton(titleKey);

  if (isInternalSepPath && !hasSepSession) return null;

  return (
    <LoginWebBasicaTitleContext.Provider value={titleContextValue}>
      <div className="login-layout">
      <header className="login-layout__header">
        {showBackButton ? (
          <button
            className="login-layout__back-btn"
            onClick={() => navigate(-1)}
            aria-label={t("comun.atras")}
          >
            <IconBack />
          </button>
        ) : (
          <span className="login-layout__back-spacer" aria-hidden="true" />
        )}
        <span className="login-layout__header-title">{title}</span>
        <div className="login-layout__header-actions">
          {headerAction}
          <button
            className="login-layout__lang-btn"
            title={t("menu.traductor")}
            onClick={() => setShowLanguages(!showLanguages)}
          >
            <div className="language-trigger">
              {currentLanguage === "es" ? <MexicoFlag /> : <FLAG_US />}
              <IconGlobe />
            </div>
          </button>

          {showLanguages && (
            <div className="language-dropdown">
              <button
                onClick={() => {
                  setLanguage("en");
                  setShowLanguages(false);
                }}
              >
                🇺🇸 English
              </button>
              <button
                onClick={() => {
                  setLanguage("es");
                  setShowLanguages(false);
                }}
              >
                🇲🇽 Español
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="login-layout__content">{children}</main>
      <SepFloatingMenu />
      </div>
    </LoginWebBasicaTitleContext.Provider>
  );
}
