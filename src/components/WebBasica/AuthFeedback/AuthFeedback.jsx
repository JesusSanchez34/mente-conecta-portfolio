import React, { useEffect, useId, useRef } from "react";
import "./AuthFeedback.scss";
import logoSaludMental from "../../../assets/img/WebBasica/logo-salud-mental.png";

export function AuthFeedbackBar({ message, tone = "error" }) {
  if (!message) return null;

  return (
    <div className={`auth-feedback-bar auth-feedback-bar--${tone}`} role="alert">
      <span>{message}</span>
    </div>
  );
}

export function AuthFeedbackDialog({
  open,
  title,
  message,
  actionLabel = "Aceptar",
  onAction,
  tone = "info",
  placement = "center",
}) {
  const actionButtonRef = useRef(null);
  const cardRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onActionRef = useRef(onAction);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    onActionRef.current = onAction;
  }, [onAction]);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    actionButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onActionRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = cardRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (
        focusableElements.length === 1 ||
        (!event.shiftKey && document.activeElement === lastElement)
      ) {
        event.preventDefault();
        firstElement.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`auth-feedback-dialog auth-feedback-dialog--${placement}`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={message ? messageId : undefined}
    >
      <div
        ref={cardRef}
        className={`auth-feedback-dialog__card auth-feedback-dialog__card--${tone}`}
      >
        <img src={logoSaludMental} 
        alt="Mente Conecta Salud Mental" 
        className="auth-feedback-dialog__logo" />
        <h2 id={titleId} 
        className="auth-feedback-dialog__title"
        style={{ color: tone === "error" ? "#ff0000" : "inherit" }}
        >
          {title}
        </h2>
        {message && (
          <p id={messageId} className="auth-feedback-dialog__message">
            {message}
          </p>
        )}
       { actionLabel && (
        <button
          ref={actionButtonRef}
          type="button"
          className="auth-feedback-dialog__button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
       )}
      </div>
    </div>
  );
}
