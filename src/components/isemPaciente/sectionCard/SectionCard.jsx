import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SectionCard.css';

// ── Imágenes de fondo por sección ──────────────
import imgSociodemo from '../../../assets/login/familiar.jpg';
import imgSaludMental from '../../../assets/login/saludmental.jpeg';
import imgDeterminantes from '../../../assets/login/determinantessociales.jpeg';

/**
 * SectionCard
 * ============================================================
 * Tarjeta visual de una sección de cuestionarios.
 * Muestra una imagen de fondo (o gradiente fallback) con
 * el nombre de la sección en un overlay.
 *
 * @param {number} seccionId - ID dinámico de la sección para la URL (Reemplaza al slug)
 * @param {string} titulo    - Título de la sección que viene del backend
 * @param {string} color     - Color de fallback
 * @param {string} [imagen]  - URL de la imagen de fondo desde el backend (opcional)
 * ============================================================
 */
export function SectionCard({ seccionId, titulo, color, imagen }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // ¡Aquí está la magia! Navegamos usando el ID numérico real
    navigate(`/isem/cuestionarios/${seccionId}`);
  };

 // Función inteligente para adivinar el tema visual basándonos en el título del backend
  const getThemeKey = (texto) => {
    // Convertimos a minúsculas y eliminamos tildes/acentos
    const normalizado = texto
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") || '';

    if (normalizado.includes('sociodemografico')) return 'sociodemograficos';
    if (normalizado.includes('salud mental')) return 'salud-mental';
    if (normalizado.includes('determinante')) return 'determinantes-sociales';
    
    return 'default';
  };

  const themeKey = getThemeKey(titulo);

  // Mapeo de imágenes por themeKey
  const imageMap = {
    sociodemograficos: imgSociodemo,
    'salud-mental': imgSaludMental,
    'determinantes-sociales': imgDeterminantes,
  };

  // Si el backend trae imagen, la usamos. Si no, usamos la local.
  const resolvedImage = imagen || imageMap[themeKey];

  // Obtenemos la clase CSS según el tema
  const themeClass = themeKey === 'sociodemograficos'
    ? 'section-card--sociodemograficos'
    : themeKey === 'salud-mental'
      ? 'section-card--salud-mental'
      : themeKey === 'determinantes-sociales'
        ? 'section-card--determinantes-sociales'
        : 'section-card--default';

  return (
    <button
      type="button"
      className={`section-card ${themeClass}`}
      onClick={handleClick}
      aria-label={`Ir a ${titulo}`}
      id={`section-${seccionId}`}
      style={themeClass === 'section-card--default' ? { '--default-accent': color || '#6b3a5c' } : undefined}
    >
      {resolvedImage ? (
        <img
          src={resolvedImage}
          alt=""
          className="section-card__bg"
          aria-hidden="true"
          loading="lazy"
        />
      ) : (
        <div
          className="section-card__gradient"
          aria-hidden="true"
        />
      )}

      <div className="section-card__overlay">
        <span className="section-card__title">{titulo}</span>
      </div>
    </button>
  );
}