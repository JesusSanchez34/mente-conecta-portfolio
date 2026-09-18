/**
 * LoginISEMLayout.jsx
 * ============================================================
 * Layout mínimo para la pantalla de login ISEM.
 *
 * NO incluye Header ni Footer de la landing page.
 * La página LoginISEMPage tiene su propio header/footer institucional.
 *
 * Propósito: servir como wrapper en el sistema de rutas
 * (que requiere que cada ruta tenga un layout).
 * ============================================================
 */

import React from 'react';
import './LoginISEMLayout.css';

export function LoginISEMLayout({ children }) {
  return (
    <div className="login-isem-layout">
      {children}
    </div>
  );
}
