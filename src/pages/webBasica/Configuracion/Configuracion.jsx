import React, { useState, useEffect } from "react";
import "./Configuracion.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  IoBookOutline,
  IoCheckmarkCircleOutline,
  IoEyeOutline,
  IoHeartOutline,
  IoRadioButtonOffOutline,
  IoShieldOutline,
} from "react-icons/io5";
import iconosDecoracion from "../../../assets/img/WebBasica/iconos-decoracion.png";
import personajesConfiguracion from "../../../assets/img/WebBasica/chica_pants_rojo.png";
import { AuthFeedbackBar } from "../../../components/WebBasica/AuthFeedback";
import { useAuth } from "../../../hooks";
import {
  applyTheme,
  getStoredTheme,
  getThemeUserIdentifier,
  saveTheme,
} from "../../../utils/theme";

const getKey = (userId, setting) => userId ? `u_${userId}_${setting}` : null;

const getStoredSetting = (userId, setting) => {
  const key = getKey(userId, setting);
  return key ? localStorage.getItem(key) : null;
};

const setStoredSetting = (userId, setting, value) => {
  const key = getKey(userId, setting);
  if (key) localStorage.setItem(key, value);
};

const getFontBounds = (isDyslexiaFont) => (
  isDyslexiaFont ? { min: 10, max: 14 } : { min: 16, max: 20 }
);

const clampFontSize = (value, isDyslexiaFont) => {
  const { min, max } = getFontBounds(isDyslexiaFont);
  const numericValue = Number(value) || min;
  return Math.min(max, Math.max(min, numericValue));
};

const cargarConfig = (userId) => ({
  isDyslexiaFont: getStoredSetting(userId, "isDyslexiaFont") === "true",
  isDarkMode: getStoredTheme(userId) === "dark",
});

const guardarConfig = (userId, config) => {
  setStoredSetting(userId, "fontSize", config.fontSize);
  setStoredSetting(userId, "isDyslexiaFont", config.isDyslexiaFont);
  saveTheme(config.isDarkMode ? "dark" : "light", userId);
};

