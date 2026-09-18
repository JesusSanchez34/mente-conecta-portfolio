import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalTerminos.css';

export function ModalPoliticaPrivacidad({ show, onHide }) {
    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Términos y Condiciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-content-scroll">
                    <h4>1. Introducción</h4>
                    <p>
                        Bienvenido a Mente Conecta. Estos términos y condiciones
                        regulan el uso de nuestro sitio web y servicios. Al
                        utilizar nuestro sitio, aceptas estos términos en su
                        totalidad.
                    </p>

                    <h4>2. Recopilación de Datos</h4>
                    <p>
                        Recopilamos información personal que incluye: nombre,
                        correo electrónico, información demográfica y datos de
                        salud mental cuando los proporciona voluntariamente a
                        través de cuestionarios.
                    </p>

                    <h4>3. Uso de Datos</h4>
                    <p>
                        Los datos recopilados se utilizan para: mejorar nuestros
                        servicios, análisis de salud mental, investigación
                        médica autorizada y comunicación con usuarios sobre
                        actualizaciones de servicios.
                    </p>

                    <h4>4. Compartición de Datos</h4>
                    <p>
                        No compartimos datos personales con terceros sin
                        consentimiento explícito, excepto cuando sea requerido
                        por ley o para profesionales de salud mental
                        autorizados.
                    </p>

                    <h4>5. Seguridad</h4>
                    <p>
                        Implementamos medidas de seguridad técnicas y
                        administrativas para proteger sus datos contra acceso no
                        autorizado, alteración, divulgación o destrucción.
                    </p>

                    <h4>6. Derechos del Usuario</h4>
                    <p>
                        Tiene derecho a acceder, rectificar, actualizar o
                        solicitar la eliminación de su información personal.
                        Para ejercer estos derechos, contacte a nuestro equipo
                        de privacidad.
                    </p>

                    <h4>7. Contacto</h4>
                    <p>
                        Si tiene preguntas sobre estos términos, contacte a:
                        privacidad@menteconecta.com
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
