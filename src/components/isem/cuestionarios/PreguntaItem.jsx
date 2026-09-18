/**
 * PreguntaItem.jsx
 * ============================================================
 * Contenedor de una pregunta individual del cuestionario.
 */

import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { OpcionMultiple } from './OpcionMultiple';
import { EspecificarRespuesta } from './EspecificarRespuesta';
import './PreguntaItem.css';

export function PreguntaItem({ pregunta, index, values, setFieldValue, disabled }) {
  const fieldName = `pregunta_${pregunta.id}`;
  const fieldNameText = `pregunta_${pregunta.id}_text`;

  const tieneExplicacion =
    pregunta.explicacion_pregunta && pregunta.explicacion_pregunta.trim() !== '';

  return (
    <div className="pregunta-item__card">
      <div className="pregunta-item__header">
        <p className="pregunta-item__text">
          {pregunta.pregunta}
        </p>

        {tieneExplicacion && (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${pregunta.id}`}>
                {pregunta.explicacion_pregunta}
              </Tooltip>
            }
          >
            <button
              type="button"
              aria-label="Ver explicación de la pregunta"
              id={`info-btn-${pregunta.id}`}
              className="pregunta-item__info-badge"
            >
              ⓘ
            </button>
          </OverlayTrigger>
        )}
      </div>

      <hr className="pregunta-item__divider" />

      {/* Opciones de respuesta */}
      <OpcionMultiple
        pregunta={pregunta}
        fieldName={fieldName}
        values={values}
        setFieldValue={setFieldValue}
        disabled={disabled}
      />

      {/* Textarea de especificación a nivel de pregunta */}
      {pregunta.especificar_respuesta && (
        <EspecificarRespuesta
          fieldName={fieldNameText}
          value={values[fieldNameText]}
          setFieldValue={setFieldValue}
          label={pregunta.detalle_especificacion || 'Especifique su respuesta'}
          disabled={disabled}
        />
      )}
    </div>
  );
}
