import { AdminLayout } from '../layouts';
import { 
    EstadisticaFase1,
    ColumbiaPage,
    HomaAdminFase1,
    QuejasTrabajador
} from '../pages/adminFase1';

const routesAdminFase1 = [
    {
        path: "/admin/f1/",
        layout: AdminLayout,
        component: HomaAdminFase1,
    },
    {
        path: "/admin/f1/estadisticas",
        layout: AdminLayout,
        component: EstadisticaFase1,
    },
    {
        path: "/admin/f1/columbia",
        layout: AdminLayout,
        component: ColumbiaPage,
    },
    {
        path: "/admin/f1/quejas",
        layout: AdminLayout,
        component: QuejasTrabajador,
    }
]

export default routesAdminFase1;