export function Configuracion() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [userId, setUserId] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [tema, setTema] = useState("claro");
  const [modoLectura, setModoLectura] = useState("normal");
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const uid = getThemeUserIdentifier({
      token: auth?.token,
      user: auth?.me,
    });

    setUserId(uid);

    const config = cargarConfig(uid);
    const storedFontSize = parseFloat(getStoredSetting(uid, "fontSize"));
    const safeFontSize = clampFontSize(storedFontSize, config.isDyslexiaFont);
    setFontSize(safeFontSize);
    setTema(config.isDarkMode ? "oscuro" : "claro");
    setModoLectura(config.isDyslexiaFont ? "dislexia" : "normal");
    applyTheme(config.isDarkMode ? "dark" : "light");
  }, [auth?.me, auth?.token]);

  const handleTemaChange = (nuevoTema) => {
    setTema(nuevoTema);
    applyTheme(nuevoTema === "oscuro" ? "dark" : "light");
  };

  const handleFontSizeChange = (value) => {
    const nextSize = clampFontSize(value, modoLectura === "dislexia");
    setFontSize(nextSize);
    document.documentElement.style.fontSize = `${nextSize}px`;
  };

  const handleModoLecturaChange = (modo) => {
    setModoLectura(modo);
    const isDyslexiaFont = modo === "dislexia";
    const nextSize = clampFontSize(fontSize, isDyslexiaFont);
    setFontSize(nextSize);
    document.documentElement.style.fontSize = `${nextSize}px`;
    document.body.classList.toggle("sep-dyslexia-font", modo === "dislexia");
    document.body.classList.remove("dyslexia-font");
  };

  const handleGuardar = () => {
    const config = {
      fontSize,
      isDyslexiaFont: modoLectura === "dislexia",
      isDarkMode: tema === "oscuro",
    };
    guardarConfig(userId, config);
    document.documentElement.style.fontSize = `${fontSize}px`;
    if (modoLectura === "dislexia") {
      document.body.classList.add("sep-dyslexia-font");
    } else {
      document.body.classList.remove("sep-dyslexia-font");
    }
    document.body.classList.remove("dyslexia-font");
    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
      navigate("/login-sep/bienvenido");
    }, 700);
  };

  const fontBounds = getFontBounds(modoLectura === "dislexia");
  const language = i18n.language?.startsWith("en") ? "en" : "es";
  const modoLecturaText = language === "en" ? "Reading mode selector" : "Selector de modo de lectura";
  const letraNormalText = language === "en" ? "Normal Font" : "Letra Normal";
  const modoDislexiaText = language === "en" ? "Dyslexia" : "Modo Dislexia";

  return (
    <div className="config">
      <AuthFeedbackBar message={guardado ? t("configuracion.guardado") : ""} tone="success" />
      <img src={iconosDecoracion} alt="" className="config__deco config__deco--left" aria-hidden="true" />
      <img src={iconosDecoracion} alt="" className="config__deco config__deco--right" aria-hidden="true" />

      <div className="config__center">
        <div className="config__card">
          {/* Tamaño de letra */}
          <div className="config__section">
            <p className="config__section-title">{t("configuracion.tamanoLetra")}</p>
            <div className="config__slider-wrap">
              <span className="config__slider-label config__slider-label--small">a</span>
              <input
                type="range"
                min={fontBounds.min}
                max={fontBounds.max}
                step="1"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="config__slider"
              />
              <span className="config__slider-label config__slider-label--big">A</span>
            </div>
            <p className="config__slider-value">{t("configuracion.tamanoActual")} {fontSize}px</p>
          </div>

          <div className="config__divider" />

          {/* Apariencia visual */}
          <div className="config__section">
            <div className="config__appearance-card">
              <p className="config__section-title">{t("configuracion.apariencia")}</p>
              <p className="config__section-sub">{t("configuracion.eligeTema")}</p>
              <div className="config__temas">
                <button
                  className={`config__tema ${tema === "claro" ? "config__tema--activo" : ""}`}
                  onClick={() => handleTemaChange("claro")}
                  aria-pressed={tema === "claro"}
                >
                  <div className="config__tema-preview config__tema-preview--claro">
                    <IoHeartOutline className="config__preview-heart" aria-hidden="true" />
                    <IoShieldOutline className="config__preview-shield" aria-hidden="true" />
                  </div>
                  <span>{t("configuracion.claro")}</span>
                  {tema === "claro" ? (
                    <IoCheckmarkCircleOutline className="config__tema-check" aria-hidden="true" />
                  ) : (
                    <IoRadioButtonOffOutline className="config__tema-check" aria-hidden="true" />
                  )}
                </button>
                <button
                  className={`config__tema ${tema === "oscuro" ? "config__tema--activo" : ""}`}
                  onClick={() => handleTemaChange("oscuro")}
                  aria-pressed={tema === "oscuro"}
                >
                  <div className="config__tema-preview config__tema-preview--oscuro">
                    <IoHeartOutline className="config__preview-heart" aria-hidden="true" />
                    <IoShieldOutline className="config__preview-shield" aria-hidden="true" />
                  </div>
                  <span>{t("configuracion.oscuro")}</span>
                  {tema === "oscuro" ? (
                    <IoCheckmarkCircleOutline className="config__tema-check" aria-hidden="true" />
                  ) : (
                    <IoRadioButtonOffOutline className="config__tema-check" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="config__divider" />

          {/* Modo lectura */}
          <div className="config__section">
            <p className="config__section-title">{modoLecturaText}</p>
            <div className="config__modos">
              <button
                className={`config__modo ${modoLectura === "normal" ? "config__modo--activo" : ""}`}
                onClick={() => handleModoLecturaChange("normal")}
              >
                <IoBookOutline aria-hidden="true" />
                {letraNormalText}
              </button>
              <button
                className={`config__modo ${modoLectura === "dislexia" ? "config__modo--activo" : ""}`}
                onClick={() => handleModoLecturaChange("dislexia")}
              >
                <IoEyeOutline aria-hidden="true" />
                {modoDislexiaText}
              </button>
            </div>
          </div>

          <button className="config__btn" onClick={handleGuardar}>
            {t("configuracion.guardar")}
          </button>
          <img
            src={personajesConfiguracion}
            alt=""
            className="config__characters"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
