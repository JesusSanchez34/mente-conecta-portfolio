/**
 * OpcionMultiple.jsx
 * ============================================================
 * Renderiza las opciones de respuesta de una pregunta o un
 * cuadro de texto libre si la pregunta es abierta.
 */

import React from 'react';
import { Form } from 'react-bootstrap';
import './OpcionMultiple.css';

export function OpcionMultiple({ pregunta, fieldName, values, setFieldValue, disabled }) {
  const isMulti = pregunta.opcion_multiple === true;
  const currentValue = values[fieldName];

  const especificarTextKey = `${fieldName}_text`;
  const currentText = values[especificarTextKey] || '';

  // ─── 1. MODO PREGUNTA ABIERTA ─────────────────────────────
  // Si no hay opciones de respuesta, dibujamos el textarea maestro
  if (!pregunta.respuestas || pregunta.respuestas.length === 0) {
    const textValue = currentText || (currentValue && currentValue.texto) || '';

    return (
      <Form.Control
        as="textarea"
        rows={2}
        placeholder="Escriba su respuesta..."
        value={textValue}
        onChange={(e) => {
          const txt = e.target.value;
          
          // 1. Guardamos el texto real para enviarlo al backend
          setFieldValue(especificarTextKey, txt);
          
          // 2. Simulamos un "ID de respuesta" para que la validación estricta pase
          if (txt.trim() !== '') {
            setFieldValue(fieldName, { id: 0, calificacion: 0, texto: txt });
          } else {
            setFieldValue(fieldName, null); // Si está vacío, bloquea el envío final
          }
        }}
        disabled={disabled}
        className="opcion-multiple__textarea-open"
      />
    );
  }

  // ─── 2. MODO OPCIÓN MÚLTIPLE O RADIO (Pregunta cerrada) ───

  const handleRadioChange = (respuesta) => {
    setFieldValue(fieldName, {
      id: respuesta.id,
      calificacion: respuesta.ponderacion,
      texto: respuesta.respuesta,
    });
    if (!respuesta.especificar_respuesta) {
      setFieldValue(especificarTextKey, '');
    }
  };

  const handleCheckChange = (respuesta, checked) => {
    const prevIds = currentValue?.ids || [];
    const prevItems = currentValue?.items || [];

    let newIds, newItems;
    if (checked) {
      newIds = [...prevIds, respuesta.id];
      newItems = [
        ...prevItems,
        { id: respuesta.id, calificacion: respuesta.ponderacion, texto: respuesta.respuesta },
      ];
    } else {
      newIds = prevIds.filter((i) => i !== respuesta.id);
      newItems = prevItems.filter((i) => i.id !== respuesta.id);
    }

    setFieldValue(fieldName, { ids: newIds, items: newItems });
  };

  const isSelected = (respuestaId) => {
    if (isMulti) {
      return (currentValue?.ids || []).includes(respuestaId);
    }
    return currentValue?.id === respuestaId;
  };

  const selectedRespuesta = !isMulti
    ? pregunta.respuestas?.find((r) => r.id === currentValue?.id)
    : null;
  const showEspecificarInline =
    !isMulti && selectedRespuesta?.especificar_respuesta;

  return (
    <div className="opcion-multiple__card">
      {pregunta.respuestas?.map((respuesta) => (
        <React.Fragment key={respuesta.id}>
          <label
            className={`opcion-multiple__row ${disabled ? 'opcion-multiple__row--disabled' : ''}`}
            htmlFor={`${fieldName}_${respuesta.id}`}
          >
            <span className="opcion-multiple__label">{respuesta.respuesta}</span>
            <Form.Check
              type={isMulti ? 'checkbox' : 'radio'}
              id={`${fieldName}_${respuesta.id}`}
              name={isMulti ? `${fieldName}_${respuesta.id}` : fieldName}
              checked={isSelected(respuesta.id)}
              onChange={(e) => {
                if (disabled) return;
                isMulti
                  ? handleCheckChange(respuesta, e.target.checked)
                  : handleRadioChange(respuesta);
              }}
              disabled={disabled}
              label=""
              className={`opcion-multiple__check ${
                isMulti ? 'opcion-multiple__check-checkbox' : 'opcion-multiple__check-radio'
              }`}
            />
          </label>

          {isMulti && respuesta.especificar_respuesta && isSelected(respuesta.id) && (
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Especifique..."
              value={values[`${fieldName}_spec_${respuesta.id}`] || ''}
              onChange={(e) =>
                setFieldValue(`${fieldName}_spec_${respuesta.id}`, e.target.value)
              }
              disabled={disabled}
              className="opcion-multiple__especificar-inline"
            />
          )}
        </React.Fragment>
      ))}

      {showEspecificarInline && (
        <Form.Control
          as="textarea"
          rows={2}
          placeholder={selectedRespuesta?.detalle_especificacion || 'Especifique...'}
          value={currentText}
          onChange={(e) => setFieldValue(especificarTextKey, e.target.value)}
          disabled={disabled}
          className="opcion-multiple__especificar-inline"
        />
      )}
    </div>
  );
}