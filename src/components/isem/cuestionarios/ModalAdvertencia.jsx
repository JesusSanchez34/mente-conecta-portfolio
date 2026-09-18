/**
 * ModalAdvertencia.jsx
 * ============================================================
 * Modal de react-bootstrap que aparece cuando el usuario
 * intenta guardar con preguntas sin responder.
 */

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ModalAdvertencia.css';

export function ModalAdvertencia({ show, onClose, onConfirm }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="sm"
      id="modal-advertencia-cuestionario"
      dialogClassName="modal-advertencia"
    >
      <div className="modal-advertencia__header-yellow">
        <div className="modal-advertencia__bulb-icon" aria-hidden="true" />
      </div>

      <Modal.Body className="modal-advertencia__body">
        <h5 className="modal-advertencia__title">Finalizado</h5>
        <p className="modal-advertencia__description">
          Aún tienes preguntas por contestar, ¿deseas continuar?
        </p>
      </Modal.Body>

      <Modal.Footer className="modal-advertencia__footer">
        <Button
          variant="link"
          onClick={onClose}
          id="modal-advertencia-btn-volver"
          className="modal-advertencia__btn-back"
        >
          Volver
        </Button>
        <Button
          onClick={onConfirm}
          id="modal-advertencia-btn-confirmar"
          className="modal-advertencia__btn-save"
        >
          Sí, guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
