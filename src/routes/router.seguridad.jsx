import { SeguridadLayout } from '../layouts';
import { QuienLoRealiza } from '../pages/seguridadPublica/quienLoRealiza';
import { Bienvenida } from '../pages/seguridadPublica/Bienvenida';
import { FormLoginSeguridad } from '../components/login/formLogin/FormLoginSeguridad';
import { NoLayout } from '../layouts/noLayout/NoLayout';
import { useNavigate } from 'react-router-dom';
import {
    EvaluacionSocio,
    EvaluacionSocioPreguntas,
    EvaluacionMental,
    EvaluacionFisica,
    EvaluacionEstadoGeneral,
    EvaluacionCalidadSueno,
    EvaluacionActividadFisica,
    EvaluacionSaludGlobal,
    EvaluacionDeterminantes,
    EvaluacionDeterminantesSociales,
    EvaluacionNom035,
    EvaluacionAcontecimientosTraumaticos,
} from '../pages/seguridadPublica/EvaluacionInicio';
import {
    EvaluacionSintomatologia,
    EvaluacionConductaAlimentaria,
    EvaluacionFuncionamientoGlobal,
    EvaluacionEventosTraumaticos,
    EvaluacionResiliencia,
    EvaluacionTabaco,
    EvaluacionAlcohol,
} from '../pages/seguridadPublica/EvaluacionInicio/EvaluacionesMentales';

const LoginSeguridadWrapped = () => {
    const navigate = useNavigate();
    return <FormLoginSeguridad typeLogin={7} onBack={() => navigate('/login')} />;
};

const routerSeguridad = [
    {
        path: '/loginseguridad',
        layout: NoLayout,
        component: LoginSeguridadWrapped,
    },
    {
        path: '/seguridad/inicio',
        layout: SeguridadLayout,
        component: QuienLoRealiza,
    },
    //Bienvenida
    {
        path: '/seguridad/Bienvenida',
        layout: SeguridadLayout,
        component: Bienvenida,
    },
    //Evaluacion Socioeconomica
    {
        path: '/seguridad/evaluacion-socio',
        layout: SeguridadLayout,
        component: EvaluacionSocio,
    },
    {
        path: '/seguridad/evaluacion-socio/preguntas',
        layout: SeguridadLayout,
        component: EvaluacionSocioPreguntas,
    },
    //Evaluacion Mental
    {
        path: '/seguridad/evaluacion-mental',
        layout: SeguridadLayout,
        component: EvaluacionMental,
    },
    {
        path: '/seguridad/evaluacion-mental/sintomatologia',
        layout: SeguridadLayout,
        component: EvaluacionSintomatologia,
    },
    {
        path: '/seguridad/evaluacion-mental/conducta-alimentaria',
        layout: SeguridadLayout,
        component: EvaluacionConductaAlimentaria,
    },
    {
        path: '/seguridad/evaluacion-mental/funcionamiento-global',
        layout: SeguridadLayout,
        component: EvaluacionFuncionamientoGlobal,
    },
    {
        path: '/seguridad/evaluacion-mental/eventos-traumaticos',
        layout: SeguridadLayout,
        component: EvaluacionEventosTraumaticos,
    },
    {
        path: '/seguridad/evaluacion-mental/resiliencia',
        layout: SeguridadLayout,
        component: EvaluacionResiliencia,
    },
    {
        path: '/seguridad/evaluacion-mental/tabaco',
        layout: SeguridadLayout,
        component: EvaluacionTabaco,
    },
    {
        path: '/seguridad/evaluacion-mental/alcohol',
        layout: SeguridadLayout,
        component: EvaluacionAlcohol,
    },

    // evaluacion fisica
    {
        path: '/seguridad/evaluacion-fisica',
        layout: SeguridadLayout,
        component: EvaluacionFisica,
    },
    {
        path: '/seguridad/evaluacion-fisica/estado-general',
        layout: SeguridadLayout,
        component: EvaluacionEstadoGeneral,
    },
    {
        path: '/seguridad/evaluacion-fisica/calidad-sueno',
        layout: SeguridadLayout,
        component: EvaluacionCalidadSueno,
    },
    {
        path: '/seguridad/evaluacion-fisica/actividad-fisica',
        layout: SeguridadLayout,
        component: EvaluacionActividadFisica,
    },
    {
        path: '/seguridad/evaluacion-fisica/salud-global',
        layout: SeguridadLayout,
        component: EvaluacionSaludGlobal,
    },
    // evaluacion determinantes
    {
        path: '/seguridad/evaluacion-determinantes',
        layout: SeguridadLayout,
        component: EvaluacionDeterminantes,
    },
    {
        path: '/seguridad/evaluacion-determinantes/preguntas',
        layout: SeguridadLayout,
        component: EvaluacionDeterminantesSociales,
    },
    // evaluacion nom035
    {
        path: '/seguridad/evaluacion-nom035',
        layout: SeguridadLayout,
        component: EvaluacionNom035,
    },
    {
        path: '/seguridad/evaluacion-nom035/acontecimientos-traumaticos',
        layout: SeguridadLayout,
        component: EvaluacionAcontecimientosTraumaticos,
    },
];

export default routerSeguridad;
