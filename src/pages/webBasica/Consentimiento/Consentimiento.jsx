import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/WebBasica/Button/Button";
import { AuthFeedbackBar } from "../../../components/WebBasica/AuthFeedback";
import { useAuth } from "../../../hooks";
import { getToken } from "../../../api/token";
import { aceptarTerminosWebBasica } from "../../../services/authServiceWebBasica";
import "./Consentimiento.scss";
import iconosDecoracion from "../../../assets/img/WebBasica/iconos-decoracion.png";

const TIPOS_VALIDOS = ["consentimiento", "asentimiento"];
const QUIEN_REALIZA_VALIDOS = ["personal", "personal_salud", "familiar"];
const NEXT_STEP_ROUTE = "/login-sep/bienvenido";

const IconDocument = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const IconLock = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const DOCUMENTOS = {
  consentimiento: {
    titulo: "Consentimiento Informado",
    declaracionTitulo: "Declaración de consentimiento",
    declaracion:
      "He leído esta carta de consentimiento para el proyecto Mente Conecta. Entiendo la información proporcionada y doy mi consentimiento para participar.",
    secciones: [
      {
        titulo: "Objetivo",
        color: "#f39301",
        texto:
          "El objetivo de este estudio es evaluar su estado de salud integral y detectar de manera oportuna riesgos asociados a las adicciones, mediante la aplicación de cuestionarios y procedimientos biológicos que nos permitirán conocer su situación actual y ofrecerle acompañamiento especializado si así lo requiere.",
      },
      {
        titulo: "Propósito",
        color: "#62c254",
        texto:
          "Implementar un sistema de detección y atención temprana en materia de adicciones, con el fin de ofrecerle distintas intervenciones y herramientas que puedan favorecer su bienestar emocional y calidad de vida.",
      },
      {
        titulo: "Confidencialidad",
        color: "#35a8d8",
        texto:
          "Toda la información que nos proporcione será tratada con absoluta confidencialidad y utilizada únicamente con fines de evaluación y mejora de su salud.",
      },
      {
        titulo: "Coordinación del programa y protección",
        color: "#7b68ee",
        texto:
          "El equipo de Mente Conecta será responsable de orientarle durante su participación. La protección de sus datos personales estará a cargo del equipo profesional que atiende su caso.",
      },
    ],
  },
  asentimiento: {
    titulo: "Asentimiento Informado",
    declaracionTitulo: "Declaración de asentimiento",
    declaracion:
      "He leído esta carta de asentimiento para el proyecto Mente Conecta. Entiendo la información proporcionada y doy mi asentimiento para participar.",
    secciones: [
      {
        titulo: "Objetivo",
        color: "#f39301",
        texto:
          "El objetivo de este estudio es evaluar el estado de salud integral y detectar de manera oportuna riesgos asociados a las adicciones.",
      },
      {
        titulo: "Propósito",
        color: "#62c254",
        texto:
          "Implementar un sistema de detección y atención temprana en materia de adicciones, con el fin de ofrecer intervenciones y herramientas que puedan favorecer el bienestar emocional y la calidad de vida.",
      },
      {
        titulo: "Confidencialidad",
        color: "#35a8d8",
        texto:
          "Toda la información proporcionada será tratada con absoluta confidencialidad y utilizada únicamente con fines de evaluación y mejora de la salud.",
      },
      {
        titulo: "Coordinación del programa y protección",
        color: "#7b68ee",
        texto:
          "El equipo de Mente Conecta será responsable de orientar durante la participación.",
      },
    ],
  },
};

