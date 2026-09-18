import React, { useState } from "react";
import "./OlvideContrasena.scss";
import { useTranslation } from "react-i18next";

import { AuthCard } from "../../../../components/WebBasica/AuthCard/AuthCard";
import { Button } from "../../../../components/WebBasica/Button/Button";
import { Input } from "../../../../components/WebBasica/Input/input";
import { OtpInput } from "../../../../components/WebBasica/OtpInput/OtpInput";
import { AuthFeedbackDialog } from "../../../../components/WebBasica/AuthFeedback";
import { useLoginWebBasicaTitle } from "../../../../layouts/LoginWebBasica";

import iconosDecoracion from "../../../../assets/img/WebBasica/iconos-decoracion.png";

import {
  enviarCorreoRecuperacion,
  validarTokenRecuperacion,
  establecerNuevoPassword,
} from "../../../../services/authServiceWebBasica";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Header superior: Mantiene "¿Olvidaste tu contraseña?" en el paso de verificación
export const RECOVERY_TITLE_BY_STEP = {
  1: "titulos.olvideContrasena",
  3: "titulos.olvideContrasena", 
  4: "titulos.cambioContrasena",
  5: "titulos.cambioContrasena",
};

const IconKey = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="12" r="4" />
    <path d="M11 12h10" />
    <path d="M18 12v3" />
    <path d="M21 12v2" />
  </svg>
);

const IconEnvelope = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

const IconLockOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#62C254" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const IconEmailInput = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#53C055" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

const IconLockInput = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#53C055" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconValidationCheck = () => (
  <svg
    className="oc__hint-check"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

