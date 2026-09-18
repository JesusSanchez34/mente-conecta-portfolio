import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { FiLogOut, FiUsers } from 'react-icons/fi';
import isemLogoImg from '../../../assets/login/isem.png';
import './ISEMSidebar.css';

/**
 * ISEMSidebar
 * ============================================================
 * Sidebar del paciente ISEM con:
 *   • Logo "ISEM Salud Mental"
 *   • "Seleccionar otra persona" → /quien-realiza
 *   • "Cerrar sesión" → logout
 *
 * En desktop (≥992px) siempre visible.
 * En móvil, se abre/cierra con botón hamburguesa.
 * ============================================================
 */
export function ISEMSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  const handleSeleccionarOtra = () => {
    handleClose();
    sessionStorage.removeItem('tipoRealizador');
    navigate('/quien-realiza', { replace: true });
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className={`isem-hamburger ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        aria-label="Abrir menú"
        id="isem-menu-toggle"
      >
        <span className="isem-hamburger__icon" />
      </button>

      {/* Overlay para cerrar al tocar fuera */}
      <div
        className={`isem-sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <nav className={`isem-sidebar ${isOpen ? 'open' : ''}`} id="isem-sidebar">
        {/* Header */}
        <div className="isem-sidebar__header">
          <img src={isemLogoImg} alt="ISEM" className="isem-sidebar__logo-img" />
          <span className="isem-sidebar__subtitle">Salud Mental</span>
        </div>

        <div className="isem-sidebar__divider" />

        {/* Opciones */}
        <ul className="isem-sidebar__menu">
          <li>
            <button
              type="button"
              className="isem-sidebar__menu-item isem-sidebar__menu-item--active"
              onClick={handleSeleccionarOtra}
              id="btn-seleccionar-persona"
            >
              <span className="isem-sidebar__menu-icon">
                <FiUsers />
              </span>
              Seleccionar otra persona
            </button>
          </li>
          <li>
            <button
              type="button"
              className="isem-sidebar__menu-item"
              onClick={handleLogout}
              id="btn-cerrar-sesion"
            >
              <span className="isem-sidebar__menu-icon">
                <FiLogOut />
              </span>
              Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
