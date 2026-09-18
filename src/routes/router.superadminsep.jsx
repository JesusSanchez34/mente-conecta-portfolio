import { AdminLayout } from '../layouts';
import { HomeSuperAdminSeP } from '../pages/superAdminSEP/homeSuperAdminSeP/HomeSuperAdminSeP';
import { GraficasSuperAdminSeP } from '../pages/superAdminSEP/graficasSuperAdminSeP/GraficasSuperAdminSeP';
import { PacientesSuperAdminSeP } from '../pages/superAdminSEP/pacientesSuperAdminSeP/PacientesSuperAdminSeP';
import { GestoresSuperAdminSeP } from '../pages/superAdminSEP/gestoresSuperAdminSeP/GestoresSuperAdminSeP';
import { NoticiasSuperAdminSeP } from '../pages/superAdminSEP/noticiasSuperAdminSeP/NoticiasSuperAdminSeP';
import { ReportesSuperAdminSeP } from '../pages/superAdminSEP/reportesSuperAdminSeP/ReportesSuperAdminSeP';
import { RoleRouteSEP } from '../components/adminsep';

/**
 * Rutas para SuperGestores de SEP (typeLogin=4, is_superuser=true)
 * 
 * Patrón de rutas: /admin/super-gestor/sep/*
 * Protección: RoleRoute con allowSuper=true
 * Algunas rutas tienen restricción adicional por organización
 */

const routesSuperAdminSeP = [
  {
    path: '/admin/super-gestor/sep',
    layout: AdminLayout,
    component: (props) => (
      <RoleRouteSEP allowSuper>
        <HomeSuperAdminSeP {...props} />
      </RoleRouteSEP>
    ),
  },
  {
    path: '/admin/super-gestor/sep/graficas',
    layout: AdminLayout,
    component: (props) => (
      <RoleRouteSEP allowSuper>
        <GraficasSuperAdminSeP {...props} />
      </RoleRouteSEP>
    ),
  },
  {
    path: '/admin/super-gestor/sep/pacientes-riesgo',
    layout: AdminLayout,
    component: (props) => (
      <RoleRouteSEP allowSuper>
        <PacientesSuperAdminSeP {...props} />
      </RoleRouteSEP>
    ),
  },
  {
    path: '/admin/super-gestor/sep/gestores',
    layout: AdminLayout,
    component: (props) => (
      <RoleRouteSEP allowSuper allowOrganizaciones={[2]}>
        <GestoresSuperAdminSeP {...props} />
      </RoleRouteSEP>
    ),
  },
  {
    path: '/admin/super-gestor/sep/noticias',
    layout: AdminLayout,
    component: (props) => (
      <RoleRouteSEP allowSuper>
        <NoticiasSuperAdminSeP {...props} />
      </RoleRouteSEP>
    ),
  },
  {
    path: '/admin/super-gestor/sep/reportes',
    layout: AdminLayout,
    component: (props) => (
      <RoleRouteSEP allowSuper allowOrganizaciones={[0]}>
        <ReportesSuperAdminSeP {...props} />
      </RoleRouteSEP>
    ),
  },
];

export default routesSuperAdminSeP;
