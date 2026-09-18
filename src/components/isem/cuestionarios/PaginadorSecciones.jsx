/**
 * PaginadorSecciones.jsx
 * ============================================================
 * Barra de paginación numérica que divide el cuestionario
 * en páginas (grupos de PREGUNTAS_POR_PAGINA preguntas).
 */

import React from 'react';
import './PaginadorSecciones.css';

export function PaginadorSecciones({ total, actual, onChange }) {
  if (total <= 1) return null;

  return (
    <nav className="paginador-secciones" aria-label="Navegación de páginas del cuestionario">
      {Array.from({ length: total }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          type="button"
          className={`paginador-secciones__btn ${num === actual ? 'paginador-secciones__btn--active' : ''}`}
          onClick={() => onChange(num)}
          aria-label={`Ir a página ${num}`}
          aria-current={num === actual ? 'page' : undefined}
          id={`paginador-btn-${num}`}
        >
          {num}
        </button>
      ))}
    </nav>
  );
}
