import React, { useState, useEffect, useRef } from "react";
import "./RegistroSep.css";
import { registrarPacienteSep } from "../../../api/sep/registroSepPublico";
import {
  obtenerCiudadesPorEstado,
  obtenerEstadosPorPais,
  obtenerPaises,
  obtenerSedesPorCiudad,
} from "../../../api/sep/catalogosSepPublicos";
import logoMenteConecta from "../../../assets/img/WebBasica/logo.png";
import logoMenteConectaSaludMental from "../../../assets/img/WebBasica/logo-salud-mental.png";
import logoEducacion from "../../../assets/img/logoSep.png";
import {
  AuthFeedbackDialog,
} from "../../../components/WebBasica/AuthFeedback";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../hooks/useLanguage";
import {
  countriesData,
  getFlagEmoji,
} from "../../../components/login/formRegisterEnvejecimiento/FormRegisterEnvejecimiento";
import { MexicoFlag } from "../../../components/WebBasica/MexicoFlag/MexicoFlag";
import { useNavigate } from 'react-router-dom';
// ─── Personajes ───────────────────────────────────────────
import CHICA_LIBRETA from "../../../assets/img/WebBasica/chica_libreta.png";
import CHICA_PANTS_ROJO from "../../../assets/img/WebBasica/chica_pants_rojo.png";
import CHICA_SALTA from "../../../assets/img/WebBasica/chica_salta.png";
import CHICA_UNIFORME_ROJO from "../../../assets/img/WebBasica/chica_uniforme_rojo.png";
import CHICO_MOCHILA from "../../../assets/img/WebBasica/chico_mochila.png";
import CHICO_NARANJA from "../../../assets/img/WebBasica/chico_naranja.png";

// ─── Iconos ───────────────────────────────────────────────
import DECO_CONTAINER2 from "../../../assets/img/WebBasica/Container_2.png";
import DECO_CORAZON from "../../../assets/img/WebBasica/Corazon.png";
import DECO_ESCUDO from "../../../assets/img/WebBasica/Escudo.png";

// ─── Ilustraciones ────────────────────────────────────────
import DIAGNOSTICO_SALUD from "../../../assets/img/WebBasica/diagnostico_salud.png";
import DIAGNOSTICO from "../../../assets/img/WebBasica/diagnostico.png";

// ─── Fondos / barras del último slide ─────────────────────
import BARRA_FIGURAS from "../../../assets/img/WebBasica/ac2f239af2c0c3ecc1cbfb91c7768319a8e2944a copy.png";
import BARRA_CASA from "../../../assets/img/WebBasica/6072a240710f1418c5572e5309f518766491adcc copy.png";
import BARRA_CEREBRO from "../../../assets/img/WebBasica/07460769bc5e573ec9104027d609eb606b385e70 copy.png";

export const REGISTRO_STEP_CONTENT = {
  es: {
    2: { title: "REGISTRO", description: "Introduce tus datos" },
    3: {
      title: "REGISTRO DE INSTITUCIÓN",
      description: "Selecciona tu ubicación",
    },
    4: {
      title: "REGISTRAR",
      description: "Registra tu correo y contraseña",
    },
    5: {
      title: "CONTACTO DE EMERGENCIA",
      description: "Registra un contacto de emergencia",
    },
    6: { title: "TÉRMINOS Y CONDICIONES", description: "" },
  },
  en: {
    2: { title: "REGISTRATION", description: "Enter your information" },
    3: {
      title: "INSTITUTION REGISTRATION",
      description: "Select your location",
    },
    4: {
      title: "REGISTER",
      description: "Register your email and password",
    },
    5: {
      title: "EMERGENCY CONTACT",
      description: "Register an emergency contact",
    },
    6: { title: "TERMS AND CONDITIONS", description: "" },
  },
};
const getRegistroLanguage = (currentLanguage) =>
  currentLanguage?.startsWith("en") ? "en" : "es";

const LETTERS_ONLY_PATTERN = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
export const PHONE_PREFIX_OPTIONS = [
  ...countriesData.filter((country) => country.code === "mx"),
  ...countriesData.filter((country) => country.code !== "mx"),
].map((country) => ({
  value: country.code,
  dialCode: country.dial_code,
  flag: getFlagEmoji(country.code),
  labelEs: country.nameEs,
  labelEn: country.nameEn,
  digits: country.maxLength,
}));

const hasOnlyLetters = (value) => LETTERS_ONLY_PATTERN.test(value.trim());
const toUpperPersonInput = (value) => value.toLocaleUpperCase("es-MX");
const getPhonePrefixOption = (value) =>
  PHONE_PREFIX_OPTIONS.find((option) => option.value === value) ||
  PHONE_PREFIX_OPTIONS[0];

const FlagUs = () => (
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

const SvgGlobe = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const RegistroLanguageControl = ({ inHeader = false }) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [showLanguages, setShowLanguages] = useState(false);
  const language = getRegistroLanguage(currentLanguage);
  const isSpanish = language === "es";
  const languageLabel = t("registroSep.language.ariaLabel", { lng: language });

  const selectLanguage = (language) => {
    setLanguage(language);
    setShowLanguages(false);
  };

  return (
    <div
      className={`registro-sep-language-control${
        inHeader ? " registro-sep-language-control--in-header" : ""
      }`}
    >
      <button
        type="button"
        className="registro-sep-lang-btn"
        title={languageLabel}
        aria-label={languageLabel}
        onClick={() => setShowLanguages((current) => !current)}
      >
        <span className="registro-sep-language-trigger">
          {isSpanish ? <MexicoFlag /> : <FlagUs />}
          <SvgGlobe />
        </span>
      </button>

      {showLanguages && (
        <div className="registro-sep-language-dropdown">
          <button type="button" onClick={() => selectLanguage("en")}>
            {t("registroSep.language.english", { lng: language })}
          </button>
          <button type="button" onClick={() => selectLanguage("es")}>
            {t("registroSep.language.spanish", { lng: language })}
          </button>
        </div>
      )}
    </div>
  );
};

