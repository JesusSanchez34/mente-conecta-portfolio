import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./PlaceholderWebBasica.scss";

const SECTION_LABELS = {
  sociodemograficos: "Sociodemogr\u00e1ficos",
  "determinantes-sociales": "Determinantes sociales",
};

export function PlaceholderWebBasica({
  title = "Secci\u00f3n",
  flutterRoute = "",
}) {
  const { search } = useLocation();

  const displayTitle = useMemo(() => {
    const section = new URLSearchParams(search).get("seccion");
    return SECTION_LABELS[section] || title;
  }, [search, title]);

  return (
    <section className="placeholder-web-basica">
      <div className="placeholder-web-basica__panel">
        <p className="placeholder-web-basica__eyebrow">SEP web b&aacute;sica</p>
        <h1>{displayTitle}</h1>
        <p>Vista pendiente de implementar.</p>
        {flutterRoute && (
          <p className="placeholder-web-basica__route">
            Ruta Flutter identificada: <strong>{flutterRoute}</strong>
          </p>
        )}
        {/* TODO: Reemplazar este placeholder por la vista final de SEP web basica. */}
      </div>
    </section>
  );
}
