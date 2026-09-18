import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Perfil.scss";
import { useTranslation } from "react-i18next";
import iconosDecoracion from "../../../assets/img/WebBasica/iconos-decoracion.png";
import { AuthFeedbackBar } from "../../../components/WebBasica/AuthFeedback";
import { useAuth } from "../../../hooks";
import { clearSepFlowSession } from "../../../utils/sepSession";
import { obtenerPerfil, actualizarPerfil } from "../../../services/Perfilnoticiasservice ";
import { jwtDecode } from "jwt-decode";

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconSave = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

export function Perfil() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [datos, setDatos] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerPerfil(auth.token);
        setDatos(data);
        setEmail(data.email || "");
      } catch (err) {
        setMensaje({ texto: t("perfil.errorCargar"), tipo: "error" });
      } finally {
        setLoading(false);
      }
    };
    if (auth?.token) cargar();
  }, [auth, t]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      const message = t("perfil.correoVacio");
      setEmailError(message);
      setMensaje({ texto: message, tipo: "error" });
      return;
    }
    setGuardando(true);
    setMensaje({ texto: "", tipo: "" });
    setEmailError("");
    try {
      const decoded = jwtDecode(auth.token);
      await actualizarPerfil(auth.token, decoded.user_id, email);
      setMensaje({ texto: t("perfil.cambiosGuardados"), tipo: "success" });
    } catch {
      setMensaje({ texto: t("perfil.errorGuardar"), tipo: "error" });
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="perfil perfil--loading">
        <div className="perfil__spinner" />
      </div>
    );
  }

  const nombreCompleto = datos
    ? `${datos.nombre || ""} ${datos.apellido_paterno || ""} ${datos.apellido_materno || ""}`.trim()
    : "";
  const handleLogout = () => {
    clearSepFlowSession();
    logout();
    navigate("/login-sep", { replace: true });
  };

  return (
    <div className="perfil">
      <AuthFeedbackBar
        message={mensaje.texto}
        tone={mensaje.tipo === "success" ? "success" : "error"}
      />
      <img src={iconosDecoracion} alt="" className="perfil__deco perfil__deco--left" aria-hidden="true" />
      <img src={iconosDecoracion} alt="" className="perfil__deco perfil__deco--right" aria-hidden="true" />

      <div className="perfil__center">
        <div className="perfil__avatar">
          {datos?.foto ? (
            <img src={datos.foto} alt={t("perfil.titulo")} className="perfil__avatar-img" />
          ) : (
            <IconUser />
          )}
        </div>

        <h2 className="perfil__nombre">{nombreCompleto || t("comun.usuario")}</h2>
        <p className="perfil__fecha">
          {t("perfil.fechaNacimiento")} {datos?.fecha_nacimiento || "-"}
        </p>

        <div className="perfil__card">
          <p className="perfil__section-title">{t("perfil.informacionContacto")}</p>
          <form onSubmit={handleGuardar}>
            <div className="perfil__field">
              <label className="perfil__field-label" htmlFor="perfil-email">
                <IconMail />
                {t("perfil.correo")}
              </label>
              <div className={`perfil__input-wrap${emailError ? " perfil__input-wrap--error" : ""}`}>
                <input
                  id="perfil-email"
                  type="email"
                  placeholder={t("perfil.correo")}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  className="perfil__input"
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? "perfil-email-error" : undefined}
                />
              </div>
              {emailError && (
                <p id="perfil-email-error" className="perfil__field-error">
                  {emailError}
                </p>
              )}
            </div>

            <button type="submit" className="perfil__btn perfil__btn--guardar" disabled={guardando}>
              <IconSave />
              {guardando ? t("perfil.guardando") : t("perfil.guardarCambios")}
            </button>
          </form>

          <button className="perfil__btn perfil__btn--logout" onClick={handleLogout}>
            <IconLogout />
            {t("perfil.cerrarSesion")}
          </button>
        </div>
      </div>
    </div>
  );
}
