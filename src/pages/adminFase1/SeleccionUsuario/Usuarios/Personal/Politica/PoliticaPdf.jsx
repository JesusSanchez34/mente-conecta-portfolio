import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, paddingBottom: 80, fontFamily: 'Helvetica' },
  header: { marginBottom: 30, borderBottomWidth: 2, borderBottomColor: '#1a569d', paddingBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a569d' },
  subtitle: { fontSize: 11, color: '#64748b', marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#2b2d42', marginBottom: 12, marginTop: 20 },
  introText: { fontSize: 11, color: '#334155', marginBottom: 15, lineHeight: 1.5 },
  listItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  listNumber: { width: 20, fontSize: 11, fontWeight: 'bold', color: '#1a569d' },
  listText: { flex: 1, fontSize: 11, color: '#334155', lineHeight: 1.5 },
  principioItem: { marginBottom: 8, fontSize: 11, color: '#334155', lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 9, color: '#8d99ae', borderTopWidth: 1, borderTopColor: '#e9ecef', paddingTop: 10 },
});

export const PoliticaPdfDocument = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Política de Prevención de Riesgos Psicosociales</Text>
          <Text style={styles.subtitle}>Guía de Referencia IV - NOM-035-STPS-2018</Text>
        </View>

        <Text style={styles.sectionTitle}>Documento oficial de la política</Text>
        <Text style={styles.introText}>
          En este centro de trabajo, en relación con la prevención de los factores de riesgo psicosocial, la prevención de la violencia laboral y la promoción de un entorno organizacional favorable, se asumen los siguientes compromisos:
        </Text>

        {[
          "Es obligación de supervisores, gerentes y directores aplicar esta política y predicar con el ejemplo.",
          "Los actos de violencia laboral no son tolerados, así como ningún incidente que propicie factores de riesgo psicosocial.",
          "Se aplican medidas encaminadas a la prevención de los factores de riesgo psicosocial y la violencia laboral, para prevenir sus consecuencias adversas.",
          "Se cuenta con un procedimiento de atención justo, que no permite represalias y evita reclamaciones abusivas, y que garantiza la confidencialidad de los casos.",
          "Se realizan acciones de sensibilización, programas de información y capacitación.",
          "Se divulgan de forma eficaz las políticas de prevención y las medidas adoptadas.",
          "Todos los trabajadores participan para establecer y poner en práctica esta política en el lugar de trabajo.",
          "Se respeta el ejercicio de los derechos del personal sin distinción de raza, sexo, religión, etnia, edad u otra condición.",
          "Se crean espacios de participación y consulta, teniendo en cuenta las ideas y aportaciones de los trabajadores."
        ].map((texto, i) => (
          <View style={styles.listItem} key={i}>
            <Text style={styles.listNumber}>{i + 1}.</Text>
            <Text style={styles.listText}>{texto}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Principios de la política (GR-IV)</Text>
        
        {[
          { t: "Entorno organizacional favorable:", d: "reuniones con trabajadores, instalaciones limpias y seguras, trato digno y atención de conflictos." },
          { t: "Sentido de pertenencia:", d: "todos los trabajadores son importantes para el funcionamiento del centro de trabajo." },
          { t: "Capacitación:", d: "formación conforme a la Ley Federal del Trabajo acorde a las actividades de cada puesto." },
          { t: "Definición de responsabilidades:", d: "difusión de manuales de organización y descripciones de puesto." },
          { t: "Participación y comunicación:", d: "tableros y canales de comunicación bidireccional entre trabajadores y empresa." },
          { t: "Distribución de cargas de trabajo:", d: "jornadas y cargas de trabajo conforme a la LFT." },
          { t: "Reconocimiento del desempeño:", d: "evaluación anual de desempeño con reconocimientos." },
          { t: "Prevención de violencia laboral:", d: "vigilancia, atención oportuna y confidencialidad en quejas." }
        ].map((principio, i) => (
          <Text style={styles.principioItem} key={i}>
            <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>{i + 1}. {principio.t} </Text>
            {principio.d}
          </Text>
        ))}

        <View style={styles.footer} fixed>
          <Text>Mente Conecta Integra | Política NOM-035</Text>
          <Text style={{ marginTop: 4 }}>Documento vigente emitido el {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};
