import React, { useEffect } from 'react';
//import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { FormLoginISEM } from '../../components/login/isem';

import headerImg from '../../assets/login/cuidador.png';
import footerImg from '../../assets/login/isemlogo.png';
import escudoImg from '../../assets/login/isem.png';

import './LoginISEMPage.css';

export function LoginISEMPage() {
  // Asegúrate de extraer la función logout de tu hook
  const { auth, logout } = useAuth(); 

  // ── SEO & MANEJO DEL BOTÓN ATRÁS ──────────────────────────────
  useEffect(() => {
    document.title = 'Iniciar Sesión · ISEM Mente Conecta';

    // Si la pantalla se carga y el usuario ya tenía sesión, 
    // significa que le dio al botón "Atrás". Le cerramos la sesión
    // para que vea el formulario y no se quede atrapado en un bucle.
    if (auth) {
      logout();
    }

    return () => {
      document.title = 'Mente Conecta';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div className="isem-page" id="isem-login-page">

      <header className="isem-page__header" role="banner">
        <img
          src={headerImg}
          alt=""
          className="isem-page__header-bg"
          aria-hidden="true"
        />
        <div className="isem-page__header-overlay" aria-hidden="true" />

        <div className="isem-page__header-content">
          <img
            src={escudoImg}
            alt="ISEM"
            className="isem-page__header-logo"
          />
          <h1 className="isem-page__header-title">
            Servicio de Diagnóstico Digital en Salud Mental
          </h1>
        </div>

        <div className="isem-page__header-curve" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,120 1080,0 1440,80 L1440,120 L0,120 Z" fill="#f5f5f5" />
          </svg>
        </div>
      </header>

      <main className="isem-page__main" role="main">
        <div className="isem-card" role="region" aria-label="Formulario de acceso">
          <div className="isem-card__body">
            <FormLoginISEM />
          </div>
        </div>

        <p className="isem-page__credit">
          ¿Necesitas acceso a otro portal?{' '}
          <a href="/login" className="isem-page__credit-link">
            Ver todos los portales
          </a>
        </p>
      </main>

      <footer className="isem-page__footer" role="contentinfo">
        <img
          src={footerImg}
          alt="Gobierno del Estado de México"
          className="isem-page__footer-img"
        />
      </footer>
    </div>
  );
}