import React from 'react';
import { FiPlay, FiCheck } from 'react-icons/fi';
import './CuestionarioCard.css';

/**
 * CuestionarioCard
 * ============================================================
 * Tarjeta de un cuestionario individual con botón "REALIZAR" o "COMPLETADO".
 *
 * @param {string}   nombre      - Nombre del cuestionario
 * @param {boolean}  [completado] - Si ya fue completado (100% respondido)
 * @param {function} [onClick]   - Handler al hacer clic
 * ============================================================
 */
export function CuestionarioCard({ nombre, completado = false, onClick }) {
  return (
    <button
      type="button"
      className={`cuestionario-card ${completado ? 'cuestionario-card--completed' : ''}`}
      onClick={onClick}
      aria-label={completado ? `${nombre} - Completado` : `Realizar ${nombre}`}
    >
      <span className="cuestionario-card__nombre">{nombre}</span>

      <div className="cuestionario-card__action">
        {/* Cambiamos los estilos visuales dependiendo si está completado o no */}
        <div className="cuestionario-card__play-icon">
          {completado ? <FiCheck size={20} /> : <FiPlay />}
        </div>
        
        <span className="cuestionario-card__action-text">
          {completado ? 'COMPLETO' : 'REALIZAR'}
        </span>
      </div>
    </button>
  );
}