import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './categoryDetailNX.scss';
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
} from '../../../../../api/neuroXpand/cuestionarionx.service';

export function CategoryDetailNX() {
  const navigate = useNavigate();
  const { category } = useParams();
  const location = useLocation();
  const stateFromNav = location.state || {};
  const savedStateStr = sessionStorage.getItem(`nx_section_${category}`);
  const savedState = savedStateStr ? JSON.parse(savedStateStr) : {};
  const sectionId = stateFromNav.sectionId || savedState.sectionId;
  const sectionTitle = stateFromNav.sectionTitle || savedState.sectionTitle;
  const sectionDesc = stateFromNav.sectionDesc || savedState.sectionDesc;
  useEffect(() => {
    if (sectionId) {
      sessionStorage.setItem(`nx_section_${category}`, JSON.stringify({ sectionId, sectionTitle, sectionDesc }));
    }
  }, [sectionId, sectionTitle, sectionDesc, category]);

  const { t, i18n } = useTranslation();
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
  const [activeTooltip, setActiveTooltip] = useState(null);

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
        <div className="empty-options-categoryNX">
          {t('questionnaire.noOptions', { defaultValue: 'No hay opciones disponibles.' })}
        </div>
      );
    }

    const selectedValue = formValues[qId];
    const selectedOptionObj = qOptions.find(opt => String(opt.id !== undefined ? opt.id : opt) === String(selectedValue));
    let isOpenAnswer = false;
    
    if (selectedOptionObj) {
        isOpenAnswer = selectedOptionObj.especificar_respuesta === true;
    }

    return (
      <div style={{ width: '100%' }}>
        <div className="option-card-group-categoryNX">
          {qOptions.map((option) => {
            const optVal = option.id !== undefined ? option.id : option;
            const label = getQuestionOptionLabel(question, option);
            const isMultiple = question.opcion_multiple === true;  
            const isSelected = isMultiple 
              ? (Array.isArray(formValues[qId]) && formValues[qId].map(String).includes(String(optVal)))
              : String(formValues[qId] || '') === String(optVal);

            return (
              <button
                key={optVal}
                type="button"
                className={`option-card-categoryNX ${isSelected ? 'selected' : ''}`}
                onClick={() => handleChange(qId, optVal, isMultiple)} 
              >
                <span className="option-card-text-categoryNX">{label}</span>
                <span className="option-card-check-categoryNX">{isSelected ? '✓' : ''}</span>
              </button>
            );
          })}
        </div>
        {isOpenAnswer && (
            <input
                type="text"
                placeholder={
                    (i18n.language?.startsWith('en') ? question.detail_specification : question.detalle_especificacion) 
                    || t('questionnaire.specify', { defaultValue: 'Por favor, especifique su respuesta...' })
                }
                value={formValues[`${qId}_open`] || ''}
                onChange={(event) => handleChange(`${qId}_open`, event.target.value)}
                style={{ 
                    marginTop: '15px', 
                    width: '100%', 
                    padding: '14px 20px', 
                    borderRadius: '8px', 
                    border: '1px solid #c5b4e3',
                    fontSize: '1rem',
                    color: '#1a1a1a',
                    outline: 'none',
                    backgroundColor: '#faf8ff'
                }}
            />
        )}
      </div>
    );
  };

  const isSelectQuestion = (q) => getQuestionOptions(q).length > 0 || q.type === 'select';

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
                const q = apiQuestions.find(aq => aq.id === resp.preguntaId);
                const isMult = q && q.opcion_multiple === true;
                const val = resp.respuestaId !== 0 ? resp.respuestaId : resp.respuestasUser;

                if (isMult) {
                    if (!initialFormValues[resp.preguntaId]) initialFormValues[resp.preguntaId] = [];
                    initialFormValues[resp.preguntaId].push(val);
                } else {
                    initialFormValues[resp.preguntaId] = val;
                }
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


  useEffect(() => {
    if (stage === 'questionnaire') {
      window.history.pushState(null, null, window.location.pathname);

      const handleBrowserBack = (event) => {
        window.history.pushState(null, null, window.location.pathname);
        setShowExitConfirm(true);
      };

      window.addEventListener('popstate', handleBrowserBack);
      return () => {
        window.removeEventListener('popstate', handleBrowserBack);
      };
    }
  }, [stage]);

  const handleConfirmStart = () => {
    setCurrentPage(0);
    setSubmitted(false); 
    setStage('loading');
  };

