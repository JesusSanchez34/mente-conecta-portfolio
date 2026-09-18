/**
 * ModalResultadoGrave.jsx
 * ============================================================
 * Modal informativo que aparece cuando el backend detecta un
 * resultado de riesgo en el cuestionario de Sintomatología.
 *
 * El backend envía en la respuesta de evaluación un array de
 * cuestionarios derivados (cuestionario_id). Si ese array
 * NO está vacío, este modal se muestra.
 *
 * Props:
 *   show    {boolean}  — controla visibilidad
 *   onOkay  {function} — callback al presionar "Okay"
 * ============================================================
 */

import React from 'react';
import { Modal } from 'react-bootstrap';
import './ModalResultadoGrave.css';
import doctoraImg from '../../../assets/img/doctora.png';

export function ModalResultadoGrave({ show, onOkay }) {
  return (
    <Modal
      show={show}
      centered
      backdrop="static"
      keyboard={false}
      id="modal-resultado-grave"
      dialogClassName="modal-grave-dialog"
      className="modal-grave-container"
    >
      {/* ── Área visual superior con ilustración de doctora ── */}
      <div className="modal-grave__illustration" aria-hidden="true">
        <img 
          src={doctoraImg} 
          alt="Doctora" 
          className="modal-grave__doctor-image" 
        />
      </div>

      <Modal.Body className="modal-grave__body">
        <h3 className="modal-grave__title">Resultados</h3>
        <p className="modal-grave__description">
          Detectamos que contestaste algunas preguntas relacionadas con los
          siguientes diagnósticos, te pedimos que contestes algunas preguntas
          más para darte una mejor información. Te sugerimos que contestes los
          siguientes cuestionarios
        </p>
      </Modal.Body>

      <Modal.Footer className="modal-grave__footer">
        <button
          type="button"
          id="modal-grave-btn-okay"
          className="modal-grave__btn-okay"
          onClick={onOkay}
        >
          Okay
        </button>
      </Modal.Footer>
    </Modal>
  );
}
