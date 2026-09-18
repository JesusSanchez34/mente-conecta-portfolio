import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Bienvenido.scss";

import estudiantesBienvenida from "../../../assets/img/WebBasica/estudiantes-bienvenida.png";
import iconosDecoracion from "../../../assets/img/WebBasica/iconos-decoracion.png";
import cerebroIcono from "../../../assets/img/WebBasica/07460769bc5e573ec9104027d609eb606b385e70 copy.png";
import casaIcono from "../../../assets/img/WebBasica/6072a240710f1418c5572e5309f518766491adcc copy.png";
import comunidadIcono from "../../../assets/img/WebBasica/ac2f239af2c0c3ecc1cbfb91c7768319a8e2944a copy.png";

const CARD_COLOR_PALETTES = [
  ["#050914", "#2452dc", "#991a84"],
  ["#ff9308", "#33a438", "#9b1f8e"],
  ["#f25c54", "#0092b8", "#53c055"],
  ["#f4a340", "#7a57d1", "#1fae90"],
  ["#e44f9b", "#20a4f3", "#6cc551"],
];

export function Bienvenido() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const MAIN_OPTIONS = [
    {
      titleKey: "bienvenido.sociodemograficos",
      descKey: "bienvenido.sociodemograficosDesc",
      image: comunidadIcono,
      route: "/login-sep/cuestionario?seccion=sociodemograficos",
    },
    {
      titleKey: "bienvenido.saludMental",
      descKey: "bienvenido.saludMentalDesc",
      image: cerebroIcono,
      route: "/login-sep/cuestionario-salud-mental",
    },
    {
      titleKey: "bienvenido.determinantes",
      descKey: "bienvenido.determinantesDesc",
      image: casaIcono,
      route: "/login-sep/cuestionario?seccion=determinantes-sociales",
    },
  ];
  const cardColors = useMemo(() => {
    const index = Math.floor(Math.random() * CARD_COLOR_PALETTES.length);
    return CARD_COLOR_PALETTES[index];
  }, []);

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <section className="bienvenido-web">
      <img
        src={iconosDecoracion}
        alt=""
        className="bienvenido-web__deco bienvenido-web__deco--left"
        aria-hidden="true"
      />
      <img
        src={iconosDecoracion}
        alt=""
        className="bienvenido-web__deco bienvenido-web__deco--right"
        aria-hidden="true"
      />
      <div className="bienvenido-web__content">
        <div className="bienvenido-web__header-space" aria-hidden="true" />
        <div
          className="bienvenido-web__options"
          aria-label={t("bienvenido.abrirMenu")}
        >
          {MAIN_OPTIONS.map((option, index) => (
            <button
              key={option.titleKey}
              type="button"
              className="bienvenido-web__card"
              style={{
                backgroundColor: cardColors[index],
                "--bienvenido-card-text": "#ffffff",
              }}
              onClick={() => handleNavigate(option.route)}
            >
              <span className="bienvenido-web__card-image">
                <img src={option.image} alt="" aria-hidden="true" />
              </span>
              <span className="bienvenido-web__card-copy">
                <span className="bienvenido-web__card-title">
                  {t(option.titleKey)}
                </span>
                <span className="bienvenido-web__card-description">
                  {t(option.descKey)}
                </span>
              </span>
            </button>
          ))}
        </div>
        <img
          src={estudiantesBienvenida}
          alt=""
          className="bienvenido-web__characters"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
