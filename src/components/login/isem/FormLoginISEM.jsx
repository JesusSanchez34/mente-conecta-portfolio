import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

import { useAuth } from '../../../hooks/useAuth';
import { loginISEM } from '../../../api/isem/authService.isem';
import './FormLoginISEM.css';

// ─── ESQUEMA DE VALIDACIÓN ────────────────────────────────────
const validationSchema = Yup.object({
  username: Yup.string()
    .required('El usuario es requerido')
    .min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

// ─── COMPONENTE ───────────────────────────────────────────────
export function FormLoginISEM({ onBack }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // ─── FORMIK ──────────────────────────────────────────────────
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError(null);

        console.info('[FormLoginISEM] Iniciando login ISEM...');

        // PASO 1: Llamar servicio (mock o API real)
        const response = await loginISEM(values);
        const { access } = response;

        // PASO 2: Guardar en AuthContext (token + typeLogin=1)
        // typeLogin=1 corresponde al portal ISEM en el sistema existente
        await login(access, 1);

        console.info('[FormLoginISEM] ✓ Login ISEM completado.');
        toast.success('¡Bienvenido al portal ISEM!');

        // Limpiar selección previa para forzar nueva elección
        sessionStorage.removeItem('tipoRealizador');

        // Redirigir a la pantalla de selección ¿Quién lo realizará?
        navigate('/quien-realiza');
      } catch (err) {
        console.error('[FormLoginISEM] Error:', err.message);
        setError(err.message || 'Error al iniciar sesión. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // ─── RENDER ───────────────────────────────────────────────────
  return (
    <form
      id="form-login-isem"
      className="form-login-isem"
      onSubmit={formik.handleSubmit}
      noValidate
    >

      {/* ── TÍTULO ──────────────────────────────────────────── */}
      <h2 className="isem-form-title">Inicio de sesión</h2>
      <p className="isem-form-subtitle">¡Nos alegra verte de vuelta!</p>

      {/* ── MODAL DE ERROR ────────────────────────────────── */}
      {error && createPortal(
        <div className="isem-error-overlay" role="dialog" aria-modal="true" aria-label="Error de inicio de sesión">
          <div className="isem-error-modal">
            <div className="isem-error-modal__top">
              <div className="isem-error-modal__icon-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="isem-error-modal__bottom">
              <p className="isem-error-modal__text">{error}</p>
              <button
                type="button"
                className="isem-error-modal__btn"
                onClick={() => setError(null)}
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── CAMPO USUARIO ────────────────────────────────── */}
      <div className={`isem-field ${formik.errors.username && formik.touched.username ? 'isem-field--error' : ''}`}>
        <label htmlFor="isem-username" className="isem-field__label">
          Usuario
        </label>
        <div className="isem-field__input-wrapper">
          <input
            id="isem-username"
            type="text"
            name="username"
            className="isem-field__input"
            placeholder="Nombre de usuario"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isLoading}
            autoComplete="username"
            autoFocus
          />
        </div>
        {formik.errors.username && formik.touched.username && (
          <span className="isem-field__error">{formik.errors.username}</span>
        )}
      </div>

      {/* ── CAMPO CONTRASEÑA ─────────────────────────────── */}
      <div className={`isem-field ${formik.errors.password && formik.touched.password ? 'isem-field--error' : ''}`}>
        <label htmlFor="isem-password" className="isem-field__label">
          Contraseña
        </label>
        <div className="isem-field__input-wrapper">
          <input
            id="isem-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            className="isem-field__input"
            placeholder="Contraseña"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="isem-field__toggle-pw"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={-1}
          >
            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
          </button>
        </div>
        {formik.errors.password && formik.touched.password && (
          <span className="isem-field__error">{formik.errors.password}</span>
        )}
      </div>

      {/* ── OPCIONES (Recordarme + Olvidé contraseña) ─────── */}
      <div className="isem-options-row">
        <label className="isem-remember" htmlFor="isem-remember-check">
          <input
            type="checkbox"
            id="isem-remember-check"
            className="isem-remember__checkbox"
          />
          <span className="isem-remember__text">Recordarme</span>
        </label>
        <button
          type="button"
          className="isem-forgot-link"
          onClick={() => navigate('/forgot-password')}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* ── BOTÓN PRINCIPAL ──────────────────────────────── */}
      <button
        id="btn-login-isem"
        type="submit"
        className="isem-btn-primary"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="isem-btn-primary__loading">
            <span className="isem-spinner" aria-hidden="true" />
            Iniciando sesión...
          </span>
        ) : (
          'Iniciar Sesión'
        )}
      </button>

      {/* ── SEPARADOR ────────────────────────────────────── */}
      <div className="isem-form-divider">
        <span>O</span>
      </div>

      {/* ── REGISTRO ─────────────────────────────────────── */}
      <div className="isem-register-row">
        <span>¿Aún no tienes cuenta? </span>
        <button
          type="button"
          className="isem-register-link"
          onClick={() => navigate('/register/isem/policies')}
        >
          Regístrate
        </button>
      </div>

      {/* ── OVERLAY DE PRE-LOADER FLUTTER (QuickAlert.loading paridad al iniciar sesión) ── */}
      {isLoading && createPortal(
        <div className="qalert-loading-overlay">
          <div className="qalert-loading-box">
            <div className="qalert-loading-header">
              <div className="qalert-loading-dots">
                <span className="dot dot--1"></span>
                <span className="dot dot--2"></span>
                <span className="dot dot--3"></span>
                <span className="dot dot--4"></span>
              </div>
            </div>
            <div className="qalert-loading-body">
              <h3>Iniciando sesión</h3>
              <p>...</p>
            </div>
          </div>
        </div>,
        document.body
      )}

    </form>
  );
}
