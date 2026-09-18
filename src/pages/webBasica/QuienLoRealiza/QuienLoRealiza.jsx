import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuienLoRealiza.scss";
import { useTranslation } from "react-i18next";

import iconosDecoracion from "../../../assets/img/WebBasica/iconos-decoracion.png";
import primeraImagen from "../../../assets/img/WebBasica/QuienLoRealiza/418e67cd81cf4b662dfba8fe4937e047b1de7aaf.png";
import segundaImagen from "../../../assets/img/WebBasica/QuienLoRealiza/0842e8109e863a220480cfbcc034617b00ca7fe6.png";
import terceraImagen from "../../../assets/img/WebBasica/QuienLoRealiza/34f00a5e70f223d72cfb90db59fb6ea46c3d58c8.png";

export function QuienLoRealiza() {
  const { t } = useTranslation();
  const [seleccionado, setSeleccionado] = useState(null);
  const navigate = useNavigate();

  const OPCIONES = [
    { id: "personal",       labelKey: "quienRealiza.personal",       tipoConsentimiento: "consentimiento", img: primeraImagen },
    { id: "personal_salud", labelKey: "quienRealiza.personalSalud",  tipoConsentimiento: "asentimiento",   img: segundaImagen },
    { id: "familiar",       labelKey: "quienRealiza.familiar",       tipoConsentimiento: "asentimiento",   img: terceraImagen },
  ];

  const handleSeleccionar = (opcion) => {
    setSeleccionado(opcion.id);
    sessionStorage.setItem("quien_realiza", opcion.id);
    sessionStorage.setItem("tipo_consentimiento", opcion.tipoConsentimiento);
    setTimeout(() => navigate("/login-sep/consentimiento"), 400);
  };

  return (
    <div className="qlr">
      <img src={iconosDecoracion} alt="" className="qlr__deco qlr__deco--left" aria-hidden="true" />
      <img src={iconosDecoracion} alt="" className="qlr__deco qlr__deco--right" aria-hidden="true" />

      <div className="qlr__center">
        <div className="qlr__header">
          <h2 className="qlr__title">{t("quienRealiza.titulo")}</h2>
        </div>
        <div className="qlr__opciones">
          {OPCIONES.map((opcion) => (
            <button
              key={opcion.id}
              className={`qlr__opcion ${seleccionado === opcion.id ? "qlr__opcion--activa" : ""}`}
              onClick={() => handleSeleccionar(opcion)}
            >
              <div className="qlr__opcion-img">
                <img src={opcion.img} alt={t(opcion.labelKey)} />
              </div>
              <span className="qlr__opcion-label">{t(opcion.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
