import React from 'react';
import { Modal } from 'react-bootstrap';
import { FaLightbulb } from 'react-icons/fa';
import './ModalInicioCuestionario.css';

export function ModalInicioCuestionario({ show, onClose, onComenzar, titulo, descripcion }) {
  let displayTitulo = titulo || '';
  let displayDescripcion = descripcion || '';

  const cleanTitulo = displayTitulo.trim().toLowerCase();

  if (cleanTitulo.includes('yale') || cleanTitulo.includes('eyboc')) {
    displayTitulo = 'Escala Yale- Brown para TOC EYBOC';
    displayDescripcion = 'Bienvenido a la Escala Yale-Brown para el Trastorno Obsesivo-Compulsivo (EYBOC). Este test está diseñado para ayudarte a identificar y evalúa la severidad de los obsesiones y compulsiones que puedes experimentar, así como entender tus síntomas de TOC.';
  } else if (cleanTitulo.includes('droga')) {
    displayTitulo = 'Cuestionario de Drogas.';
    displayDescripcion = 'Bienvenido al cuestionario sobre el uso de drogas. Este test está diseñado para evaluar tus patrones de consumo y ayudarte a comprender tu relación con las drogas.';
  } else if (cleanTitulo.includes('plutch')) {
    displayTitulo = 'CUESTIONARIO PLUTCHCK';
    displayDescripcion = 'Este cuestionario está diseñado para explorar cómo manejas las impulsividades en tu vida diaria. Tus respuestas sinceras nos ayudarán a comprender mejor tus patrones de conducta y ofrecerte el apoyo adecuado si lo necesitas.';
  } else if (cleanTitulo.includes('psl')) {
    displayTitulo = 'Cuestionario PSL5';
    displayDescripcion = 'Bienvenido al Cuestionario PSL-5 sobre el Estrés Postraumático. Este test te ayudará a evaluar los síntomas relacionados con experiencias traumáticas recientes.';
  } else if (cleanTitulo.includes('phq')) {
    displayTitulo = 'PHq-9';
    displayDescripcion = 'Bienvenido a este cuestionario te ayudará a evaluar los síntomas de depresión que has experimentado determinando el grado y así poder sugerir con un tratamiento.';
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-inicio-dialog"
      className="modal-inicio-container"
    >
      <div className="modal-inicio__header">
        <div className="modal-inicio__icon-circle">
          <FaLightbulb size={45} color="white" />
        </div>
      </div>
      <Modal.Body className="modal-inicio__body">
        <h3 className="modal-inicio__title">{displayTitulo}</h3>
        <p className="modal-inicio__description">
          {displayDescripcion || 'Bienvenido a este cuestionario. Responde cada pregunta con total honestidad.'}
        </p>
        
        <div className="modal-inicio__buttons">
          <button
            type="button"
            className="modal-inicio__btn-back"
            onClick={onClose}
          >
            Regresar
          </button>
          <button
            type="button"
            className="modal-inicio__btn-start"
            onClick={onComenzar}
          >
            Comenzar
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
