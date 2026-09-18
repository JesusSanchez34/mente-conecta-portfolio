import { AdminLayout } from "../layouts";
import {
    SeleccionUsuarioNX,
    PersonalNX,
    CategoryDetailNX,
    FamiliarNX,
    FamiliarCategoryDetailNX,
    CuidadorNX,
    DatosGeneralesNX,
    ReporteNX
} from "../pages/neuroXpand";
import { Carrouselnx } from '../components/login/CarrouselNeuroXpand/Carrouselnx';
import {
    FormLoginnx,
    RecuperarPasswordnx,
    VerificarCodigonx,
    EstablecerPasswordnx,
    RegistroEmpresanx
} from "../components/login";
import FormRegistronx from "../components/adminNX/FormRegistroNeuroXpand/FormRegistronx";


const routesUserNX = [
    {
        path: '/carrusel-neuroXpand',
        layout: ({ children }) => <>{children}</>,
        component: Carrouselnx,
    },
    {
        path: '/login-neuroXpand',
        layout: ({ children }) => <>{children}</>,
        component: FormLoginnx,
    },
    {
        path: '/recuperar-password-neuroXpand',
        layout: ({ children }) => <>{children}</>,
        component: RecuperarPasswordnx,
    },
    {
        path: '/verificar-codigo-neuroXpand',
        layout: ({ children }) => <>{children}</>,
        component: VerificarCodigonx,
    },
    {
        path: '/establecer-password-neuroXpand',
        layout: ({ children }) => <>{children}</>,
        component: EstablecerPasswordnx,
    },
    {
        path: '/registro-neuroXpand',
        layout: ({ children }) => <>{children}</>,
        component: FormRegistronx,
    },
    {
        path: '/registro-empresa-neuroXpand',
        layout: ({ children }) => <>{children}</>,
        component: RegistroEmpresanx,
    },
    {
        path: "/seleccion-usuarioNX",
        layout: ({ children }) => <>{children}</>,
        component: SeleccionUsuarioNX,
    },
    {
        path: '/personalNX',
        layout: ({ children }) => <>{children}</>,
        component: PersonalNX,
    },
    {
        path: "/personalNX/:category",
        layout: ({ children }) => <>{children}</>,
        component: CategoryDetailNX,
    },

    {
        path: '/personalNX/datos-generalesNX',
        layout: ({ children }) => <>{children}</>,
        component: DatosGeneralesNX,
    },
    {
        path: '/personalNX/reporteNX',
        layout: ({ children }) => <>{children}</>,
        component: ReporteNX,
    },

    {
        path: '/familiarNX',
        layout: ({ children }) => <>{children}</>,
        component: FamiliarNX,
    },
    {
        path: '/familiarNX/:category',
        layout: ({ children }) => <>{children}</>,
        component: FamiliarCategoryDetailNX,
    },
    {
        path: '/cuidadorNX',
        layout: ({ children }) => <>{children}</>,
        component: CuidadorNX,
    },
    {
        path: '/cuidadorNX/:category',
        layout: ({ children }) => <>{children}</>,
        component: FamiliarCategoryDetailNX,
    },

]

export default routesUserNX;