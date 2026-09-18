/**
 * EspecificarRespuesta.jsx
 * ============================================================
 * Textarea de texto libre que se muestra cuando la pregunta
 * tiene `especificar_respuesta: true` al nivel de la pregunta
 * (no de una opción específica).
 */

import React from 'react';
import { Form } from 'react-bootstrap';
import './EspecificarRespuesta.css';

export function EspecificarRespuesta({ fieldName, value, setFieldValue, label, disabled }) {
  return (
    <div className="especificar-respuesta__wrapper">
      {label && (
        <Form.Label htmlFor={fieldName} className="especificar-respuesta__label">
          {label}
        </Form.Label>
      )}
      <Form.Control
        as="textarea"
        id={fieldName}
        name={fieldName}
        value={value || ''}
        onChange={(e) => setFieldValue(fieldName, e.target.value)}
        placeholder={label || 'Especifique su respuesta...'}
        disabled={disabled}
        className="especificar-respuesta__textarea"
      />
    </div>
  );
}
