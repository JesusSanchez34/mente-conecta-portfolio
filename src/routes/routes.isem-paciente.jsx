/**
 * routes.isem-paciente.jsx
 * ============================================================
 * Rutas del flujo del paciente ISEM (cuestionarios).
 *
 * Rutas incluidas:
 *   /isem/bienvenida                  → Pantalla de bienvenida con 3 secciones
 *   /isem/cuestionarios/:seccion      → Lista de cuestionarios por sección
 *   /isem/cuestionario/:id            → Motor de cuestionario individual
 *   /isem/resultados/:id              → Resultados de un cuestionario individual
 *   /isem/seguimiento                 → "Sala de espera" con cuestionarios derivados
 *   /isem/resultados-consolidados     → Pre-diagnósticos consolidados de seguimiento
 *
 * Layout: ISEMPacienteLayout (sidebar + guards de auth)
 * ============================================================
 */

import { ISEMPacienteLayout } from '../layouts/isemPacienteLayout';
import { BienvenidaISEMPage } from '../pages/isemPaciente/bienvenida';
import { CuestionariosListPage } from '../pages/isemPaciente/cuestionariosList';
import { CuestionarioPage } from '../pages/isem/cuestionarios';
import { ResultadosPage } from '../pages/isemPaciente/resultados';
import { CuestionariosSeguimientoPage } from '../pages/isemPaciente/cuestionariosSeguimiento';
import { ResultadosConsolidadosPage } from '../pages/isemPaciente/resultadosConsolidados';

const routesISEMPaciente = [
  {
    path: '/isem/bienvenida',
    layout: ISEMPacienteLayout,
    component: BienvenidaISEMPage,
  },
  {
    path: '/isem/cuestionarios/:seccionId',
    layout: ISEMPacienteLayout,
    component: CuestionariosListPage,
  },
  {
    path: '/isem/cuestionario/:id',
    layout: ISEMPacienteLayout,
    component: CuestionarioPage,
  },
  {
    path: '/isem/resultados/:id',
    layout: ISEMPacienteLayout,
    component: ResultadosPage,
  },
  {
    path: '/isem/seguimiento',
    layout: ISEMPacienteLayout,
    component: CuestionariosSeguimientoPage,
  },
  {
    path: '/isem/resultados-consolidados',
    layout: ISEMPacienteLayout,
    component: ResultadosConsolidadosPage,
  },
];

export default routesISEMPaciente;

