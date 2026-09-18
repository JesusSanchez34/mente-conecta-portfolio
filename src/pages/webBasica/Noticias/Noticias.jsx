import React, { useState, useEffect } from "react";
import "./Noticias.scss";
import { useTranslation } from "react-i18next";
import iconosDecoracion from "../../../assets/img/WebBasica/iconos-decoracion.png";
import { AuthFeedbackBar } from "../../../components/WebBasica/AuthFeedback";
import { useAuth } from "../../../hooks";
import { getToken } from "../../../api/token";
import { obtenerNoticias, obtenerNoticia } from "../../../services/Perfilnoticiasservice ";

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const NewsImage = ({ src, alt, variant = "card" }) => {
  const [hasError, setHasError] = useState(false);
  const isPanel = variant === "panel";

  if (!src || hasError) {
    return (
      <div
        className={
          isPanel
            ? "noticias__panel-img noticias__img-placeholder noticias__img-placeholder--panel"
            : "noticias__img-placeholder"
        }
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      className={isPanel ? "noticias__panel-img" : undefined}
      onError={() => setHasError(true)}
    />
  );
};

export function Noticias() {
  const { t, i18n } = useTranslation();
  const { auth } = useAuth();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noticiaDetalle, setNoticiaDetalle] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const isEnglish = i18n.language?.startsWith("en");
  const emptyMessage = isEnglish
    ? "No news."
    : "No hay noticias.";

  useEffect(() => {
    let active = true;
    const loadingTimeoutId = setTimeout(() => {
      if (!active) return;
      setError("");
      setLoading(false);
    }, 12000);

    const cargar = async () => {
      const token = auth?.token || getToken();
      if (!token) {
        setError(t("noticias.errorCargar"));
        clearTimeout(loadingTimeoutId);
        setLoading(false);
        return;
      }

      try {
        setError("");
        const data = await obtenerNoticias(token);
        if (!active) return;
        setNoticias(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) setError("");
      } finally {
        clearTimeout(loadingTimeoutId);
        if (active) setLoading(false);
      }
    };
    cargar();
    return () => {
      active = false;
      clearTimeout(loadingTimeoutId);
    };
  }, [auth?.token, t]);

  const handleVerDetalle = async (id) => {
    const token = auth?.token || getToken();
    if (!token) {
      setError(t("noticias.errorDetalle"));
      return;
    }

    setLoadingDetalle(true);
    setError("");
    try {
      const data = await obtenerNoticia(token, id);
      setNoticiaDetalle(data);
    } catch (err) {
      setError("");
    } finally {
      setLoadingDetalle(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    try {
      return new Date(fecha).toLocaleDateString(i18n.language === "en" ? "en-US" : "es-MX", {
        day: "2-digit", month: "long", year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="noticias">
      <AuthFeedbackBar
        message={!loading && noticias.length === 0 ? "" : error}
        tone="error"
      />
      <img src={iconosDecoracion} alt="" className="noticias__deco noticias__deco--left" aria-hidden="true" />
      <img src={iconosDecoracion} alt="" className="noticias__deco noticias__deco--right" aria-hidden="true" />

      <div className="noticias__center">
        {loading && <div className="noticias__loading"><div className="noticias__spinner" /></div>}

        {!loading && noticias.length === 0 && (
          <div className="noticias__state">
            <h2>{t("noticias.titulo")}</h2>
            <p>{emptyMessage}</p>
          </div>
        )}

        {!loading && noticias.map((noticia) => (
          <div key={noticia.id} className="noticias__card" onClick={() => handleVerDetalle(noticia.id)}>
            <div className="noticias__img">
              <NewsImage src={noticia.imagen} alt={noticia.titulo} />
            </div>
            <div className="noticias__content">
              <h3 className="noticias__titulo">{noticia.titulo}</h3>
              <p className="noticias__desc">{noticia.descripcion_previa}</p>
              <div className="noticias__meta">
                <span className="noticias__fecha">{formatFecha(noticia.fecha_noticia)}</span>
                <span className="noticias__tiempo">
                  <IconClock />
                  {t("noticias.leerMas")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {noticiaDetalle && (
        <div className="noticias__panel">
          <div className="noticias__panel-content">
            <button className="noticias__panel-close" onClick={() => setNoticiaDetalle(null)} aria-label={t("comun.cerrar")}>
              <IconClose />
            </button>
            <NewsImage
              src={noticiaDetalle.imagen}
              alt={noticiaDetalle.titulo}
              variant="panel"
            />
            <h2 className="noticias__panel-titulo">{noticiaDetalle.titulo}</h2>
            <p className="noticias__panel-fecha">{formatFecha(noticiaDetalle.fecha_noticia)}</p>
            <p className="noticias__panel-desc">{noticiaDetalle.descripcion}</p>
          </div>
        </div>
      )}

      {loadingDetalle && (
        <div className="noticias__overlay"><div className="noticias__spinner" /></div>
      )}
    </div>
  );
}
