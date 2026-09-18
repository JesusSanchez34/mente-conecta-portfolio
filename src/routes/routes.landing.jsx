import React from 'react';
import { LandingLayout } from '../layouts';
import { HomeLanding } from '../pages/landingPage/home';
import { CharacteristicsPage } from '../pages/landingPage/characteristics/CharacteristicsPage';
import { SecurityPage } from '../pages/landingPage/security/SecurityPage';
import { ServicesPage } from '../pages/landingPage/services/ServicesPage';

import FormularioDeRegistro from '../components/adminfase1/FormularioDeRegistro/FormularioDeRegistro';
import {
    RecuperarPassword,
    RegistroEmpresa,
    FormLoginFase1,
    VerificarCodigo,
    EstablecerPassword,
} from '../components/login/formLogin';

import { CarrouselFase1 } from '../components/login/CarrouselFase1/CarrouselFase1';
import { SeleccionUsuario } from '../pages/adminFase1/SeleccionUsuario/SeleccionUsuario'

import { Personal } from '../pages/adminFase1/SeleccionUsuario/Usuarios/Personal';
import { CategoryDetail } from '../pages/adminFase1/SeleccionUsuario/Usuarios/Personal/CategoryDetail';
import { Familiar, FamiliarCategoryDetail } from '../pages/adminFase1/SeleccionUsuario/Usuarios/Familiar';
import { Cuidador } from '../pages/adminFase1/SeleccionUsuario/Usuarios/Cuidador';
import { DatosGenerales } from '../pages/adminFase1/SeleccionUsuario/Usuarios/Personal/Sidebar/DatosGenerales/DatosGenerales';
import { Reporte } from '../pages/adminFase1/SeleccionUsuario/Usuarios/Personal/Reporte';
import { ReporteNom035 } from '../pages/adminFase1/SeleccionUsuario/Usuarios/Personal/ReporteNom035';
import { Politica } from '../pages/adminFase1/SeleccionUsuario/Usuarios/Personal/Politica';
import { QuejasTrabajador } from '../pages/adminFase1/QuejasTrabajador/QuejasTrabajador';


// Registro ISEM
import { PoliticasPage } from '../pages/register/isem/PoliticasPage';
import { ConsentimientoPage } from '../pages/register/isem/ConsentimientoPage';
import { PropositoPage } from '../pages/register/isem/PropositoPage';
import { RegistroPage } from '../pages/register/isem/RegistroPage';

// Layout sin header/footer para pantallas de registro
import { Home } from "../pages/landing";
import { RegistroSep } from "../pages/webBasica/registroSep/RegistroSep";
import { LoginLayout } from "../pages/login";

import { TutorialCarousel } from '../pages/envejecimiento/tutorial/TutorialCarousel';
import { ConsentimientoInformado } from '../pages/envejecimiento/tutorial/ConsentimientoInformado';
import { PantallaCarga } from '../pages/envejecimiento/PantallaCarga';
import { PerfilPaciente } from '../pages/envejecimiento/PerfilPaciente';
import { ConfiguracionScreen } from '../pages/envejecimiento/ConfiguracionScreen';
import { ReportePaciente } from '../pages/envejecimiento/ReportePaciente';
import { FormLoginEnvejecimiento } from '../components/login/formLoginEnvejecimiento/FormLoginEnvejecimiento';
import { FormRegisterEnvejecimiento } from '../components/login/formRegisterEnvejecimiento/FormRegisterEnvejecimiento';
import { QuienLoRealiza } from '../pages/envejecimiento/quienLoRealiza/QuienLoRealiza';
import { ForgotPassword } from '../pages/envejecimiento/recuperarPassword/ForgotPassword';
import { ValidarCodigo } from '../pages/envejecimiento/recuperarPassword/ValidarCodigo';
import { NuevoPassword } from '../pages/envejecimiento/recuperarPassword/NuevoPassword';
import { SeccionesScreen } from '../pages/envejecimiento/secciones/SeccionesScreen';
import { SplashScreenEnvejecimiento } from '../pages/envejecimiento/preview/SplashScreenEnvejecimiento';
import { CuestionarioScreen } from '../pages/envejecimiento/cuestionarios/CuestionarioScreen';
import { CuestionarioSaludMentalScreen } from '../pages/envejecimiento/cuestionarios/CuestionarioSaludMentalScreen';
import { PreguntasScreen } from '../pages/envejecimiento/cuestionarios/PreguntasScreen';
import { MarcadoresBiologicosScreen } from '../pages/envejecimiento/saludMental/MarcadoresBiologicosScreen';
import { EdadCelularScreen } from '../pages/envejecimiento/saludMental/EdadCelularScreen';
import { ValorLongitudRelativaScreen } from '../pages/envejecimiento/saludMental/ValorLongitudRelativaScreen';
import { GlucosaLabScreen } from '../pages/envejecimiento/saludMental/GlucosaLabScreen';
import { DeterioroCognitivoScreen } from '../pages/envejecimiento/saludMental/DeterioroCognitivoScreen';
import { SemaforoDeterioroScreen } from '../pages/envejecimiento/saludMental/SemaforoDeterioroScreen';
import { EnvejecimientoSaludableScreen } from '../pages/envejecimiento/saludMental/EnvejecimientoSaludableScreen';
import { SecuenciaVistasScreen } from '../pages/envejecimiento/saludMental/SecuenciaVistasScreen';
import { ResultadoSecuenciasScreen } from '../pages/envejecimiento/saludMental/ResultadoSecuenciasScreen';
import { GenotipoScreen } from '../pages/envejecimiento/saludMental/GenotipoScreen';
import { NoLayout } from '../layouts/noLayout/NoLayout';
import { useNavigate } from 'react-router-dom';
import { DemoPage } from '../pages/demo/DemoPage';
import { DemoLayout } from '../layouts/demo/DemoLayout';

