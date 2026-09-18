import React from "react";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoClose,
  IoInformationCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";
import logoSaludMental from "../../../assets/img/WebBasica/logo-salud-mental.png";
import "./SepAlert.scss";

const ICONS = {
  error: IoAlertCircleOutline,
  success: IoCheckmarkCircleOutline,
  confirm: IoWarningOutline,
  info: IoInformationCircleOutline,
  loading: IoInformationCircleOutline,
};

export function SepAlert({
  open,
  type = "info",
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cerrar",
  onConfirm,
  onCancel,
  showCancel = false,
  loading = false,
  children,
}) {
  if (!open) return null;

  const Icon = ICONS[type] || ICONS.info;

  return (
    <div className="sep-alert" role="presentation">
      <section
        className={`sep-alert__card sep-alert__card--${type}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sep-alert-title"
      >
        {onCancel && (
          <button
            type="button"
            className="sep-alert__close"
            aria-label={cancelText}
            onClick={onCancel}
          >
            <IoClose aria-hidden="true" />
          </button>
        )}

        <img
          src={logoSaludMental}
          alt="Mente Conecta Salud Mental"
          className="sep-alert__logo"
        />

        {loading ? (
          <span className="sep-alert__spinner" aria-hidden="true" />
        ) : (
          <Icon className="sep-alert__icon" aria-hidden="true" />
        )}

        {title && <h2 id="sep-alert-title">{title}</h2>}
        {message && <p>{message}</p>}
        {children}

        {(confirmText || showCancel) && !loading && (
          <div className="sep-alert__actions">
            {showCancel && (
              <button
                type="button"
                className="sep-alert__button sep-alert__button--ghost"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            )}
            {confirmText && (
              <button
                type="button"
                className="sep-alert__button"
                onClick={onConfirm || onCancel}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
