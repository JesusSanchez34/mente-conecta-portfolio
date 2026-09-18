import React from "react";
import mexicoFlag from "../../../assets/img/WebBasica/flag-mexico.svg";
import "./MexicoFlag.scss";

export function MexicoFlag({ className = "" }) {
  return (
    <img
      src={mexicoFlag}
      className={`mexico-flag ${className}`.trim()}
      width="24"
      height="18"
      alt="Bandera de México"
    />
  );
}