const BlankLayout = ({ children }) => <>{children}</>;


const LoginMenWrapped = () => {
    const navigate = useNavigate();
    return <FormLoginEnvejecimiento onBack={() => navigate('/tutorial')} />;
};

const RegistroWrapped = () => {
    const navigate = useNavigate();
    return <FormRegisterEnvejecimiento onBack={() => navigate('/quien-lo-realiza')} />;
};

const routesLanding = [
    {
        path: '/carrusel',
        layout: ({ children }) => <>{children}</>,
        component: CarrouselFase1,
    },
    {
        path: "/",
        layout: LandingLayout,
        component: HomeLanding,
    },
    {
        path: "/home",
        layout: LandingLayout,
        component: HomeLanding,
    },
    {
        path: "/services",
        layout: LandingLayout,
        component: ServicesPage,
    },
    {
        path: "/characteristics",
        layout: LandingLayout,
        component: CharacteristicsPage,
    },
    {
        path: "/security",
        layout: LandingLayout,
        component: SecurityPage,
    },
    {
        path: '/preview',
        layout: NoLayout,
        component: SplashScreenEnvejecimiento,
    },
    {
        path: '/tutorial',
        layout: NoLayout,
        component: TutorialCarousel,
    },
    {
        path: '/loginmen',
        layout: NoLayout,
        component: LoginMenWrapped,
    },
    {
        path: '/registro',
        layout: NoLayout,
        component: RegistroWrapped,
    },
    {
        path: '/quien-lo-realiza',
        layout: NoLayout,
        component: QuienLoRealiza,
    },
    {
        path: '/consentimiento',
        layout: NoLayout,
        component: ConsentimientoInformado,
    },
    {
        path: '/asentimiento',
        layout: NoLayout,
        component: ConsentimientoInformado,
    },
    {
        path: '/inicio-paciente',
        layout: NoLayout,
        component: PantallaCarga,
    },
    {
        path: '/secciones',
        layout: NoLayout,
        component: SeccionesScreen,
    },
    {
        path: '/olvide-contrasena',
        layout: NoLayout,
        component: ForgotPassword,
    },
    {
        path: '/verificar-codigo',
        layout: NoLayout,
        component: ValidarCodigo,
    },
    {
        path: '/nueva-contrasena',
        layout: NoLayout,
        component: NuevoPassword,
    },
    {
        path: '/perfil-paciente',
        layout: NoLayout,
        component: PerfilPaciente,
    },
    {
        path: '/configuracion',
        layout: NoLayout,
        component: ConfiguracionScreen,
    },
    {
        path: '/reporte/:usuarioId',
        layout: NoLayout,
        component: ReportePaciente,
    },
    {
        path: '/envejecimiento/cuestionario/:seccionId',
        layout: NoLayout,
        component: CuestionarioScreen,
    },
    {
        path: '/envejecimiento/salud-mental',
        layout: NoLayout,
        component: CuestionarioSaludMentalScreen,
    },
    {
        path: '/preguntas/:cuestionarioId',
        layout: NoLayout,
        component: PreguntasScreen,
    },
    {
        path: '/marcadores-biologicos',
        layout: NoLayout,
        component: MarcadoresBiologicosScreen,
    },
    {
        path: '/CuestionarioEdadCelularPantalla',
        layout: NoLayout,
        component: EdadCelularScreen,
    },
    {
        path: '/ValorLongitudRelativa',
        layout: NoLayout,
        component: ValorLongitudRelativaScreen,
    },
    {
        path: '/Cuestionario_Glucosa',
        layout: NoLayout,
        component: GlucosaLabScreen,
    },
    {
        path: '/Deterioro_Cognitivo',
        layout: NoLayout,
        component: DeterioroCognitivoScreen,
    },
    {
        path: '/semaforo-deterioro-cognitivo',
        layout: NoLayout,
        component: SemaforoDeterioroScreen,
    },
    {
        path: '/envejecimiento-saludable',
        layout: NoLayout,
        component: EnvejecimientoSaludableScreen,
    },
    {
        path: '/secuenciavistas',
        layout: NoLayout,
        component: SecuenciaVistasScreen,
    },
    {
        path: '/ResultadoSecuenciasVistasScreen',
        layout: NoLayout,
        component: ResultadoSecuenciasScreen,
    },
    {
        path: '/genotipo',
        layout: NoLayout,
        component: GenotipoScreen,
    },
    {
        path: '/registro-fase1',
        layout: ({ children }) => <>{children}</>,
        component: FormularioDeRegistro,
    },
    {
        path: '/recuperar-password',
        layout: ({ children }) => <>{children}</>,
        component: RecuperarPassword,
    },
    {
        path: '/verificar-codigo',
        layout: ({ children }) => <>{children}</>,
        component: VerificarCodigo,
    },
    {
        path: '/establecer-password',
        layout: ({ children }) => <>{children}</>,
        component: EstablecerPassword,
    },
    {
        path: '/registro-empresa',
        layout: ({ children }) => <>{children}</>,
        component: RegistroEmpresa,
    },
    {
        path: '/login-fase1',
        layout: ({ children }) => <>{children}</>,
        component: FormLoginFase1,
    },
    {
        path: '/seleccion-usuario',
        layout: ({ children }) => <>{children}</>,
        component: SeleccionUsuario,
    },
    {
        path: '/personal',
        layout: ({ children }) => <>{children}</>,
        component: Personal,
    },
    {
        path: '/personal/:category',
        layout: ({ children }) => <>{children}</>,
        component: CategoryDetail,
    },

    {
        path: '/familiar',
        layout: ({ children }) => <>{children}</>,
        component: Familiar,
    },
    {
        path: '/familiar/:category',
        layout: ({ children }) => <>{children}</>,
        component: FamiliarCategoryDetail,
    },

    {
        path: '/cuidador',
        layout: ({ children }) => <>{children}</>,
        component: Cuidador,
    },
    {
        path: '/cuidador/:category',
        layout: ({ children }) => <>{children}</>,
        component: FamiliarCategoryDetail,
    },

    {
        path: '/personal/datos-generales',
        layout: ({ children }) => <>{children}</>,
        component: DatosGenerales,
    },
    {
        path: '/personal/reporte',
        layout: ({ children }) => <>{children}</>,
        component: Reporte,
    },
    {
        path: '/personal/reporte-nom035',
        layout: ({ children }) => <>{children}</>,
        component: ReporteNom035,
    },
    {
        path: '/personal/politica',
        layout: ({ children }) => <>{children}</>,
        component: Politica,
    },
    {
        path: '/personal/reporte-situacion',
        layout: ({ children }) => <>{children}</>,
        component: QuejasTrabajador,
    },
    // ---- Flujo de Registro ISEM ----
    {
        path: '/register/isem/policies',
        layout: BlankLayout,
        component: PoliticasPage,
    },
    {
        path: '/register/isem/consent',
        layout: BlankLayout,
        component: ConsentimientoPage,
    },
    {
        path: '/register/isem/purpose',
        layout: BlankLayout,
        component: PropositoPage,
    },
    {
        path: '/register/isem/form',
        layout: BlankLayout,
        component: RegistroPage,
    },
  {
    path: "/registro-sep",
    layout: BlankLayout,
    component: RegistroSep,
  },
  {
    path: "/login",
    layout: BlankLayout,
    component: LoginLayout,
  },
  {
    path: '/demo',
    layout: DemoLayout,
    component: DemoPage,
  },
];

export default routesLanding;
