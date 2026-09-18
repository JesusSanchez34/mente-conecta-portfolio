import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './CategoryDetail.scss';
import Swal from 'sweetalert2';
import { useAuth } from '../../../../../hooks';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../../../../components/ui';
import {
  getCuestionariosPorSeccionApi,
  getPreguntasCuestionarioApi,
  getRespuestasUsuarioApi,
  guardarRespuestasUsuarioApi,
  modificarRespuestasUsuarioApi,
} from '../../../../../api/fase1/cuestionario';
import { FaClipboardList } from 'react-icons/fa';

export function CategoryDetail() {
  const navigate = useNavigate();
  const { category } = useParams();
  const location = useLocation();
  
  const fallbackMap = {
    'sociodemograficos': 1,
    'salud-mental': 2,
    'salud-fisica': 3,
    'determinantes-sociales': 4,
    'covid-salud-mental': 5,
    'nom-035': 7,
  };

  const sectionId = location.state?.sectionId || fallbackMap[category];
  const sectionTitle = location.state?.sectionTitle || '';
  const sectionDesc = location.state?.sectionDesc || '';

  const { t } = useTranslation();
  const { auth } = useAuth();

  const [stage, setStage] = useState('intro');
  const [formValues, setFormValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);

  const [questionnaires, setQuestionnaires] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [userResponseId, setUserResponseId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAlreadyCompletedModal, setShowAlreadyCompletedModal] = useState(false);
  const [showFinishConfirmModal, setShowFinishConfirmModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [missingQuestionsText, setMissingQuestionsText] = useState("");

  const getQuestionLabel = (q) => {
    return q?.pregunta || q?.label || '';
  };

  const getQuestionPlaceholder = (q) => {
    if (q?.placeholder) {
      return q.placeholder;
    }
    return '';
  };

  const getQuestionOptions = (q) => q.respuestas || q.options || [];

  const getQuestionOptionLabel = (q, option) => {
    return option.respuesta ?? option;
  };

  const renderSelectOptions = (question, qId) => {
    const qOptions = getQuestionOptions(question);

    if (!qOptions || qOptions.length === 0) {
      return (
        <div className="empty-options">
          {t('questionnaire.noOptions', { defaultValue: 'No hay opciones disponibles.' })}
        </div>
      );
    }

    return (
      <div className="option-card-group">
        {qOptions.map((option) => {
          const optVal = option.id !== undefined ? option.id : option;
          const label = getQuestionOptionLabel(question, option);
          const isSelected = String(formValues[qId] || '') === String(optVal);

          return (
            <button
              key={optVal}
              type="button"
              className={`option-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleChange(qId, optVal)}
            >
              <span className="option-card-text">{label}</span>
              <span className="option-card-check">{isSelected ? '✓' : ''}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const isSelectQuestion = (q) => getQuestionOptions(q).length > 0 || q.type === 'select';

  const getGuia2Instruction = (qNum) => {
    switch(qNum) {
      case 1: return "Para responder las preguntas siguientes considere las condiciones de su centro de trabajo, así como la cantidad y ritmo de trabajo.";
      case 10: return "Las preguntas siguientes están relacionadas con las actividades que realiza en su trabajo y las responsabilidades que tiene.";
      case 14: return "Las preguntas siguientes están relacionadas con el tiempo destinado a su trabajo y sus responsabilidades familiares.";
      case 18: return "Las preguntas siguientes están relacionadas con las decisiones que puede tomar en su trabajo.";
      case 23: return "Las preguntas siguientes están relacionadas con la capacitación e información que recibe sobre su trabajo.";
      case 28: return "Las preguntas siguientes se refieren a las relaciones con sus compañeros de trabajo y su jefe.";
      default: return null;
    }
  };

  const getGuia3Instruction = (qNum) => {
    switch(qNum) {
      case 1: return "Para responder las preguntas siguientes considere las condiciones ambientales de su centro de trabajo.";
      case 6: return "Para responder a las preguntas siguientes piense en la cantidad y ritmo de trabajo que tiene.";
      case 9: return "Las preguntas siguientes están relacionadas con el esfuerzo mental que le exige su trabajo.";
      case 13: return "Las preguntas siguientes están relacionadas con las actividades que realiza en su trabajo y las responsabilidades que tiene.";
      case 17: return "Las preguntas siguientes están relacionadas con su jornada de trabajo.";
      case 23: return "Las preguntas siguientes están relacionadas con las decisiones que puede tomar en su trabajo.";
      case 29: return "Las preguntas siguientes están relacionadas con cualquier tipo de cambio que ocurra en su trabajo (considere los últimos cambios realizados).";
      case 31: return "Las preguntas siguientes están relacionadas con la capacitación e información que se le proporciona sobre su trabajo.";
      case 37: return "Las preguntas siguientes están relacionadas con el o los jefes con quien tiene contacto.";
      case 42: return "Las preguntas siguientes se refieren a las relaciones con sus compañeros.";
      case 47: return "Las preguntas siguientes están relacionadas con la información que recibe sobre su rendimiento en el trabajo, el reconocimiento, el sentido de pertenencia y la estabilidad que le ofrece su trabajo.";
      case 57: return "Las preguntas siguientes están relacionadas con actos de violencia laboral (malos tratos, acoso, hostigamiento, acoso psicológico).";
      default: return null;
    }
  };

  useEffect(() => {
    if (!sectionId) return;

    const loadQuestionnaires = async () => {
      setLoadingData(true);
      try {
        if (sectionId && auth?.token) {
          const apiQuestionnaires = await getCuestionariosPorSeccionApi(auth.token, sectionId);
          if (apiQuestionnaires && apiQuestionnaires.length > 0) {
           
            const updatedQuestionnaires = await Promise.all(
              apiQuestionnaires.map(async (quest) => {
                try {
                  const userAnswers = await getRespuestasUsuarioApi(auth.token, auth.me.id, quest.id, null);
                  return {
                    ...quest,
                    estatusUsuario: userAnswers?.estatus_finalizado ?? 0,
                  };
                } catch (e) {
                  console.error(`Error al cargar respuestas del usuario para cuestionario ${quest.id}:`, e);
                  return {
                    ...quest,
                    estatusUsuario: 0,
                  };
                }
              })
            );
            setQuestionnaires(updatedQuestionnaires);
            setLoadingData(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error al cargar cuestionarios de la API, usando fallback:", error);
      }
      
      setQuestionnaires([]);
      setLoadingData(false);
    };

    setShowInstructions(false);
    
    loadQuestionnaires();
  }, [category, sectionId, auth?.token, refreshTrigger]);

  useEffect(() => {
    if (stage !== 'loading') return undefined;

    const loadQuestionsAndResponses = async () => {
      try {
        if (selectedSection && selectedSection.id && auth?.token) {
        
          const apiQuestions = await getPreguntasCuestionarioApi(auth.token, selectedSection.id);
          setQuestions(apiQuestions);

          
          const prevRespuestas = await getRespuestasUsuarioApi(
            auth.token,
            auth.me.id,
            selectedSection.id,
            null
          );

          if (prevRespuestas) {
            if (prevRespuestas.id) {
              setUserResponseId(prevRespuestas.id);
            } else {
              setUserResponseId(null);
            }

            if (prevRespuestas.respuestas_json) {
              const parsed = JSON.parse(prevRespuestas.respuestas_json);
              const initialFormValues = {};
              parsed.forEach((resp) => {
                initialFormValues[resp.preguntaId] = resp.respuestaId !== 0 ? resp.respuestaId : resp.respuestasUser;
              });
              setFormValues(initialFormValues);
            } else {
              setFormValues({});
            }
          } else {
            setUserResponseId(null);
            
            const initialValues = {};
            apiQuestions.forEach((q) => {
              initialValues[q.id] = '';
            });
            setFormValues(initialValues);
          }
        } else {
          setUserResponseId(null);
        
          setQuestions([]);
          setFormValues({});
        }
      } catch (error) {
        console.error("Error al cargar preguntas de la API, usando fallback:", error);
        setUserResponseId(null);
        setQuestions([]);
        setFormValues({});
      } finally {
        setStage('questionnaire');
      }
    };

    loadQuestionsAndResponses();
  }, [stage, selectedSection, auth?.token, auth?.me?.id]);

  const handleConfirmStart = () => {
    setCurrentPage(0);
    setStage('loading');
  };

  const handleChange = (id, value) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleExitAndSavePartial = async () => {
    setShowExitConfirm(false);
    
    if (selectedSection && selectedSection.id && auth?.token) {
      try {
        const respuestasList = [];

        for (const question of questions) {
          const value = formValues[question.id];
          if (value === undefined || value === null || value === '') {
            continue;
          }

          const qOptions = getQuestionOptions(question);
          if (qOptions.length > 0) {
            const optionId = Number(value);
            const optionObj = qOptions.find((opt) => opt.id === optionId);

            if (optionObj) {
              respuestasList.push({
                preguntaId: question.id,
                respuestaId: optionObj.id,
                respuestaMultiOpcion: "",
                respuestasUser: optionObj.respuesta,
                calificacion: optionObj.calificacion || 0,
              });
            }
          } else {
            respuestasList.push({
              preguntaId: question.id,
              respuestaId: 0,
              respuestaMultiOpcion: "",
              respuestasUser: String(value),
              calificacion: 0,
            });
          }
        }

        if (respuestasList.length > 0) {
          const payload = {
            id_usuario: auth.me.id,
            id_cuestionario: selectedSection.id,
            respuestas_json: JSON.stringify(respuestasList),
            estatus_finalizado: 0, // 0 = Incompleto (guarda progreso pero no marca completo)
            id_seccion: selectedSection.seccionId || sectionId,
          };

          if (userResponseId) {
            await modificarRespuestasUsuarioApi(auth.token, userResponseId, payload);
          } else {
            await guardarRespuestasUsuarioApi(auth.token, payload);
          }
        }
      } catch (error) {
        console.error("Error al guardar respuestas parciales al salir:", error);
      }
    }
    
    setStage('intro');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFinalSubmit = async () => {
    setShowFinishConfirmModal(false);

    if (selectedSection && selectedSection.id && auth?.token) {
      setStage('loading');
      try {
        const respuestasList = [];

        for (const question of questions) {
          const value = formValues[question.id];
          if (value === undefined || value === '') {
            continue;
          }

          const qOptions = getQuestionOptions(question);
          if (qOptions.length > 0) {
            const optionId = Number(value);
            const optionObj = qOptions.find((opt) => opt.id === optionId);

            if (optionObj) {
              respuestasList.push({
                preguntaId: question.id,
                respuestaId: optionObj.id,
                respuestaMultiOpcion: "",
                respuestasUser: optionObj.respuesta,
                calificacion: optionObj.calificacion || 0,
              });
            }
          } else {
            respuestasList.push({
              preguntaId: question.id,
              respuestaId: 0,
              respuestaMultiOpcion: "",
              respuestasUser: String(value),
              calificacion: 0,
            });
          }
        }

        const payload = {
          id_usuario: auth.me.id,
          id_cuestionario: selectedSection.id,
          respuestas_json: JSON.stringify(respuestasList),
          estatus_finalizado: 1, // 1 = Completado
          id_seccion: selectedSection.seccionId || sectionId,
        };

        if (userResponseId) {
          console.log("Modificando respuestas a la API:", userResponseId, payload);
          await modificarRespuestasUsuarioApi(auth.token, userResponseId, payload);
        } else {
          console.log("Guardando respuestas a la API:", payload);
          await guardarRespuestasUsuarioApi(auth.token, payload);
        }

        setSubmitted(true);
        setRefreshTrigger(prev => prev + 1);

        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: 'Tus respuestas han sido enviadas correctamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4DB6AC',
        }).then(() => {
          setStage('intro');
        });
      } catch (error) {
        console.error("Error al guardar respuestas:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar tus respuestas. Por favor intenta de nuevo.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2196F3',
        });
        setStage('questionnaire');
      }
    } else {
      setSubmitted(true);
      setStage('intro');
    }
  };

  const handleSubmitClick = (event) => {
    event.preventDefault();

    // Validar que todas las preguntas estén contestadas
    const unansweredQuestions = questions.filter(q => {
      const val = formValues[q.id];
      return val === undefined || val === null || val === '';
    });

    if (unansweredQuestions.length > 0) {
      const missingNumbers = unansweredQuestions.map(q => {
        const qLabel = getQuestionLabel(q);
        const matchNum = qLabel.match(/^(\d+)\.-/);
        return matchNum ? matchNum[1] : null;
      }).filter(Boolean);
      
      let text = "Por favor responde todas las preguntas antes de enviar.";
      if (missingNumbers.length > 0) {
        text = `Por favor responde todas las preguntas antes de enviar.\nFaltan las preguntas: ${missingNumbers.join(', ')}`;
      }
      setMissingQuestionsText(text);
      setShowIncompleteModal(true);
      return;
    }

    setShowFinishConfirmModal(true);
  };

  if (!sectionId) {
    return (
      <div className="category-detail-container">
        <div className="category-detail-header">
          <button className="back-btn" onClick={() => navigate('/personal')} aria-label={t('questionnaire.buttons.back', { defaultValue: 'Regresar' })}>
            <span className="arrow">←</span> {t('questionnaire.buttons.back', { defaultValue: 'Regresar' })}
          </button>
        </div>
        <div className="category-content">
          <h2>Sección no encontrada</h2>
          <p>La sección seleccionada no existe o no tiene un ID válido. Intenta seleccionar otra sección.</p>
        </div>
      </div>
    );
  }

  const title = sectionTitle || 'Sección Seleccionada';
  const description = sectionDesc || '';
  const introText = description;
  const categoryTitle = t(`category.${category}.title`, { defaultValue: title });
  const categoryDescription = t(`category.${category}.description`, { defaultValue: description });
  const categoryIntroText = t(`category.${category}.introText`, { defaultValue: introText });

  const selectedSectionTitle = selectedSectionIndex !== null
    ? t(`category.${category}.questionnaires.${selectedSectionIndex}.title`, {
        defaultValue: selectedSection?.titulo || selectedSection?.title || title,
      })
    : selectedSection?.titulo || selectedSection?.title || title;

  const selectedSectionDescription = selectedSectionIndex !== null
    ? t(`category.${category}.questionnaires.${selectedSectionIndex}.description`, {
        defaultValue: selectedSection?.descripcion || selectedSection?.description || introText,
      })
    : selectedSection?.descripcion || selectedSection?.description || categoryIntroText;

  const categoryInstructions = t(`category.${category}.instructions`, {
    defaultValue: selectedSection?.instrucciones || selectedSection?.instructions || categoryIntroText,
  });

  const selectedSectionInstructions = selectedSectionIndex !== null
    ? t(`category.${category}.questionnaires.${selectedSectionIndex}.instructions`, {
        defaultValue: categoryInstructions,
      })
    : categoryInstructions;

  const handleSelectSection = (section, index) => {
    setSelectedSection(section);
    setSelectedSectionIndex(index);
    setSubmitted(false);
    if (section.estatusUsuario === 1) {
      setShowAlreadyCompletedModal(true);
    } else {
      setStage('confirm');
    }
  };

  const renderQuestionnaireForm = () => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(questions.length / itemsPerPage);
    const visibleQuestions = questions.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
      <div className="questionnaire-screen">
          <div className="questionnaire-header">
            <div>
              <span className={`cd-category-badge border-azul`}>{t('questionnaire.label', { defaultValue: 'Cuestionario' })}</span>
              <h3>{t(`category.${category}.title`, { defaultValue: selectedSection?.titulo || selectedSection?.title || title })}</h3>
              <p>
                {selectedSection
                  ? t('questionnaire.respondForSection', { section: selectedSectionTitle })
                  : t('questionnaire.respondBelow', { defaultValue: 'Responde las preguntas que aparecen a continuación para completar el cuestionario.' })}
              </p>
            </div>
            <div className="questionnaire-actions-header" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {(selectedSection?.instrucciones || selectedSection?.instructions) && (
                <button
                  type="button"
                  className="instructions-btn"
                  onClick={() => setShowInstructions(true)}
                >
                  💡 {t('questionnaire.instructions', { defaultValue: 'Instrucciones' })}
                </button>
              )}
            </div>
          </div>

        <form className="questionnaire-form" onSubmit={handleSubmitClick}>
          {submitted && (
            <div className="submit-message">
              {t('questionnaire.savedSuccess', { defaultValue: '¡Tus respuestas se han guardado correctamente!' })}
            </div>
          )}

          {visibleQuestions?.map((question) => {
            const qId = question.id;
            let qLabel = getQuestionLabel(question);
            const qOptions = getQuestionOptions(question);
            const isSelect = isSelectQuestion(question);

            let explanation = question.explicacion_pregunta || '';
            let qNum = null;
            const matchNum = qLabel.match(/^(.*?)(?=\s*\d+\.\s*-|\s*\d+\.-)/);
            
            if (!explanation) {
              if (matchNum && matchNum[1].trim().length > 10) {
                explanation = matchNum[1].trim();
                qLabel = qLabel.substring(matchNum[1].length).trim();
              }
            } else if (qLabel.includes(explanation)) {
              qLabel = qLabel.replace(explanation, '').trim();
            }

            // Extraer el número exacto de la pregunta para inyectar instrucciones de Guía 2
            const numExtracted = qLabel.match(/^(\d+)\.-/);
            if (numExtracted) {
              qNum = parseInt(numExtracted[1], 10);
            }

            const titleLower = selectedSection?.title?.toLowerCase() || '';
            const isGuia3 = titleLower.includes('gr-iii') || titleLower.includes('entorno organizacional') || titleLower.includes('guía de referencia iii');
            const isGuia2 = !isGuia3 && (titleLower.includes('gr-ii') || titleLower.includes('factores de riesgo') || titleLower.includes('guía de referencia ii'));
            
            let injectedInstruction = null;
            if (isGuia2 && qNum) {
              injectedInstruction = getGuia2Instruction(qNum);
            } else if (isGuia3 && qNum) {
              injectedInstruction = getGuia3Instruction(qNum);
            }

            // Sobrescribir preguntas filtro de la Guía 2 y 3 para eliminar textos falsos
            if (isGuia2 || isGuia3) {
              if (qLabel.toLowerCase().includes('brindar servicio a clientes')) {
                injectedInstruction = "Las preguntas siguientes están relacionadas con la atención a clientes y usuarios.";
                qLabel = "En mi trabajo debo brindar servicio a clientes o usuarios:";
                explanation = "Si su respuesta fue \"SÍ\", responda las preguntas siguientes. Si su respuesta fue \"NO\" pase a las preguntas de la sección siguiente.";
              } else if (qLabel.toLowerCase().includes('jefe de otros trabajadores')) {
                injectedInstruction = null;
                qLabel = "Soy jefe de otros trabajadores:";
                explanation = isGuia3
                  ? "Si su respuesta fue \"SÍ\", responda las preguntas siguientes. Si su respuesta fue \"NO\", ha concluido el cuestionario.\n\nLas preguntas siguientes están relacionadas con las actitudes de las personas que supervisa."
                  : "Si su respuesta fue \"SÍ\", responda las preguntas siguientes. Si su respuesta fue \"NO\", ha concluido el cuestionario.\n\nLas siguientes preguntas están relacionadas con las actitudes de los trabajadores que supervisa.";
              }
            }

            const isFilterQuestion = (isGuia2 || isGuia3) && (qLabel.toLowerCase().includes('brindar servicio a clientes') || qLabel.toLowerCase().includes('jefe de otros trabajadores'));

            return (
              <React.Fragment key={qId}>
                {injectedInstruction && (
                  <div className="section-divider-instruction" style={{ backgroundColor: '#1e40af', padding: '16px 20px', borderRadius: '8px', marginBottom: '32px', marginTop: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <p style={{ fontSize: '18px', color: '#ffffff', fontWeight: '500', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      {injectedInstruction}
                    </p>
                  </div>
                )}
                <div className="question-item" style={{ marginBottom: '32px' }}>
                  {!isFilterQuestion && explanation && !injectedInstruction && (
                    <div className="question-explanation-box" style={{ backgroundColor: '#1e40af', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                      <p style={{ fontSize: '18px', color: '#ffffff', fontWeight: '500', margin: 0, lineHeight: '1.6' }}>
                        {explanation}
                      </p>
                    </div>
                  )}
                <label htmlFor={qId} style={{ fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '16px' }}>{qLabel}</label>

                {isSelect ? (
                  renderSelectOptions(question, qId)
                ) : (
                  <input
                    id={qId}
                    type={question.type || 'text'}
                    placeholder={getQuestionPlaceholder(question) || t('questionnaire.writeAnswer', { defaultValue: 'Escribe tu respuesta...' })}
                    value={formValues[qId] || ''}
                    onChange={(event) => handleChange(qId, event.target.value)}
                  />
                )}

                {isFilterQuestion && explanation && (
                  <div className="question-explanation-box" style={{ backgroundColor: '#1e40af', padding: '16px 20px', borderRadius: '8px', marginTop: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <p style={{ fontSize: '18px', color: '#ffffff', fontWeight: '500', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      {explanation}
                    </p>
                  </div>
                )}
              </div>
              </React.Fragment>
            );
          })}

          {totalPages > 1 && (
            <div className="pagination-container">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pagination-number ${currentPage === i ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentPage(i);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              {currentPage > 0 ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setCurrentPage(prev => prev - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ marginTop: 0 }}
              >
                {t('questionnaire.prev', { defaultValue: 'Anterior' })}
              </button>
            ) : (
              <div />
            )}

            {currentPage < totalPages - 1 ? (
                <button
                  type="button"
                  className="btn-start"
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {t('questionnaire.next', { defaultValue: 'Siguiente' })}
                </button>
            ) : (
              <button type="submit" className="btn-start">
                {t('questionnaire.submit', { defaultValue: 'Completar' })}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="category-detail-container">
      <div className="category-detail-header">
        <button
          className="back-button"
          onClick={() => {
            if (stage === 'questionnaire') {
              setShowExitConfirm(true);
            } else if (stage !== 'intro') {
              setStage('intro');
            } else {
              navigate('/personal');
            }
          }}
        >
          {t('common.back', { defaultValue: '← Volver' })}
        </button>
        <h2>{categoryTitle}</h2>
        <div className="category-detail-header-actions">
          <LanguageSelector lightBg={true} />
        </div>
      </div>

      {stage === 'questionnaire' ? (
        <div key="stage-questionnaire">
          {renderQuestionnaireForm()}
        </div>
      ) : category === 'nom-035' ? (
        <div key="stage-nom035" className="category-detail-content" style={{ maxWidth: '1000px' }}>
          {/* Banner */}
          <div className="nom035-info-banner">
            <div className="nom035-info-icon">i</div>
            <div>
              <strong>{t('nom035.evaluationPeriod', { defaultValue: 'Periodo de evaluación 2026.' })}</strong> {t('nom035.bannerText', { defaultValue: 'Tu participación es fundamental. La información que proporcionas es estrictamente confidencial y se usa exclusivamente para mejorar el ambiente de trabajo.' })}
            </div>
          </div>

          {loadingData ? (
            <div className="category-detail-empty">
              <p>{t('category.loadingQuestionnaires', { defaultValue: 'Cargando cuestionarios...' })}</p>
            </div>
          ) : questionnaires.length === 0 ? (
            <div className="category-detail-empty">
              <p>{t('category.noQuestionnaires', { defaultValue: 'No hay cuestionarios disponibles en esta sección.' })}</p>
            </div>
          ) : (
            <div className="nom035-quests-grid">
              {questionnaires.map((section, index) => {
                const isCompleted = section.estatusUsuario === 1;
                const rawTitle = section.titulo || section.title || "";
                
                let cardClass = index === 0 ? 'gr1' : 'gr2';
                let shortTitle = "Cuestionario";
                let iconColor = "#cc2b2b";
                
                if (index === 0) {
                  shortTitle = "GR-I • Cuestionario ATS";
                  iconColor = "#cc2b2b";
                } else {
                  if (rawTitle.toLowerCase().includes('entorno')) {
                    shortTitle = "GR-III • Entorno Organizacional";
                    cardClass = 'gr3';
                    iconColor = "#1a569d";
                  } else {
                    shortTitle = "GR-II • Factores de Riesgo";
                    cardClass = 'gr2';
                    iconColor = "#1a569d";
                  }
                }
                
                return (
                  <div key={`quest-${section.id}-${index}`} className={`nom035-quest-card ${cardClass}`}>
                    <div className="nom035-quest-header">
                      <div className="nom035-quest-title">
                        <div className="icon-circle" style={{ backgroundColor: iconColor }}></div>
                        {shortTitle}
                      </div>
                      <span className={`nom035-badge ${isCompleted ? 'completed' : 'pending'}`}>
                        {isCompleted ? t('questionnaire.status.completeText', { defaultValue: 'Completado' }) : t('questionnaire.status.pendingText', { defaultValue: 'Pendiente' })}
                      </span>
                    </div>
                    
                    <div className="nom035-quest-desc">
                      {t(`category.${category}.questionnaires.${index}.description`, { defaultValue: section.descripcion || section.description || rawTitle })}
                    </div>

                    <button 
                      className="nom035-quest-btn"
                      onClick={() => handleSelectSection(section, index)}
                    >
                      {isCompleted ? t('questionnaire.status.viewAgain', { defaultValue: 'Ver cuestionario →' }) : t('questionnaire.status.startNow', { defaultValue: 'Contestar ahora →' })}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Cards */}
          <div className="nom035-bottom-grid">
            <div className="nom035-bottom-card policy">
              <div className="nom035-bottom-title">
                <FaClipboardList className="policy-icon" /> {t('nom035.policyTitle', { defaultValue: 'Política de prevención' })}
              </div>
              <div className="nom035-bottom-desc">
                {t('nom035.policyDesc', { defaultValue: 'Conoce los compromisos y principios de tu empresa conforme a la NOM-035.' })}
              </div>
              <Link to="/personal/politica" className="nom035-bottom-btn">
                {t('nom035.policyBtn', { defaultValue: 'Ver política' })}
              </Link>
            </div>

            <div className="nom035-bottom-card report">
              <div className="nom035-bottom-title">
                <span className="sos-icon">SOS</span> {t('nom035.reportTitle', { defaultValue: '¿Necesitas reportar algo?' })}
              </div>
              <div className="nom035-bottom-desc">
                {t('nom035.reportDesc', { defaultValue: 'Reporta situaciones de acoso, violencia o malestar de forma anónima y confidencial.' })}
              </div>
              <Link to="/personal/reporte-situacion" className="nom035-bottom-btn">
                {t('nom035.reportBtn', { defaultValue: 'Reportar situación →' })}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div key="stage-other" className="category-detail-content">
          <p className="category-detail-description">{categoryDescription}</p>
          <p className="category-detail-intro">{categoryIntroText}</p>

          {loadingData ? (
            <div className="category-detail-empty">
              <p>{t('category.loadingQuestionnaires', { defaultValue: 'Cargando cuestionarios...' })}</p>
            </div>
          ) : questionnaires.length === 0 ? (
            <div className="category-detail-empty">
              <p>{t('category.noQuestionnaires', { defaultValue: 'No hay cuestionarios disponibles en esta sección.' })}</p>
            </div>
          ) : (
            <div className="section-cards-grid">
              {questionnaires.map((section, index) => {
                const isCompleted = section.estatusUsuario === 1;
                return (
                  <button
                    key={`section-${section.id}-${index}`}
                    type="button"
                    className={`cd-section-card ${isCompleted ? 'completed-card' : ''}`}
                    onClick={() => handleSelectSection(section, index)}
                  >
                    <span className="section-card-title">
                      {t(`category.${category}.questionnaires.${index}.title`, {
                        defaultValue: section.titulo || section.title,
                      })}
                    </span>
                    <span className="section-card-action">
                      {isCompleted ? (
                        <>
                          <span className="section-card-icon" style={{ color: '#eae5f3', marginRight: '6px' }}>✔</span>
                          <span style={{ color: '#28a745', fontWeight: 'bold' }}>{t('questionnaire.status.complete', { defaultValue: 'COMPLETO' })}</span>
                        </>
                      ) : (
                        <>
                          <span className="section-card-icon">▶</span>
                          {t('questionnaire.status.start', { defaultValue: 'INICIAR' })}
                        </>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {stage === 'confirm' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-top">
              <span className="modal-icon">💡</span>
            </div>
            <div className="modal-card-body">
              <h3 style={{ fontWeight: '600', fontSize: '20px', color: '#1e293b', marginBottom: '12px' }}>{selectedSectionTitle}</h3>
              <p>{selectedSectionDescription}</p>
              <button className="modal-button" type="button" onClick={handleConfirmStart}>
                {t('common.ok', { defaultValue: 'Ok' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="modal-overlay" style={{ zIndex: 40 }}>
          <div className="modal-card">
            <div className="modal-top" style={{ backgroundColor: '#f5c74a' }}>
              <span className="modal-icon">💡</span>
            </div>
            <div className="modal-card-body">
              <h3 style={{ fontWeight: '600', fontSize: '22px', color: '#1e293b', marginBottom: '16px' }}>
                {t('questionnaire.instructions', { defaultValue: 'Instrucciones' })}
              </h3>
              <p style={{ color: '#5f5c73', fontSize: '16px', lineHeight: '1.7', marginBottom: '26px' }}>
                {selectedSectionInstructions}
              </p>
              <button
                className="modal-button"
                type="button"
                onClick={() => setShowInstructions(false)}
                style={{ backgroundColor: '#2196f3', borderRadius: '18px', padding: '14px 36px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
              >
                {t('common.close', { defaultValue: 'Cerrar' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'loading' && (
        <div className="modal-overlay loading-overlay">
          <div className="loading-card">
            <div className="loading-top">
              <div className="loading-animation" />
            </div>
            <div className="loading-card-body">
              <h3>{t('category.loadingQuestions', { defaultValue: 'Cargando preguntas' })}</h3>
              <p>...</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ¿ESTÁS SEGURO QUE DESEAS SALIR? */}
      {showExitConfirm && (
        <div className="modal-overlay" style={{ zIndex: 50 }}>
          <div className="modal-card">
            <div className="modal-top" style={{ backgroundColor: '#f5c74a' }}>
              <span className="modal-icon" style={{ fontSize: '70px', animation: 'bounce 2s infinite' }}>💡</span>
            </div>
            <div className="modal-card-body">
              <h3 style={{ fontWeight: '600', fontSize: '20px', color: '#1e293b', marginBottom: '12px' }}>
                ¿Estás seguro que deseas salir?
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                Se guardarán tus preguntas al continuar.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <button
                  className="modal-cancel-btn"
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                >
                  Cancelar
                </button>
                <button
                  className="modal-action-btn"
                  type="button"
                  onClick={handleExitAndSavePartial}
                  style={{ backgroundColor: '#2196f3' }}
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FINALIZADO / CUESTIONARIO COMPLETO (REDO) */}
      {showAlreadyCompletedModal && (
        <div className="modal-overlay" style={{ zIndex: 50 }}>
          <div className="modal-card">
            <div className="modal-top" style={{ backgroundColor: '#2ecc71', flexDirection: 'column' }}>
              <div className="concentric-circle">
                <div className="inner-concentric"></div>
              </div>
            </div>
            <div className="modal-card-body">
              <h3 style={{ fontWeight: 'bold', fontSize: '24px', color: '#1f1a38', marginBottom: '12px' }}>
                Finalizado
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                Cuestionario Completo
              </p>
              <button
                className="modal-action-btn"
                type="button"
                onClick={() => {
                  setShowAlreadyCompletedModal(false);
                }}
                style={{ backgroundColor: '#2196f3', minWidth: '120px' }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: FINALIZADO / EL PROCESO HA SIDO FINALIZADO EXITOSAMENTE */}
      {showFinishConfirmModal && (
        <div className="modal-overlay" style={{ zIndex: 50 }}>
          <div className="modal-card">
            <div className="modal-top" style={{ backgroundColor: '#26a69a', flexDirection: 'column' }}>
              <div className="concentric-circle-teal">
                <div className="center-dot"></div>
              </div>
            </div>
            <div className="modal-card-body">
              <h3 style={{ fontWeight: 'bold', fontSize: '24px', color: '#1f1a38', marginBottom: '12px' }}>
                Finalizado
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                El proceso ha sido finalizado exitosamente
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <button
                  className="modal-cancel-btn"
                  type="button"
                  onClick={() => setShowFinishConfirmModal(false)}
                >
                  Volver
                </button>
                <button
                  className="modal-action-btn"
                  type="button"
                  onClick={handleFinalSubmit}
                  style={{ backgroundColor: '#2196f3' }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 4: RESPUESTAS INCOMPLETAS (ESTÉTICO) */}
      {showIncompleteModal && (
        <div className="modal-overlay" style={{ zIndex: 60 }}>
          <div className="modal-card">
            <div className="modal-top" style={{ backgroundColor: '#f39c12', flexDirection: 'column' }}>
              <div className="warning-circle">
                <div className="warning-icon">!</div>
              </div>
            </div>
            <div className="modal-card-body">
              <h3 style={{ fontWeight: 'bold', fontSize: '24px', color: '#1f1a38', marginBottom: '12px' }}>
                Respuestas incompletas
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px', whiteSpace: 'pre-line' }}>
                {missingQuestionsText || "Por favor responde todas las preguntas antes de enviar."}
              </p>
              <button
                className="modal-action-btn"
                type="button"
                onClick={() => setShowIncompleteModal(false)}
                style={{ backgroundColor: '#2196f3', minWidth: '130px' }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
