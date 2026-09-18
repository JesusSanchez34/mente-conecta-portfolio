import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalTerminos.css';

export function ModalProposito({ show, onHide }) {
    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Propósito de Uso de Datos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-content-scroll">
                    <h4>¿Qué es Mente Conecta?</h4>
                    <p>
                        Mente Conecta es una plataforma de evaluación y
                        seguimiento de salud mental diseñada para proporcionar
                        herramientas de diagnóstico y apoyo a usuarios en
                        contextos corporativos, educativos y de investigación.
                    </p>

                    <h4>¿Por qué necesitamos sus datos?</h4>
                    <p>
                        Recopilamos información de salud mental para: evaluar su
                        bienestar psicológico, proporcionar recomendaciones
                        personalizadas, contribuir a investigaciones en salud
                        mental, y mejorar continuamente nuestros servicios.
                    </p>

                    <h4>¿Qué cuestionarios incluye?</h4>
                    <p>
                        Mente Conecta incluye cuestionarios estandarizados de
                        evaluación de:
                    </p>
                    <ul>
                        <li>Depresión y ansiedad</li>
                        <li>Estrés y sobrecarga laboral</li>
                        <li>Burnout profesional</li>
                        <li>Bienestar general</li>
                        <li>Riesgos psicosociales</li>
                    </ul>

                    <h4>Confidencialidad y Protección</h4>
                    <p>
                        Sus datos están protegidos bajo encriptación de nivel
                        corporativo. Solo personal autorizado puede acceder a la
                        información, y nunca se compartirá con terceros sin su
                        consentimiento explícito.
                    </p>

                    <h4>Su Consentimiento</h4>
                    <p>
                        Al registrarse, consiente que sus respuestas se utilicen
                        para los propósitos descritos. Puede revocar este
                        consentimiento en cualquier momento contactando a
                        nuestro equipo de soporte.
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
