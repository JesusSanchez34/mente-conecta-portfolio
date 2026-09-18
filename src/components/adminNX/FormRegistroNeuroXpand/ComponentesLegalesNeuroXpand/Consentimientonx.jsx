import React from 'react';
import { useTranslation } from 'react-i18next';

export function Consentimientonx() {
    const { i18n } = useTranslation();
    const isEn = i18n.language === 'en';

    if (isEn) {
        return (
            <>
                <h3>Introduction</h3>
                <p>Mental health should be assessed frequently, just like physical health. Therefore, this comprehensive mental health and well-being assessment is presented, establishing a precedent to detect mental health issues and stratify them by risk levels of suicidal behaviors and risk eating behaviors, combining biological data and validated measurements.</p>

                <h3>Objective</h3>
                <p>The objective is to complete questionnaires that will indicate your current mental health status and allow us to follow up if required.</p>

                <h3>Purpose</h3>
                <p>Implement a national early detection and care system to assess general mental health and offer you different interventions to assist you in case we detect any emotional issue, or, if none exist, offer you prevention options.</p>

                <h3>Procedures</h3>
                <p>You will be presented with questions about your mental health.</p>

                <h3>Benefits</h3>
                <p>You will be able to know if we detect any issue with anxiety, depression, risky use of alcohol or psychoactive substances, and you will be notified via email in order to provide you with an individualized therapeutic proposal that you can accept voluntarily.</p>

                <h3>Confidentiality</h3>
                <p>All information you provide for the study and treatment will be strictly confidential and will only be used for evaluation, and will not be available for any other purpose. You will be identified with a number.</p>

                <h3>Voluntary Participation/Withdrawal</h3>
                <p>Your participation in this study is absolutely voluntary. You are completely free to refuse to participate or to withdraw your participation at any time. Your decision to participate or not will not entail any negative consequences.</p>

                <h3>Potential Risks/Compensation</h3>
                <p>The potential risks involved in your participation in this study are minimal. If any of the questions make you feel uncomfortable, you have the right not to answer.</p>

                <h3>Protection of Personal Data</h3>
                <p>The Protocol Coordinator is responsible for guiding you in your treatment, and the safeguarding of personal data will be the responsibility of the team handling your case, which will be protected in accordance with the provisions of the General Law on the Protection of Personal Data Held by Obligated Parties. The personal data requested from you will be used exclusively for research. You may request the correction of your data, that your data be deleted from our databases, or withdraw your consent for its use.</p>

                <h3>Declaration of the person giving their assent</h3>
                <p>• I have read this consent letter.</p>
                <p>• My questions related to my participation have been answered.</p>
                <p>I understood the information provided to me, and I give my consent to participate in this study.</p>
            </>
        );
    }

    return (
        <>
            <h3>Introducción</h3>
            <p>La salud mental debe ser valorada frecuentemente, así como lo es la salud física. Por lo tanto, se presenta la presente valoración integral de la salud mental y del bienestar, proponiendo un precedente para detectar problemas de salud mental y la estratificación por nivel de riesgo de comportamientos suicidas y conductas alimentarias de riesgo, combinando datos biológicos y mediciones validadas.</p>

            <h3>Objetivo</h3>
            <p>El objetivo es realizar cuestionarios que nos indicarán tu actual estado de salud mental y darle seguimiento si lo requiere.</p>

            <h3>Propósito</h3>
            <p>Implementar a nivel nacional un sistema de detección y atención temprana para valorar la salud mental general y poder ofrecerte diferentes intervenciones para atenderte en caso de que detectemos algún problema de tipo emocional o, si no existen, ofrecerte opciones de prevención.</p>

            <h3>Procedimientos</h3>
            <p>Se te presentarán preguntas sobre tu salud mental.</p>

            <h3>Beneficios</h3>
            <p>Podrás conocer si detectamos algún problema de ansiedad, depresión, uso riesgoso de alcohol o sustancias psicoactivas, y se te notificará a través de tu correo electrónico con el fin de brindarte una propuesta terapéutica individualizada que podrás aceptar de manera voluntaria.</p>

            <h3>Confidencialidad</h3>
            <p>Toda la información que nos proporciones para el estudio y tratamiento será estrictamente confidencial y se utilizará únicamente para evaluar y no estará disponible para ningún otro propósito. Quedarás identificado con un número.</p>

            <h3>Participación Voluntaria/Retiro</h3>
            <p>Tu participación en este estudio es absolutamente voluntaria. Estás en plena libertad de negarte a participar o de retirar tu participación en este en cualquier momento. Tu decisión de participar o no, no implicará ningún tipo de consecuencia negativa.</p>

            <h3>Riesgos Potenciales/Compensación</h3>
            <p>Los riesgos potenciales que implica tu participación en este estudio son mínimos. Si alguna de las preguntas a contestar te hiciera sentir incómodo(a), tienes el derecho de no responder.</p>

            <h3>Protección de Datos Personales</h3>
            <p>El Coordinador del Protocolo es responsable de guiarte en tu tratamiento y el resguardo de los datos personales será responsabilidad del equipo de trabajo que atiende tu caso, los cuales serán protegidos conforme a lo dispuesto por la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados. Los datos personales que te solicitaremos serán utilizados exclusivamente para investigación. Puedes solicitar la corrección de tus datos o que tus datos se eliminen de nuestras bases de datos o retirar tu consentimiento para su uso.</p>

            <h3>Declaración de la persona que da su asentimiento</h3>
            <p>• He leído esta carta de consentimiento.</p>
            <p>• Me han contestado mis preguntas relacionadas con mi participación.</p>
            <p>Entendí la información que me han dado, y doy mi consentimiento para participar en este estudio.</p>
        </>
    );
}