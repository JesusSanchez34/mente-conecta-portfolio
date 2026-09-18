import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoArrowForwardCircleOutline,
  IoAlertCircleOutline,
  IoChevronBack,
  IoChevronForward,
  IoCheckmarkCircle,
  IoInformationCircleOutline,
  IoPersonOutline,
} from "react-icons/io5";
import {
  MdAir,
  MdHeartBroken,
  MdMedicationLiquid,
  MdPsychology,
  MdRestaurant,
  MdSelfImprovement,
  MdSentimentVeryDissatisfied,
  MdSmokingRooms,
  MdWarningAmber,
  MdWineBar,
} from "react-icons/md";
import { useAuth } from "../../../hooks";
import { getToken } from "../../../api/token";
import {
  aceptarInstruccionesSeccion,
  actualizarDatosPaciente,
  guardarRespuestasUsuario,
  modificarRespuestasUsuario,
  obtenerCuestionariosPorSeccion,
  obtenerPreguntasCuestionario,
  obtenerRespuestasUsuario,
  obtenerSeccionesCuestionarios,
  verificarInstruccionesSeccion,
} from "../../../api/sep/cuestionariosWebBasica";
import iconosDecoracion from "../../../assets/img/WebBasica/iconos-decoracion.png";
import logoMenteConecta from "../../../assets/img/WebBasica/logo.png";
import logoSaludMental from "../../../assets/img/WebBasica/logo-salud-mental.png";
import {
  AuthFeedbackBar,
  AuthFeedbackDialog,
} from "../../../components/WebBasica/AuthFeedback";
import {
  useLoginWebBasicaHeaderAction,
  useLoginWebBasicaTitle,
} from "../../../layouts/LoginWebBasica";
import "./CuestionarioSociodemografico.scss";

const PAGE_SIZE = 10;

const SECTION_CONFIG = {
  sociodemograficos: {
    id: 1,
    match: "sociodemograficos",
    titleKey: "cuestionarioWeb.sociodemograficosTitulo",
    introKey: "cuestionarioWeb.sociodemograficosIntro",
    accent: "#1487e8",
  },
  "determinantes-sociales": {
    id: 4,
    match: "determinantes",
    titleKey: "cuestionarioWeb.determinantesTitulo",
    introKey: "cuestionarioWeb.determinantesIntro",
    accent: "#8cc318",
  },
  "salud-mental": {
    id: 2,
    match: "saludmental",
    titleKey: "cuestionarioWeb.saludMentalTitulo",
    introKey: "cuestionarioWeb.saludMentalIntro",
    accent: "#4fc254",
  },
};

const DEFAULT_QUESTIONNAIRE_STYLE = {
  color: "#64748b",
  icon: IoInformationCircleOutline,
};

const QUESTIONNAIRE_STYLES_BY_ID = {
  1: { color: "#3b82f6", icon: IoPersonOutline },
  2: { color: "#8b5cf6", icon: MdPsychology },
  3: { color: "#6ada9c", icon: MdRestaurant },
  6: { color: "#aa6120", icon: MdSmokingRooms },
  7: { color: "#ef4444", icon: MdWineBar },
  12: { color: "#d946ef", icon: IoPersonOutline },
};

const QUESTIONNAIRE_STYLES_BY_TITLE = [
  { match: "sintomatologiapsiquiatrica", color: "#8b5cf6", icon: MdPsychology },
  { match: "conductaalimentaria", color: "#6ada9c", icon: MdRestaurant },
  { match: "malestaremocional", color: "#e69900", icon: MdSelfImprovement },
  { match: "drogas", color: "#009688", icon: MdMedicationLiquid },
  { match: "eventostraumaticos", color: "#d9468f", icon: MdHeartBroken },
  { match: "riesgodesuicidio", color: "#d32f2f", icon: MdWarningAmber },
  { match: "tabaco", color: "#aa6120", icon: MdSmokingRooms },
  { match: "alcohol", color: "#ef4444", icon: MdWineBar },
  { match: "ansiedad", color: "#f57c00", icon: MdAir },
  { match: "depresion", color: "#3f51b5", icon: MdSentimentVeryDissatisfied },
  { match: "depression", color: "#3f51b5", icon: MdSentimentVeryDissatisfied },
  { match: "anxiety", color: "#f57c00", icon: MdAir },
  { match: "traumatic", color: "#d9468f", icon: MdHeartBroken },
];

const QUESTIONNAIRE_FALLBACK_TEXT = {
  es: {
    continuarCuestionario: "Continuar cuestionario",
    guardandoParcial: "Guardando respuestas...",
    repetir: "Repetir",
    repetirCuestionario: "Repetir cuestionario",
    repetirDetalle:
      "Este cuestionario ya fue completado. Puedes repetirlo si necesitas actualizar tus respuestas.",
  },
  en: {
    continuarCuestionario: "Continue questionnaire",
    guardandoParcial: "Saving responses...",
    repetir: "Repeat",
    repetirCuestionario: "Repeat questionnaire",
    repetirDetalle:
      "This questionnaire has already been completed. You can repeat it if you need to update your answers.",
  },
};

// ── Utilidades ────────────────────────────────────────────────────────────────

