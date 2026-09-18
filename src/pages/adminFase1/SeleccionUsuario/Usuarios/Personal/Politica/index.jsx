import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PoliticaPdfDocument } from './PoliticaPdf';
import './Politica.scss';

export function Politica() {
    const navigate = useNavigate();

    return (
        <div className="politica-container">
            <div className="politica-header-top">
                <button
                    className="back-btn"
                    onClick={() => navigate('/personal/nom-035')}
                >
                    ←
                </button>
                <div className="title-wrapper">
                    <h2>Política de Prevención de Riesgos Psicosociales</h2>
                    <span className="subtitle">Guía de Referencia IV - NOM-035-STPS-2018</span>
                </div>
            </div>

            <div className="politica-content">
                <div className="politica-box">
                    <div className="box-header">
                        <h3>Documento oficial de la política</h3>
                        <div className="header-actions">
                            <span className="badge-vigente">Vigente - Enero 2026</span>
                            <PDFDownloadLink 
                                document={<PoliticaPdfDocument />} 
                                fileName="Politica_Prevencion_Riesgos_NOM035.pdf"
                                className="download-btn"
                            >
                                {({ blob, url, loading, error }) => (
                                    loading ? 'Generando PDF...' : '📄 Descargar PDF'
                                )}
                            </PDFDownloadLink>
                        </div>
                    </div>

                    <div className="box-body">
                        <p className="intro-text">
                            En este centro de trabajo, en relación con la prevención de los factores de riesgo psicosocial, la prevención de la violencia laboral y la promoción de un entorno organizacional favorable, se asumen los siguientes compromisos:
                        </p>

                        <div className="compromisos-list">
                            <div className="list-item">
                                <span className="number-circle">1</span>
                                <p>Es obligación de supervisores, gerentes y directores aplicar esta política y predicar con el ejemplo.</p>
                            </div>
                            <div className="list-item">
                                <span className="number-circle">2</span>
                                <p>Los actos de violencia laboral no son tolerados, así como ningún incidente que propicie factores de riesgo psicosocial.</p>
                            </div>
                            <div className="list-item">
                                <span className="number-circle">3</span>
                                <p>Se aplican medidas encaminadas a la prevención de los factores de riesgo psicosocial y la violencia laboral, para prevenir sus consecuencias adversas.</p>
                            </div>
                            <div className="list-item">
                                <span className="number-circle">4</span>
                                <p>Se cuenta con un procedimiento de atención justo, que no permite represalias y evita reclamaciones abusivas, y que garantiza la confidencialidad de los casos.</p>
                            </div>
                            <div className="list-item">
                                <span className="number-circle">5</span>
                                <p>Se realizan acciones de sensibilización, programas de información y capacitación.</p>
                            </div>
                            <div className="list-item">
                                <span className="number-circle">6</span>
                                <p>Se divulgan de forma eficaz las políticas de prevención y las medidas adoptadas.</p>
                            </div>
                            <div className="list-item">
                                <span className="number-circle">7</span>
                                <p>Todos los trabajadores participan para establecer y poner en práctica esta política en el lugar de trabajo.</p>
                            </div>
                            <div className="list-item">
                                <span className="number-circle">8</span>
                                <p>Se respeta el ejercicio de los derechos del personal sin distinción de raza, sexo, religión, etnia, edad u otra condición.</p>
                            </div>
                            <div className="list-item">
                                <span className="number-circle">9</span>
                                <p>Se crean espacios de participación y consulta, teniendo en cuenta las ideas y aportaciones de los trabajadores.</p>
                            </div>
                        </div>

                        <h4 className="principios-title">Principios de la política (GR-IV)</h4>
                        <ol className="principios-list">
                            <li><strong>Entorno organizacional favorable:</strong> reuniones con trabajadores, instalaciones limpias y seguras, trato digno y atención de conflictos.</li>
                            <li><strong>Sentido de pertenencia:</strong> todos los trabajadores son importantes para el funcionamiento del centro de trabajo.</li>
                            <li><strong>Capacitación:</strong> formación conforme a la Ley Federal del Trabajo acorde a las actividades de cada puesto.</li>
                            <li><strong>Definición de responsabilidades:</strong> difusión de manuales de organización y descripciones de puesto.</li>
                            <li><strong>Participación y comunicación:</strong> tableros y canales de comunicación bidireccional entre trabajadores y empresa.</li>
                            <li><strong>Distribución de cargas de trabajo:</strong> jornadas y cargas de trabajo conforme a la LFT.</li>
                            <li><strong>Reconocimiento del desempeño:</strong> evaluación anual de desempeño con reconocimientos.</li>
                            <li><strong>Prevención de violencia laboral:</strong> vigilancia, atención oportuna y confidencialidad en quejas.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
