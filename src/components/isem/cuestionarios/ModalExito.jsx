import React from 'react';
import { Modal } from 'react-bootstrap';
import { FiCheck } from 'react-icons/fi';
import './ModalExito.css';

export function ModalExito({ show, onVerResultados, onAceptar, generaResultados = true, isSeguimiento = false }) {
  return (
    <Modal 
      show={show} 
      centered 
      backdrop="static" 
      keyboard={false}
      dialogClassName="modal-exito-dialog"
      className="modal-exito-container"
    >
      <div className="modal-exito__header">
        <div className="modal-exito__icon-circle">
          <FiCheck color="white" size={45} />
        </div>
      </div>
      <Modal.Body className="modal-exito__body">
        <h3 className="modal-exito__title">
          {isSeguimiento 
            ? "Cuestionario finalizado" 
            : (generaResultados ? "Cuestionario Completado" : "Cuestionario Finalizado")
          }
        </h3>
        <p className="modal-exito__description">
          {isSeguimiento 
            ? "Completado" 
            : (generaResultados 
                ? "Puedes ver tus resultados o continuar con tu cuestionarios faltantes"
                : "Has contestado correctamente todas las preguntas de este test."
              )
          }
        </p>
        
        {isSeguimiento ? (
          <button 
            type="button"
            onClick={onAceptar}
            className="modal-exito__btn-results"
          >
            Okay
          </button>
        ) : generaResultados ? (
          <button 
            type="button"
            onClick={onVerResultados}
            className="modal-exito__btn-results"
          >
            Ver resultados
          </button>
        ) : (
          <button 
            type="button"
            onClick={onAceptar}
            className="modal-exito__btn-results"
          >
            Aceptar
          </button>
        )}
      </Modal.Body>
    </Modal>
  );
}
