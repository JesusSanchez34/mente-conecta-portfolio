/**
 * cuestionarios.js
 * ============================================================
 * Catálogo estático de secciones y cuestionarios ISEM.
 *
 * Cada sección tiene un slug (para la URL), título, y lista
 * de cuestionarios con su id y nombre.
 * ============================================================
 */

export const SECCIONES = [
  {
    slug: 'sociodemograficos',
    seccionId: 1,
    titulo: 'Cuestionarios Sociodemográficos',
    tituloCorto: 'SOCIODEMOGRÁFICOS',
    descripcion: 'Datos generales del paciente',
    color: '#8D6E63',
    cuestionarios: [
      { id: 'datos-sociodemograficos', nombre: 'DATOS SOCIODEMOGRÁFICOS' },
    ],
  },
  {
    slug: 'salud-mental',
    seccionId: 2,
    titulo: 'Cuestionarios Salud Mental',
    tituloCorto: 'SALUD MENTAL',
    descripcion: 'Evaluaciones de salud mental',
    color: '#7B8D8E',
    cuestionarios: [
      { id: 'sintomatologia-psiquiatrica', nombre: 'SINTOMATOLOGÍA PSIQUIÁTRICA' },
      { id: 'funcionamiento-global', nombre: 'FUNCIONAMIENTO GLOBAL' },
      { id: 'eventos-traumaticos', nombre: 'EVENTOS TRAUMÁTICOS' },
      { id: 'escala-resiliencia', nombre: 'ESCALA DE RESILIENCIA' },
      { id: 'evaluacion-tabaco', nombre: 'EVALUACIÓN DE TABACO' },
      { id: 'evaluacion-alcohol', nombre: 'EVALUACIÓN DE ALCOHOL' },
    ],
  },
  {
    slug: 'determinantes-sociales',
    seccionId: 3,
    titulo: 'Cuestionarios Determinantes Sociales',
    tituloCorto: 'DETERMINANTES SOCIALES',
    descripcion: 'Factores sociales del entorno',
    color: '#A1887F',
    cuestionarios: [
      { id: 'datos-determinantes-sociales', nombre: 'DATOS DETERMINANTES SOCIALES' },
    ],
  },
];

/**
 * Busca una sección por su slug.
 * @param {string} slug
 * @returns {Object|undefined}
 */
export function getSeccionBySlug(slug) {
  return SECCIONES.find((s) => s.slug === slug);
}
