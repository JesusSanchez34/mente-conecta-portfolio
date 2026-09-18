/**
 * QuienRealizaPage.jsx
 * ============================================================
 * Pantalla intermedia post-login ISEM.
 *
 * Pregunta "¿Quién lo realizará?" con dos opciones:
 *   • Personal
 *   • Encuestador
 *
 * Guarda la selección en sessionStorage y redirige a /isem/bienvenida.
 * ============================================================
 */

import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

import headerImg from '../../assets/login/personal.jpg';

import './QuienRealizaPage.css';

export function QuienRealizaPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  // ── SEO & LIMPIEZA DE ESTADO ──────────────────────────────
  useEffect(() => {
    document.title = '¿Quién lo realizará? · ISEM Mente Conecta';
    
    // SOLUCIÓN: Limpiamos la selección si el usuario le dio "Atrás"
    // para permitirle elegir de nuevo sin que se auto-redirija.
    sessionStorage.removeItem('tipoRealizador');

    return () => {
      document.title = 'Mente Conecta';
    };
  }, []);

  // ── GUARD: Sin sesión → login ──────────────────────────────
  if (!auth || auth?.detail) {
    return <Navigate to="/login/isem" replace />;
  }

  // ELIMINAMOS EL GUARD DE "Ya seleccionó" porque ahora limpiamos 
  // el estado al entrar, permitiendo el uso del botón "Atrás".

  // ── HANDLER DE SELECCIÓN ───────────────────────────────────
  const handleSelect = (tipo) => {
    sessionStorage.setItem('tipoRealizador', tipo);
    
    // SOLUCIÓN: Navegamos NORMALMENTE para que esta página se 
    // guarde en el historial del navegador. (Se quitó el replace: true)
    navigate('/isem/bienvenida');
  };

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div className="quien-realiza-page" id="quien-realiza-page">

      {/* ── TÍTULO ──────────────────────────────────────────── */}
      <div className="quien-realiza-page__title-wrapper">
        <h1 className="quien-realiza-page__title">
          ¿Quién lo realizará?
        </h1>
      </div>

      {/* ── TARJETAS ────────────────────────────────────────── */}
      <div className="quien-realiza-page__cards">

        {/* Personal */}
        <button
          type="button"
          className="quien-realiza-card"
          id="btn-personal"
          onClick={() => handleSelect('personal')}
          aria-label="Seleccionar Personal"
        >
          <img
            src={headerImg}
            alt=""
            className="quien-realiza-card__image"
            aria-hidden="true"
          />
          <div className="quien-realiza-card__overlay" aria-hidden="true" />
          <span className="quien-realiza-card__label">Personal</span>
        </button>

        {/* Encuestador */}
        <button
          type="button"
          className="quien-realiza-card"
          id="btn-encuestador"
          onClick={() => handleSelect('encuestador')}
          aria-label="Seleccionar Encuestador"
        >
          <img
            src={headerImg}
            alt=""
            className="quien-realiza-card__image"
            aria-hidden="true"
          />
          <div className="quien-realiza-card__overlay" aria-hidden="true" />
          <span className="quien-realiza-card__label">Encuestador</span>
        </button>

      </div>
    </div>
  );
}