const SvgBack = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const getRegistroStepContent = (step, currentLanguage) => {
  const language = getRegistroLanguage(currentLanguage);
  return REGISTRO_STEP_CONTENT[language][step] || REGISTRO_STEP_CONTENT[language][2];
};

const RegistroSepHeader = ({ title, onBack, backLabel }) => (
  <header className="registro-sep-topbar">
    <button
      type="button"
      className="registro-sep-topbar__back"
      onClick={onBack}
      aria-label={backLabel}
    >
      <SvgBack />
    </button>
    <span className="registro-sep-topbar__title">{title}</span>
    <div className="registro-sep-topbar__actions">
      <RegistroLanguageControl inHeader />
    </div>
  </header>
);

const ConsentSection = ({ section }) => (
  <>
    <h3 className="sep-consent-section-title">{section.title}</h3>
    {section.paragraphs?.map((paragraph) => (
      <p key={paragraph} className="sep-consent-text">
        {paragraph}
      </p>
    ))}
    {section.items?.length ? (
      <ul className="sep-consent-list">
        {section.items.map((item, index) => (
          <li key={`${section.title}-${index}`}>
            {typeof item === "string" ? (
              item
            ) : (
              <>
                <strong>{item.strong}</strong> {item.text}
              </>
            )}
          </li>
        ))}
      </ul>
    ) : null}
  </>
);

// Conjunto fijo de decoraciones para todos los slides
const SlideDecorations = () => (
  <>
    <img
      src={DECO_CONTAINER2}
      className="deco deco--tl"
      alt=""
    />
    <img
      src={DECO_CORAZON}
      className="deco deco--tl2"
      alt=""
    />
    <img
      src={DECO_ESCUDO}
      className="deco deco--tc"
      alt=""
    />
    <img
      src={DECO_CONTAINER2}
      className="deco deco--tr"
      alt=""
    />
    <img
      src={DECO_CORAZON}
      className="deco deco--ml"
      alt=""
    />
    <img
      src={DECO_CORAZON}
      className="deco deco--ml2"
      alt=""
    />
    <img
      src={DECO_ESCUDO}
      className="deco deco--br"
      alt=""
    />
    <img
      src={DECO_CONTAINER2}
      className="deco deco--bm"
      alt=""
    />
  </>
);

// ─── SVG Icons puros para los inputs del formulario ─────────
const SvgUser = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a0aec0"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SvgMail = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a0aec0"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const SvgLock = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a0aec0"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const SvgEye = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f39c12"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SvgEyeOff = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a0aec0"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const SvgCalendar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ─── Indicadores ─────────────────────────────────────────────────────────────
const CarouselDots = ({ total, active, onDotClick, copy }) => (
  <div className="carousel-dots-wrap">
    <div
      className="carousel-dots"
      role="tablist"
      aria-label={copy.common.dotsLabel}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`carousel-dot${i === active ? " carousel-dot--active" : ""}`}
          role="tab"
          aria-selected={i === active}
          aria-label={`${copy.common.slideLabel} ${i + 1}`}
          onClick={() => onDotClick && onDotClick(i)}
          style={{ cursor: "pointer" }}
        />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 0 — Mente Conecta Salud Mental
