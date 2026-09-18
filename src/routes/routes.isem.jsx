/**
 * routes.isem.jsx
 * ============================================================
 * Definición de rutas de autenticación.
 *
 * Rutas incluidas:
 *   /login       → LoginLayout (SelectLogin con TODOS los portales)
 *   /login/isem  → LoginISEMPage (login institucional ISEM)
 *   *            → Navigate a /login (fallback 404)
 *
 * Flujo: /login → usuario elige portal → si ISEM → /login/isem
 * ============================================================
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

import { LoginISEMLayout } from '../layouts/loginISEMLayout';
import { LoginISEMPage, ForgotPasswordISEMPage, QuienRealizaPage } from '../pages/loginISEM';
import { LoginLayout } from '../pages/login';

const routesISEM = [
  // ── Selector de portales (ISEM, Fase1, Conasama, SEP, SESyN) ──
  {
    path: '/login',
    layout: LoginISEMLayout,
    component: LoginLayout,
  },

  // ── Login dedicado ISEM (typeLogin=1) ─────────────────────
  {
    path: '/login/isem',
    layout: LoginISEMLayout,
    component: LoginISEMPage,
  },

  // ── ¿Quién lo realizará? (selección post-login ISEM) ────
  {
    path: '/quien-realiza',
    layout: LoginISEMLayout,
    component: QuienRealizaPage,
  },

  // ── Recuperación de contraseña ISEM ─────────────────────
  {
    path: '/forgot-password',
    layout: LoginISEMLayout,
    component: ForgotPasswordISEMPage,
  },

  // ── Fallback: ruta no encontrada → selector de login ──────
  {
    path: '*',
    layout: LoginISEMLayout,
    component: () => <Navigate to="/login" replace />,
  },
];

export default routesISEM;