export function Consentimiento() {
  const { t } = useTranslation();
  const [tipoConsentimiento, setTipoConsentimiento] = useState("");
  const [quienRealiza, setQuienRealiza] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [termsAcceptedSuccessfully, setTermsAcceptedSuccessfully] =
    useState(false);
  const documentRef = useRef(null);
  const documentEndRef = useRef(null);
  const navigate = useNavigate();
  const { auth } = useAuth();

  // El endpoint GET registra la aceptación; solo debe ejecutarse al continuar.
  useEffect(() => {
    const tipoGuardado = sessionStorage.getItem("tipo_consentimiento");
    const quienGuardado = sessionStorage.getItem("quien_realiza");

    if (!TIPOS_VALIDOS.includes(tipoGuardado)) {
      navigate("/login-sep/quien-realiza", { replace: true });
      return;
    }

    setTipoConsentimiento(tipoGuardado);
    setQuienRealiza(
      QUIEN_REALIZA_VALIDOS.includes(quienGuardado) ? quienGuardado : "",
    );

    const yaAceptoLocal =
      sessionStorage.getItem("terminos_aceptados") === "true" &&
      sessionStorage.getItem("terminos_tipo") === tipoGuardado;

    if (yaAceptoLocal) {
      setAccepted(true);
      setHasReachedBottom(true);
      setTermsAcceptedSuccessfully(true);
    }

    setVerifying(false);
  }, [navigate]);

  const documento = useMemo(
    () => DOCUMENTOS[tipoConsentimiento] || DOCUMENTOS.consentimiento,
    [tipoConsentimiento],
  );

  const revisarFinDelDocumento = useCallback(() => {
    const element = documentEndRef.current || documentRef.current;
    if (!element || hasReachedBottom) return;
    const rect = element.getBoundingClientRect();
    if (rect.bottom <= window.innerHeight + 16) setHasReachedBottom(true);
  }, [hasReachedBottom]);

  useEffect(() => {
    if (verifying || !tipoConsentimiento) return undefined;

    const frame = requestAnimationFrame(revisarFinDelDocumento);
    return () => cancelAnimationFrame(frame);
  }, [revisarFinDelDocumento, tipoConsentimiento, verifying]);

  useEffect(() => {
    if (verifying || !tipoConsentimiento || hasReachedBottom) return undefined;

    window.addEventListener("scroll", revisarFinDelDocumento, { passive: true });
    window.addEventListener("resize", revisarFinDelDocumento);

    return () => {
      window.removeEventListener("scroll", revisarFinDelDocumento);
      window.removeEventListener("resize", revisarFinDelDocumento);
    };
  }, [hasReachedBottom, revisarFinDelDocumento, tipoConsentimiento, verifying]);

  const handleAcceptChange = (event) => {
    if (termsAcceptedSuccessfully) return;
    setAccepted(event.target.checked);
    if (event.target.checked) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Si ya estaba aceptado, solo navegar
    if (termsAcceptedSuccessfully) {
      navigate(NEXT_STEP_ROUTE);
      return;
    }

    if (!hasReachedBottom) {
      setError(t("consentimiento.leerDocumento"));
      return;
    }
    if (!accepted) {
      sessionStorage.removeItem("terminos_aceptados");
      sessionStorage.removeItem("terminos_tipo");
      navigate(NEXT_STEP_ROUTE);
      return;
    }

    const token = auth?.token || getToken();
    if (!token) {
      setError(t("consentimiento.sinSesion"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await aceptarTerminosWebBasica(
        {
          tipo_consentimiento: tipoConsentimiento,
          quien_realiza: quienRealiza,
          aceptado: true,
        },
        token,
      );
      sessionStorage.setItem("terminos_aceptados", "true");
      sessionStorage.setItem("terminos_tipo", tipoConsentimiento);
      setTermsAcceptedSuccessfully(true);
      navigate(NEXT_STEP_ROUTE);
    } catch {
      setError(t("consentimiento.errorAceptar"));
    } finally {
      setLoading(false);
    }
  };

  // ── Loading inicial mientras verifica ──────────────────────────────────────
  if (verifying || !tipoConsentimiento) {
    return (
      <section className="consentimiento-web">
        <div className="consentimiento-web__verifying">
          <div className="consentimiento-web__spinner" />
        </div>
      </section>
    );
  }

  return (
    <section className="consentimiento-web">
      <AuthFeedbackBar
        message={error}
        tone={error ? "error" : "success"}
      />
      <img
        src={iconosDecoracion}
        alt=""
        className="consentimiento-web__deco consentimiento-web__deco--left"
        aria-hidden="true"
      />
      <img
        src={iconosDecoracion}
        alt=""
        className="consentimiento-web__deco consentimiento-web__deco--right"
        aria-hidden="true"
      />
      <form className="consentimiento-web__card" onSubmit={handleSubmit}>
        <div className="consentimiento-web__heading">
          <span className="consentimiento-web__document-icon">
            <IconDocument />
          </span>
          <h1>{documento.titulo}</h1>
        </div>

        <div
          className="consentimiento-web__document"
          ref={documentRef}
        >
          {documento.secciones.map((section) => (
            <article
              className="consentimiento-web__section"
              key={section.titulo}
            >
              <span
                className="consentimiento-web__section-bar"
                style={{ backgroundColor: section.color }}
                aria-hidden="true"
              />
              <div>
                <h2>{section.titulo}</h2>
                {section.texto.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
          <span
            ref={documentEndRef}
            className="consentimiento-web__document-end"
            aria-hidden="true"
          />
        </div>

        <div
          className={`consentimiento-web__footer ${hasReachedBottom ? "consentimiento-web__footer--ready" : ""}`}
        >
          {hasReachedBottom ? (
            <div className="consentimiento-web__acceptance">
              <div className="consentimiento-web__declaration">
                <span className="consentimiento-web__lock-icon">
                  <IconLock />
                </span>
                <div className="consentimiento-web__declaration-content">
                  <h2>{documento.declaracionTitulo}</h2>
                  <p>{documento.declaracion}</p>
                </div>
              </div>

              <label className="consentimiento-web__checkbox">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={handleAcceptChange}
                  disabled={termsAcceptedSuccessfully}
                />
                <span>{t("consentimiento.checkboxPendiente")}</span>
              </label>

              <div className="consentimiento-web__actions">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading
                    ? t("consentimiento.procesando")
                    : t("cuestionarioWeb.continuar", { defaultValue: "Continuar" })}
                </Button>
              </div>
            </div>
          ) : (
            <p className="consentimiento-web__scroll-hint">
              {t("consentimiento.leerDocumento")}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
