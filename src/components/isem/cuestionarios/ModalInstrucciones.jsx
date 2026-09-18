import React from 'react';
import { Modal } from 'react-bootstrap';
import { FaLightbulb } from 'react-icons/fa';
import './ModalInstrucciones.css';

export function ModalInstrucciones({ show, onClose, instrucciones }) {
  const finalInstrucciones = instrucciones || "Responde a cada pregunta basándote en cómo te has sentido en las últimas semanas. Tu perspectiva es fundamental para una evaluación precisa.";

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      dialogClassName="modal-instrucciones-dialog"
      className="modal-instrucciones-container"
    >
      <div className="modal-instrucciones__header-custom">
        <div className="modal-instrucciones__icon-wrapper">
          <FaLightbulb size={45} color="white" />
        </div>
      </div>
      <Modal.Body className="modal-instrucciones__body-custom">
        <h3 className="modal-instrucciones__title-custom">Instrucciones</h3>
        <p className="modal-instrucciones__text-custom">
          {finalInstrucciones}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="modal-instrucciones__btn-close-custom"
          id="modal-instrucciones-btn-cerrar"
        >
          Cerrar
        </button>
      </Modal.Body>
    </Modal>
  );
}
