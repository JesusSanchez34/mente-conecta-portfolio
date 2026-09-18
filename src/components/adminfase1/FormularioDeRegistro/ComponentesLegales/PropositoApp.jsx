import React from 'react';
import { useTranslation } from 'react-i18next';

export function PropositoApp() {
    const { i18n } = useTranslation();
    const isEn = i18n.language === 'en';

    if (isEn) {
        return (
            <div className="text-center-paragraphs">
                <p className="highlight-p">Mente Conecta is a mental health support APP.</p>
                <p>Many of us go through periods of anxiety or depression, and despite our best efforts, that discomfort returns. The fast pace of life often prevents us from visiting a doctor for a check-up.</p>
                <p>This app is a tool designed to assist you, guiding you towards a possible diagnosis of a psychiatric illness that may lie behind your discomfort.</p>
                <p>Inside you will find questionnaires that will allow us to guide you on what you might have, where to go to receive treatment, and how to feel better, with the help of specialists.</p>
            </div>
        );
    }

    return (
        <div className="text-center-paragraphs">
            <p className="highlight-p">Mente Conecta es una APP de ayuda en salud mental.</p>
            <p>Muchos de nosotros pasamos por periodos de ansiedad o depresión, y aunque nos esforzamos, volvemos a sentir ese malestar. El ritmo vertiginoso de la vida muchas veces nos impide asistir al médico para una revisión.</p>
            <p>Esta app es una herramienta diseñada para auxiliarte, orientándote hacia un posible diagnóstico de alguna enfermedad psiquiátrica que pudiera estar detrás de tus malestares.</p>
            <p>Dentro encontrarás cuestionarios que nos permitirán orientar sobre qué puedes tener y dónde acudir para recibir tratamiento y sentirte mejor, mediante especialistas.</p>
        </div>
    );
}