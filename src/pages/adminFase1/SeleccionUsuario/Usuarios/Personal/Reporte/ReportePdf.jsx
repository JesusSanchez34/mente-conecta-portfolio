import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 32, paddingBottom: 70, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  logo: { width: 50, height: 50 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
  text: { fontSize: 12, marginBottom: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 10 },
  table: { flexDirection: 'column', marginTop: 10, borderWidth: 1, borderColor: '#bdbdbd' },
  tableRow: { flexDirection: 'row' },
  tableHeader: { backgroundColor: '#e0e0e0', fontWeight: 'bold' },
  tableCell: { padding: 5, borderRightWidth: 1, borderRightColor: '#bdbdbd', borderBottomWidth: 1, borderBottomColor: '#bdbdbd', fontSize: 12 },
  col1: { width: '44%' },
  col2: { width: '12%' },
  col3: { width: '44%', borderRightWidth: 0 },
  notaRoja: { fontSize: 12, fontStyle: 'italic', color: '#b71c1c', marginTop: 20 },
  footer: { position: 'absolute', bottom: 30, left: 32, right: 32, textAlign: 'center', fontSize: 9 },
  referenciaRow: { flexDirection: 'row', marginBottom: 10 },
  referenciaNum: { fontSize: 11, fontWeight: 'bold', width: 20 },
  referenciaText: { fontSize: 11, flex: 1, lineHeight: 1.4 }
});

const referencias = [
  "García-Galicia A, Díaz-Díaz JF, Montiel-Jarquín ÁJ, González-López AM, Vázquez-Cruz E, Morales-Flores CF. Validity and consistency of an outpatient department user satisfaction rapid scale. Gac Med Mex. 2020;156(1):47-52.",
  "Arrieta J, Aguerrebere M, Raviola G, Flores H, Elliott P, Espinosa A, Reyes A, Ortiz-Panozo E, Rodriguez-Gutierrez EG, Mukherjee J, Palazuelos D, Franke MF. Validity and Utility of the Patient Health Questionnaire (PHQ)-2 and PHQ-9 for Screening and Diagnosis of Depression in Rural Chiapas, Mexico: A Cross-Sectional Study. J Clin Psychol. 2017 Sep;73(9):1076-1090.",
  "Higgins-Biddle JC, Babor TF. A review of the Alcohol Use Disorders Identification Test (AUDIT), AUDIT-C, and USAUDIT for screening in the United States: Past issues and future directions. Am J Drug Alcohol Abuse. 2018;44(6):578-586.",
  "David Sanchez-Teruel1 y Maria Auxiliadora Robles-Bello1Escala de Resiliencia 14 ítems (RS-14): Propiedades Psicométricas de la Versión en Español. Revista iberoamericana de diagnóstico y evaluación. 2015. No. 40, vol. 2, 003-113.",
  "Medina-Mora, M.E.; Genis-Mendoza, A.D.; Villatoro Velázquez, J.A.; Bustos-Gamiño, M.; Bautista, C.F.; Camarena, B.; Martínez-Magaña, J.J.; Nicolini, H. The Prevalence of Symptomatology and Risk Factors in Mental Health in Mexico: The 2016-17 ENCODAT Cohort. Int. J. Environ. Res. Public Health 2023, 20, 3109.",
  "Phillips KA, McElroy SL, Dwight MM, Eisen JL, Rasmussen SA. Delusionality and response to open-label fluvoxamine in body dysmorphic disorder. J Clin Psychiatry. 2001 Feb;62(2):87-91."
];

export const ReportePdfDocument = ({ reporte, t }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('pdf.title', 'Mente Conecta Pre-Diagnosticos')}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('pdf.personalData', 'Datos Personales.')}</Text>
        <View style={styles.divider} />
        <Text style={styles.text}>{t('pdf.patientName', 'Nombre del Paciente:')} {reporte?.usuario}</Text>
        <Text style={styles.text}>{t('pdf.email', 'Correo:')} {reporte?.correo}</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.col1]}>{t('pdf.questionnaire', 'Cuestionario')}</Text>
            <Text style={[styles.tableCell, styles.col2]}>{t('pdf.score', 'Nota')}</Text>
            <Text style={[styles.tableCell, styles.col3]}>{t('pdf.interpretation', 'Interpretación')}</Text>
          </View>
          {reporte?.resultados?.map((res, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, styles.col1]}>{t(`pdf.results.${res.cuestionario}`, res.cuestionario || '')}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{res.nota || ''}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{t(`pdf.results.${res.interpretacion}`, res.interpretacion || '')}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.notaRoja}>
          {reporte?.nota || t('pdf.importantNote', 'Nota Importante: Esta información corresponde únicamente a un prediagnóstico. Te recomendamos consultar a un especialista para una evaluación completa y precisa.')}
        </Text>

        <View style={styles.footer} fixed>
          <View style={styles.divider} />
          <Text>mente-conecta@loopconexion.com | www.mente-conecta.com | (55) 1234-5678</Text>
          <Text style={{ fontStyle: 'italic', marginTop: 4 }}>
            {t('pdf.confidential', 'Este documento es confidencial y no sustituye la evaluación de un profesional.')}
          </Text>
          <Text style={{ color: '#616161', marginTop: 4 }}>
            {t('pdf.emissionDate', 'Fecha de Emisión:')} {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>{t('pdf.references', 'Referencias')}</Text>
        <View style={styles.divider} />
        {referencias.map((ref, index) => (
          <View style={styles.referenciaRow} key={index}>
            <Text style={styles.referenciaNum}>{index + 1}. </Text>
            <Text style={styles.referenciaText}>{ref}</Text>
          </View>
        ))}
        
        <View style={styles.footer} fixed>
          <View style={styles.divider} />
          <Text>mente-conecta@loopconexion.com | www.mente-conecta.com | (55) 1234-5678</Text>
          <Text style={{ fontStyle: 'italic', marginTop: 4 }}>
            {t('pdf.confidential', 'Este documento es confidencial y no sustituye la evaluación de un profesional.')}
          </Text>
          <Text style={{ color: '#616161', marginTop: 4 }}>
            {t('pdf.emissionDate', 'Fecha de Emisión:')} {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
