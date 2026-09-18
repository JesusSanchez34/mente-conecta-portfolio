import { AdminLayout } from '../layouts';
import { 
    EstadisticasNX,
    ColumbiaPageNX,
    HomeAdminNX
} from '../pages/neuroXpand';

const routesAdminNX = [
    {
        path: "/admin/neuroXpand/Home",
        layout: AdminLayout,
        component: HomeAdminNX,
    },
    {
        path: "/admin/neuroXpand/estadisticas",
        layout: AdminLayout,
        component: EstadisticasNX,
    },
    {
        path: "/admin/neuroXpand/columbia",
        layout: AdminLayout,
        component: ColumbiaPageNX,
    }
]

export default routesAdminNX;