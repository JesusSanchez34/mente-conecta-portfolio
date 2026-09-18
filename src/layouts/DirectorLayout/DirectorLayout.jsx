import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import logoMenu from '../../assets/img/logomenteconecta.png';
import { BASE_API_F1, TOKEN } from '../../utils/constants';
import './DirectorLayout.scss';

export function DirectorLayout({ children }) {
  const { auth, logout } = useAuth();
  const location = useLocation();
  const [empresaNombre, setEmpresaNombre] = useState('Empresa no asignada');

  const empresaId = auth?.me?.empresa;

  useEffect(() => {
    if (!empresaId || typeof empresaId !== 'number') return;
    const token = auth?.token || sessionStorage.getItem(TOKEN);
    fetch(`${BASE_API_F1}/catalogo/empresas/${empresaId}/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setEmpresaNombre(data.nombre_empresa))
      .catch(() => {});
  }, [empresaId, auth?.token]);

  if (auth === undefined) return null;
  if (!auth || !auth.me || auth.detail) return <Navigate to="/login-fase1" replace />;

  // Si no es director (rol 5), mandarlo fuera
  if (auth.me.role !== 5) {
    return <Navigate to="/" />;
  }

  return (
    <div className="director-wrapper">
      {/* Sidebar */}
      <div className="director-sidebar">
        <div className="sidebar-header">
          <img src={logoMenu} alt="Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">NOM-035 STPS</h2>
          <p className="sidebar-subtitle">Sistema Integral de Cumplimiento</p>
        </div>

        <div className="sidebar-user-profile">
          <div className="user-avatar">
            {auth.me.nombre ? auth.me.nombre[0].toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <h4 className="user-name">{auth.me.nombre}</h4>
            <p className="user-role">Dirección General</p>
            <p className="user-company">{empresaNombre}</p>
          </div>
        </div>

        <div className="sidebar-menu">
          <Link 
            to="/director/dashboard" 
            className={`menu-item ${location.pathname === '/director/dashboard' ? 'active' : ''}`}
          >
            <div className="menu-item-left">
              <i className="bi bi-bar-chart-fill"></i> Dashboard ejecutivo
            </div>
          </Link>
        </div>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={logout}>
            <i className="bi bi-box-arrow-left"></i> Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="director-content">
        <div className="director-topbar">
          <div>
            <h3>Dashboard ejecutivo</h3>
            <div className="subtitle">Vista consolidada - NOM-035 - 2026</div>
          </div>
        </div>
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
