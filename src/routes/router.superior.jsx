import { AdminLayout } from "../layouts";
import {
    HomeSuperior,
    PacientesRiesgoSuperior,
    GestoresSuperior,
    GraficacionSuperior,
    GrupoSuperior,
    NoticiasSuperior
} from "../pages/SuperiorSEP";

const routerSuperior = [
    {
        path: "/admin/superior-gestor/sep",
        layout: AdminLayout,
        component: HomeSuperior,
    },
    {
    path: "/admin/superior-gestor/sep/pacientes-riesgo",
    layout: AdminLayout,
    component: PacientesRiesgoSuperior,
    },

    {
        path: "/admin/superior-gestor/sep/gestores",
        layout: AdminLayout,
        component: GestoresSuperior,
    },
    
    {
        path: "/admin/superior-gestor/sep/graficas",
        layout: AdminLayout,
        component: GraficacionSuperior,
    },
    {
        path: "/admin/superior-gestor/sep/grupo",
        layout: AdminLayout,
        component: GrupoSuperior,
    },
    {
        path: "/admin/superior-gestor/sep/noticias",
        layout: AdminLayout,
        component: NoticiasSuperior,
    }
];

export default routerSuperior;
