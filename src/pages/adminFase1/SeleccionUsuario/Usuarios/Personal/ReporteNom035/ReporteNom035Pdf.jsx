import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, paddingBottom: 80, fontFamily: 'Helvetica' },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
    paddingBottom: 10
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e3a8a' },
  subtitle: { fontSize: 10, color: '#64748b' },

  personalDataBox: { padding: 12, backgroundColor: '#f8fafc', borderRadius: 4, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15 },
  dataRow: { flexDirection: 'row', marginBottom: 4 },
  textLabel: { fontSize: 9, fontWeight: 'bold', color: '#475569', width: '35%' },
  textValue: { fontSize: 9, color: '#1e293b', width: '65%' },

  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginTop: 20, color: '#ffffff', backgroundColor: '#1e3a8a', padding: 5, textAlign: 'center' },
  summaryTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#1e3a8a', borderBottomWidth: 1, borderBottomColor: '#1e3a8a', paddingBottom: 3 },

  table: { flexDirection: 'column', marginTop: 10, marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center', minHeight: 20 },
  tableHeader: { backgroundColor: '#f1f5f9', borderBottomWidth: 2, borderBottomColor: '#cbd5e1' },
  tableCell: { padding: 5, fontSize: 8, color: '#334155' },
  tableHeaderCell: { padding: 5, fontSize: 8, fontWeight: 'bold', color: '#1e293b' },

  col1: { width: '8%', textAlign: 'center' }, // #
  col2: { width: '64%' }, // Pregunta
  col3: { width: '15%', textAlign: 'center' }, // Respuesta
  col4: { width: '13%', textAlign: 'center' }, // Puntos

  statsTable: { width: '100%', marginBottom: 4 },
  statsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 4, alignItems: 'center' },
  statsHeader: { backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#94a3b8' },
  statsLabel: { fontSize: 9, color: '#334155', width: '55%' },
  statsValue: { fontSize: 9, fontWeight: 'bold', color: '#1e3a8a', width: '15%', textAlign: 'right' },
  statsNivel: { fontSize: 8, fontWeight: 'bold', color: '#0369a1', width: '30%', textAlign: 'right' },
  statsAccion: { fontSize: 7, color: '#64748b', marginBottom: 4, paddingLeft: 2 },

  categoriaLabel: { fontSize: 10, fontWeight: 'bold', color: '#1e293b' },
  dominioLabel: { fontSize: 9, color: '#334155', paddingLeft: 10 },
  dimensionLabel: { fontSize: 8, color: '#64748b', paddingLeft: 20 },
  dimensionValue: { fontSize: 8, color: '#64748b', width: '15%', textAlign: 'right' },

  seccionTitleG1: { fontSize: 11, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#5b4a9a', padding: 4, marginTop: 12, marginBottom: 6 },
  resultadoSeccionBox: { padding: 6, backgroundColor: '#f8fafc', borderRadius: 3, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 4, marginTop: 2 },
  resultadoSeccionText: { fontSize: 9, fontWeight: 'bold', color: '#1e3a8a' },
  diagnosticoFinalBox: { padding: 12, backgroundColor: '#f0f9ff', borderRadius: 4, borderWidth: 1, borderColor: '#bae6fd', marginTop: 15 },
  diagnosticoFinalTitle: { fontSize: 11, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 4 },
  diagnosticoFinalText: { fontSize: 10, fontWeight: 'bold', color: '#0369a1' },

  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#94a3b8', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 8 },
  scoreBox: { padding: 10, backgroundColor: '#f0f9ff', borderRadius: 4, borderWidth: 1, borderColor: '#bae6fd', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  scoreTextPrimary: { fontSize: 12, fontWeight: 'bold', color: '#0369a1' },
  scoreTextSecondary: { fontSize: 11, color: '#0ea5e9' },

  sectionInstructionBox: { backgroundColor: '#1e40af', padding: 8, borderRadius: 4, marginTop: 8, marginBottom: 4 },
  sectionInstructionText: { fontSize: 8, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.4 },
  filterQuestionBox: { backgroundColor: '#fef3c7', borderWidth: 1, borderColor: '#f59e0b', borderRadius: 4, padding: 8, marginTop: 4, marginBottom: 4 },
  filterQuestionText: { fontSize: 9, fontWeight: 'bold', color: '#1e293b', marginBottom: 3 },
  filterAnswerText: { fontSize: 9, fontWeight: 'bold', color: '#92400e' },
});

const GUIA2_INSTRUCCIONES = {
  1: "Para responder las preguntas siguientes considere las condiciones de su centro de trabajo, así como la cantidad y ritmo de trabajo.",
  10: "Las preguntas siguientes están relacionadas con las actividades que realiza en su trabajo y las responsabilidades que tiene.",
  14: "Las preguntas siguientes están relacionadas con el tiempo destinado a su trabajo y sus responsabilidades familiares.",
  18: "Las preguntas siguientes están relacionadas con las decisiones que puede tomar en su trabajo.",
  23: "Las preguntas siguientes están relacionadas con la capacitación e información que recibe sobre su trabajo.",
  28: "Las preguntas siguientes se refieren a las relaciones con sus compañeros de trabajo y su jefe.",
};

const GUIA3_INSTRUCCIONES = {
  1: "Para responder las preguntas siguientes considere las condiciones ambientales de su centro de trabajo.",
  6: "Para responder a las preguntas siguientes piense en la cantidad y ritmo de trabajo que tiene.",
  9: "Las preguntas siguientes están relacionadas con el esfuerzo mental que le exige su trabajo.",
  13: "Las preguntas siguientes están relacionadas con las actividades que realiza en su trabajo y las responsabilidades que tiene.",
  17: "Las preguntas siguientes están relacionadas con su jornada de trabajo.",
  23: "Las preguntas siguientes están relacionadas con las decisiones que puede tomar en su trabajo.",
  29: "Las preguntas siguientes están relacionadas con cualquier tipo de cambio que ocurra en su trabajo (considere los últimos cambios realizados).",
  31: "Las preguntas siguientes están relacionadas con la capacitación e información que se le proporciona sobre su trabajo.",
  37: "Las preguntas siguientes están relacionadas con el o los jefes con quien tiene contacto.",
  42: "Las preguntas siguientes se refieren a las relaciones con sus compañeros.",
  47: "Las preguntas siguientes están relacionadas con la información que recibe sobre su rendimiento en el trabajo, el reconocimiento, el sentido de pertenencia y la estabilidad que le ofrece su trabajo.",
  57: "Las preguntas siguientes están relacionadas con actos de violencia laboral (malos tratos, acoso, hostigamiento, acoso psicológico).",
};

const getSeccionInstruccion = (guiaId, qNum) => {
  if (qNum == null) return null;
  if (guiaId === 46) return GUIA2_INSTRUCCIONES[qNum] || null;
  if (guiaId === 47) return GUIA3_INSTRUCCIONES[qNum] || null;
  return null;
};

const getFiltroExplicacion = (texto) => {
  const t = (texto || '').toLowerCase();
  if (t.includes('brindar servicio a clientes')) {
    return "Si su respuesta fue \"SÍ\", responda las preguntas siguientes. Si su respuesta fue \"NO\", pase a las preguntas de la sección siguiente.";
  }
  if (t.includes('jefe de otros trabajadores')) {
    return "Si su respuesta fue \"SÍ\", responda las preguntas siguientes. Si su respuesta fue \"NO\", ha concluido esta sección del cuestionario.";
  }
  return null;
};

// La fuente Helvetica del PDF no incluye glifos como ⚠ ✔ ► — se quitan para
// no mostrar caracteres rotos, el texto y color ya transmiten el énfasis.
const limpiarSimbolos = (texto) => (texto || '').replace(/[⚠✔]\s*/g, '').trim();

const CalificacionCategorias = ({ categorias }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.summaryTitle}>Calificación por Categoría, Dominio y Dimensión</Text>
    <View style={styles.statsTable}>
      {categorias.map((cat, ci) => (
        <View key={ci}>
          <View style={styles.statsRow}>
            <Text style={[styles.categoriaLabel, { width: '55%' }]}>{cat.nombre}</Text>
            <Text style={styles.statsValue}>{cat.puntaje}</Text>
            <Text style={styles.statsNivel}>{cat.nivel}</Text>
          </View>
          {cat.accion && <Text style={styles.statsAccion}>{cat.accion}</Text>}

          {cat.dominios.map((dom, di) => (
            <View key={di}>
              <View style={styles.statsRow}>
                <Text style={[styles.dominioLabel, { width: '55%' }]}>- {dom.nombre}</Text>
                <Text style={styles.statsValue}>{dom.puntaje}</Text>
                <Text style={styles.statsNivel}>{dom.nivel}</Text>
              </View>
              {dom.accion && <Text style={styles.statsAccion}>{dom.accion}</Text>}

              {dom.dimensiones.map((dim, dmi) => (
                <View key={dmi} style={styles.statsRow}>
                  <Text style={[styles.dimensionLabel, { width: '65%' }]}>{dim.nombre}</Text>
                  <Text style={styles.dimensionValue}>{dim.puntaje}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  </View>
);

const TablaRespuestasConPuntos = ({ respuestas, guiaId }) => (
  <>
    <Text style={[styles.summaryTitle, { marginTop: 10 }]}>Detalle de Respuestas</Text>
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.tableHeaderCell, styles.col1]}>#</Text>
        <Text style={[styles.tableHeaderCell, styles.col2]}>Pregunta</Text>
        <Text style={[styles.tableHeaderCell, styles.col3]}>Respuesta</Text>
        <Text style={[styles.tableHeaderCell, styles.col4]}>Puntos</Text>
      </View>

      {respuestas?.map((res, i) => {
        const instruccion = getSeccionInstruccion(guiaId, res.numero);

        return (
          <React.Fragment key={i}>
            {instruccion && (
              <View style={styles.sectionInstructionBox} wrap={false}>
                <Text style={styles.sectionInstructionText}>{instruccion}</Text>
              </View>
            )}

            {res.esFiltro ? (
              <View style={styles.filterQuestionBox} wrap={false}>
                <Text style={styles.filterQuestionText}>{res.texto_pregunta}</Text>
                <Text style={styles.filterAnswerText}>Respuesta: {res.respuesta_texto}</Text>
                {getFiltroExplicacion(res.texto_pregunta) && (
                  <Text style={[styles.filterAnswerText, { fontWeight: 'normal', color: '#78350f', marginTop: 3 }]}>
                    {getFiltroExplicacion(res.texto_pregunta)}
                  </Text>
                )}
              </View>
            ) : (
              <View style={[styles.tableRow, { backgroundColor: res.noAplica ? '#f1f5f9' : (i % 2 === 0 ? '#ffffff' : '#f8fafc') }]} wrap={false}>
                <Text style={[styles.tableCell, styles.col1]}>{res.numero}</Text>
                <Text style={[styles.tableCell, styles.col2, res.noAplica && { color: '#94a3b8', fontStyle: 'italic' }]}>{res.texto_pregunta}</Text>
                <Text style={[styles.tableCell, styles.col3, res.noAplica && { color: '#94a3b8', fontStyle: 'italic' }]}>{res.respuesta_texto}</Text>
                <Text style={[styles.tableCell, styles.col4, res.noAplica && { color: '#94a3b8', fontStyle: 'italic' }]}>{res.valor}</Text>
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  </>
);

const SeccionesGuiaI = ({ secciones, resultadoGlobal }) => (
  <>
    {secciones?.map((seccion, si) => (
      <View key={si}>
        <Text style={styles.seccionTitleG1}>SECCIÓN {seccion.numero} — {seccion.nombre}</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>#</Text>
            <Text style={[styles.tableHeaderCell, { width: '77%' }]}>Pregunta</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Respuesta</Text>
          </View>
          {seccion.preguntas.map((p, pi) => (
            <View key={pi} style={[styles.tableRow, { backgroundColor: pi % 2 === 0 ? '#ffffff' : '#f8fafc' }]} wrap={false}>
              <Text style={[styles.tableCell, styles.col1]}>{p.numero}</Text>
              <Text style={[styles.tableCell, { width: '77%' }]}>{p.texto_pregunta}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{p.respuesta_texto}</Text>
            </View>
          ))}
        </View>
        <View style={styles.resultadoSeccionBox}>
          <Text style={styles.resultadoSeccionText}>Resultado Sección {seccion.numero}: {limpiarSimbolos(seccion.resultado)}</Text>
        </View>
      </View>
    ))}

    {resultadoGlobal && (
      <View style={styles.diagnosticoFinalBox}>
        <Text style={styles.diagnosticoFinalTitle}>DIAGNÓSTICO FINAL</Text>
        <Text style={styles.diagnosticoFinalText}>Resultado global del cuestionario: {limpiarSimbolos(resultadoGlobal)}</Text>
      </View>
    )}
  </>
);

export const ReporteNom035PdfDocument = ({ reporte, t }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>RESULTADOS NOM-035-STPS-2018</Text>
          <Text style={styles.subtitle}>Mente Conecta Integra</Text>
        </View>

        <View style={styles.personalDataBox}>
          <View style={styles.dataRow}>
            <Text style={styles.textLabel}>TRABAJADOR:</Text>
            <Text style={styles.textValue}>{reporte?.usuario || 'N/A'}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.textLabel}>CORREO ELECTRÓNICO:</Text>
            <Text style={styles.textValue}>{reporte?.correo || 'N/A'}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.textLabel}>TAMAÑO DEL CENTRO DE TRABAJO:</Text>
            <Text style={styles.textValue}>{reporte?.numeroEmpleados || 'N/A'}</Text>
          </View>
        </View>

        {reporte?.guias?.map((guia, index) => (
          <View key={index} break={index > 0}>
            <Text style={styles.sectionTitle}>{guia.nombre.toUpperCase()}</Text>

            {guia.id === 45 ? (
              <SeccionesGuiaI secciones={guia.secciones} resultadoGlobal={guia.resultadoGlobal} />
            ) : (
              <>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreTextPrimary}>Nivel de Riesgo: {guia.nivelRiesgo}</Text>
                  <Text style={styles.scoreTextSecondary}>Calificación Final: {guia.puntajeTotal}</Text>
                </View>

                {guia.categorias && guia.categorias.length > 0 && (
                  <CalificacionCategorias categorias={guia.categorias} />
                )}

                <TablaRespuestasConPuntos respuestas={guia.respuestas} guiaId={guia.id} />
              </>
            )}
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text>Reporte generado conforme a la NORMA Oficial Mexicana NOM-035-STPS-2018</Text>
          <Text style={{ marginTop: 2 }}>mente-conecta@loopconexion.com | www.mente-conecta.com</Text>
          <Text style={{ marginTop: 2 }}>Fecha de Emisión: {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};
