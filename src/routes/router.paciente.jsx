import React from 'react';
import { InicioPaciente } from '../pages/paciente/InicioPaciente';
import { CuestionariosList } from '../pages/paciente/CuestionariosList';
import { PreguntasCuestionario } from '../pages/paciente/PreguntasCuestionario';
import { NoticiasPaciente } from '../pages/paciente/NoticiasPaciente';
import { ConfiguracionPaciente } from '../pages/paciente/ConfiguracionPaciente';
import { PerfilPaciente } from '../pages/paciente/PerfilPaciente';

const routesPaciente = [
    {
        path: '/paciente/inicio',
        layout: React.Fragment,
        component: InicioPaciente,
    },
    {
        path: '/paciente/cuestionarios',
        layout: React.Fragment,
        component: CuestionariosList,
    },
    {
        path: '/paciente/preguntas',
        layout: React.Fragment,
        component: PreguntasCuestionario,
    },
    {
        path: '/paciente/noticias',
        layout: React.Fragment,
        component: NoticiasPaciente,
    },
    {
        path: '/paciente/configuracion',
        layout: React.Fragment,
        component: ConfiguracionPaciente,
    },
    {
        path: '/paciente/perfil',
        layout: React.Fragment,
        component: PerfilPaciente,
    }
];

export default routesPaciente;
