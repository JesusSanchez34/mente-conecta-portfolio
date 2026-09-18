import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { useLocation, Navigate } from 'react-router-dom';
import { HeaderAdmin, LeftMenu } from '../../components/admin';
import { LanguageSelector } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import './AdminLayout.css';
// Nota: LoginLayout eliminado de este import — el redirect ahora apunta a /login

export function AdminLayout(props) {
  const { children } = props;
  const { auth } = useAuth();
  const { pathname } = useLocation();

  // ── GUARD DE AUTENTICACIÓN ──────────────────────────────────
  // Si auth es undefined → AuthContext aún está cargando (esperar)
  if (auth === undefined) return null;

  // Si no hay sesión → redirigir a la página de login ISEM
  if (!auth || auth?.detail) return <Navigate to="/admin" replace />;

  const isAdminF1Route = pathname.startsWith('/admin/f1');
  const isGestorConasamaRoute = pathname.startsWith("/admin/gestor/conasama");
  const isSuperConasamaRoute = pathname.startsWith("/admin/super-gestor/conasama");
  const isGestorSePRoute = pathname.startsWith("/admin/gestor/sep");
  const isSuperSePRoute = pathname.startsWith("/admin/super-gestor/sep");
  const isSuperiorSePRoute = pathname.startsWith("/admin/superior-gestor/sep");

  const typeLogin = Number(auth?.typeLogin);

  if (auth.typeLogin === 1) {
    if (isAdminF1Route) return <Navigate to="/admin" replace />;
  }

  // REDIRECCIÓN B2B (RH: rol 4 → /empresa/dashboard, Director: rol 5 → /director/dashboard)
  if (auth.me?.role === 5) {
    if (pathname !== '/director/dashboard') {
      return <Navigate to="/director/dashboard" replace />;
    }
  }
  if (auth.me?.role === 4) {
    if (pathname !== '/empresa/dashboard') {
      return <Navigate to="/empresa/dashboard" replace />;
    }
  }

  if (auth.typeLogin === 2) {
    if (!isAdminF1Route) return <Navigate to="/admin/f1/" replace />;
  }

  if (auth.typeLogin === 3) {
    if (auth.is_superuser) {
      if (!isSuperConasamaRoute) {
        return <Navigate to="/admin/super-gestor/conasama" replace />;
      }
    } else if (auth.is_staff) {
      if (!isGestorConasamaRoute) {
        return <Navigate to="/admin/gestor/conasama" replace />;
      }
    } else {
      return <Navigate to="/paciente/inicio" replace />;
    }
  }

  if (auth.typeLogin === 4) {
    if (auth.is_superuser) {
      if (!isSuperSePRoute) {
        return <Navigate to="/admin/super-gestor/sep" replace />;
      }
    } else if (auth.is_staff) {
      if (!isGestorSePRoute) {
        return <Navigate to="/admin/gestor/sep" replace />;
      }
    } else {
      return <Navigate to="/paciente/inicio" replace />;
    }
  }

  if (auth.typeLogin === 5) {
    if (auth.is_superuser) {
      if (!isSuperiorSePRoute) {
        return <Navigate to="/admin/superior-gestor/sep" replace />;
      }
    } else if (auth.is_staff) {
      if (!isSuperiorSePRoute) {
        return <Navigate to="/admin/superior-gestor/sep" replace />;
      }
    }
  }

  if (Number(auth.typeLogin) === 6) {
    return <Navigate to="/seguridad/inicio" replace />;
  }


  return (
    <Container fluid className="admin-layout" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 999 }}>
        <LanguageSelector lightBg />
      </div>
      <Row>
        <HeaderAdmin />
      </Row>
      <Row className="row divi">
        <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3">
          <LeftMenu />
        </div>
        <div className="col-sm-12 col-md-8 col-lg-9 col-xl-9">
          <Row>{children}</Row>
        </div>
      </Row>
    </Container>
  );
}
