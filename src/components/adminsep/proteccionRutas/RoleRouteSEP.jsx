import React from 'react';
import { useAuth } from '../../../hooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * Componente de Protección de Rutas para SEP
 *
 * Props:
 * - allowSuper: boolean - Solo para usuarios con is_superuser === true
 * - allowStaff: boolean - Solo para usuarios con is_staff === true Y is_superuser === false
 * - allowOrganizaciones: array - Valida auth.me.organizacion contra esta lista
 * - children: ReactNode - Componente a renderizar si tiene permisos
 *
 * Ejemplo:
 * <RoleRouteSEP allowStaff>
 *   <HomaAdminSeP />
 * </RoleRouteSEP>
 *
 * <RoleRouteSEP allowSuper allowOrganizaciones={[0]}>
 *   <ReportesSeP />
 * </RoleRouteSEP>
 */
export function RoleRouteSEP({
  allowSuper = false,
  allowStaff = false,
  allowOrganizaciones = null,
  children,
}) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  // Validaciones
  const isSeP = Number(auth?.typeLogin) === 4;
  const isSuper = Boolean(auth?.is_superuser);
  const isStaff = Boolean(auth?.is_staff);
  const organizacion = auth?.me?.organizacion;

  // ================== LÓGICA DE PERMISOS ==================

  // Validar que sea de SEP primero, luego validar el rol
  const rolPermitido = isSeP && ((allowSuper && isSuper) || (allowStaff && isStaff && !isSuper));

  // Validar si la organización está permitida
  const organizacionPermitida =
    !allowOrganizaciones || allowOrganizaciones.includes(organizacion);

  const tienePermiso = rolPermitido && organizacionPermitida;

  // ================== REDIRECCIÓN ==================

  if (!tienePermiso && isSeP) {
    toast.error(
      `${
        !rolPermitido
          ? 'No tienes rol suficiente para acceder a esta sección'
          : 'Tu organización no tiene acceso a esta sección'
      }`
    );

    // Redirigir según el rol
    if (isSuper) {
      navigate('/admin/super-gestor/sep');
    } else if (isStaff) {
      navigate('/admin/gestor/sep');
    } else {
      navigate('/admin');
    }

    return null;
  }

  // ================== RENDERIZAR ==================

  return children;
}

export default RoleRouteSEP;