const handleChange = (id, value, isMultiple = false) => {
    setFormValues((prev) => {
      if (isMultiple) {
        const currentVals = Array.isArray(prev[id]) ? prev[id] : (prev[id] ? [prev[id]] : []);
        if (currentVals.includes(value)) {
          return { ...prev, [id]: currentVals.filter(v => String(v) !== String(value)) };
        } else {
          return { ...prev, [id]: [...currentVals, value] };
        }
      }
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const handleExitAndSavePartial = async () => {
    setShowExitConfirm(false);

    if (selectedSection && selectedSection.id && auth?.token) {
      try {
        const respuestasList = [];

        for (const question of questions) {
          const value = formValues[question.id];
          if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
            continue;
          }
          const qOptions = getQuestionOptions(question);
          const isMultiple = question.opcion_multiple === true;

          if (qOptions.length > 0) {
            const valuesArray = isMultiple && Array.isArray(value) ? value : [value];

            valuesArray.forEach(val => {
              const optionId = Number(val);
              const optionObj = qOptions.find((opt) => opt.id === optionId);

              if (optionObj) {
                const isOptionOpen = optionObj.especificar_respuesta === true;
                const textoAbierto = isOptionOpen ? (formValues[`${question.id}_open`] || "") : "";
                respuestasList.push({
                  preguntaId: question.id,
                  respuestaId: optionObj.id,
                  respuestaMultiOpcion: "",
                  respuestasUser: textoAbierto,
                  calificacion: optionObj.ponderacion ?? optionObj.calificacion ?? 0,
                });
              }
            });
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
            estatus_finalizado: 0,
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
                respuestasUser: "",
                calificacion: optionObj.ponderacion ?? optionObj.calificacion ?? 0,
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

    const unansweredQuestions = questions.filter(q => {
      const val = formValues[q.id];
      return val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
    });

    if (unansweredQuestions.length > 0) {
      setShowIncompleteModal(true);
      return;
    }

    setShowFinishConfirmModal(true);
  };

  if (!sectionId) {
    return (
      <div className="categoryNX-detail-container">
        <div className="categoryNX-detail-header">
          <button className="back-button-categoryNX" onClick={() => navigate('/personalNX')} aria-label={t('questionnaire.buttons.back', { defaultValue: 'Regresar' })}>
            <span className="arrow">←</span> {t('questionnaire.buttons.back', { defaultValue: 'Regresar' })}
          </button>
        </div>
        <div className="categoryNX-detail-content">
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

  const selectedSectionTitle = selectedSection?.titulo || selectedSection?.title || title;

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
      <div className="questionnaire-screen-categoryNX">
        <div className="questionnaire-header-categoryNX">
          <div>
            <span className={`categoryNX-card-label border-azul`}>{t('questionnaire.label', { defaultValue: 'Cuestionario' })}</span>
            <h3>{selectedSection?.titulo || selectedSection?.title || title}</h3>
          </div>
          <div className="questionnaire-actions-header-categoryNX">
            {(selectedSection?.instrucciones || selectedSection?.instructions) && (
              <button
                type="button"
                className="instructions-btn-categoryNX"
                onClick={() => setShowInstructions(true)}
              >
                💡 {t('questionnaire.instructions', { defaultValue: 'Instrucciones' })}
              </button>
            )}
          </div>
        </div>

        <form className="questionnaire-form-categoryNX" onSubmit={handleSubmitClick}>
          {submitted && (
            <div className="submit-message-categoryNX">
              {t('questionnaire.savedSuccess', { defaultValue: '¡Tus respuestas se han guardado correctamente!' })}
            </div>
          )}

          {visibleQuestions?.map((question) => {
            const qId = question.id;
            const qLabel = getQuestionLabel(question);
            const isSelect = isSelectQuestion(question);

            const hasExplanation = question.explicacion_pregunta || question.explanation_question;

            return (
              <div className="question-item-categoryNX" key={qId} style={{ position: 'relative' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <label htmlFor={qId} style={{ margin: 0, flex: 1 }}>{qLabel}</label>

                  {hasExplanation && (
                    <div style={{ position: 'relative', marginLeft: '10px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTooltip(activeTooltip === qId ? null : qId);
                        }}
                        style={{
                          background: '#e91e63',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: 0,
                          flexShrink: 0
                        }}
                        aria-label="Información adicional"
                      >
                        i
                      </button>

                      {activeTooltip === qId && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          right: '0',
                          marginTop: '12px',
                          backgroundColor: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '12px',
                          padding: '16px',
                          width: '280px',
                          boxShadow: '0px 6px 16px rgba(0,0,0,0.12)',
                          zIndex: 100,
                          fontSize: '0.9rem',
                          color: '#333',
                          lineHeight: '1.5',
                          textAlign: 'justify'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '6px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: 'white',
                            borderLeft: '1px solid #e0e0e0',
                            borderTop: '1px solid #e0e0e0',
                            transform: 'rotate(45deg)'
                          }}></div>
                          
                          <div style={{ position: 'relative', zIndex: 2 }}>
                            {i18n.language?.startsWith('en') 
                                ? (question.explanation_question || question.explicacion_pregunta) 
                                : (question.explicacion_pregunta || question.explanation_question)
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isSelect ? (
                  renderSelectOptions(question, qId)
                ) : (
                  <input
                    id={qId}
                    type={(() => {
                      const label = qLabel.toLowerCase();
                      const original = question.pregunta ? question.pregunta.toLowerCase() : '';
                      
                      const isDate = label.includes('fecha') || label.includes('date') || original.includes('fecha') || question.type === 'date';
                      const isDuration = label.includes('cuántas') || label.includes('cuantas') || label.includes('horas') || label.includes('hours') || label.includes('how many');            
                      const isTime = (label.includes('hora') || label.includes('time') || original.includes('hora') || question.type === 'time') && !isDuration;

                      if (isDate) return 'date';
                      if (isTime) return 'time';
                      return question.type || 'text';
                    })()}
                    placeholder={getQuestionPlaceholder(question) || t('questionnaire.writeAnswer', { defaultValue: 'Escribe tu respuesta...' })}
                    value={formValues[qId] || ''}
                    onChange={(event) => handleChange(qId, event.target.value)}
                  />
                )}
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="pagination-container-categoryNX">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pagination-number-categoryNX ${currentPage === i ? 'active' : ''}`}
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

          <div className="form-actions-categoryNX" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {currentPage > 0 ? (
              <button
                type="button"
                className="btn-secondary-categoryNX"
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
                className="btn-start-categoryNX"
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentPage(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {t('questionnaire.next', { defaultValue: 'Siguiente' })}
              </button>
           ) : (
              <button
                type="button" 
                className="btn-start-categoryNX"
                onClick={handleSubmitClick} 
              >
                {t('questionnaire.submit', { defaultValue: 'Completar' })}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="categoryNX-detail-container">
      <div className="categoryNX-detail-header">
        {/* Ruta actualizada a NX */}
        <button
          className="back-button-categoryNX"
          onClick={() => {
            if (stage === 'questionnaire') {
              setShowExitConfirm(true);
            } else {
              navigate('/personalNX');
            }
          }}
        >
          {t('common.back', { defaultValue: '← Volver' })}
        </button>
        <h2>{categoryTitle}</h2>
        <div className="categoryNX-detail-header-actions">
          <LanguageSelector lightBg={true} />
        </div>
      </div>

      {stage === 'questionnaire' ? (
        renderQuestionnaireForm()
      ) : (
        <div className="categoryNX-detail-content">
          <p className="categoryNX-card p">{categoryDescription}</p>
          
          {loadingData ? (
            <div className="categoryNX-detail-empty">
              <p>{t('category.loadingQuestionnaires', { defaultValue: 'Cargando cuestionarios...' })}</p>
            </div>
          ) : questionnaires.length === 0 ? (
            <div className="categoryNX-detail-empty">
              <p>{t('category.noQuestionnaires', { defaultValue: 'No hay cuestionarios disponibles en esta sección.' })}</p>
            </div>
          ) : (
            <div className="section-cards-grid-categoryNX">
              {questionnaires.map((section, index) => {
                const isCompleted = section.estatusUsuario === 1;
                return (
                  <button
                    key={index}
                    type="button"
                    className={`cd-section-card-categoryNX ${isCompleted ? 'completed-card' : ''}`}
                    onClick={() => handleSelectSection(section, index)}
                  >
                    <span className="section-card-title-categoryNX">
                      {section.titulo || section.title}
                    </span>
                    <span className="section-card-action-categoryNX">
                      {isCompleted ? (
                        <>
                          <span className="section-card-icon-categoryNX" style={{ color: '#eae5f3', marginRight: '6px' }}>✔</span>
                          <span style={{ color: '#28a745', fontWeight: 'bold' }}>{t('questionnaire.status.complete', { defaultValue: 'COMPLETO' })}</span>
                        </>
                      ) : (
                        <>
                          <span className="section-card-icon-categoryNX">▶</span>
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
        <div className="modal-overlay-categoryNX">
          <div className="modal-card-categoryNX">
            <div className="modal-top-categoryNX">
              <span className="modal-icon-categoryNX">💡</span>
            </div>
            <div className="modal-card-body-categoryNX">
              <h3>{selectedSectionTitle}</h3>
              <p>{selectedSectionDescription}</p>
              <button className="modal-button-categoryNX" type="button" onClick={handleConfirmStart}>
                {t('common.ok', { defaultValue: 'Ok' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="modal-overlay-categoryNX" style={{ zIndex: 40 }}>
          <div className="modal-card-categoryNX">
            <div className="modal-top-categoryNX" style={{ backgroundColor: '#f5c74a' }}>
              <span className="modal-icon-categoryNX">💡</span>
            </div>
            <div className="modal-card-body-categoryNX">
              <h3 style={{ fontWeight: 'bold', fontSize: '28px', color: '#1f1a38', marginBottom: '16px' }}>
                {t('questionnaire.instructions', { defaultValue: 'Instrucciones' })}
              </h3>
              <p style={{ color: '#5f5c73', fontSize: '16px', lineHeight: '1.7', marginBottom: '26px' }}>
                {selectedSectionInstructions}
              </p>
              <button
                className="modal-button-categoryNX"
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
        <div className="modal-overlay-categoryNX loading-overlay-categoryNX">
          <div className="loading-card-categoryNX">
            <div className="loading-top-categoryNX">
              <div className="loading-animation-categoryNX" />
            </div>
            <div className="loading-card-body-categoryNX">
              <h3>{t('category.loadingQuestions', { defaultValue: 'Cargando preguntas' })}</h3>
              <p>...</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ¿ESTÁS SEGURO QUE DESEAS SALIR? */}
      {showExitConfirm && (
        <div className="modal-overlay-categoryNX" style={{ zIndex: 50 }}>
          <div className="modal-card-categoryNX">
            <div className="modal-top-categoryNX" style={{ backgroundColor: '#f5c74a' }}>
              <span className="modal-icon-categoryNX" style={{ fontSize: '70px', animation: 'bounceNX 2s infinite' }}>💡</span>
            </div>
            <div className="modal-card-body-categoryNX">
              <h3 style={{ fontWeight: 'bold', fontSize: '24px', color: '#1f1a38', marginBottom: '12px' }}>
                ¿Estás seguro que deseas salir?
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                Se guardarán tus preguntas al continuar.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <button
                  className="modal-cancel-btn-categoryNX"
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                >
                  Cancelar
                </button>
                <button
                  className="modal-action-btn-categoryNX"
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
        <div className="modal-overlay-categoryNX" style={{ zIndex: 50 }}>
          <div className="modal-card-categoryNX">
            <div className="modal-top-categoryNX" style={{ backgroundColor: '#2ecc71', flexDirection: 'column' }}>
              <div className="concentric-circle-categoryNX">
                <div className="inner-concentric-categoryNX"></div>
              </div>
            </div>
            <div className="modal-card-body-categoryNX">
              <h3 style={{ fontWeight: 'bold', fontSize: '24px', color: '#1f1a38', marginBottom: '12px' }}>
                Finalizado
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                Cuestionario Completo
              </p>
              <button
                className="modal-action-btn-categoryNX"
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
        <div className="modal-overlay-categoryNX" style={{ zIndex: 50 }}>
          <div className="modal-card-categoryNX">
            <div className="modal-top-categoryNX" style={{ backgroundColor: '#26a69a', flexDirection: 'column' }}>
              <div className="concentric-circle-teal-categoryNX">
                <div className="center-dot-categoryNX"></div>
              </div>
            </div>
            <div className="modal-card-body-categoryNX">
              <h3 style={{ fontWeight: 'bold', fontSize: '24px', color: '#1f1a38', marginBottom: '12px' }}>
                Finalizado
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                El proceso ha sido finalizado exitosamente
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <button
                  className="modal-cancel-btn-categoryNX"
                  type="button"
                  onClick={() => setShowFinishConfirmModal(false)}
                >
                  Volver
                </button>
                <button
                  className="modal-action-btn-categoryNX"
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

      {/* MODAL 4: RESPUESTAS INCOMPLETAS */}
      {showIncompleteModal && (
        <div className="modal-overlay-categoryNX" style={{ zIndex: 60 }}>
          <div className="modal-card-categoryNX">
            <div className="modal-top-categoryNX" style={{ backgroundColor: '#f39c12', flexDirection: 'column' }}>
              <div className="warning-circle-categoryNX">
                <div className="warning-icon-categoryNX">!</div>
              </div>
            </div>
            <div className="modal-card-body-categoryNX">
              <h3 style={{ fontWeight: 'bold', fontSize: '24px', color: '#1f1a38', marginBottom: '12px' }}>
                Respuestas incompletas
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                Por favor responde todas las preguntas antes de enviar.
              </p>
              <button
                className="modal-action-btn-categoryNX"
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