// ─────────────────────────────────────────────────────────────────────────────
const Slide0 = ({ onGoToLogin, carouselIndex, onDotClick, copy }) => (
  <div className="carousel-slide slide-0">
    <SlideDecorations />

    <div className="slide0-titles">
      <h1 className="slide0-main-title">{copy.slide0.title}</h1>
      <h2 className="slide0-sub-title">{copy.slide0.subtitle}</h2>
    </div>

    <div className="slide0-chars-container" aria-hidden="true">
      <img
        src={CHICA_PANTS_ROJO}
        alt={copy.slide0.studentAlt}
        className="slide0-char-img"
      />
    </div>

    <CarouselDots
      total={5}
      active={carouselIndex}
      onDotClick={onDotClick}
      copy={copy}
    />

    <div className="slide0-cta">
      <button className="carousel-btn-primary" onClick={onGoToLogin}>
        {copy.slide0.accountButton}
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — Evaluaciones Psicológicas
// ─────────────────────────────────────────────────────────────────────────────
const Slide1 = ({ carouselIndex, onDotClick, copy }) => (
  <div className="carousel-slide slide-flanked">
    <SlideDecorations />

    <img
      src={CHICA_LIBRETA}
      alt={copy.slide1.leftAlt}
      className="slide-char-left"
    />

    <div className="slide-flanked-center">
      <h2 className="slide-info-title">{copy.slide1.title}</h2>
      <p className="slide-info-desc">{copy.slide1.description}</p>
      <CarouselDots
        total={5}
        active={carouselIndex}
        onDotClick={onDotClick}
        copy={copy}
      />
    </div>

    <img
      src={CHICO_MOCHILA}
      alt={copy.slide1.rightAlt}
      className="slide-char-right"
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — Consultas con Profesionales
// ─────────────────────────────────────────────────────────────────────────────
const Slide2 = ({ carouselIndex, onDotClick, copy }) => (
  <div className="carousel-slide slide-flanked">
    <SlideDecorations />

    <img
      src={CHICA_SALTA}
      alt={copy.slide2.leftAlt}
      className="slide-char-left"
    />

    <div className="slide-flanked-center">
      <h2 className="slide-info-title">{copy.slide2.title}</h2>
      <p className="slide-info-desc">{copy.slide2.description}</p>
      <CarouselDots
        total={5}
        active={carouselIndex}
        onDotClick={onDotClick}
        copy={copy}
      />
    </div>

    <img
      src={CHICO_NARANJA}
      alt={copy.slide2.rightAlt}
      className="slide-char-right"
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — Seguimiento y Estadísticas
// ─────────────────────────────────────────────────────────────────────────────
const Slide3 = ({ carouselIndex, onDotClick, copy }) => (
  <div className="carousel-slide slide-3">
    <SlideDecorations />

    {/* Diagnóstico Salud — arriba/centro */}
    <div className="slide3-top-image" aria-hidden="true">
      <img src={DIAGNOSTICO_SALUD} alt="" className="slide3-diag-salud-img" />
    </div>

    {/* Área central: texto + dots */}
    <div className="slide3-center">
      <h2 className="slide-info-title">{copy.slide3.title}</h2>
      <p className="slide-info-desc">{copy.slide3.description}</p>
      <CarouselDots
        total={5}
        active={carouselIndex}
        onDotClick={onDotClick}
        copy={copy}
      />
    </div>

    {/* Diagnóstico — abajo izquierda */}
    <div className="slide3-left-image" aria-hidden="true">
      <img src={DIAGNOSTICO} alt="" className="slide3-diag-img" />
    </div>

    {/* Chica uniforme rojo — derecha */}
    <div className="slide3-right-image">
      <img
        src={CHICA_UNIFORME_ROJO}
        alt={copy.slide3.characterAlt}
        className="slide3-char-img"
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — ¿Cuánto tiempo me llevará responder los cuestionarios?
// ─────────────────────────────────────────────────────────────────────────────
const Slide4 = ({ onRegistrarse, carouselIndex, onDotClick, copy }) => (
  <div className="carousel-slide slide-4">
    <SlideDecorations />

    <div className="slide4-content">
      <h2 className="slide4-title">{copy.slide4.title}</h2>
      <p className="slide4-desc">{copy.slide4.description}</p>

      {/* Barras verticalmente apiladas */}
      <div className="slide4-bars">
        <div
          className="slide4-bar"
          style={{ backgroundImage: `url("${BARRA_FIGURAS}")` }}
        >
          <div className="slide4-bar-overlay" />
          <span className="slide4-bar-label">
            {copy.slide4.bars.sociodemographic}
          </span>
          <span className="slide4-bar-time">
            {copy.slide4.bars.sociodemographicTime}
          </span>
        </div>
        <div
          className="slide4-bar"
          style={{ backgroundImage: `url("${BARRA_CASA}")` }}
        >
          <div className="slide4-bar-overlay" />
          <span className="slide4-bar-label">
            {copy.slide4.bars.socialDeterminant}
          </span>
          <span className="slide4-bar-time">
            {copy.slide4.bars.socialDeterminantTime}
          </span>
        </div>
        <div
          className="slide4-bar"
          style={{ backgroundImage: `url("${BARRA_CEREBRO}")` }}
        >
          <div className="slide4-bar-overlay" />
          <span className="slide4-bar-label">
            {copy.slide4.bars.mentalHealth}
          </span>
          <span className="slide4-bar-time">
            {copy.slide4.bars.mentalHealthTime}
          </span>
        </div>
      </div>

      <CarouselDots
        total={5}
        active={carouselIndex}
        onDotClick={onDotClick}
        copy={copy}
      />

      <button
        className="carousel-btn-primary slide4-register-btn"
        onClick={onRegistrarse}
      >
        {copy.slide4.registerButton}
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export const RegistroSep = ({onBack}) => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const language = getRegistroLanguage(currentLanguage);
  const registroCopy = t("registroSep", {
    lng: language,
    returnObjects: true,
  });
  const [step, setStep] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const dateInputRef = useRef(null);
  const stepRef = useRef(step);
  const carouselIndexRef = useRef(carouselIndex);
  const historyReadyRef = useRef(false);
  const previousHistoryStepRef = useRef(step);
  const previousHistoryCarouselIndexRef = useRef(carouselIndex);
  const isHistoryNavigationRef = useRef(false);
  const catalogRequestRef = useRef({
    paises: 0,
    estados: 0,
    ciudades: 0,
    sedes: 0,
  });

  const handleDatePickerClick = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (e) {
        dateInputRef.current.focus();
      }
    }
  };

  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    pais: "",
    estado: "",
    sede: "",
    ciudad: "",
    paisId: "",
    paisNombre: "",
    estadoId: "",
    estadoNombre: "",
    ciudadId: "",
    ciudadNombre: "",
    sedeId: "",
    sedeNombre: "",
    correo: "",
    password: "",
    confirmPassword: "",
    contactoNombre: "",
    contactoParentesco: "",
    contactoTelefono: "",
    contactoLada: "+52",
    contactoPaisCodigo: "mx",
    aceptaConsentimiento: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationDialog, setRegistrationDialog] = useState(null);
  const [catalogos, setCatalogos] = useState({
    paises: [],
    estados: [],
    ciudades: [],
    sedes: [],
  });
  const [catalogLoading, setCatalogLoading] = useState({
    paises: false,
    estados: false,
    ciudades: false,
    sedes: false,
  });
  const [catalogErrors, setCatalogErrors] = useState({});

  // Ocultar chatbot global en este módulo
  useEffect(() => {
    const chatbot = document.querySelector(".chatbot-container");
    if (chatbot) chatbot.style.display = "none";
    return () => {
      if (chatbot) chatbot.style.display = "block";
    };
  }, []);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    carouselIndexRef.current = carouselIndex;
  }, [carouselIndex]);

  useEffect(() => {
    const currentState = window.history.state || {};
    window.history.replaceState(
      {
        ...currentState,
        registroSepFlow: true,
        registroSepStep: stepRef.current,
        registroSepCarouselIndex: carouselIndexRef.current,
      },
      "",
      window.location.href,
    );
    historyReadyRef.current = true;

    const handlePopState = (event) => {
      const targetStep = event.state?.registroSepStep;
      const targetCarouselIndex = event.state?.registroSepCarouselIndex;

      if (Number.isInteger(targetStep) && targetStep >= 1 && targetStep <= 6) {
        isHistoryNavigationRef.current = true;
        setStep(targetStep);
        if (
          targetStep === 1 &&
          Number.isInteger(targetCarouselIndex) &&
          targetCarouselIndex >= 0 &&
          targetCarouselIndex <= 4
        ) {
          setCarouselIndex(targetCarouselIndex);
        }
        return;
      }

      if (stepRef.current === 1 && carouselIndexRef.current > 0) {
        const previousCarouselIndex = Math.max(0, carouselIndexRef.current - 1);
        isHistoryNavigationRef.current = true;
        window.history.pushState(
          {
            registroSepFlow: true,
            registroSepStep: 1,
            registroSepCarouselIndex: previousCarouselIndex,
          },
          "",
          window.location.href,
        );
        setCarouselIndex(previousCarouselIndex);
        return;
      }

      if (stepRef.current > 1) {
        const previousStep = Math.max(1, stepRef.current - 1);
        isHistoryNavigationRef.current = true;
        window.history.pushState(
          {
            registroSepFlow: true,
            registroSepStep: previousStep,
            registroSepCarouselIndex: carouselIndexRef.current,
          },
          "",
          window.location.href,
        );
        setStep(previousStep);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const sameHistoryScreen =
      previousHistoryStepRef.current === step &&
      previousHistoryCarouselIndexRef.current === carouselIndex;

    if (!historyReadyRef.current || sameHistoryScreen) {
      return;
    }

    if (isHistoryNavigationRef.current) {
      isHistoryNavigationRef.current = false;
      previousHistoryStepRef.current = step;
      previousHistoryCarouselIndexRef.current = carouselIndex;
      return;
    }

    const state = {
      registroSepFlow: true,
      registroSepStep: step,
      registroSepCarouselIndex: carouselIndex,
    };

    if (previousHistoryStepRef.current === 0 && step === 1) {
      window.history.replaceState(state, "", window.location.href);
    } else {
      window.history.pushState(state, "", window.location.href);
    }

    previousHistoryStepRef.current = step;
    previousHistoryCarouselIndexRef.current = carouselIndex;
  }, [step, carouselIndex]);

  // Limpiar errores al cambiar de paso
  useEffect(() => {
    setErrors({});
  }, [step]);

  // Timer splash screen (step 0 → step 1 automático tras 1 segundo)
  useEffect(() => {
    if (step !== 0) return;
    const timer = setTimeout(() => setStep(1), 1000);
    return () => clearTimeout(timer);
  }, [step]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo modificado inmediatamente
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const updateLocationFields = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(values).forEach((field) => delete next[field]);
      return next;
    });
  };

  const getSelectedCatalogItem = (items, id) => {
    return items.find((item) => String(item.id) === String(id));
  };

  const setCatalogLoadingField = (field, value) => {
    setCatalogLoading((prev) => ({ ...prev, [field]: value }));
  };

  const setCatalogErrorField = (field, value) => {
    setCatalogErrors((prev) => ({ ...prev, [field]: value }));
  };

  const catalogErrorMessage = registroCopy.validation.catalogLoadError;
  const isValidCatalogId = (value) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0;
  };

  useEffect(() => {
    if (step !== 3 || catalogos.paises.length) return;

    let isActive = true;
    const requestId = catalogRequestRef.current.paises + 1;
    catalogRequestRef.current.paises = requestId;
    setCatalogLoadingField("paises", true);
    setCatalogErrorField("paises", "");

    obtenerPaises()
      .then((paises) => {
        if (isActive && catalogRequestRef.current.paises === requestId) {
          setCatalogos((prev) => ({ ...prev, paises }));
        }
      })
      .catch(() => {
        if (isActive && catalogRequestRef.current.paises === requestId)
          setCatalogErrorField("paises", catalogErrorMessage);
      })
      .finally(() => {
        if (isActive && catalogRequestRef.current.paises === requestId)
          setCatalogLoadingField("paises", false);
      });

    return () => {
      isActive = false;
    };
  }, [step, catalogos.paises.length]);

  const handlePaisChange = async (paisId) => {
    const selected = getSelectedCatalogItem(catalogos.paises, paisId);
    catalogRequestRef.current.estados += 1;
    catalogRequestRef.current.ciudades += 1;
    catalogRequestRef.current.sedes += 1;

    updateLocationFields({
      paisId,
      paisNombre: selected?.label || "",
      pais: selected?.label || "",
      estadoId: "",
      estadoNombre: "",
      estado: "",
      ciudadId: "",
      ciudadNombre: "",
      ciudad: "",
      sedeId: "",
      sedeNombre: "",
      sede: "",
    });

    setCatalogos((prev) => ({ ...prev, estados: [], ciudades: [], sedes: [] }));
    setCatalogErrors((prev) => ({
      ...prev,
      estados: "",
      ciudades: "",
      sedes: "",
    }));
    setCatalogLoading((prev) => ({
      ...prev,
      estados: false,
      ciudades: false,
      sedes: false,
    }));

    if (!paisId) return;

    const requestId = catalogRequestRef.current.estados;
    setCatalogLoadingField("estados", true);
    try {
      const estados = await obtenerEstadosPorPais(paisId);
      if (catalogRequestRef.current.estados === requestId) {
        setCatalogos((prev) => ({ ...prev, estados }));
      }
    } catch (error) {
      if (catalogRequestRef.current.estados === requestId)
        setCatalogErrorField("estados", catalogErrorMessage);
    } finally {
      if (catalogRequestRef.current.estados === requestId)
        setCatalogLoadingField("estados", false);
    }
  };

  const handleEstadoChange = async (estadoId) => {
    const selected = getSelectedCatalogItem(catalogos.estados, estadoId);
    catalogRequestRef.current.ciudades += 1;
    catalogRequestRef.current.sedes += 1;

    updateLocationFields({
      estadoId,
      estadoNombre: selected?.label || "",
      estado: selected?.label || "",
      ciudadId: "",
      ciudadNombre: "",
      ciudad: "",
      sedeId: "",
      sedeNombre: "",
      sede: "",
    });

    setCatalogos((prev) => ({ ...prev, ciudades: [], sedes: [] }));
    setCatalogErrors((prev) => ({ ...prev, ciudades: "", sedes: "" }));
    setCatalogLoading((prev) => ({ ...prev, ciudades: false, sedes: false }));

    if (!estadoId) return;

    const requestId = catalogRequestRef.current.ciudades;
    setCatalogLoadingField("ciudades", true);
    try {
      const ciudades = await obtenerCiudadesPorEstado(estadoId);
      if (catalogRequestRef.current.ciudades === requestId) {
        setCatalogos((prev) => ({ ...prev, ciudades }));
      }
    } catch (error) {
      if (catalogRequestRef.current.ciudades === requestId)
        setCatalogErrorField("ciudades", catalogErrorMessage);
    } finally {
      if (catalogRequestRef.current.ciudades === requestId)
        setCatalogLoadingField("ciudades", false);
    }
  };

  const handleCiudadChange = async (ciudadId) => {
    const selected = getSelectedCatalogItem(catalogos.ciudades, ciudadId);
    catalogRequestRef.current.sedes += 1;

    updateLocationFields({
      ciudadId,
      ciudadNombre: selected?.label || "",
      ciudad: selected?.label || "",
      sedeId: "",
      sedeNombre: "",
      sede: "",
    });

    setCatalogos((prev) => ({ ...prev, sedes: [] }));
    setCatalogErrors((prev) => ({ ...prev, sedes: "" }));
    setCatalogLoading((prev) => ({ ...prev, sedes: false }));

    if (!ciudadId) return;

    const requestId = catalogRequestRef.current.sedes;
    setCatalogLoadingField("sedes", true);
    try {
      const sedes = await obtenerSedesPorCiudad(ciudadId);
      if (catalogRequestRef.current.sedes === requestId) {
        setCatalogos((prev) => ({ ...prev, sedes }));
      }
    } catch (error) {
      if (catalogRequestRef.current.sedes === requestId)
        setCatalogErrorField("sedes", catalogErrorMessage);
    } finally {
      if (catalogRequestRef.current.sedes === requestId)
        setCatalogLoadingField("sedes", false);
    }
  };

  const handleSedeChange = (sedeId) => {
    const selected = getSelectedCatalogItem(catalogos.sedes, sedeId);

    updateLocationFields({
      sedeId,
      sedeNombre: selected?.label || "",
      sede: selected?.label || "",
    });
  };

  // Validaciones por paso
  const validateStep2 = () => {
    const tempErrors = {};
    if (!formData.nombre.trim()) {
      tempErrors.nombre = registroCopy.validation.required;
    } else if (!hasOnlyLetters(formData.nombre)) {
      tempErrors.nombre = registroCopy.validation.lettersOnly;
    }

    if (!formData.apellidoPaterno.trim()) {
      tempErrors.apellidoPaterno = registroCopy.validation.required;
    } else if (!hasOnlyLetters(formData.apellidoPaterno)) {
      tempErrors.apellidoPaterno = registroCopy.validation.lettersOnly;
    }

    if (!formData.apellidoMaterno.trim()) {
      tempErrors.apellidoMaterno = registroCopy.validation.required;
    } else if (!hasOnlyLetters(formData.apellidoMaterno)) {
      tempErrors.apellidoMaterno = registroCopy.validation.lettersOnly;
    }

    if (!formData.fechaNacimiento) {
      tempErrors.fechaNacimiento = registroCopy.validation.required;
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep3 = () => {
    const tempErrors = {};

    if (!isValidCatalogId(formData.paisId)) {
      tempErrors.paisId = registroCopy.validation.required;
    }

    if (!isValidCatalogId(formData.estadoId)) {
      tempErrors.estadoId = registroCopy.validation.required;
    }

    if (!isValidCatalogId(formData.ciudadId)) {
      tempErrors.ciudadId = registroCopy.validation.required;
    }

    if (!isValidCatalogId(formData.sedeId)) {
      tempErrors.sedeId = registroCopy.validation.required;
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep4 = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      tempErrors.correo = registroCopy.validation.required;
    } else if (!emailRegex.test(formData.correo)) {
      tempErrors.correo = registroCopy.validation.emailInvalid;
    }

    if (!formData.password) {
      tempErrors.password = registroCopy.validation.required;
    } else if (formData.password.length < 6) {
      tempErrors.password = registroCopy.validation.passwordMin;
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = registroCopy.validation.required;
    } else if (formData.confirmPassword.length < 6) {
      tempErrors.confirmPassword = registroCopy.validation.passwordMin;
    } else if (
      !tempErrors.password &&
      formData.confirmPassword !== formData.password
    ) {
      tempErrors.password = registroCopy.validation.passwordMismatch;
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep5 = () => {
    const tempErrors = {};
    const selectedPhonePrefix = getPhonePrefixOption(
      formData.contactoPaisCodigo,
    );
    if (!formData.contactoNombre.trim()) {
      tempErrors.contactoNombre = registroCopy.validation.required;
    } else if (!hasOnlyLetters(formData.contactoNombre)) {
      tempErrors.contactoNombre = registroCopy.validation.lettersOnly;
    }

    if (!formData.contactoParentesco.trim()) {
      tempErrors.contactoParentesco = registroCopy.validation.required;
    } else if (!hasOnlyLetters(formData.contactoParentesco)) {
      tempErrors.contactoParentesco = registroCopy.validation.lettersOnly;
    }

    const telefonoDigits = formData.contactoTelefono.replace(/\D/g, "");
    if (!formData.contactoTelefono.trim()) {
      tempErrors.contactoTelefono = registroCopy.validation.required;
    } else if (telefonoDigits.length !== selectedPhonePrefix.digits) {
      tempErrors.contactoTelefono = registroCopy.validation.phoneInvalid;
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Navegación carrusel — NO modifica step
  const goCarouselNext = () => {
    if (carouselIndex < 4) setCarouselIndex((prev) => prev + 1);
  };
  const goCarouselPrev = () => {
    if (carouselIndex > 0) setCarouselIndex((prev) => prev - 1);
  };

  const handleDotClick = (index) => {
    setCarouselIndex(index);
  };

  const handleGoToLogin = () => {
    window.location.href = "/login-sep";
  };

  // Solo desde slide 4 → avanza a step 2
  const handleRegistrarse = () => setStep(2);
  const registroStepContent =
    registroCopy.steps?.[step] || getRegistroStepContent(step, currentLanguage);

  const handleHeaderBack = () => {
    if (step === 1 && carouselIndex > 0) {
      setCarouselIndex((prev) => prev - 1);
      return;
    }

    if (step > 1) {
      setStep((prev) => Math.max(1, prev - 1));
      return;
    }

    window.location.href = "/login-sep";
  };
const handleRegistrarFinal = async () => {
  if (!formData.aceptaConsentimiento || loading) {
    if (!loading) {
      // 1. Mostrar la alerta personalizada
      setRegistrationDialog({
        tone: "error",
        title: "Error",
        message: "Es necesario aceptar los términos y condiciones.",
        actionLabel: null,
      });

      // 2. Esperar 2 segundos para cerrar la alerta y redireccionar
      setTimeout(() => {
        setRegistrationDialog(null);
        if (typeof onBack === "function") {
          onBack();
        }else{
          navigate(-5);
        }
      }, 2000);
    }
    return;
  }

    setShowSuccess(false);
    setLoading(true);

    try {
      await registrarPacienteSep(formData);
      setShowSuccess(true);

      setTimeout(() => {
        window.location.href = "/login-sep";
      }, 1200);
    } catch (error) {
      const rawMessage =
        typeof error?.message === "string" ? error.message.trim() : "";
      const safeMessage =
        rawMessage && !/\[object Object\]/i.test(rawMessage)
          ? rawMessage
          : registroCopy.dialog.genericRegistrationError;
      const duplicateAccount =
        /ya existe una cuenta|cuenta.*registrad|correo.*(?:registrad|existe)|duplicate|already.*(?:registered|exists)|email.*(?:registered|exists)/i.test(
          safeMessage,
        );
      setRegistrationDialog({
        tone: "error",
        title: duplicateAccount
          ? registroCopy.dialog.duplicateEmailTitle
          : registroCopy.dialog.errorTitle,
        message: duplicateAccount
          ? registroCopy.dialog.duplicateEmailMessage
          : safeMessage,
        actionLabel: duplicateAccount
          ? registroCopy.dialog.accept
          : registroCopy.dialog.retry,
      });
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 0: Splash ─────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="registro-sep-page registro-splash">
        <RegistroLanguageControl />
        <div className="splash-logo-stack">
          <img
            src={logoMenteConecta}
            alt="Mente Conecta"
            className="splash-logo-mente"
          />
          <img
            src={logoEducacion}
            alt="Secretaría de Educación Pública"
            className="splash-logo-educacion"
          />
        </div>
      </div>
    );
  }

  // ── STEP 1: Carrusel ───────────────────────────────────────────────────────
  if (step === 1) {
    const slides = [
      <Slide0
        onGoToLogin={handleGoToLogin}
        carouselIndex={carouselIndex}
        onDotClick={handleDotClick}
        copy={registroCopy.carousel}
      />,
      <Slide1
        carouselIndex={carouselIndex}
        onDotClick={handleDotClick}
        copy={registroCopy.carousel}
      />,
      <Slide2
        carouselIndex={carouselIndex}
        onDotClick={handleDotClick}
        copy={registroCopy.carousel}
      />,
      <Slide3
        carouselIndex={carouselIndex}
        onDotClick={handleDotClick}
        copy={registroCopy.carousel}
      />,
      <Slide4
        onRegistrarse={handleRegistrarse}
        carouselIndex={carouselIndex}
        onDotClick={handleDotClick}
        copy={registroCopy.carousel}
      />,
    ];

    return (
      <div className="registro-sep-page registro-carousel-page">
        <RegistroLanguageControl />
        <div className="carousel-viewport" key={carouselIndex}>
          {slides[carouselIndex]}
        </div>

        {/* Flechas sutiles — solo para navegación, sin protagonismo */}
        {carouselIndex > 0 && (
          <button
            className="carousel-arrow carousel-arrow--left"
            onClick={goCarouselPrev}
            aria-label={registroCopy.carousel.common.previousSlide}
          >
            ‹
          </button>
        )}
        {carouselIndex < 4 && (
          <button
            className="carousel-arrow carousel-arrow--right"
            onClick={goCarouselNext}
            aria-label={registroCopy.carousel.common.nextSlide}
          >
            ›
          </button>
        )}
      </div>
    );
  }

  // ── STEP 2: Datos personales ───────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="registro-sep-page registro-sep-page--with-header">
        <RegistroSepHeader
          title={registroStepContent.title}
          onBack={handleHeaderBack}
          backLabel={registroCopy.common.back}
        />
        <SlideDecorations />
        <div className="sep-form-container">
          <img
            src={logoMenteConectaSaludMental}
            alt="Mente Conecta Salud Mental"
            className="sep-form-logo"
          />
          <p className="sep-form-description">{registroStepContent.description}</p>
          <div className="sep-form-fields">
            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <input
                  type="text"
                  className="sep-input"
                  placeholder={registroCopy.form.name}
                  value={formData.nombre}
                  onChange={(e) =>
                    updateField("nombre", toUpperPersonInput(e.target.value))
                  }
                />
              </div>
              {errors.nombre && (
                <span className="sep-input-error">{errors.nombre}</span>
              )}
            </div>

            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <input
                  type="text"
                  className="sep-input"
                  placeholder={registroCopy.form.paternalLastName}
                  value={formData.apellidoPaterno}
                  onChange={(e) =>
                    updateField(
                      "apellidoPaterno",
                      toUpperPersonInput(e.target.value),
                    )
                  }
                />
              </div>
              {errors.apellidoPaterno && (
                <span className="sep-input-error">
                  {errors.apellidoPaterno}
                </span>
              )}
            </div>

            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <input
                  type="text"
                  className="sep-input"
                  placeholder={registroCopy.form.maternalLastName}
                  value={formData.apellidoMaterno}
                  onChange={(e) =>
                    updateField(
                      "apellidoMaterno",
                      toUpperPersonInput(e.target.value),
                    )
                  }
                />
              </div>
              {errors.apellidoMaterno && (
                <span className="sep-input-error">
                  {errors.apellidoMaterno}
                </span>
              )}
            </div>

            <div className="sep-input-group">
              <div
                className="sep-input-wrapper sep-input-wrapper--date"
                onClick={handleDatePickerClick}
              >
                <span className="sep-input-icon-left sep-input-date-color">
                  <SvgCalendar />
                </span>
                <input
                  ref={dateInputRef}
                  type="date"
                  className={`sep-input sep-input-date${
                    formData.fechaNacimiento ? " sep-input-date--selected" : ""
                  }`}
                  value={formData.fechaNacimiento}
                  onChange={(e) =>
                    updateField("fechaNacimiento", e.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <span
                  className="sep-input-icon-right sep-input-date-picker-icon"
                  aria-hidden="true"
                >
                  <SvgCalendar />
                </span>
              </div>
              {errors.fechaNacimiento && (
                <span className="sep-input-error">
                  {errors.fechaNacimiento}
                </span>
              )}
            </div>
          </div>

          <button
            className="carousel-btn-primary sep-form-btn-submit"
            onClick={() => validateStep2() && setStep(3)}
          >
            {registroCopy.common.next}
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 3: Ubicación ──────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="registro-sep-page registro-sep-page--with-header">
        <RegistroSepHeader
          title={registroStepContent.title}
          onBack={handleHeaderBack}
          backLabel={registroCopy.common.back}
        />
        <SlideDecorations />
        <div className="sep-form-container">
          <img
            src={logoMenteConectaSaludMental}
            alt="Mente Conecta Salud Mental"
            className="sep-form-logo"
          />
          <p className="sep-form-description">{registroStepContent.description}</p>
          <div className="sep-form-fields">
            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <select
                  className="sep-select"
                  value={formData.paisId}
                  onChange={(e) => handlePaisChange(e.target.value)}
                  disabled={catalogLoading.paises}
                >
                  <option value="" disabled hidden>
                    {registroCopy.form.country}
                  </option>
                  {catalogos.paises.map((pais) => (
                    <option key={pais.id} value={pais.id}>
                      {pais.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* {catalogLoading.paises && (
                <span className="sep-input-error">
                  {registroCopy.form.loadingCountries}
                </span>
              )} */}
              {catalogErrors.paises && (
                <span className="sep-input-error">{catalogErrors.paises}</span>
              )}
              {errors.paisId && (
                <span className="sep-input-error">{errors.paisId}</span>
              )}
            </div>

            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <select
                  className="sep-select"
                  value={formData.estadoId}
                  onChange={(e) => handleEstadoChange(e.target.value)}
                  disabled={!formData.paisId || catalogLoading.estados}
                >
                  <option value="" disabled hidden>
                    {registroCopy.form.state}
                  </option>
                  {catalogos.estados.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* {catalogLoading.estados && (
                <span className="sep-input-error">
                  {registroCopy.form.loadingStates}
                </span>
              )} */}
              {catalogErrors.estados && (
                <span className="sep-input-error">{catalogErrors.estados}</span>
              )}
              {errors.estadoId && (
                <span className="sep-input-error">{errors.estadoId}</span>
              )}
            </div>

            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <select
                  className="sep-select"
                  value={formData.ciudadId}
                  onChange={(e) => handleCiudadChange(e.target.value)}
                  disabled={!formData.estadoId || catalogLoading.ciudades}
                >
                  <option value="" disabled hidden>
                    {registroCopy.form.city}
                  </option>
                  {catalogos.ciudades.map((ciudad) => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* {catalogLoading.ciudades && (
                <span className="sep-input-error">
                  {registroCopy.form.loadingCities}
                </span>
              )} */}
              {catalogErrors.ciudades && (
                <span className="sep-input-error">
                  {catalogErrors.ciudades}
                </span>
              )}
              {errors.ciudadId && (
                <span className="sep-input-error">{errors.ciudadId}</span>
              )}
            </div>

            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <select
                  className="sep-select"
                  value={formData.sedeId}
                  onChange={(e) => handleSedeChange(e.target.value)}
                  disabled={!formData.ciudadId || catalogLoading.sedes}
                >
                  <option value="" disabled hidden>
                    {registroCopy.form.campus}
                  </option>
                  {catalogos.sedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* {catalogLoading.sedes && (
                <span className="sep-input-error">
                  {registroCopy.form.loadingCampuses}
                </span>
              )} */}
              {catalogErrors.sedes && (
                <span className="sep-input-error">{catalogErrors.sedes}</span>
              )}
              {errors.sedeId && (
                <span className="sep-input-error">{errors.sedeId}</span>
              )}
            </div>
          </div>

          <button
            className="carousel-btn-primary sep-form-btn-submit"
            onClick={() => validateStep3() && setStep(4)}
          >
            {registroCopy.common.next}
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 4: Cuenta ─────────────────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="registro-sep-page registro-sep-page--with-header">
        <RegistroSepHeader
          title={registroStepContent.title}
          onBack={handleHeaderBack}
          backLabel={registroCopy.common.back}
        />
        <SlideDecorations />
        <div className="sep-form-container">
          <img
            src={logoMenteConectaSaludMental}
            alt="Mente Conecta Salud Mental"
            className="sep-form-logo"
          />
          <p className="sep-form-description">{registroStepContent.description}</p>
          <div className="sep-form-fields">
            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <span className="sep-input-icon-left">
                  <SvgMail />
                </span>
                <input
                  type="email"
                  className="sep-input"
                  placeholder={registroCopy.form.email}
                  value={formData.correo}
                  onChange={(e) => updateField("correo", e.target.value)}
                />
              </div>
              {errors.correo && (
                <span className="sep-input-error">{errors.correo}</span>
              )}
            </div>

            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <span className="sep-input-icon-left">
                  <SvgLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="sep-input"
                  placeholder={registroCopy.form.password}
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />
                <span
                  className="sep-input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <SvgEye /> : <SvgEyeOff />}
                </span>
              </div>
              {errors.password && (
                <span className="sep-input-error">{errors.password}</span>
              )}
            </div>

            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <span className="sep-input-icon-left">
                  <SvgLock />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="sep-input"
                  placeholder={registroCopy.form.confirmPassword}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                />
                <span
                  className="sep-input-icon-right"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <SvgEye /> : <SvgEyeOff />}
                </span>
              </div>
              {errors.confirmPassword && (
                <span className="sep-input-error">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          <button
            className="carousel-btn-primary sep-form-btn-submit"
            onClick={() => validateStep4() && setStep(5)}
          >
            {registroCopy.common.next}
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 5: Contacto de emergencia ─────────────────────────────────────────
  if (step === 5) {
    return (
      <div className="registro-sep-page registro-sep-page--with-header">
        <RegistroSepHeader
          title={registroStepContent.title}
          onBack={handleHeaderBack}
          backLabel={registroCopy.common.back}
        />
        <SlideDecorations />
        <div className="sep-form-container">
          <img
            src={logoMenteConectaSaludMental}
            alt="Mente Conecta Salud Mental"
            className="sep-form-logo"
          />
          <p className="sep-form-description">{registroStepContent.description}</p>
          <div className="sep-form-fields">
            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <span className="sep-input-icon-left">
                  <SvgUser />
                </span>
                <input
                  type="text"
                  className="sep-input"
                  placeholder={registroCopy.form.contactFullName}
                  value={formData.contactoNombre}
                  onChange={(e) =>
                    updateField(
                      "contactoNombre",
                      toUpperPersonInput(e.target.value),
                    )
                  }
                />
              </div>
              {errors.contactoNombre && (
                <span className="sep-input-error">{errors.contactoNombre}</span>
              )}
            </div>

            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <span className="sep-input-icon-left">
                  <SvgUser />
                </span>
                <input
                  type="text"
                  className="sep-input"
                  placeholder={registroCopy.form.relationship}
                  value={formData.contactoParentesco}
                  onChange={(e) =>
                    updateField(
                      "contactoParentesco",
                      toUpperPersonInput(e.target.value),
                    )
                  }
                />
              </div>
              {errors.contactoParentesco && (
                <span className="sep-input-error">
                  {errors.contactoParentesco}
                </span>
              )}
            </div>

            <div className="sep-input-group">
              <div className="sep-input-wrapper">
                <label
                  className="sep-phone-prefix"
                  aria-label={registroCopy.form.phonePrefixAria}
                >
                  <select
                    className="sep-phone-prefix-select"
                    value={formData.contactoPaisCodigo}
                    title={registroCopy.form.phonePrefixTitle}
                    onChange={(e) => {
                      const selected = getPhonePrefixOption(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        contactoPaisCodigo: selected.value,
                        contactoLada: selected.dialCode,
                        contactoTelefono: prev.contactoTelefono.slice(
                          0,
                          selected.digits,
                        ),
                      }));
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.contactoTelefono;
                        return next;
                      });
                    }}
                  >
                    {PHONE_PREFIX_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.flag} {option.dialCode}{" "}
                        {language === "en" ? option.labelEn : option.labelEs}
                      </option>
                    ))}
                  </select>
                </label>
                <input
                  type="tel"
                  className="sep-input"
                  placeholder={registroCopy.form.phone}
                  value={formData.contactoTelefono}
                  onChange={(e) =>
                    updateField(
                      "contactoTelefono",
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(
                          0,
                          getPhonePrefixOption(formData.contactoPaisCodigo)
                            .digits,
                        ),
                    )
                  }
                  maxLength={
                    getPhonePrefixOption(formData.contactoPaisCodigo).digits
                  }
                />
              </div>
              {errors.contactoTelefono && (
                <span className="sep-input-error">
                  {errors.contactoTelefono}
                </span>
              )}
            </div>
          </div>

          <button
            className="carousel-btn-primary sep-form-btn-submit"
            onClick={() => validateStep5() && setStep(6)}
          >
            {registroCopy.form.registerMe}
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 6: Términos y consentimiento informado ───────────────────────────
  if (step === 6) {
    return (
      <div className="registro-sep-page registro-sep-page--with-header">
        <RegistroSepHeader
          title={registroStepContent.title}
          onBack={handleHeaderBack}
          backLabel={registroCopy.common.back}
        />
        <SlideDecorations />
        <AuthFeedbackDialog
          open={Boolean(registrationDialog)}
          tone={registrationDialog?.tone || "error"}
          title={registrationDialog?.title}
          message={registrationDialog?.message}
          actionLabel={registrationDialog?.actionLabel}
          onAction={() => setRegistrationDialog(null)}
        />
        <div className="sep-consent-card">
          <h2 className="sep-consent-title">{registroCopy.consent.title}</h2>
          <p className="sep-consent-subtitle">
            {registroCopy.consent.subtitle}
          </p>
          <div className="sep-consent-divider"></div>

          {registroCopy.consent.sections.map((section) => (
            <ConsentSection key={section.title} section={section} />
          ))}

          <div className="sep-autorizo-container">
            <label className="sep-checkbox-wrapper">
              <input
                type="checkbox"
                className="sep-checkbox"
                checked={formData.aceptaConsentimiento}
                onChange={(e) =>
                  updateField("aceptaConsentimiento", e.target.checked)
                }
              />
              <span className="sep-autorizo-label">
                {registroCopy.consent.authorization.label}
              </span>
            </label>

            <p className="sep-autorizo-disclaimer">
              {registroCopy.consent.authorization.disclaimer}
            </p>

            <p className="sep-autorizo-warning">
              {registroCopy.consent.authorization.warning}
              <br />
              {registroCopy.consent.authorization.warningSecondary}
            </p>
          </div>

          <div className="sep-consent-btn-container">
            <button
              className="carousel-btn-primary sep-consent-continue-btn"
              onClick={handleRegistrarFinal}
              disabled={loading}
            >
              {loading ? registroCopy.form.registering : registroCopy.common.continue}
            </button>
          </div>
        </div>
        {/* MODAL DE CARGA Y ÉXITO */}
        {(loading || showSuccess) && (
          <div className="sep-modal-overlay">
            <div className="sep-modal-box">
              {loading ? (
                <>
                  <div className="sep-modal-text">
                    {registroCopy.form.registeringTitle}
                  </div>
                  <div className="sep-spinner"></div>
                </>
              ) : (
                <div className="sep-success-text">
                  {registroCopy.form.successRedirect}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};