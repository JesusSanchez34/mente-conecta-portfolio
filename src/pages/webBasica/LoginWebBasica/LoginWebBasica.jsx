import React, { useEffect, useState } from "react";
import "./LoginWebBasica.scss";
import { useTranslation } from "react-i18next";

import { AuthCard } from "../../../components/WebBasica/AuthCard/AuthCard";
import { Button } from "../../../components/WebBasica/Button/Button";
import { Input } from "../../../components/WebBasica/Input/input";
import { LoadingModal } from "../../../components/WebBasica/LoadingModal/LoadingModal";
import { AuthFeedbackBar } from "../../../components/WebBasica/AuthFeedback";

import { useNavigate } from "react-router-dom";
import { loginOtp } from "../../../services/authServiceWebBasica";

import nina from "../../../assets/img/WebBasica/personajeNiña.png";
import nino from "../../../assets/img/WebBasica/personajeNiño.png";
import logoSaludMental from "../../../assets/img/WebBasica/logo-salud-mental.png";
import iconosDecoracion from "../../../assets/img/WebBasica/iconos-decoracion.png";

const REMEMBER_ME_KEYS = {
  enabled: "sepRememberMe",
  user: "sepRememberedUser",
  password: "sepRememberedPassword",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getRememberedCredentials = () => {
  try {
    if (localStorage.getItem(REMEMBER_ME_KEYS.enabled) !== "true") {
      return null;
    }

    return {
      usuario: localStorage.getItem(REMEMBER_ME_KEYS.user) || "",
      contrasena: localStorage.getItem(REMEMBER_ME_KEYS.password) || "",
      recuerdame: true,
    };
  } catch {
    return null;
  }
};

const clearRememberedCredentials = () => {
  try {
    Object.values(REMEMBER_ME_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch {
    // La pantalla de inicio de sesión sigue disponible si el almacenamiento no está habilitado.
  }
};

const storeRememberedCredentials = ({ usuario, contrasena }) => {
  try {
    localStorage.setItem(REMEMBER_ME_KEYS.enabled, "true");
    localStorage.setItem(REMEMBER_ME_KEYS.user, usuario);
    localStorage.setItem(REMEMBER_ME_KEYS.password, contrasena);
  } catch {
    // La autenticación no depende del almacenamiento local.
  }
};

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export function LoginWebBasica() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ usuario: "", contrasena: "", recuerdame: false });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const navigate = useNavigate();
  const language = i18n.language?.startsWith("en") ? "en" : "es";
  const invalidCredentialsMessage =
    language === "en"
      ? "Incorrect password or unregistered email."
      : "Contraseña incorrecta o correo no registrado.";
  const connectionErrorMessage =
    language === "en"
      ? "Could not connect to the server. Please check your internet connection."
      : "No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.";

  useEffect(() => {
    const rememberedCredentials = getRememberedCredentials();

    if (rememberedCredentials) {
      setForm(rememberedCredentials);
    }
  }, []);

  useEffect(() => {
    if (!feedbackMessage) return undefined;

    const timer = setTimeout(() => setFeedbackMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((currentForm) => {
      const nextForm = {
        ...currentForm,
        [name]: type === "checkbox" ? checked : value,
      };

      if (nextForm.recuerdame && (nextForm.usuario || nextForm.contrasena)) {
        storeRememberedCredentials(nextForm);
      } else if (name === "recuerdame" && !checked) {
        clearRememberedCredentials();
      }

      return nextForm;
    });

    if (fieldErrors[name]) {
      setFieldErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[name];
        return nextErrors;
      });
    }

    if (feedbackMessage) {
      setFeedbackMessage("");
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const usuario = form.usuario.trim();
    const contrasena = form.contrasena;

    if (!usuario) {
      nextErrors.usuario = t("login.validacion.campoObligatorio");
    } else if (!EMAIL_PATTERN.test(usuario)) {
      nextErrors.usuario = t("login.validacion.correoInvalido");
    }

    if (!contrasena) {
      nextErrors.contrasena = t("login.validacion.campoObligatorio");
    } else if (contrasena.length < 6) {
      nextErrors.contrasena = t("login.validacion.passwordMinimo");
    }

    setFieldErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setFeedbackMessage("");

    try {
      const data = await loginOtp(form.usuario, form.contrasena);
      sessionStorage.setItem("otp_session", data.otp_session);
      sessionStorage.setItem("login_email", form.usuario);
      sessionStorage.setItem("login_password", form.contrasena);

      if (form.recuerdame) {
        storeRememberedCredentials(form);
      } else {
        clearRememberedCredentials();
      }

      navigate("/login-sep/verificacion");
    } catch (err) {
      const rawMessage = err?.message || "";
      setFieldErrors({});
      setFeedbackMessage(
        /failed to fetch|network|conectar|configurada/i.test(rawMessage)
          ? connectionErrorMessage
          : invalidCredentialsMessage,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lwb">
      {loading && <LoadingModal />}
      <AuthFeedbackBar message={feedbackMessage} />

      <img src={iconosDecoracion} alt="" className="lwb__deco lwb__deco--left" aria-hidden="true" />
      <img src={iconosDecoracion} alt="" className="lwb__deco lwb__deco--right" aria-hidden="true" />
      <img src={nina} alt={t("login.personajeNina")} className="lwb__char lwb__char--left" />
      <img src={nino} alt={t("login.personajeNino")} className="lwb__char lwb__char--right" />

      <div className="lwb__center">
        <AuthCard className="lwb__card-top">
          <img src={logoSaludMental} alt="Mente Conecta Salud Mental" className="lwb__logo" />
          <h2 className="lwb__title">¡Bienvenido de Nuevo!</h2>
          <p className="lwb__subtitle">Ingresa tu correo electrónico y contraseña para continuar.</p>
        </AuthCard>

        <AuthCard className="lwb__card-form">
          <form onSubmit={handleSubmit} noValidate>
            <div className="lwb__fields">
              <div className="lwb__field-group">
                <span className="lwb__field-label">{t("login.usuario")}</span>
                <Input
                  id="lwb-usuario"
                  type="text"
                  name="usuario"
                  placeholder={t("login.usuario")}
                  value={form.usuario}
                  onChange={handleChange}
                  icon={<IconUser />}
                  error={fieldErrors.usuario}
                  required
                />
                {fieldErrors.usuario && (
                  <span id="lwb-usuario-error" className="lwb__input-error">
                    {fieldErrors.usuario}
                  </span>
                )}
              </div>

              <div className="lwb__field-group">
                <span className="lwb__field-label">{t("login.contrasena")}</span>
                <Input
                  id="lwb-contrasena"
                  type="password"
                  name="contrasena"
                  placeholder={t("login.contrasena")}
                  value={form.contrasena}
                  onChange={handleChange}
                  icon={<IconLock />}
                  error={fieldErrors.contrasena}
                  required
                />
                {fieldErrors.contrasena && (
                  <span id="lwb-contrasena-error" className="lwb__input-error">
                    {fieldErrors.contrasena}
                  </span>
                )}
              </div>
            </div>

            <div className="lwb__row">
              <label className="lwb__remember">
                <input
                  type="checkbox"
                  name="recuerdame"
                  checked={form.recuerdame}
                  onChange={handleChange}
                />
                <span>{t("login.recuerdame")}</span>
              </label>
              <a href="/login-sep/olvide-contrasena" className="lwb__forgot">
                {t("login.olvidaste")}
              </a>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {t("login.iniciarSesion")}
            </Button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
