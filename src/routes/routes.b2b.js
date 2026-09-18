import { B2BLayout } from '../layouts';
import { Politica } from '../pages/adminFase1/SeleccionUsuario/Usuarios/Personal/Politica';
import { 
    DashboardRH, 
    ResultadosRH, 
    AtsRH, 
    QuejasRH 
} from '../pages/b2b';

const routesB2B = [
    {
        path: "/empresa/dashboard",
        layout: B2BLayout,
        component: DashboardRH,
        exact: true
    },
    {
        path: "/empresa/resultados",
        layout: B2BLayout,
        component: ResultadosRH,
        exact: true
    },
    {
        path: "/empresa/ats",
        layout: B2BLayout,
        component: AtsRH,
        exact: true
    },
    {
        path: "/empresa/quejas",
        layout: B2BLayout,
        component: QuejasRH,
        exact: true
    },
    {
        path: "/empresa/politica",
        layout: B2BLayout,
        component: Politica,
        exact: true
    }
];

export default routesB2B;
