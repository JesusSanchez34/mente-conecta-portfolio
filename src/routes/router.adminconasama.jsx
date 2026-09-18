import { AdminLayout } from '../layouts';
import { 
    EstadisticaConasama,
    ColumbiaPageCona,
    HomaAdminConasama
} from '../pages/adminConasama';
import { RoleRoute } from '../components/adminconasama/proteccionRutas';

const routesAdminConasama = [
    {
        path: "/admin/gestor/conasama",
        layout: AdminLayout,
        component: (props) => (
            <RoleRoute allowStaff>
                <HomaAdminConasama {...props} />
            </RoleRoute>
        ),
    },
    {
        path: "/admin/gestor/conasama/estadisticas",
        layout: AdminLayout,
        component: (props) => (
            <RoleRoute allowStaff>
                <EstadisticaConasama {...props} />
            </RoleRoute>
        ),
    },
    {
        path: "/admin/gestor/conasama/columbia",
        layout: AdminLayout,
        component: (props) => (
            <RoleRoute allowStaff>
                <ColumbiaPageCona {...props} />
            </RoleRoute>
        ),
    }
]

export default routesAdminConasama;