function normalizeText(value = "") {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

function getLocalized(item, esKey, enKey, language) {
  if (!item) return "";
  if (language === "en") return item[enKey] || item[esKey] || "";
  return item[esKey] || item[enKey] || "";
}

function getQuestionnaireStyle(questionnaire, language) {
  const title = getLocalized(questionnaire, "titulo", "title", language);
  const normalizedTitle = normalizeText(title);
  const styleByTitle = QUESTIONNAIRE_STYLES_BY_TITLE.find(({ match }) =>
    normalizedTitle.includes(match),
  );
  return (
    styleByTitle ||
    QUESTIONNAIRE_STYLES_BY_ID[questionnaire?.id] ||
    DEFAULT_QUESTIONNAIRE_STYLE
  );
}

function getQuestionId(question) {
  return Number(question?.id || 0);
}
function getQuestionOptions(question) {
  return Array.isArray(question?.respuestas) ? question.respuestas : [];
}
function isMultipleQuestion(question) {
  return Boolean(question?.opcion_multiple ?? question?.multiRespuesta);
}
function isRegistryQuestion(question) {
  return Boolean(question?.pregunta_registro ?? question?.preguntaRegistro);
}
function getRegistryKey(question) {
  return question?.key_registro || question?.keyRegistro || "";
}
function getQuestionInputType(question) {
  return Number(question?.id_tipo_opcion ?? question?.idTipoOpcion ?? 0);
}
function getOptionId(option) {
  return Number(option?.id || 0);
}
function getOptionScore(option) {
  return Number(option?.ponderacion ?? option?.calificacion ?? 0);
}
function optionRequiresText(option) {
  return Boolean(option?.especificar_respuesta ?? option?.specify_response);
}
function idsFromMultiValue(value = "") {
  return value
    .toString()
    .split(",")
    .map((item) => Number(item))
    .filter(Boolean);
}
function buildEmptyAnswer(question) {
  return {
    ponderacionId: 0,
    respuestaId: 0,
    respuestaMultiOpcion: "",
    preguntaId: getQuestionId(question),
    respuestasUser: "",
    calificacion: 0,
  };
}
function normalizeStoredAnswer(answer) {
  return {
    ponderacionId: Number(answer?.ponderacionId || 0),
    respuestaId: Number(answer?.respuestaId || 0),
    respuestaMultiOpcion: answer?.respuestaMultiOpcion || "",
    preguntaId: Number(answer?.preguntaId || 0),
    respuestasUser: answer?.respuestasUser || "",
    calificacion: Number(answer?.calificacion || 0),
  };
}
function parseAnswersFromBack(respuestasJson) {
  if (!respuestasJson) return {};
  try {
    const parsed = JSON.parse(respuestasJson);
    if (!Array.isArray(parsed)) return {};
    return parsed.reduce((acc, item) => {
      const answer = normalizeStoredAnswer(item);
      if (answer.preguntaId) acc[answer.preguntaId] = answer;
      return acc;
    }, {});
  } catch {
    return {};
  }
}
function responseStatus(response) {
  return Number(
    response?.estatus_finalizado ?? response?.estatusFinalizado ?? 0,
  );
}
function responseId(response) {
  return response?.id || response?.id_respuesta || null;
}
function formatDateForApi(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}
function formatDateForInput(value) {
  if (!value) return "";
  const [day, month, year] = value.split("/");
  if (!year || !month || !day) return value;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function normalizeNumericAnswer(value = "") {
  const normalized = value.toString().replace(",", ".").replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = normalized.split(".");
  return decimalParts.length
    ? `${whole}.${decimalParts.join("")}`
    : whole;
}

// Calcula en qué página quedó el usuario basándose en cuántas preguntas respondidas tiene
// ── Dialog ────────────────────────────────────────────────────────────────────
function Dialog({ children, onClose, accent }) {
  return (
    <div className="cuestionario-web__dialog-backdrop" role="presentation">
      <div
        className="cuestionario-web__dialog"
        role="dialog"
        aria-modal="true"
        style={accent ? { "--questionnaire-modal-accent": accent } : undefined}
      >
        {children}
        {onClose && (
          <button
            type="button"
            className="cuestionario-web__dialog-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            x
          </button>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export function CuestionarioSociodemografico({ section: forcedSection }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { auth } = useAuth();
  const language = i18n.language?.startsWith("en") ? "en" : "es";
  const questionnaireFallbacks =
    QUESTIONNAIRE_FALLBACK_TEXT[language] || QUESTIONNAIRE_FALLBACK_TEXT.es;
  const tq = useCallback(
    (key) =>
      t(`cuestionarioWeb.${key}`, {
        defaultValue: questionnaireFallbacks[key],
      }),
    [questionnaireFallbacks, t],
  );
  const token = auth?.token || getToken();
  const userId = Number(auth?.me?.id || 0);

  const sectionSlug = useMemo(() => {
    const value = new URLSearchParams(search).get("seccion");
    if (forcedSection && SECTION_CONFIG[forcedSection]) return forcedSection;
    return value && SECTION_CONFIG[value] ? value : "sociodemograficos";
  }, [forcedSection, search]);

  const sectionConfig = SECTION_CONFIG[sectionSlug];
  const questionnaireAlertLogo =
    sectionSlug === "salud-mental" ? logoSaludMental : logoMenteConecta;
  const questionnaireAlertLogoClass =
    sectionSlug === "salud-mental"
      ? "cuestionario-web__modal-logo cuestionario-web__modal-logo--health"
      : "cuestionario-web__modal-logo";

  const [loading, setLoading] = useState(true);
  const [loadMessage, setLoadMessage] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState("list");
  const [sectionMeta, setSectionMeta] = useState(null);
  const [needsInstructionAcceptance, setNeedsInstructionAcceptance] =
    useState(false);
  const [instructionChecked, setInstructionChecked] = useState(false);
  const [introError, setIntroError] = useState("");
  const [introSaving, setIntroSaving] = useState(false);
  const [instructionAttemptCount, setInstructionAttemptCount] = useState(0);
  const [instructionNotice, setInstructionNotice] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [questionnaireToStart, setQuestionnaireToStart] = useState(null);
  const [activeQuestionnaire, setActiveQuestionnaire] = useState(null);
  const [storedResponse, setStoredResponse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [patientRegistry, setPatientRegistry] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [validationMessage, setValidationMessage] = useState("");
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [completedNotice, setCompletedNotice] = useState(null);
  const [instructionDialogOpen, setInstructionDialogOpen] = useState(false);
  const [questionInfo, setQuestionInfo] = useState(null);

  // Ref para tener siempre los valores actuales en el beforeunload
  const sessionRef = React.useRef({});
  useEffect(() => {
    sessionRef.current = {
      answers,
      questions,
      activeQuestionnaire,
      storedResponse,
    };
  }, [answers, questions, activeQuestionnaire, storedResponse]);

  // ── Guardado parcial ────────────────────────────────────────────────────────
  const savePartial = useCallback(
    async (
      currentAnswers,
      currentQuestions,
      currentQuestionnaire,
      currentStoredResponse,
    ) => {
      if (!currentQuestionnaire || !currentQuestions.length) return;

      const responseList = currentQuestions
        .map((q) => normalizeStoredAnswer(currentAnswers[getQuestionId(q)]))
        .filter(
          (a) =>
            a.preguntaId &&
            (a.respuestaId || a.respuestaMultiOpcion || a.respuestasUser),
        );

      if (!responseList.length) return;

      const payload = {
        id: responseId(currentStoredResponse),
        respuestas_json: JSON.stringify(responseList),
        estatus_finalizado: 0,
        id_usuario: userId,
        id_sub_usuario: null,
        id_seccion: null,
        id_cuestionario: currentQuestionnaire.id,
        encuestador: 0,
      };

      try {
        if (responseId(currentStoredResponse)) {
          await modificarRespuestasUsuario(
            token,
            responseId(currentStoredResponse),
            payload,
          );
        } else {
          const saved = await guardarRespuestasUsuario(token, payload, 0);
          // Actualizar el storedResponse con el id recién creado para futuros PUT
          if (saved?.id) {
            setStoredResponse((prev) => ({ ...prev, ...saved }));
          }
        }
      } catch {
        // Guardado parcial silencioso — no interrumpir al usuario
      }
    },
    [token, userId],
  );

  // ── Carga inicial ───────────────────────────────────────────────────────────
  const resolveSection = useCallback(
    async (currentToken) => {
      const fallbackSection = {
        id: sectionConfig.id,
        titulo: t(sectionConfig.titleKey),
        title: t(sectionConfig.titleKey),
      };
      try {
        const secciones = await obtenerSeccionesCuestionarios(currentToken, 1);
        const match = (Array.isArray(secciones) ? secciones : []).find(
          (item) =>
            Number(item?.id) === sectionConfig.id ||
            normalizeText(
              `${item?.titulo || ""} ${item?.title || ""}`,
            ).includes(sectionConfig.match),
        );
        return match || fallbackSection;
      } catch {
        return fallbackSection;
      }
    },
    [sectionConfig, t],
  );

  const loadQuestionnairesWithStatus = useCallback(
    async (currentToken, currentUserId, currentSectionId) => {
      const data = await obtenerCuestionariosPorSeccion(
        currentToken,
        currentSectionId,
      );
      const list = Array.isArray(data) ? data : [];
      return Promise.all(
        list.map(async (questionnaire) => {
          try {
            const response = await obtenerRespuestasUsuario(currentToken, {
              idUsuario: currentUserId,
              idCuestionario: questionnaire.id,
              idParentesco: 0,
            });
            return {
              ...questionnaire,
              estatus_usuario: responseStatus(response),
              respuesta_usuario: response,
            };
          } catch {
            return {
              ...questionnaire,
              estatus_usuario: 0,
              respuesta_usuario: null,
            };
          }
        }),
      );
    },
    [],
  );

  const loadInitialData = useCallback(async () => {
    if (!token) {
      setError(t("cuestionarioWeb.sinSesion"));
      setLoading(false);
      return;
    }
    if (!userId) {
      setError(t("cuestionarioWeb.usuarioNoIdentificado"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadMessage(t("cuestionarioWeb.cargandoCuestionarios"));
    setError("");

    try {
      const section = await resolveSection(token);
      setSectionMeta(section);

      try {
        const instructions = await verificarInstruccionesSeccion(
          userId,
          section.id,
        );
        setNeedsInstructionAcceptance(!instructions?.status_instrucciones);
        setInstructionChecked(Boolean(instructions?.status_instrucciones));
      } catch {
        setNeedsInstructionAcceptance(true);
        setInstructionChecked(false);
      }

      const data = await loadQuestionnairesWithStatus(
        token,
        userId,
        section.id,
      );
      setQuestionnaires(data);
      setView("intro");
    } catch {
      setError(t("cuestionarioWeb.errorCargar"));
    } finally {
      setLoading(false);
      setLoadMessage("");
    }
  }, [loadQuestionnairesWithStatus, resolveSection, t, token, userId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (instructionNotice?.type !== "denied") return undefined;
    const timer = window.setTimeout(() => {
      navigate("/login-sep/bienvenido");
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [instructionNotice?.type, navigate]);

  // ── Guardado al salir: desmonte del componente (navegación interna) ──────────
  useEffect(() => {
    return () => {
      const {
        answers: a,
        questions: q,
        activeQuestionnaire: aq,
        storedResponse: sr,
      } = sessionRef.current;
      if (!aq || !q?.length) return;
      savePartial(a, q, aq, sr);
    };
  }, [savePartial]);

  // ── Guardado al salir: cierre de pestaña/ventana ──────────────────────────
  useEffect(() => {
    const handleUnload = () => {
      const {
        answers: a,
        questions: q,
        activeQuestionnaire: aq,
        storedResponse: sr,
      } = sessionRef.current;
      if (!aq || !q?.length) return;
      savePartial(a, q, aq, sr);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [savePartial]);

  // ── Respuestas ──────────────────────────────────────────────────────────────
  const setRegistryValue = useCallback((question, value) => {
    if (!isRegistryQuestion(question)) return;
    const key = getRegistryKey(question);
    if (!key) return;
    setPatientRegistry((current) => {
      if (!value) {
        const next = { ...current };
        delete next[key];
        return next;
      }
      return { ...current, [key]: value };
    });
  }, []);

  const handleIntroContinue = async () => {
    if (needsInstructionAcceptance && !instructionChecked) {
      const attempts = instructionAttemptCount + 1;
      const remaining = Math.max(3 - attempts, 0);
      setInstructionAttemptCount(attempts);
      setIntroError("");
      setInstructionNotice({
        type: remaining === 0 ? "denied" : "warning",
        remaining,
      });
      return;
    }
    if (!sectionMeta) return;
    setIntroError("");
    setInstructionNotice(null);
    if (needsInstructionAcceptance) {
      setIntroSaving(true);
      try {
        await aceptarInstruccionesSeccion(userId, sectionMeta.id);
        setNeedsInstructionAcceptance(false);
        setInstructionAttemptCount(0);
      } catch {
        setIntroError(t("cuestionarioWeb.errorAceptarInstrucciones"));
        setIntroSaving(false);
        return;
      }
      setIntroSaving(false);
    }
    setView("list");
  };

  const handleOptionChange = (question, option, checked) => {
    const questionId = getQuestionId(question);
    const optionId = getOptionId(option);
    const isMultiple = isMultipleQuestion(question);
    const optionText = getLocalized(option, "respuesta", "answer", language);

    setAnswers((current) => {
      const previous = current[questionId] || buildEmptyAnswer(question);
      let nextAnswer;

      if (isMultiple) {
        const previousIds = idsFromMultiValue(previous.respuestaMultiOpcion);
        let nextIds = checked
          ? [...new Set([...previousIds, optionId])]
          : previousIds.filter((id) => id !== optionId);
        if (checked && optionRequiresText(option)) nextIds = [];
        nextAnswer = {
          ...previous,
          respuestaId: checked ? optionId : nextIds[nextIds.length - 1] || 0,
          respuestaMultiOpcion: nextIds.join(","),
          respuestasUser:
            checked && optionRequiresText(option)
              ? previous.respuestasUser
              : "",
          calificacion: checked ? getOptionScore(option) : 0,
        };
      } else if (checked) {
        nextAnswer = {
          ...previous,
          respuestaId: optionId,
          respuestaMultiOpcion: "",
          respuestasUser: optionRequiresText(option)
            ? previous.respuestasUser
            : "",
          calificacion: getOptionScore(option),
        };
      } else {
        nextAnswer = buildEmptyAnswer(question);
      }

      return { ...current, [questionId]: nextAnswer };
    });

    if (checked) setRegistryValue(question, optionText);
    else setRegistryValue(question, "");
  };

  const handleTextAnswerChange = (question, value) => {
    const questionId = getQuestionId(question);
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        ...(current[questionId] || buildEmptyAnswer(question)),
        respuestaId: current[questionId]?.respuestaId || 0,
        respuestaMultiOpcion: current[questionId]?.respuestaMultiOpcion || "",
        respuestasUser: value,
        calificacion: current[questionId]?.calificacion || 0,
      },
    }));
    setRegistryValue(question, value);
  };

  const answerNeedsSpecifyText = useCallback((question, answer) => {
    if (!answer) return false;
    return getQuestionOptions(question).some(
      (option) =>
        getOptionId(option) === Number(answer.respuestaId) &&
        optionRequiresText(option),
    );
  }, []);

  const answerHasValue = useCallback(
    (question, answer) => {
      if (!answer) return false;
      const options = getQuestionOptions(question);
      if (!options.length) return Boolean(answer.respuestasUser?.trim());
      if (answerNeedsSpecifyText(question, answer))
        return (
          Boolean(answer.respuestaId) && Boolean(answer.respuestasUser?.trim())
        );
      if (isMultipleQuestion(question))
        return (
          idsFromMultiValue(answer.respuestaMultiOpcion).length > 0 ||
          Boolean(answer.respuestaId)
        );
      return Boolean(answer.respuestaId);
    },
    [answerNeedsSpecifyText],
  );

  const validateQuestions = useCallback(
    (questionsToValidate) => {
      const missing = questionsToValidate.find(
        (question) =>
          !answerHasValue(question, answers[getQuestionId(question)]),
      );
      if (missing) {
        setValidationMessage(
          t("cuestionarioWeb.respuestaRequerida", {
            posicion: missing.posicion || questions.indexOf(missing) + 1,
          }),
        );
        return false;
      }
      setValidationMessage("");
      return true;
    },
    [answerHasValue, answers, questions, t],
  );

  // ── Cargar cuestionario ─────────────────────────────────────────────────────
  const loadQuestionnaire = async (questionnaire) => {
    setQuestionnaireToStart(null);
    setLoading(true);
    setLoadMessage(t("cuestionarioWeb.cargandoPreguntas"));
    setError("");

    try {
      const [questionData, responseData] = await Promise.all([
        obtenerPreguntasCuestionario(token, questionnaire.id),
        obtenerRespuestasUsuario(token, {
          idUsuario: userId,
          idCuestionario: questionnaire.id,
          idParentesco: 0,
        }),
      ]);

      const list = Array.isArray(questionData) ? questionData : [];
      const parsedAnswers = parseAnswersFromBack(responseData?.respuestas_json);

      // Retomar desde donde quedó

      setQuestions(list);
      setStoredResponse(responseData);
      setAnswers(parsedAnswers);
      setPatientRegistry({});
      setActiveQuestionnaire(questionnaire);
      setCurrentPage(0);
      setValidationMessage("");
      setView("questions");
    } catch {
      setError(t("cuestionarioWeb.errorPreguntas"));
    } finally {
      setLoading(false);
      setLoadMessage("");
    }
  };

  // ── Paginación ──────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
  const visibleQuestions = questions.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  const handleNext = async () => {
    setValidationMessage("");
    // Guardado parcial automático al avanzar
    setAutoSaving(true);
    await savePartial(answers, questions, activeQuestionnaire, storedResponse);
    setAutoSaving(false);

    setCurrentPage((page) => Math.min(page + 1, totalPages - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setValidationMessage("");
    setCurrentPage((page) => Math.max(page - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRequestSubmit = () => {
    if (!validateQuestions(visibleQuestions)) return;
    if (!validateQuestions(questions)) return;
    setConfirmSubmit(true);
  };

  // ── Submit final ────────────────────────────────────────────────────────────
  const submitAnswers = async () => {
    const responseList = questions
      .map((question) =>
        normalizeStoredAnswer(answers[getQuestionId(question)]),
      )
      .filter((answer) => answer.preguntaId);

    const allAnswered = responseList.length === questions.length;

    const payload = {
      id: responseId(storedResponse),
      respuestas_json: JSON.stringify(responseList),
      estatus_finalizado: allAnswered ? 1 : 0,
      id_usuario: userId,
      id_sub_usuario: null,
      id_seccion: null,
      id_cuestionario: activeQuestionnaire.id,
      encuestador: 0,
    };

    setSubmitting(true);
    try {
      if (responseId(storedResponse)) {
        await modificarRespuestasUsuario(
          token,
          responseId(storedResponse),
          payload,
        );
      } else {
        await guardarRespuestasUsuario(token, payload, 0);
      }

      if (Object.keys(patientRegistry).length > 0) {
        await actualizarDatosPaciente(token, {
          ...patientRegistry,
          usuario_id: userId,
        });
      }

      setQuestionnaires((current) =>
        current.map((item) =>
          item.id === activeQuestionnaire.id
            ? {
                ...item,
                estatus_usuario: payload.estatus_finalizado,
                respuesta_usuario: { ...payload },
              }
            : item,
        ),
      );
      setConfirmSubmit(false);
      setCompletedNotice({ afterSubmit: true });
    } catch {
      setValidationMessage(t("cuestionarioWeb.errorGuardar"));
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccess = () => {
    setSuccessMessage("");
    setActiveQuestionnaire(null);
    setQuestions([]);
    setAnswers({});
    setStoredResponse(null);
    setPatientRegistry({});
    setView("list");
  };

  const closeCompletedNotice = () => {
    setCompletedNotice(null);
    setActiveQuestionnaire(null);
    setQuestions([]);
    setAnswers({});
    setStoredResponse(null);
    setPatientRegistry({});
    setView("list");
  };

  // ── Render inputs ────────────────────────────────────────────────────────────
  const renderQuestionInput = (question) => {
    const questionId = getQuestionId(question);
    const answer = answers[questionId] || buildEmptyAnswer(question);
    const options = [...getQuestionOptions(question)].sort(
      (a, b) => getOptionScore(b) - getOptionScore(a),
    );

    if (options.length) {
      const selectedMulti = idsFromMultiValue(answer.respuestaMultiOpcion);
      return (
        <div className="cuestionario-web__answer-list">
          {options.map((option) => {
            const optionId = getOptionId(option);
            const selected = isMultipleQuestion(question)
              ? optionRequiresText(option)
                ? answer.respuestaId === optionId
                : selectedMulti.includes(optionId)
              : answer.respuestaId === optionId;

            return (
              <label
                key={optionId}
                className={`cuestionario-web__option ${selected ? "cuestionario-web__option--selected" : ""}`}
              >
                <span className="cuestionario-web__option-text">
                  {getLocalized(option, "respuesta", "answer", language)}
                </span>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(event) =>
                    handleOptionChange(question, option, event.target.checked)
                  }
                />
              </label>
            );
          })}
          {answerNeedsSpecifyText(question, answer) && (
            <input
              className="cuestionario-web__input"
              value={answer.respuestasUser}
              placeholder={
                getLocalized(
                  question,
                  "detalle_especificacion",
                  "detail_specification",
                  language,
                ) || t("cuestionarioWeb.especificar")
              }
              onChange={(event) =>
                handleTextAnswerChange(question, event.target.value)
              }
            />
          )}
        </div>
      );
    }

    const inputType = getQuestionInputType(question);
    const placeholder =
      getLocalized(
        question,
        "detalle_especificacion",
        "detail_specification",
        language,
      ) || t("cuestionarioWeb.respuesta");

    if (inputType === 33) {
      return (
        <input
          className="cuestionario-web__input"
          type="date"
          value={formatDateForInput(answer.respuestasUser)}
          onChange={(event) =>
            handleTextAnswerChange(
              question,
              formatDateForApi(event.target.value),
            )
          }
        />
      );
    }
    if (inputType === 32) {
      return (
        <input
          className="cuestionario-web__input"
          type="time"
          value={answer.respuestasUser}
          onChange={(event) =>
            handleTextAnswerChange(question, event.target.value)
          }
        />
      );
    }
    return (
      <input
        className="cuestionario-web__input"
        type="text"
        inputMode={inputType === 31 ? "decimal" : undefined}
        pattern={inputType === 31 ? "[0-9]*[.,]?[0-9]*" : undefined}
        value={answer.respuestasUser}
        placeholder={placeholder}
        onChange={(event) =>
          handleTextAnswerChange(
            question,
            inputType === 31
              ? normalizeNumericAnswer(event.target.value)
              : event.target.value,
          )
        }
      />
    );
  };

  const sectionTitle = sectionMeta
    ? getLocalized(sectionMeta, "titulo", "title", language)
    : t(sectionConfig.titleKey);
  const activeQuestionnaireInstructions =
    (activeQuestionnaire &&
      getLocalized(activeQuestionnaire, "instrucciones", "instructions", language)) ||
    (language === "en"
      ? "Answer each question carefully."
      : "Responda cada pregunta con atención.");
  const activeQuestionnaireStyle = activeQuestionnaire
    ? getQuestionnaireStyle(activeQuestionnaire, language)
    : DEFAULT_QUESTIONNAIRE_STYLE;
  const instructionsTitle = t("cuestionarioWeb.instrucciones", {
    defaultValue: language === "en" ? "Instructions" : "Instrucciones",
  });
  const closeInstructionLabel = language === "en" ? "Close" : "Cerrar";
  const headerAction = useMemo(
    () =>
      view === "questions" && activeQuestionnaire ? (
        <button
          type="button"
          className="login-layout__context-action"
          onClick={() => setInstructionDialogOpen(true)}
          aria-label={instructionsTitle}
        >
          <IoInformationCircleOutline aria-hidden="true" />
          <span>{instructionsTitle}</span>
        </button>
      ) : null,
    [activeQuestionnaire, instructionsTitle, view],
  );

  useLoginWebBasicaTitle(
    view === "questions"
      ? "cuestionarioWeb.preguntas"
      : "titulos.cuestionario",
  );
  useLoginWebBasicaHeaderAction(headerAction);

  // ── Loading / Error ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="cuestionario-web">
        <div className="cuestionario-web__loading">
          <div className="cuestionario-web__spinner" />
          <p>{loadMessage || t("comun.cargando")}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="cuestionario-web">
        <div className="cuestionario-web__state-card">
          <IoAlertCircleOutline aria-hidden="true" />
          <h2>{t("cuestionarioWeb.errorTitulo")}</h2>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => navigate("/login-sep/bienvenido")}
          >
            {t("cuestionarioWeb.volverBienvenida")}
          </button>
        </div>
      </section>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <section
      className="cuestionario-web"
      style={{ "--section-accent": sectionConfig.accent }}
    >
      <img
        src={iconosDecoracion}
        alt=""
        className="cuestionario-web__deco cuestionario-web__deco--left"
        aria-hidden="true"
      />
      <img
        src={iconosDecoracion}
        alt=""
        className="cuestionario-web__deco cuestionario-web__deco--right"
        aria-hidden="true"
      />

      <AuthFeedbackBar
        message={introError || validationMessage}
        tone="error"
      />

      {/* ── Intro ── */}
      {view === "intro" && (
  <div className="cuestionario-web__dialog-backdrop" role="presentation">
    <div
      className="cuestionario-web__dialog"
      role="dialog"
      aria-modal="true"
      style={{
        maxWidth: "500px",
        height: "auto",
        padding: "24px",
        borderRadius: "16px",
        borderBottomWidth: "2px",
        borderBottomStyle: "solid",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      }}
    >
      

      <div className="cuestionario-web__intro-card" style={{ boxShadow: "none", padding: 0, border: "none" }}>
        <img src={logoMenteConecta} alt="" aria-hidden="true" />
        <p className="cuestionario-web__eyebrow">
          {t("cuestionarioWeb.cuestionario")}
        </p>
        <h1>{sectionTitle}</h1>
        <p>{t(sectionConfig.introKey)}</p>
        {needsInstructionAcceptance && (
          <label className="cuestionario-web__check-row">
            <input
              type="checkbox"
              checked={instructionChecked}
              onChange={(event) => {
                setInstructionChecked(event.target.checked);
                setInstructionNotice(null);
              }}
            />
            <span>{t("cuestionarioWeb.aceptoInstrucciones")}</span>
          </label>
        )}
        <button
          type="button"
          className="cuestionario-web__primary"
          onClick={handleIntroContinue}
          disabled={introSaving}
        >
          {introSaving
            ? t("cuestionarioWeb.guardando")
            : t("cuestionarioWeb.comenzar")}
        </button>
      </div>
    </div>
  </div>
)}

      {/* ── Lista de cuestionarios ── */}
      {(view === "list" || view === "intro") && (
        <div className="cuestionario-web__shell">
          {questionnaires.length === 0 ? (
            <div className="cuestionario-web__state-card">
              <IoInformationCircleOutline aria-hidden="true" />
              <h2>{t("cuestionarioWeb.sinCuestionarios")}</h2>
              <p>{t("cuestionarioWeb.sinCuestionariosDetalle")}</p>
            </div>
          ) : (
            <div className="cuestionario-web__questionnaire-list">
              {questionnaires.map((questionnaire) => {
                const status = Number(questionnaire.estatus_usuario);
                const completed = status === 1;
                const inProgress =
                  status === 0 && responseId(questionnaire.respuesta_usuario);
                const title = getLocalized(
                  questionnaire,
                  "titulo",
                  "title",
                  language,
                );
                const style = getQuestionnaireStyle(questionnaire, language);
                const Icon = style.icon;

                return (
                  <article
                    key={questionnaire.id}
                    className="cuestionario-web__questionnaire"
                    style={{ "--questionnaire-color": style.color }}
                  >
                    <div className="cuestionario-web__questionnaire-head">
                      <div>
                        <span>{t("cuestionarioWeb.cuestionario")}</span>
                        <h2>{title}</h2>
                      </div>
                      <Icon aria-hidden="true" />
                    </div>

                    <button
                      type="button"
                      className="cuestionario-web__questionnaire-action"
                      onClick={() => setQuestionnaireToStart(questionnaire)}
                      disabled={completed}
                    >
                      <span>
                        {completed
                          ? t("cuestionarioWeb.completado", {
                              defaultValue: language === "en" ? "Completed" : "Completado",
                            })
                          : inProgress
                            ? tq("continuarCuestionario")
                            : t("cuestionarioWeb.comenzarCuestionario")}
                      </span>
                      {completed ? (
                        <IoCheckmarkCircle aria-hidden="true" />
                      ) : (
                        <IoArrowForwardCircleOutline aria-hidden="true" />
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
          <p className="cuestionario-web__confidential-note">
            {t("cuestionarioWeb.notaConfidencialidad")}
          </p>
        </div>
      )}

      {/* ── Preguntas ── */}
      {view === "questions" && activeQuestionnaire && (
        <div className="cuestionario-web__questions-shell">
          {/* Indicador de guardado automático */}
          {autoSaving && (
            <p className="cuestionario-web__autosave">
              {tq("guardandoParcial")}
            </p>
          )}

          <div className="cuestionario-web__questions-list">
            {visibleQuestions.map((question) => (
              <article
                key={getQuestionId(question)}
                className="cuestionario-web__question-card"
              >
                <div className="cuestionario-web__question-header">
                  <h2>
                    {getLocalized(question, "pregunta", "question", language)}
                  </h2>
                  {getLocalized(
                    question,
                    "explicacion_pregunta",
                    "explanation_question",
                    language,
                  ) && (
                    <button
                      type="button"
                      className="cuestionario-web__question-info"
                      title={getLocalized(
                        question,
                        "explicacion_pregunta",
                        "explanation_question",
                        language,
                      )}
                      aria-label={
                        language === "en"
                          ? "Show question information"
                          : "Mostrar información de la pregunta"
                      }
                      onClick={() =>
                        setQuestionInfo({
                          title: getLocalized(
                            question,
                            "pregunta",
                            "question",
                            language,
                          ),
                          text: getLocalized(
                            question,
                            "explicacion_pregunta",
                            "explanation_question",
                            language,
                          ),
                        })
                      }
                    >
                      <IoInformationCircleOutline aria-hidden="true" />
                    </button>
                  )}
                </div>
                {renderQuestionInput(question)}
              </article>
            ))}
          </div>

          <footer className="cuestionario-web__footer">
            <button
              type="button"
              className="cuestionario-web__nav-button cuestionario-web__nav-button--back"
              onClick={handleBack}
              disabled={currentPage === 0}
            >
              <IoChevronBack aria-hidden="true" />
              {t("comun.atras")}
            </button>

            <div className="cuestionario-web__dots" aria-hidden="true">
              {Array.from({ length: totalPages }).map((_, index) => (
                <span
                  key={index}
                  className={
                    index === currentPage
                      ? "cuestionario-web__dot cuestionario-web__dot--active"
                      : "cuestionario-web__dot"
                  }
                />
              ))}
            </div>

            {currentPage === totalPages - 1 ? (
              <button
                type="button"
                className="cuestionario-web__nav-button cuestionario-web__nav-button--next"
                onClick={handleRequestSubmit}
              >
                {t("cuestionarioWeb.enviar")}
                <IoChevronForward aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                className="cuestionario-web__nav-button cuestionario-web__nav-button--next"
                onClick={handleNext}
                disabled={autoSaving}
              >
                {autoSaving
                  ? tq("guardandoParcial")
                  : t("comun.siguiente")}
                <IoChevronForward aria-hidden="true" />
              </button>
            )}
          </footer>
        </div>
      )}

      {/* ── Modal: iniciar/repetir cuestionario ── */}
      {instructionNotice && (
        <Dialog
          onClose={
            instructionNotice.type === "denied"
              ? undefined
              : () => setInstructionNotice(null)
          }
        >
          <div
            className={`cuestionario-web__attempt-modal cuestionario-web__attempt-modal--${instructionNotice.type}`}
          >
            <img src={logoMenteConecta} alt="" aria-hidden="true" />
            <h2>
              {instructionNotice.type === "denied"
                ? t("cuestionarioWeb.accesoDenegado")
                : t("cuestionarioWeb.importanteTitulo")}
            </h2>
            {instructionNotice.type === "denied" ? (
              <p className="cuestionario-web__attempt-copy cuestionario-web__attempt-copy--danger">
                {t("cuestionarioWeb.oportunidadesAgotadas")}
              </p>
            ) : (
              <>
                <p className="cuestionario-web__attempt-copy cuestionario-web__attempt-copy--info">
                  {t("cuestionarioWeb.consentimientoNecesario")}
                </p>
                <p className="cuestionario-web__attempt-copy cuestionario-web__attempt-copy--warning">
                  {t("cuestionarioWeb.intentoDetectado")}
                </p>
              </>
            )}
            <strong className="cuestionario-web__attempt-number">
              {instructionNotice.remaining}
            </strong>
            <span className="cuestionario-web__attempt-label">
              {t("cuestionarioWeb.intentosRestantes")}
            </span>
            {instructionNotice.type === "denied" ? (
              <p className="cuestionario-web__attempt-footer">
                {t("cuestionarioWeb.cierreAutomatico")}
              </p>
            ) : (
              <button
                type="button"
                className="cuestionario-web__primary"
                onClick={() => setInstructionNotice(null)}
              >
                {t("comun.aceptar")}
              </button>
            )}
          </div>
        </Dialog>
      )}

      {questionnaireToStart && (
        <Dialog
          onClose={() => setQuestionnaireToStart(null)}
          accent={getQuestionnaireStyle(questionnaireToStart, language).color}
        >
          <div className="cuestionario-web__modal-copy">
            <img
              src={questionnaireAlertLogo}
              alt=""
              className={questionnaireAlertLogoClass}
              aria-hidden="true"
            />
            <h2>
              {getLocalized(questionnaireToStart, "titulo", "title", language)}
            </h2>
            <p>
              {Number(questionnaireToStart.estatus_usuario) === 1
                ? tq("repetirDetalle")
                : getLocalized(
                    questionnaireToStart,
                    "descripcion",
                    "description",
                    language,
                  )}
            </p>
            <button
              type="button"
              className="cuestionario-web__primary"
              onClick={() => loadQuestionnaire(questionnaireToStart)}
            >
              {Number(questionnaireToStart.estatus_usuario) === 1
                ? tq("repetir")
                : "Ok"}
            </button>
          </div>
        </Dialog>
      )}

      {/* ── Modal: confirmar envío ── */}
      {instructionDialogOpen && activeQuestionnaire && (
        <Dialog
          onClose={() => setInstructionDialogOpen(false)}
          accent={activeQuestionnaireStyle.color}
        >
          <div className="cuestionario-web__modal-copy">
            <img
              src={questionnaireAlertLogo}
              alt=""
              className={questionnaireAlertLogoClass}
              aria-hidden="true"
            />
            <h2>{instructionsTitle}</h2>
            <p>{activeQuestionnaireInstructions}</p>
            <button
              type="button"
              className="cuestionario-web__primary"
              onClick={() => setInstructionDialogOpen(false)}
            >
              {closeInstructionLabel}
            </button>
          </div>
        </Dialog>
      )}

      {questionInfo && (
        <Dialog onClose={() => setQuestionInfo(null)}>
          <div className="cuestionario-web__modal-copy">
            <IoInformationCircleOutline
              className="cuestionario-web__modal-info-icon"
              aria-hidden="true"
            />
            <h2>{questionInfo.title}</h2>
            <p>{questionInfo.text}</p>
            <button
              type="button"
              className="cuestionario-web__primary"
              onClick={() => setQuestionInfo(null)}
            >
              {closeInstructionLabel}
            </button>
          </div>
        </Dialog>
      )}

      {confirmSubmit && (
        <Dialog>
          <div className="cuestionario-web__modal-copy">
            <img src={logoMenteConecta} alt="" aria-hidden="true" />
            <h2>{t("cuestionarioWeb.finalizado")}</h2>
            <p>{t("cuestionarioWeb.seGuardaranPreguntas")}</p>
            <div className="cuestionario-web__modal-actions">
              <button
                type="button"
                className="cuestionario-web__secondary"
                onClick={() => setConfirmSubmit(false)}
                disabled={submitting}
              >
                {t("cuestionarioWeb.volver")}
              </button>
              <button
                type="button"
                className="cuestionario-web__primary"
                onClick={submitAnswers}
                disabled={submitting}
              >
                {submitting
                  ? t("cuestionarioWeb.guardando")
                  : t("comun.guardar")}
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {/* ── Alerta: éxito ── */}
      <AuthFeedbackDialog
        open={Boolean(successMessage)}
        tone="success"
        title={t("cuestionarioWeb.guardadoTitulo")}
        message={successMessage}
        actionLabel={t("cuestionarioWeb.continuar")}
        onAction={closeSuccess}
      />
      {completedNotice && (
        <Dialog>
          <div className="cuestionario-web__modal-copy">
            <img src={logoMenteConecta} alt="" aria-hidden="true" />
            <h2>{t("cuestionarioWeb.cuestionarioCompletado")}</h2>
            <div className="cuestionario-web__modal-actions">
              <button
                type="button"
                className="cuestionario-web__secondary"
                onClick={closeCompletedNotice}
              >
                {t("comun.cerrar")}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </section>
  );
}
