import { DirectorLayout } from '../layouts';
import { DashboardDirector } from '../pages/director';

const routesDirector = [
    {
        path: "/director/dashboard",
        layout: DirectorLayout,
        component: DashboardDirector,
    }
];

export default routesDirector;
