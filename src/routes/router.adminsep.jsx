import { AdminLayout } from '../layouts';
import { HomeAdminSeP } from '../pages/adminSEP/homeAdminSeP/HomeAdminSeP';
import { EstadisticasSeP } from '../pages/adminSEP/estadisticasSeP/EstadisticasSeP';
import { ColumbiaPageSeP } from '../pages/adminSEP/columbiaPageSeP/ColumbiaPageSeP';
import { RoleRouteSEP } from '../components/adminsep';

/**
 * Rutas para Gestores de SEP (typeLogin=4, is_staff=true)
 * 
 * Patrón de rutas: /admin/gestor/sep/*
 * Protección: RoleRoute con allowStaff=true
 */

const routesAdminSeP = [
  {
    path: '/admin/gestor/sep',
    layout: AdminLayout,
    component: (props) => (
      <RoleRouteSEP allowStaff>
        <HomeAdminSeP {...props} />
      </RoleRouteSEP>
    ),
  },
  {
    path: '/admin/gestor/sep/estadisticas',
    layout: AdminLayout,
    component: (props) => (
      <RoleRouteSEP allowStaff>
        <EstadisticasSeP {...props} />
      </RoleRouteSEP>
    ),
  },
  {
    path: '/admin/gestor/sep/columbia',
    layout: AdminLayout,
    component: (props) => (
      <RoleRouteSEP allowStaff>
        <ColumbiaPageSeP {...props} />
      </RoleRouteSEP>
    ),
  },
];

export default routesAdminSeP;
