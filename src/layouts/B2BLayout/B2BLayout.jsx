import React, { useEffect, useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoMenu from '../../assets/img/logomenteconecta.png';
import { BASE_API_F1, TOKEN } from '../../utils/constants';
import './B2BLayout.scss';

export function B2BLayout(props) {
  const { children } = props;
  const { auth, logout } = useAuth();
  const { pathname } = useLocation();
  const [empresaNombre, setEmpresaNombre] = useState(null);

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
  if (!auth || auth?.detail) return <Navigate to="/login-fase1" replace />;

  // ROLE 4 = RH, ROLE 5 = DIRECTOR
  if (auth.me?.role !== 4 && auth.me?.role !== 5) {
      return <Navigate to="/admin/f1/" replace />; // Redirect non-B2B to worker dashboard
  }

  return (
    <div className="b2b-layout">
      <div className="b2b-sidebar">
        <div className="b2b-sidebar-header">
          <div className="logo-container">
            <img src={logoMenu} alt="Mente Conecta" className="img-fluid" />
          </div>
          <div className="user-profile mt-4">
            <div className="avatar">{auth.me?.nombre ? auth.me.nombre[0].toUpperCase() : 'U'}</div>
            <div className="user-info">
              <span className="user-name">{auth.me?.nombre}</span>
              <span className="user-role">Responsable SSPA / RH</span>
            </div>
          </div>
        </div>

        <div className="b2b-sidebar-menu">
          <Link to="/empresa/dashboard" className={`menu-item ${pathname.includes('dashboard') ? 'active' : ''}`}>
            <div className="menu-item-left">
              <i className="bi bi-grid-fill"></i> Dashboard general
            </div>
          </Link>

          <div className="menu-section">EVALUACIONES</div>
          <Link to="/empresa/resultados" className="menu-item">
            <div className="menu-item-left">
              <i className="bi bi-bar-chart-fill"></i> Resultados y diagnóstico
            </div>
          </Link>

          <div className="menu-section">EMPRESA</div>
          <Link to="/empresa/quejas" className={`menu-item ${pathname.includes('quejas') ? 'active' : ''}`}>
            <div className="menu-item-left">
              <i className="bi bi-shield-lock-fill"></i> Buzón de Quejas
            </div>
          </Link>
          <Link to="/empresa/politica" className="menu-item">
            <div className="menu-item-left">
              <i className="bi bi-file-earmark-text-fill"></i> Política de prevención
            </div>
          </Link>
        </div>
        
        <div className="b2b-sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i> Cerrar sesión
          </button>
        </div>
      </div>

      <div className="b2b-content">
        <div className="w-100 h-100">
          {children}
        </div>
      </div>
    </div>
  );
}
