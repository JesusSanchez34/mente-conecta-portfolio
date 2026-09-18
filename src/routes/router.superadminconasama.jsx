import { AdminLayout } from '../layouts';
import { 
    HomeSuperAdminConasama,
    GestoresSuperAdminConasama,
    GraficasSuperAdminConasama,
    PacientesSuperAdminConasama,
    NoticiasSuperAdminConasama,
    ReportesSuperAdminConasama
} from '../pages/superAdminConasama';
import { RoleRoute } from '../components/adminconasama/proteccionRutas';

const routesAdminConasama = [
    {
        path: "/admin/super-gestor/conasama",
        layout: AdminLayout,
        component: (props) => (
            <RoleRoute allowSuper>
                <HomeSuperAdminConasama {...props} />
            </RoleRoute>
        ),
    },
    {
        path: "/admin/super-gestor/conasama/graficas",
        layout: AdminLayout,
        component: (props) => (
            <RoleRoute allowSuper>
                <GraficasSuperAdminConasama {...props} />
            </RoleRoute>
        ),
    },
    {
        path: "/admin/super-gestor/conasama/pacientes-riesgo",
        layout: AdminLayout,
        component: (props) => (
            <RoleRoute allowSuper>
                <PacientesSuperAdminConasama {...props} />
            </RoleRoute>
        ),
    },
    {
        path: "/admin/super-gestor/conasama/gestores",
        layout: AdminLayout,
        component: (props) => (
            <RoleRoute allowSuper allowOrganizaciones={[1]}>
                <GestoresSuperAdminConasama {...props} />
            </RoleRoute>
        ),
    },
    // En sep no habra apartado de noticias
    {
        path: "/admin/super-gestor/conasama/noticias",
        layout: AdminLayout,
        component: (props) => (
            <RoleRoute allowSuper>
                <NoticiasSuperAdminConasama {...props} />
            </RoleRoute>
        ),
    },
    // No habra apartado de reportes para SEP
    {
        path: "/admin/super-gestor/conasama/reportes",
        layout: AdminLayout,
        component: (props) => (
            <RoleRoute allowSuper allowOrganizaciones={[0]}>
                <ReportesSuperAdminConasama {...props} />
            </RoleRoute>
        ),
    },
]

export default routesAdminConasama;
