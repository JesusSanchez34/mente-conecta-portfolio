import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { FormForgotPasswordISEM } from '../../components/login/isem';

import headerImg from '../../assets/login/cuidador.png';
import footerImg from '../../assets/login/isemlogo.png';
import escudoImg from '../../assets/login/isem.png';

import './LoginISEMPage.css'; // Reutiliza los estilos generales de la página (layout, header, curvas, footer)

export function ForgotPasswordISEMPage() {
  const { auth } = useAuth();

  // ── SEO: Título de la pestaña ──────────────────────────────
  useEffect(() => {
    document.title = 'Recuperar Contraseña · ISEM Mente Conecta';
    return () => {
      document.title = 'Mente Conecta';
    };
  }, []);

  // ── GUARD: Si ya hay sesión activa, redirige al área admin ──
  if (auth) {
    return <Navigate to="/admin" replace />;
  }

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div className="isem-page" id="isem-forgot-password-page">

      {/* ── HEADER / HERO CON IMAGEN DE FONDO ──────────────── */}
      <header className="isem-page__header" role="banner">
        <img
          src={headerImg}
          alt=""
          className="isem-page__header-bg"
          aria-hidden="true"
        />
        <div className="isem-page__header-overlay" aria-hidden="true" />

        {/* Contenido del header: logo + texto */}
        <div className="isem-page__header-content">
          <img
            src={escudoImg}
            alt="ISEM - Instituto de Salud del Estado de México"
            className="isem-page__header-logo"
          />
          <h1 className="isem-page__header-title">
            Servicio de Diagnóstico Digital en Salud Mental
          </h1>
        </div>

        {/* Curva inferior elegante */}
        <div className="isem-page__header-curve" aria-hidden="true">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,40 C360,120 1080,0 1440,80 L1440,120 L0,120 Z"
              fill="#f5f5f5"
            />
          </svg>
        </div>
      </header>

      {/* ── ÁREA CENTRAL ───────────────────────────────────── */}
      <main className="isem-page__main" role="main">

        {/* Tarjeta de recuperación de contraseña */}
        <div className="isem-card" role="region" aria-label="Formulario de recuperación de contraseña ISEM">

          {/* ── FORMULARIO ──────────────────────────────────── */}
          <div className="isem-card__body">
            <FormForgotPasswordISEM />
          </div>

        </div>

        {/* Crédito de portal */}
        <p className="isem-page__credit">
          ¿Necesitas acceso a otro portal?{' '}
          <a href="/login" className="isem-page__credit-link">
            Ver todos los portales
          </a>
        </p>
      </main>

      {/* ── FOOTER INSTITUCIONAL ───────────────────────────── */}
      <footer className="isem-page__footer" role="contentinfo">
        <img
          src={footerImg}
          alt="Gobierno del Estado de México - ISEM"
          className="isem-page__footer-img"
        />
      </footer>

    </div>
  );
}
