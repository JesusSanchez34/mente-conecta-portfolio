/**
 * ModalConfirmarSalida.jsx
 * ============================================================
 * Modal de react-bootstrap que aparece cuando el usuario
 * intenta salir de un cuestionario activo con respuestas sin guardar.
 * ============================================================
 */

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaLightbulb } from 'react-icons/fa';
import './ModalConfirmarSalida.css';

export function ModalConfirmarSalida({ show, onClose, onConfirm }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="sm"
      className="modal-confirmar-salida"
    >
      <div className="modal-confirmar-salida__header-yellow">
        <FaLightbulb size={45} color="white" />
      </div>

      <Modal.Body className="modal-confirmar-salida__body">
        <h3 className="modal-confirmar-salida__title">
          ¿Estas seguro que desea salir?
        </h3>
        <p className="modal-confirmar-salida__description">
          No se guardaran los cambios realizados
        </p>
      </Modal.Body>

      <Modal.Footer className="modal-confirmar-salida__footer">
        <button
          type="button"
          onClick={onClose}
          className="modal-confirmar-salida__btn-cancel"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="modal-confirmar-salida__btn-salir"
        >
          Salir
        </button>
      </Modal.Footer>
    </Modal>
  );
}