export function OlvideContrasena() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [correo, setCorreo] = useState("");
  const [otp, setOtp] = useState([]);
  const [nuevaPass, setNuevaPass] = useState("");
  const [confirmaPass, setConfirmaPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedbackDialog, setFeedbackDialog] = useState(null);
  const cumpleLongitudMinima = nuevaPass.length >= 6;

  useLoginWebBasicaTitle(RECOVERY_TITLE_BY_STEP[step]);

  const clearFieldError = (fieldName) => {
    setFieldErrors((current) => {
      if (!current[fieldName]) return current;
      const next = { ...current };
      delete next[fieldName];
      return next;
    });
  };

  const closeFeedbackDialog = () => {
    const nextStep = feedbackDialog?.nextStep;
    setFeedbackDialog(null);
    if (nextStep) setStep(nextStep);
  };

  const handleEnviarCorreo = async (e) => {
    e.preventDefault();
    const correoLimpio = correo.trim();
    setFieldErrors({});

    if (!correoLimpio) {
      const message = t("olvideContrasena.correoRequerido");
      setFieldErrors({ correo: message });
      return;
    }

    if (!EMAIL_PATTERN.test(correoLimpio)) {
      const message = t("olvideContrasena.correoInvalido");
      setFieldErrors({ correo: message });
      return;
    }

    setLoading(true);
    try {
      await enviarCorreoRecuperacion(correoLimpio);
      setCorreo(correoLimpio);
      setFeedbackDialog({
        tone: "success",
        title: t("olvideContrasena.codigoEnviado"),
        message: t("olvideContrasena.mensajeEnviado"),
        actionLabel: t("olvideContrasena.ok"),
        nextStep: 3,
      });
    } catch {
      setFeedbackDialog(null);
      setFieldErrors({ correo: t("olvideContrasena.errorEnvioCorreo") });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarOtp = async (e) => {
    e.preventDefault();
    const codigo = otp.join("");
    if (codigo.length < 6) {
      const message = t("verificacion.errorDigitos");
      setFieldErrors({ otp: message });
      setFeedbackDialog(null);
      return;
    }
    setLoading(true);
    setFieldErrors({});
    try {
      await validarTokenRecuperacion(codigo);
      setStep(4);
    } catch {
      const message = t("olvideContrasena.codigoIncorrectoMensaje");
      setFieldErrors({});
      setFeedbackDialog({
        tone: "error",
        title: t("verificacion.modalCodigoIncorrectoTitulo"),
        message,
        actionLabel: t("verificacion.reintentar"),
        placement: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaContrasena = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    if (!nuevaPass || !confirmaPass) {
      const tempErrors = {};
      if (!nuevaPass) tempErrors.nuevaPass = t("olvideContrasena.campoObligatorio");
      if (!confirmaPass) tempErrors.confirmaPass = t("olvideContrasena.campoObligatorio");
      setFieldErrors(tempErrors);
      return;
    }
    if (nuevaPass.length < 6) {
      const message = t("olvideContrasena.contrasenaMinimo");
      setFieldErrors({ nuevaPass: message });
      return;
    }
    if (confirmaPass.length < 6) {
      const message = t("olvideContrasena.contrasenaMinimo");
      setFieldErrors({ confirmaPass: message });
      return;
    }
    if (nuevaPass !== confirmaPass) {
      const message = t("olvideContrasena.contrasenasNoCoinciden");
      setFieldErrors({ confirmaPass: message });
      return;
    }
    setLoading(true);
    try {
      await establecerNuevoPassword(correo, nuevaPass);
      setStep(5);
    } catch {
      setFeedbackDialog({
        tone: "error",
        title: t("olvideContrasena.errorTitulo"),
        message: t("comun.error"),
        actionLabel: t("olvideContrasena.entendido"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value) => {
    setOtp(value);
    clearFieldError("otp");
  };

  return (
    <div className="oc">
      <img src={iconosDecoracion} alt="" className="oc__deco oc__deco--left" aria-hidden="true" />
      <img src={iconosDecoracion} alt="" className="oc__deco oc__deco--right" aria-hidden="true" />

      <AuthFeedbackDialog
        open={Boolean(feedbackDialog)}
        tone={feedbackDialog?.tone}
        title={feedbackDialog?.title}
        message={feedbackDialog?.message}
        actionLabel={feedbackDialog?.actionLabel}
        placement={feedbackDialog?.placement}
        onAction={closeFeedbackDialog}
      />

      <div className="oc__center">
        {/* Paso 1 */}
        {step === 1 && (
          <AuthCard className="oc__card">
            <div className="oc__recovery-icon">
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1b6ca8 0%, #e67e22 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto'
              }}>
                <IconKey />
              </div>
            </div>
            <h2 className="oc__title">{t("olvideContrasena.titulo")}</h2>
            <p className="oc__subtitle">{t("olvideContrasena.subtitulo")}</p>
            <form onSubmit={handleEnviarCorreo} noValidate>
              <div className="oc__field-group">
                <span className="oc__label">{t("olvideContrasena.correo")}</span>
                <Input
                  type="email"
                  id="oc-correo"
                  name="correo"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    clearFieldError("correo");
                  }}
                  icon={<IconEmailInput />}
                  error={fieldErrors.correo}
                  required
                />
                {fieldErrors.correo && (
                  <p id="oc-correo-error" className="oc__input-error">
                    {fieldErrors.correo}
                  </p>
                )}
              </div>
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? t("olvideContrasena.enviando") : t("olvideContrasena.enviarCodigo")}
              </Button>
            </form>
            <div className="oc__footer-link">
              {t("olvideContrasena.recordaste")}{" "}
              <a href="/login-sep">{t("olvideContrasena.iniciarSesion")}</a>
            </div>
          </AuthCard>
        )}

        {/* Paso 3: Verificación de Código con Estilos Forzados Figma */}
        {step === 3 && (
          <AuthCard className="oc__card">
            {/* Ícono de Sobre con Gradiente Azul a Naranja */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1b6ca8 0%, #e67e22 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px auto'
            }}>
              <IconEnvelope />
            </div>

            <h2 className="oc__title">{t("olvideContrasena.verificaTuCodigo")}</h2>
            <p className="oc__subtitle">{t("olvideContrasena.ingresaCodigo")}</p>
            
            {/* Correo con Azul Cyan de Figma forzado */}
            <p className="oc__email-highlight" style={{ color: '#00a8e8', fontWeight: 'bold', fontSize: '15px' }}>
              {correo}
            </p>
            
            <form onSubmit={handleVerificarOtp}>
              <OtpInput value={otp} onChange={handleOtpChange} length={6} error={Boolean(fieldErrors.otp)} />
              {fieldErrors.otp && !feedbackDialog && (
                <p className="oc__input-error oc__input-error--center">
                  {fieldErrors.otp}
                </p>
              )}
              
              {/* Botón 'Continuar' estilizado como en Figma */}
              <div style={{ marginTop: '20px' }}>
                <Button type="submit" variant="primary" fullWidth disabled={loading} style={{ backgroundColor: '#ff9436', borderColor: '#ff9436' }}>
                  {loading ? t("olvideContrasena.verificando") : "Continuar"}
                </Button>
              </div>
            </form>

            <div className="oc__footer-link" style={{ marginTop: '15px' }}>
              {t("olvideContrasena.noRecibiste")}{" "}
              <a href="#reenviar" onClick={(e) => { e.preventDefault(); handleEnviarCorreo(e); }} style={{ color: '#ff9436', fontWeight: 'bold' }}>
                {t("olvideContrasena.reenviar")}
              </a>
            </div>
          </AuthCard>
        )}

        {/* Paso 4 */}
        {(step === 4 || step === 5) && (
          <AuthCard className="oc__card">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1b6ca8 0%, #e67e22 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px auto'
            }}>
              <IconLockOpen />
            </div>
            <h2 className="oc__title">{t("olvideContrasena.nuevaContrasena")}</h2>
            <p className="oc__subtitle">{t("olvideContrasena.nuevaContrasenaSubtitulo")}</p>
            <form onSubmit={handleNuevaContrasena}>
              <div className="oc__field-group">
                <span className="oc__label">{t("olvideContrasena.nuevaContrasenaLabel")}</span>
                <Input
                  type="password"
                  id="oc-nueva-pass"
                  name="nuevaPass"
                  placeholder={t("olvideContrasena.nuevaContrasenaLabel")}
                  value={nuevaPass}
                  onChange={(e) => {
                    setNuevaPass(e.target.value);
                    clearFieldError("nuevaPass");
                  }}
                  icon={<IconLockInput />}
                  error={fieldErrors.nuevaPass}
                  required
                />
                {fieldErrors.nuevaPass && (
                  <p id="oc-nueva-pass-error" className="oc__input-error">
                    {fieldErrors.nuevaPass}
                  </p>
                )}
              </div>
              <div className="oc__field-group">
                <span className="oc__label">{t("olvideContrasena.confirmarContrasena")}</span>
                <Input
                  type="password"
                  id="oc-confirma-pass"
                  name="confirmaPass"
                  placeholder={t("olvideContrasena.confirmarContrasena")}
                  value={confirmaPass}
                  onChange={(e) => {
                    setConfirmaPass(e.target.value);
                    clearFieldError("confirmaPass");
                  }}
                  icon={<IconLockInput />}
                  error={fieldErrors.confirmaPass}
                  required
                />
                {fieldErrors.confirmaPass && (
                  <p id="oc-confirma-pass-error" className="oc__input-error">
                    {fieldErrors.confirmaPass}
                  </p>
                )}
              </div>
              <div className="oc__hint-box">
                <p className="oc__hint-title">{t("olvideContrasena.hint")}</p>
                <p
                  className={`oc__hint-item${cumpleLongitudMinima ? " oc__hint-item--valid" : ""}`}
                  aria-live="polite"
                >
                  {cumpleLongitudMinima && <IconValidationCheck />}
                  <span>{t("olvideContrasena.hintItem")}</span>
                </p>
              </div>
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? t("olvideContrasena.guardando") : t("olvideContrasena.restablecerContrasena")}
              </Button>
            </form>
          </AuthCard>
        )}

        {/* Paso 5: confirmación superpuesta sobre el formulario */}
        {step === 5 && (
          <div
            className="oc__success-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="oc-success-title"
          >
            <div className="oc__success-modal">
              <div className="oc__success-header">
                <div className="oc__success-icon"><IconCheckCircle /></div>
              </div>
              <div className="oc__success-body">
                <h2 id="oc-success-title" className="oc__success-title">
                  {t("olvideContrasena.todoListo")}
                </h2>
                <p className="oc__subtitle-bold">{t("olvideContrasena.contrasenaExitosa")}</p>
                <p className="oc__success-description">
                  {t("olvideContrasena.guardadoSeguro")}
                </p>
                <div className="oc__success-info">
                  <IconShield />
                  <div>
                    <p className="oc__success-label">{t("olvideContrasena.cuentaProtegida")}</p>
                    <p className="oc__success-email">{t("olvideContrasena.guardadoSeguro")}</p>
                  </div>
                </div>
                <Button variant="primary" fullWidth onClick={() => (window.location.href = "/login-sep")}>
                  <span className="oc__login-button-content">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    {t("olvideContrasena.iniciarSesion")}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
