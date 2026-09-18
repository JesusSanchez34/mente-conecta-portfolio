import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ISEMSidebar } from '../../components/isemPaciente';
import './ISEMPacienteLayout.css';

/**
 * ISEMPacienteLayout
 * ============================================================
 * Layout para las pantallas del paciente ISEM.
 *
 * Incluye:
 *   • ISEMSidebar (logo + Seleccionar otra persona + Cerrar sesión)
 *   • Área de contenido principal (children)
 *
 * Guards:
 *   • Sin sesión → /login
 *   • Sin tipoRealizador → /quien-realiza
 * ============================================================
 */
export function ISEMPacienteLayout({ children }) {
  const { auth } = useAuth();

  // Esperando a que AuthContext cargue
  if (auth === undefined) return null;

  // Sin sesión → login
  if (!auth || auth?.detail) {
    return <Navigate to="/login" replace />;
  }

  // Sin selección de rol → pantalla de selección
  const tipoRealizador = sessionStorage.getItem('tipoRealizador');
  if (!tipoRealizador) {
    return <Navigate to="/quien-realiza" replace />;
  }

  return (
    <div className="isem-paciente-layout">
      <ISEMSidebar />
      <main className="isem-paciente-layout__content">
        {children}
      </main>
    </div>
  );
}
