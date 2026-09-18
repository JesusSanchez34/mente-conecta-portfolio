import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { MdPsychology } from "react-icons/md";
import "./Chatbot.scss";
import iconosDecoracion from "../../../assets/img/WebBasica/iconos-decoracion.png";

const BASE_URL = process.env.REACT_APP_BASE_URL_SEP_SUPERIOR_V1;
const ENDPOINT = `${BASE_URL}/chatbot/chat/`;
const getToken = () => sessionStorage.getItem("token");

// ── Íconos ────────────────────────────────────────────────────────────────────

const IconBot = () => (
  <MdPsychology aria-hidden="true" />
);

const IconUser = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ── Opciones predeterminadas ───────────────────────────────────────────────────

const ROOT_OPTIONS = [
  { label: "Alcohol", emoji: "🍺" },
  { label: "Ansiedad", emoji: "🧘" },
  { label: "Conducta Alimentaria", emoji: "🥗" },
  { label: "Depresión", emoji: "😔" },
  { label: "Drogas", emoji: "🚫" },
  { label: "Riesgo de Suicidio", emoji: "🆘" },
  { label: "Sobre el Proyecto", emoji: "ℹ️" },
];

const INITIAL_MESSAGE =
  "¡Hola! 👋 Soy tu asistente de Salud Mental. He seleccionado estos temas críticos para apoyarte.\n\n¿En qué categoría te gustaría profundizar hoy? ✨";

const getInitialMessages = () => [
  { id: 1, tipo: "bot", contenido: INITIAL_MESSAGE },
];

const NAV_OPTIONS = [
  { label: "Recomendaciones", emoji: "✅" },
  { label: "Asistencia y Seguimiento", emoji: "🩺" },
  { label: "Protocolos de Atención", emoji: "🚨" },
  { label: "Líneas de Apoyo", emoji: "📞" },
  { label: "Volver al inicio", emoji: "" },
];

// Intenta extraer opciones de viñetas en la respuesta del bot
function extraerOpciones(texto) {
  const opciones = [];
  for (const linea of texto.split("\n")) {
    const match =
      linea.match(/^[\s]*[-*•]\s+(.+)$/) || linea.match(/^[\s]*\d+\.\s+(.+)$/);
    if (match) {
      const opt = match[1].trim().replace(/\*\*/g, "");
      if (opt.length > 0 && opt.length < 80)
        opciones.push({ label: opt, emoji: "" });
    }
  }
  return opciones;
}

// ── Componente ────────────────────────────────────────────────────────────────

export function Chatbot() {
  const [historial, setHistorial] = useState([]);
  const [mensajes, setMensajes] = useState(getInitialMessages);
  const [opciones, setOpciones] = useState(ROOT_OPTIONS);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes, opciones, cargando, scrollToBottom]);

  const enviarAlBot = async (textoUsuario, histPrevio, ocultar = false) => {
    setCargando(true);
    setError(null);
    setOpciones([]);

    const nuevoHist = [...histPrevio, { role: "user", content: textoUsuario }];

    if (!ocultar) {
      setMensajes((prev) => [
        ...prev,
        { id: Date.now(), tipo: "usuario", contenido: textoUsuario },
      ]);
    }

    setHistorial(nuevoHist);

    try {
      const { data } = await axios.post(
        ENDPOINT,
        { messages: nuevoHist },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      const textoBot =
        data?.message || "Lo siento, no pude obtener una respuesta.";
      const histFinal = [
        ...nuevoHist,
        { role: "assistant", content: textoBot },
      ];

      setHistorial(histFinal);
      setMensajes((prev) => [
        ...prev,
        { id: Date.now() + 1, tipo: "bot", contenido: textoBot },
      ]);

      if (ocultar || textoUsuario === "Volver al inicio") {
        setOpciones(ROOT_OPTIONS);
      } else {
        const detectadas = extraerOpciones(textoBot);
        setOpciones(detectadas.length >= 2 ? detectadas : NAV_OPTIONS);
      }
    } catch (err) {
      console.error("Error chatbot:", err);
      setError(
        "No se pudo conectar con el asistente. Verifica tu sesión e intenta de nuevo.",
      );
      setOpciones(histPrevio.length === 0 ? ROOT_OPTIONS : NAV_OPTIONS);
    } finally {
      setCargando(false);
    }
  };

  const handleOpcion = (op) => {
    if (cargando) return;
    if (op.label === "Volver al inicio") {
      setMensajes(getInitialMessages());
      setHistorial([]);
      setOpciones(ROOT_OPTIONS);
      setError(null);
      return;
    }
    enviarAlBot(op.label, historial);
  };

  return (
    <div className="chat">
      <img
        src={iconosDecoracion}
        alt=""
        className="chat__deco chat__deco--left"
        aria-hidden="true"
      />
      <img
        src={iconosDecoracion}
        alt=""
        className="chat__deco chat__deco--right"
        aria-hidden="true"
      />

      <div className="chat__container">
        <div className="chat__messages">
          {mensajes.map((msg) => {
            if (msg.tipo === "bot")
              return (
                <div key={msg.id} className="chat__msg chat__msg--bot">
                  <div className="chat__msg-avatar">
                    <IconBot />
                  </div>
                  <div className="chat__msg-bubble">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <span className="chat__md-p">{children}</span>
                        ),
                      }}
                    >
                      {msg.contenido}
                    </ReactMarkdown>
                  </div>
                </div>
              );

            if (msg.tipo === "usuario")
              return (
                <div key={msg.id} className="chat__msg chat__msg--usuario">
                  <div className="chat__msg-avatar">
                    <IconUser />
                  </div>
                  <div className="chat__msg-bubble">{msg.contenido}</div>
                </div>
              );

            return null;
          })}

          {cargando && (
            <div className="chat__msg chat__msg--bot">
              <div className="chat__msg-avatar">
                <IconBot />
              </div>
              <div className="chat__msg-bubble chat__msg-bubble--typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {error && (
            <div className="chat__msg chat__msg--bot">
              <div className="chat__msg-avatar chat__msg-avatar--hidden" />
              <div className="chat__msg-bubble chat__msg-bubble--error">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {!cargando && opciones.length > 0 && (
          <div className="chat__opciones">
            {opciones.map((op) => (
              <button
                key={op.label}
                className={`chat__opcion-btn${op.label === "Volver al inicio" ? " chat__opcion-btn--volver" : ""}`}
                onClick={() => handleOpcion(op)}
                type="button"
              >
                <span>
                  {op.label}
                  {op.emoji ? ` ${op.emoji}` : ""}
                </span>
                {op.label !== "Volver al inicio" && (
                  <span className="chat__opcion-arrow">›</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="chat__footer">© Mente Conecta - SEP</p>
    </div>
  );
}
