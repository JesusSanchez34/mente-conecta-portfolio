import React, { useEffect, useState } from "react";
import "./Verificacion2Pasos.scss";
import { useTranslation } from "react-i18next";

import { AuthCard } from "../../../../components/WebBasica/AuthCard/AuthCard";
import { Button } from "../../../../components/WebBasica/Button/Button";
import { StatusIcon } from "../../../../components/WebBasica/StatusIcon/StatusIcon";
import { OtpInput } from "../../../../components/WebBasica/OtpInput/OtpInput";
import { AuthFeedbackDialog } from "../../../../components/WebBasica/AuthFeedback";
import {
  loginOtp,
  SEP_WEB_BASICA_LOGIN_TYPE,
  verificarOtpLogin,
} from "../../../../services/authServiceWebBasica";

import iconosDecoracion from "../../../../assets/img/WebBasica/iconos-decoracion.png";

import { useAuth } from "../../../../hooks";
import { useNavigate } from "react-router-dom";
import { clearSepLoginVerificationSession } from "../../../../utils/sepSession";

const IconShieldVerify = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export function Verificacion2Pasos() {
  const { t } = useTranslation();
  const [otp, setOtp] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [reenviado, setReenviado] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(null);
  const [verificationContext, setVerificationContext] = useState(() => ({
    correo: sessionStorage.getItem("login_email")?.trim() || "",
    otpSession: sessionStorage.getItem("otp_session") || "",
  }));

  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const { correo, otpSession } = verificationContext;

  useEffect(() => {
    if (!correo || !otpSession) {
      navigate("/login-sep", { replace: true });
    }
  }, [correo, navigate, otpSession]);

  const closeFeedbackDialog = () => {
    if (feedbackDialog?.returnToLogin) {
      clearSepLoginVerificationSession();
      navigate("/login-sep", { replace: true });
    }
    setFeedbackDialog(null);
  };

  const handleOtpChange = (value) => {
    setOtp(value);
    if (error) {
      setError(false);
      setErrorMsg("");
    }
  };

  const handleVerificar = async (e) => {
    e.preventDefault();
    const codigo = otp.join("");

    if (codigo.length < 6) {
      setError(true);
      setErrorMsg(t("verificacion.errorDigitos"));
      setFeedbackDialog(null);
      return;
    }

    setError(false);
    setLoading(true);

    let data;
    try {
      data = await verificarOtpLogin(codigo, otpSession);
    } catch {
      setError(false);
      setErrorMsg("");
      setFeedbackDialog({
        tone: "error",
        title: t("verificacion.modalCodigoIncorrectoTitulo"),
        message: t("verificacion.modalCodigoIncorrectoMensaje"),
        actionLabel: t("verificacion.reintentar"),
        placement: "top",
      });
      setLoading(false);
      return;
    }

    try {
      await login(data.access, SEP_WEB_BASICA_LOGIN_TYPE);
      clearSepLoginVerificationSession();
      navigate("/login-sep/quien-realiza");
    } catch {
      logout();
      setError(false);
      setErrorMsg("");
      setFeedbackDialog({
        tone: "error",
        title: t("verificacion.modalSesionErrorTitulo"),
        message: t("verificacion.modalSesionErrorMensaje"),
        actionLabel: t("verificacion.volverInicio"),
        placement: "top",
        returnToLogin: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReenviar = async (e) => {
    e.preventDefault();
    try {
      const email = sessionStorage.getItem("login_email");
      const password = sessionStorage.getItem("login_password");
      if (!email || !password) throw new Error(t("comun.error"));
      const data = await loginOtp(email, password);
      sessionStorage.setItem("otp_session", data.otp_session);
      setVerificationContext((currentContext) => ({
        ...currentContext,
        otpSession: data.otp_session,
      }));
      setReenviado(true);
      setFeedbackDialog({
        tone: "success",
        title: t("verificacion.modalCodigoEnviadoTitulo"),
        message: t("verificacion.modalCodigoEnviadoMensaje"),
        actionLabel: t("comun.aceptar"),
      });
      setTimeout(() => setReenviado(false), 3000);
    } catch {
      setError(false);
      setErrorMsg("");
      setFeedbackDialog({
        tone: "error",
        title: t("verificacion.modalErrorTitulo"),
        message: t("comun.error"),
        actionLabel: t("comun.aceptar"),
      });
    }
  };

  return (
    <div className="v2p">
      <AuthFeedbackDialog
        open={Boolean(feedbackDialog)}
        tone={feedbackDialog?.tone}
        title={feedbackDialog?.title}
        message={feedbackDialog?.message}
        actionLabel={feedbackDialog?.actionLabel}
        placement={feedbackDialog?.placement}
        onAction={closeFeedbackDialog}
      />

      <img src={iconosDecoracion} alt="" className="v2p__deco v2p__deco--left" aria-hidden="true" />
      <img src={iconosDecoracion} alt="" className="v2p__deco v2p__deco--right" aria-hidden="true" />

      <div className="v2p__center">
        <AuthCard className="v2p__card">
          <StatusIcon><IconShieldVerify /></StatusIcon>
          <h2 className="v2p__title">{t("verificacion.titulo")}</h2>
          <p className="v2p__subtitle">{t("verificacion.subtitulo")}</p>
          <p className="v2p__email">{correo}</p>

          <form onSubmit={handleVerificar}>
            <OtpInput value={otp} onChange={handleOtpChange} length={6} error={error} />
            {error && !feedbackDialog && <p className="v2p__error">{errorMsg}</p>}
            {reenviado && !feedbackDialog && <p className="v2p__success">{t("verificacion.codigoReenviado")}</p>}
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? t("verificacion.verificando") : t("verificacion.verificar")}
            </Button>
          </form>

          <div className="v2p__footer">
            <span>{t("verificacion.noRecibiste")}</span>
            <a href="#reenviar" onClick={handleReenviar}>
              {t("verificacion.reenviar")}
            </a>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
