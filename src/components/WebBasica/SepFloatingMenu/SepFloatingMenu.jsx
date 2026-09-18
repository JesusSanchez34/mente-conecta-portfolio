import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoClose,
  IoMenu,
  IoNewspaperOutline,
  IoPersonOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { MdPsychology } from "react-icons/md";
import "./SepFloatingMenu.scss";

const INTERNAL_PATHS = new Set([
  "/login-sep/quien-realiza",
  "/login-sep/consentimiento",
  "/login-sep/bienvenido",
  "/login-sep/perfil_screen",
  "/login-sep/configuracion",
  "/login-sep/chatbot",
  "/login-sep/traductor",
  "/login-sep/ayuda_screen",
  "/login-sep/actualizaciones",
  "/login-sep/cuestionario",
  "/login-sep/cuestionario-salud-mental",
]);

export function SepFloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!INTERNAL_PATHS.has(pathname)) return null;

  const options = [
    {
      label: t("menu.perfil", { defaultValue: "Perfil" }),
      route: "/login-sep/perfil_screen",
      icon: IoPersonOutline,
      color: "#078d16",
    },
    {
      label: t("menu.configuracion", { defaultValue: "Configuración" }),
      route: "/login-sep/configuracion",
      icon: IoSettingsOutline,
      color: "#0a8815",
    },
    {
      label: t("menu.chatbot", { defaultValue: "Chatbot" }),
      route: "/login-sep/chatbot",
      icon: MdPsychology,
      color: "#706fe8",
    },
    {
      label: t("menu.noticias", { defaultValue: "Noticias" }),
      route: "/login-sep/actualizaciones",
      icon: IoNewspaperOutline,
      color: "#0c72b8",
    },
  ];

  const handleSelect = (item) => {
    setIsOpen(false);
    navigate(item.route);
  };

  return (
    <nav
      className={`sep-floating-menu${isOpen ? " sep-floating-menu--open" : ""}`}
      aria-label={t("bienvenido.abrirMenu", { defaultValue: "Abrir menú" })}
    >
      <div className="sep-floating-menu__items" aria-hidden={!isOpen}>
        {isOpen &&
          options.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className="sep-floating-menu__item"
                style={{ backgroundColor: item.color }}
                onClick={() => handleSelect(item)}
                title={item.label}
                aria-label={item.label}
              >
                <Icon aria-hidden="true" />
              </button>
            );
          })}
      </div>

      <button
        type="button"
        className="sep-floating-menu__toggle"
        onClick={() => setIsOpen((current) => !current)}
        title={
          isOpen
            ? t("bienvenido.cerrarMenu", { defaultValue: "Cerrar menú" })
            : t("bienvenido.abrirMenu", { defaultValue: "Abrir menú" })
        }
        aria-label={
          isOpen
            ? t("bienvenido.cerrarMenu", { defaultValue: "Cerrar menú" })
            : t("bienvenido.abrirMenu", { defaultValue: "Abrir menú" })
        }
        aria-expanded={isOpen}
      >
        {isOpen ? <IoClose aria-hidden="true" /> : <IoMenu aria-hidden="true" />}
      </button>
    </nav>
  );
}
