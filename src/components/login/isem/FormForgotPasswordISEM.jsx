/**
 * FormForgotPasswordISEM.jsx
 * ============================================================
 * Formulario de recuperación de contraseña para el portal ISEM.
 * Diseño tipo app móvil moderna de salud mental, conectado al backend real.
 *
 * Flujo de 3 pasos:
 *   1. Ingresar correo electrónico (POST /auth/notificacion/)
 *   2. Validar código de verificación de 6 dígitos (POST /user/users/validar_token/)
 *   3. Establecer nueva contraseña (PUT /user/users/establecer_nuevo_password/)
 * ============================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { sendRecoveryEmail, verifyRecoveryCode, resetPassword } from '../../../api/isem/authService.isem';
import './FormForgotPasswordISEM.css';

export function FormForgotPasswordISEM() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' | 'code' | 'password' | 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');

  // ─── ESTADOS DE LOS FORMULARIOS ────────────────────────────────
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibilidad de contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ─── VALIDACIÓN REGEX ──────────────────────────────────────────
  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  // ─── ENVÍO DE EMAIL ────────────────────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    if (!email) {
      setValidationError('El correo electrónico es requerido');
      return;
    }
    if (!isValidEmail(email)) {
      setValidationError('Ingresa un correo electrónico válido');
      return;
    }

    try {
      setIsLoading(true);
      await sendRecoveryEmail(email);
      setStep('code');
    } catch (err) {
      setError(err.message || 'Error al enviar las instrucciones de recuperación.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── VERIFICACIÓN DE CÓDIGO ────────────────────────────────────
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    if (!code) {
      setValidationError('El código de verificación es requerido');
      return;
    }
    if (code.length !== 6) {
      setValidationError('El código debe tener exactamente 6 caracteres');
      return;
    }

    try {
      setIsLoading(true);
      await verifyRecoveryCode(code);
      setStep('password');
    } catch (err) {
      setError(err.message || 'El código ingresado es incorrecto o ha expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── ESTABLECER NUEVA CONTRASEÑA ────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    if (!password) {
      setValidationError('La contraseña es requerida');
      return;
    }
    if (password.length < 4) {
      setValidationError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email, password);
      setStep('success');
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 4. PANTALLA DE ÉXITO FINAL ────────────────────────────────
  if (step === 'success') {
    return (
      <div className="isem-forgot-success" id="forgot-success-view">
        <div className="isem-forgot-success__icon-wrapper">
          <div className="isem-forgot-success__icon-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 6L9 17L4 12"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="isem-form-title">¡Contraseña actualizada!</h2>
        <p className="isem-form-subtitle">
          Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión con tus nuevas credenciales.
        </p>

        <button
          type="button"
          className="isem-btn-primary"
          onClick={() => navigate('/login/isem')}
        >
          Regresar al inicio de sesión
        </button>
      </div>
    );
  }

  // ─── RENDERIZADO DEL FORMULARIO SEGÚN EL PASO ───────────────────
  return (
    <div className="form-forgot-wrapper">
      {/* Modal de error global */}
      {error && (
        <div className="isem-error-overlay" role="dialog" aria-modal="true" aria-label="Error de recuperación">
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
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 1: CORREO ELECTRÓNICO ────────────────────────────── */}
      {step === 'email' && (
        <form
          id="form-forgot-email-step"
          className="form-login-isem"
          onSubmit={handleEmailSubmit}
          noValidate
        >
          <h2 className="isem-form-title">Recuperar contraseña</h2>
          <p className="isem-form-subtitle">
            Ingresa tu correo electrónico registrado y te enviaremos las instrucciones de recuperación.
          </p>

          <div className={`isem-field ${validationError ? 'isem-field--error' : ''}`}>
            <label htmlFor="isem-forgot-email" className="isem-field__label">
              Correo electrónico
            </label>
            <div className="isem-field__input-wrapper">
              <input
                id="isem-forgot-email"
                type="email"
                name="email"
                className="isem-field__input"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError('');
                }}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </div>
            {validationError && (
              <span className="isem-field__error">{validationError}</span>
            )}
          </div>

          <div style={{ height: '1.25rem' }} />

          <button
            id="btn-forgot-email-submit"
            type="submit"
            className="isem-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="isem-btn-primary__loading">
                <span className="isem-spinner" aria-hidden="true" />
                Enviando...
              </span>
            ) : (
              'Enviar instrucciones'
            )}
          </button>

          <div className="isem-form-divider">
            <span>O</span>
          </div>

          <div className="isem-register-row" style={{ marginTop: '0.5rem' }}>
            <button
              type="button"
              className="isem-forgot-link"
              style={{ fontSize: '0.9375rem', fontWeight: '700' }}
              onClick={() => navigate('/login/isem')}
            >
              Regresar al inicio de sesión
            </button>
          </div>
        </form>
      )}

      {/* ── PASO 2: CÓDIGO DE VERIFICACIÓN ─────────────────────────── */}
      {step === 'code' && (
        <form
          id="form-forgot-code-step"
          className="form-login-isem"
          onSubmit={handleCodeSubmit}
          noValidate
        >
          <h2 className="isem-form-title">Verificación de Código</h2>
          <p className="isem-form-subtitle">
            Introduce el código de verificación de 6 dígitos que enviamos a tu correo electrónico:
            <br />
            <strong style={{ color: '#7B1B3A' }}>{email}</strong>
          </p>

          <div className={`isem-field ${validationError ? 'isem-field--error' : ''}`}>
            <label htmlFor="isem-forgot-code" className="isem-field__label">
              Código de verificación
            </label>
            <div className="isem-field__input-wrapper">
              <input
                id="isem-forgot-code"
                type="text"
                name="code"
                maxLength={6}
                className="isem-field__input"
                style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.25rem', fontWeight: 'bold' }}
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                  setCode(val);
                  setValidationError('');
                }}
                disabled={isLoading}
                autoComplete="off"
                autoFocus
              />
            </div>
            {validationError && (
              <span className="isem-field__error">{validationError}</span>
            )}
          </div>

          <div style={{ height: '1.25rem' }} />

          <button
            id="btn-forgot-code-submit"
            type="submit"
            className="isem-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="isem-btn-primary__loading">
                <span className="isem-spinner" aria-hidden="true" />
                Verificando...
              </span>
            ) : (
              'Verificar código'
            )}
          </button>

          <div className="isem-form-divider">
            <span>O</span>
          </div>

          <div className="isem-register-row" style={{ marginTop: '0.5rem' }}>
            <button
              type="button"
              className="isem-forgot-link"
              style={{ fontSize: '0.9375rem', fontWeight: '700' }}
              onClick={() => setStep('email')}
            >
              Cambiar correo electrónico
            </button>
          </div>
        </form>
      )}

      {/* ── PASO 3: ESTABLECER NUEVA CONTRASEÑA ─────────────────────── */}
      {step === 'password' && (
        <form
          id="form-forgot-password-step"
          className="form-login-isem"
          onSubmit={handlePasswordSubmit}
          noValidate
        >
          <h2 className="isem-form-title">Nueva contraseña</h2>
          <p className="isem-form-subtitle">
            Ingresa tu nueva contraseña para acceder al portal.
          </p>

          {/* Campo contraseña */}
          <div className={`isem-field ${validationError && !password ? 'isem-field--error' : ''}`}>
            <label htmlFor="isem-new-password" className="isem-field__label">
              Nueva contraseña
            </label>
            <div className="isem-field__input-wrapper">
              <input
                id="isem-new-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="isem-field__input"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError('');
                }}
                disabled={isLoading}
                autoComplete="new-password"
                autoFocus
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
          </div>

          {/* Campo confirmar contraseña */}
          <div className={`isem-field ${validationError && password !== confirmPassword ? 'isem-field--error' : ''}`}>
            <label htmlFor="isem-confirm-password" className="isem-field__label">
              Confirmar contraseña
            </label>
            <div className="isem-field__input-wrapper">
              <input
                id="isem-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="isem-field__input"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidationError('');
                }}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="isem-field__toggle-pw"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
            {validationError && (
              <span className="isem-field__error">{validationError}</span>
            )}
          </div>

          <div style={{ height: '1.25rem' }} />

          <button
            id="btn-forgot-password-submit"
            type="submit"
            className="isem-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="isem-btn-primary__loading">
                <span className="isem-spinner" aria-hidden="true" />
                Actualizando...
              </span>
            ) : (
              'Actualizar contraseña'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
