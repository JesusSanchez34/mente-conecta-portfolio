import React, { useState } from "react";
import "./input.scss";
import { useTranslation } from "react-i18next";

export function Input({
  id,
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  error,
}) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const inputId = id || name;
  const passwordToggleLabel = showPassword
    ? t("input.ocultarContrasena")
    : t("input.mostrarContrasena");

  const togglePasswordVisibility = () => {
    setShowPassword((isVisible) => !isVisible);
  };

  return (
    <div className="input-wrap">
      {label && <label className="input-wrap__label">{label}</label>}
      <div className={`input-wrap__field${error ? " input-wrap__field--error" : ""}`}>
        {icon && <span className="input-wrap__icon">{icon}</span>}
        <input
          id={inputId}
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          className="input-wrap__input"
        />
        {isPassword && (
          <button
            type="button"
            className="input-wrap__eye"
            onClick={togglePasswordVisibility}
            aria-label={passwordToggleLabel}
            aria-pressed={showPassword}
            title={passwordToggleLabel}
          >
            {showPassword ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
