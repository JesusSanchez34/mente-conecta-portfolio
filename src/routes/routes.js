import routesAdmin from "./routes.admin";
import routesLanding from "./routes.landing";
import routesAdminFase1 from "./router.adminf1";
import routesAdminNX from "./router.adminnx";
import routesUserNX from "./router.usernx";
import routesAdminConasama from "./router.adminconasama";
import routesSuperAdminConasama from "./router.superadminconasama";
import routesAdminSeP from "./router.adminsep";
import routesSuperAdminSeP from "./router.superadminsep";
import routerSuperior from "./router.superior";
import routesWebSep from "./routes.websep";
// Paciente ISEM: /isem/bienvenida, /isem/cuestionarios/:seccion
import routesISEMPaciente from "./routes.isem-paciente";
// Portal ISEM: incluye /login, /login/isem y fallback *
// ⚠️  Debe ir al FINAL para que el wildcard (*) no intercepte otras rutas
import routesISEM from './routes.isem';
import routerSeguridad from './router.seguridad';
import routesPaciente from './router.paciente';
import routesDirector from './routes.director';
import routesB2B from './routes.b2b';

const routes = [
  ...routesLanding,
  ...routesAdmin,
  ...routesAdminFase1,
  ...routesAdminNX,
  ...routesUserNX,
  ...routesAdminConasama,
  ...routesSuperAdminConasama,
  ...routesAdminSeP,
  ...routesSuperAdminSeP,
  ...routerSuperior,
    ...routesPaciente,
    ...routerSeguridad,
    ...routesISEMPaciente,
    ...routesDirector,
    ...routesB2B,
    ...routesISEM, // ← Siempre al final (contiene la ruta wildcard *),
  ...routesWebSep,
];

export default routes;
