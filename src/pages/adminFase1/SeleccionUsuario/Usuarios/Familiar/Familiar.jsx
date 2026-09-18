import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import './Familiar.scss';

import socioImg from '../../../../../assets/img/sociodemograficos.jpeg';
import mentalImg from '../../../../../assets/img/saludmental.jpeg';
import fisicaImg from '../../../../../assets/img/saludfisica.jpeg';
import socialImg from '../../../../../assets/img/determinantes.jpeg';
import covidImg from '../../../../../assets/img/covid.jpeg';
import nomImg from '../../../../../assets/img/nom035.jpeg';
import logoImg from '../../../../../assets/img/Icono_home.jpeg';

import { Sidebar } from '../Personal/Sidebar';
import { LanguageSelector } from '../../../../../components/ui';
import { useAuth } from '../../../../../hooks';
import Swal from 'sweetalert2';
import {
  getCuestionariosPorSeccionApi,
  getPreguntasCuestionarioApi,
  getRespuestasUsuarioApi,
  guardarRespuestasUsuarioApi,
  modificarRespuestasUsuarioApi,
  obtenerSeccionesApi,
} from '../../../../../api/fase1/cuestionario';
import {
  getFamiliaresFase1,
  registrarFamiliarFase1,
  eliminarFamiliarFase1,
  getParentescosFase1,
  getEdadesFase1,
} from '../../../../../api/user';

// Mapa de imágenes y colores para las secciones dinámicas (por ID)
const categoryMapById = {
  1: { slug: 'sociodemograficos', image: socioImg, borderColor: 'border-azul', defaultTitle: 'Sociodemográficos' },
  2: { slug: 'salud-mental', image: mentalImg, borderColor: 'border-verde', defaultTitle: 'Salud Mental' },
  3: { slug: 'salud-fisica', image: fisicaImg, borderColor: 'border-morado', defaultTitle: 'Salud Física' },
  4: { slug: 'determinantes-sociales', image: socialImg, borderColor: 'border-amarillo', defaultTitle: 'Determinantes Sociales' },
  5: { slug: 'covid-salud-mental', image: covidImg, borderColor: 'border-azul-claro', defaultTitle: 'COVID-19 y Salud Mental' },
  6: { slug: 'nom-035', image: nomImg, borderColor: 'border-rojo', defaultTitle: 'NOM 035' },
};
const defaultImage = logoImg;
const defaultBorder = 'border-gris';

// ─────────────────────────────────────────────────────
// FamiliarHome – Stage flow (list -> register -> categories)
// ─────────────────────────────────────────────────────
export function Familiar() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { t } = useTranslation();

  const getUserId = () => {
    try {
      return auth?.me?.id || (auth?.token ? jwtDecode(auth.token)?.user_id : null);
    } catch (e) {
      return auth?.me?.id || null;
    }
  };

  const [stage, setStage] = useState('list'); // 'list' | 'register' | 'categories'
  const [familiares, setFamiliares] = useState([]);
  const [selectedFamiliar, setSelectedFamiliar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');

  // Catalog states
  const [parentescos, setParentescos] = useState([]);
  const [edades, setEdades] = useState([]);

  // Form state
  const [formValues, setFormValues] = useState({
    parentescoId: '',
    edadId: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    curp: '',
  });

  const [submitting, setSubmitting] = useState(false);
  
  // Estados para las secciones dinámicas
  const [cards, setCards] = useState([]);
  const [cargandoSecciones, setCargandoSecciones] = useState(false);

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombre');
    if (nombreGuardado) setNombreUsuario(nombreGuardado);
  }, []);

  // Cargar secciones dinámicamente cuando entramos a la vista de categorías
  useEffect(() => {
    const cargarSecciones = async () => {
      if (stage === 'categories' && auth?.token && selectedFamiliar) {
        setCargandoSecciones(true);
        try {
          // Asumimos que el familiar tiene la edad guardada en rango_edad o similar. Si no, mandamos un default.
          const edadFamiliar = selectedFamiliar.rango_edad || selectedFamiliar.edad || 18; 
          const response = await obtenerSeccionesApi(edadFamiliar, auth.token);
          
          if (response && Array.isArray(response)) {
            const mappedCards = response.map(sec => {
              const tituloStr = sec.titulo || sec.title || '';
              const mapInfo = categoryMapById[sec.id] || {};
              const tituloReal = mapInfo.defaultTitle || tituloStr || 'SECCIÓN SIN NOMBRE';

              // Determine slug
              const slug = mapInfo.slug || `seccion-${sec.id}`;

              // Determine image: prefer mapped image; otherwise try to infer from title keywords
              let image = mapInfo.image || defaultImage;
              if ((!mapInfo.image || mapInfo.image === defaultImage) && /nom\s*0?35|nom-?035/i.test(tituloStr)) {
                image = nomImg;
              } else if ((!mapInfo.image || mapInfo.image === defaultImage) && /covid/i.test(tituloStr)) {
                image = covidImg;
              }

              // Determine border color: prefer mapped border, otherwise infer from title keywords
              let borderColor = mapInfo.borderColor || defaultBorder;
              if (!mapInfo.borderColor) {
                if (/nom\s*0?35|nom-?035/i.test(tituloStr)) borderColor = 'border-rojo';
                else if (/determinantes/i.test(tituloStr)) borderColor = 'border-amarillo';
                else if (/covid/i.test(tituloStr)) borderColor = 'border-azul-claro';
                else if (/sociodemografic/i.test(tituloStr)) borderColor = 'border-azul';
                else if (/salud\s*mental/i.test(tituloStr)) borderColor = 'border-verde';
                else if (/salud\s*f[ií]sica/i.test(tituloStr)) borderColor = 'border-morado';
              }
              return {
                id: sec.id,
                title: tituloReal,
                slug: slug,
                image: image,
                borderColor: borderColor,
                descripcion: sec.descripcion || ''
              };
            });
            setCards(mappedCards);
          }
        } catch (error) {
          console.error("Error al cargar secciones:", error);
          // Si falla, mostramos un arreglo vacío o las default si quisiéramos.
        } finally {
          setCargandoSecciones(false);
        }
      }
    };
    
    cargarSecciones();
  }, [stage, auth?.token, selectedFamiliar]);

  // Fetch family members list
  const fetchFamiliares = async () => {
    const userId = getUserId();
    if (!auth?.token || !userId) return;
    setLoading(true);
    try {
      const data = await getFamiliaresFase1(auth.token, userId);
      setFamiliares(data || []);
    } catch (error) {
      console.error('Error al cargar familiares:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeFamiliar = localStorage.getItem('selectedFamiliar');
    if (activeFamiliar) {
      try {
        const parsed = JSON.parse(activeFamiliar);
        if (parsed.cuidador_primario === 1 || parsed.cuidador === 1) {
          localStorage.removeItem('selectedFamiliar');
          setStage('list');
          fetchFamiliares();
        } else {
          setSelectedFamiliar(parsed);
          setStage('categories');
        }
      } catch (e) {
        localStorage.removeItem('selectedFamiliar');
        setStage('list');
        fetchFamiliares();
      }
    } else {
      setStage('list');
      fetchFamiliares();
    }
  }, [auth?.token, auth?.me]);

  // Load catalogs for registration
  useEffect(() => {
    if (stage === 'register') {
      const fetchCatalogs = async () => {
        try {
          const [parentescoData, edadData] = await Promise.all([
            getParentescosFase1(),
            getEdadesFase1(),
          ]);
          setParentescos(parentescoData || []);
          setEdades(edadData || []);
        } catch (error) {
          console.error('Error al cargar catálogos:', error);
        }
      };
      fetchCatalogs();
    }
  }, [stage]);

  const handleSelectFamiliar = (familiar) => {
    localStorage.setItem('selectedFamiliar', JSON.stringify(familiar));
    setSelectedFamiliar(familiar);
    setStage('categories');
  };

  const handleBackFromCategories = () => {
    localStorage.removeItem('selectedFamiliar');
    setSelectedFamiliar(null);
    setStage('list');
    fetchFamiliares();
  };

  const handleDeleteFamiliar = async (id) => {
    Swal.fire({
      title: t('familiar.alerts.deleteConfirmTitle'),
      text: t('familiar.alerts.deleteConfirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('familiar.alerts.deleteConfirmBtn'),
      cancelButtonText: t('familiar.alerts.deleteCancelBtn')
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarFamiliarFase1(auth.token, id);
          Swal.fire({
            icon: 'success',
            title: t('familiar.alerts.deleteSuccessTitle'),
            text: t('familiar.alerts.deleteSuccessText'),
            confirmButtonText: t('familiar.alerts.accept'),
            confirmButtonColor: '#4DB6AC'
          });
          fetchFamiliares();
        } catch (error) {
          console.error('Error al eliminar familiar:', error);
          Swal.fire(t('familiar.alerts.errorTitle'), t('familiar.alerts.deleteErrorText'), 'error');
        }
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'curp') {
      setFormValues((prev) => ({
        ...prev,
        [name]: value.slice(0, 18).toUpperCase(),
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.parentescoId || !formValues.edadId || !formValues.nombre || !formValues.apellidoPaterno || !formValues.apellidoMaterno || !formValues.curp) {
      Swal.fire(t('familiar.alerts.incompleteTitle'), t('familiar.alerts.incompleteText'), 'warning');
      return;
    }
    if (formValues.curp.length !== 18) {
      Swal.fire(t('familiar.alerts.invalidCurpTitle'), t('familiar.alerts.invalidCurpText'), 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        nombre: formValues.nombre,
        apellido_paterno: formValues.apellidoPaterno,
        apellido_materno: formValues.apellidoMaterno,
        curp: formValues.curp,
        user: getUserId(),
        parentesco: parseInt(formValues.parentescoId),
        rango_edad: parseInt(formValues.edadId),
      };

      await registrarFamiliarFase1(auth.token, payload);
      Swal.fire({
        icon: 'success',
        title: t('familiar.alerts.registerSuccessTitle'),
        text: t('familiar.alerts.registerSuccessText'),
        confirmButtonText: t('familiar.alerts.accept'),
        confirmButtonColor: '#4DB6AC',
      }).then(() => {
        setFormValues({
          parentescoId: '',
          edadId: '',
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          curp: '',
        });
        setStage('list');
        fetchFamiliares();
      });
    } catch (error) {
      console.error('Error al registrar familiar:', error);
      Swal.fire({
        icon: 'error',
        title: t('familiar.alerts.registerErrorTitle'),
        text: error.message || t('familiar.alerts.registerErrorDefault'),
        confirmButtonText: t('familiar.alerts.accept'),
        confirmButtonColor: '#2196F3',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  if (stage === 'list') {
    return (
      <div className="familiar-list-container">
        <header className="familiar-list-header">
          <button className="back-arrow-btn" onClick={() => navigate('/seleccion-usuario')} aria-label="Volver">
            ←
          </button>
          <h2>{t('familiar.listTitle')}</h2>
          <LanguageSelector lightBg={true} />
        </header>

        <div className="familiar-list-body">
            {loading ? (
              <div className="loading-container-centered">
                  <div className="loading-circle-centered">
                      <span>{t('familiar.loading', { defaultValue: 'Cargando...' })}</span>
                  </div>
              </div>
            ) : familiares.length === 0 ? (
            <div className="familiar-empty-state"></div>
          ) : (
            <div className="familiar-cards-grid">
              {familiares.map((fam) => (
                <div className="familiar-card" key={fam.id}>
                  <div className="familiar-card-info">
                    <div className="familiar-card-avatar">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="#8b4c95" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="familiar-card-details">
                      <h4>
                        {(fam.nombre || '').toUpperCase()} {(fam.apellido_paterno || '').toUpperCase()} {(fam.apellido_materno || '').toUpperCase()}
                      </h4>
                      <p>{t(`parentescoMap.${(fam.parentesco || '').toUpperCase()}`, { defaultValue: fam.parentesco || t('familiar.role') })}</p>
                    </div>
                  </div>
                  <div className="familiar-card-actions">
                    <button className="btn-select-familiar" onClick={() => handleSelectFamiliar(fam)}>
                      {t('familiar.select')}
                    </button>
                    <button className="btn-delete-familiar" onClick={() => handleDeleteFamiliar(fam.id)}>
                      {t('familiar.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="add-familiar-btn" onClick={() => setStage('register')}>
          {t('familiar.addBtn')}
        </button>
      </div>
    );
  }

  if (stage === 'register') {
    return (
      <div className="familiar-register-container">
        <header className="familiar-list-header">
          <button className="back-arrow-btn" onClick={() => setStage('list')} aria-label="Volver">
            ←
          </button>
          <h2>{t('familiar.registerTitle')}</h2>
          <LanguageSelector lightBg={true} />
        </header>

        <div className="familiar-register-body">
          <div className="avatar-silhouette">
            <svg viewBox="0 0 24 24" width="100" height="100">
              <path fill="#5c5470" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <form onSubmit={handleRegisterSubmit} className="familiar-register-form">
            <div className="form-group-line">
              <label className="input-group-heading">{t('familiar.form.parentescoLabel')}</label>
              <div className="select-wrapper-line">
                <select
                  name="parentescoId"
                  value={formValues.parentescoId}
                  onChange={handleFormChange}
                  required
                >
                  <option value="" disabled hidden>{t('familiar.form.parentescoPlaceholder')}</option>
                  {parentescos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(`parentescoMap.${(p.parentesco || '').toUpperCase()}`, { defaultValue: p.parentesco })}
                    </option>
                  ))}
                </select>
                <span className="arrow-down-icon">↓</span>
              </div>
            </div>

            <div className="form-group-line">
              <label className="input-group-heading">{t('familiar.form.edadLabel')}</label>
              <div className="select-wrapper-line">
                <select
                  name="edadId"
                  value={formValues.edadId}
                  onChange={handleFormChange}
                  required
                >
                  <option value="" disabled hidden>{t('familiar.form.edadPlaceholder')}</option>
                  {edades.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.rango_edades}
                    </option>
                  ))}
                </select>
                <span className="arrow-down-icon">↓</span>
              </div>
            </div>

            <div className="input-with-icon-wrapper">
              <input
                type="text"
                name="nombre"
                placeholder={t('familiar.form.nombre')}
                value={formValues.nombre}
                onChange={handleFormChange}
                required
              />
              <span className="input-icon-right">👤</span>
            </div>

            <div className="input-with-icon-wrapper">
              <input
                type="text"
                name="apellidoPaterno"
                placeholder={t('familiar.form.apellidoPaterno')}
                value={formValues.apellidoPaterno}
                onChange={handleFormChange}
                required
              />
              <span className="input-icon-right">👤</span>
            </div>

            <div className="input-with-icon-wrapper">
              <input
                type="text"
                name="apellidoMaterno"
                placeholder={t('familiar.form.apellidoMaterno')}
                value={formValues.apellidoMaterno}
                onChange={handleFormChange}
                required
              />
              <span className="input-icon-right">👤</span>
            </div>

            <div className="input-with-icon-wrapper curp-wrapper">
              <input
                type="text"
                name="curp"
                placeholder={t('familiar.form.curp')}
                value={formValues.curp}
                onChange={handleFormChange}
                required
              />
              <span className="input-icon-right curp-icon">AZ</span>
              <span className="curp-char-counter">{formValues.curp.length}/18</span>
            </div>

            <button type="submit" className="submit-register-btn" disabled={submitting}>
              {submitting ? t('familiar.form.submitting') : t('familiar.form.submit')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Default: stage === 'categories'
  return (
    <div className="personal-container">
      <Sidebar isOpen={menuAbierto} onClose={toggleMenu} />

      <header className="personal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="menu-icon-btn" onClick={toggleMenu} aria-label={t('personal.openMenu')}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>

        <h2 className="header-title" style={{ margin: 0 }}>
          {t('familiar.headerPrefix')}: {selectedFamiliar ? `${selectedFamiliar.nombre} ${selectedFamiliar.apellido_paterno || ''} ${selectedFamiliar.apellido_materno || ''}`.trim().toUpperCase() : nombreUsuario}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <LanguageSelector lightBg={true} />
          <div className="header-logo-container">
            <img src={logoImg} alt={t('personal.logoAlt', { defaultValue: 'Mente Conecta Logo' })} />
          </div>
        </div>
      </header>

      <div className="cards-container">
        {cargandoSecciones ? (
          <div className="loading-container-centered">
            <div className="loading-circle-centered">
              <span className="loading-text">Cargando secciones...</span>
            </div>
          </div>
        ) : cards.length === 0 ? (
          <div className="category-detail-empty">
            <p>{t('category.noQuestionnaires', { defaultValue: 'No hay secciones disponibles.' })}</p>
          </div>
        ) : (
          cards.map((card) => (
            <Link
              key={card.id}
              to={`/familiar/${card.slug}`}
              state={{ sectionId: card.id, sectionTitle: card.title, sectionDesc: card.descripcion }}
              className="card-link"
              aria-label={t('personal.viewQuestionnairesFor', { section: card.title })}
            >
              <div className={`card-item ${card.borderColor}`}>
                <img src={card.image} alt={card.title} className={`card-img-${card.slug}`} />
                <div className="card-overlay">
                  <h3>{card.title}</h3>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// FamiliarCategoryDetail – Questionnaire flow (mirrors CategoryDetail.jsx)
// ─────────────────────────────────────────────────────
export function FamiliarCategoryDetail() {
  const navigate = useNavigate();
  const { category } = useParams();
  const location = useLocation();
  const isCuidador = window.location.pathname.startsWith('/cuidador');
  const backPath = isCuidador ? '/cuidador' : '/familiar';
  
  // Extraer la información de la sección enviada a través del state del Link
  const sectionId = location.state?.sectionId;
  const sectionTitle = location.state?.sectionTitle || category;
  const sectionDesc = location.state?.sectionDesc || '';

  const { t } = useTranslation();
  const { auth } = useAuth();

  const [selectedFamiliar, setSelectedFamiliar] = useState(null);

  useEffect(() => {
    const familiarStr = localStorage.getItem('selectedFamiliar');
    if (familiarStr) {
      setSelectedFamiliar(JSON.parse(familiarStr));
    }
  }, []);

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

  const getQuestionLabel = (q) => {
    return q?.pregunta || q?.label || '';
  };

  const getQuestionPlaceholder = (q) => q?.placeholder || '';

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

  // ─── Load questionnaires for the selected category ───
  useEffect(() => {
    if (!sectionId) return;

    const fetchCategoryQuestionnaires = async () => {
      setLoadingData(true);
      try {
        const userId = selectedFamiliar ? selectedFamiliar.id : auth?.me?.id;
        
        // 1. Obtener los cuestionarios de la sección actual usando sectionId
        const fetchedCuestionarios = await getCuestionariosPorSeccionApi(auth.token, sectionId);
        
        // 2. Por cada cuestionario, revisar si ya fue contestado
        const questionnairesWithStatus = await Promise.all(
          fetchedCuestionarios.map(async (q) => {
            let status = 0;
            if (userId) {
              const resp = await getRespuestasUsuarioApi(auth.token, auth.me.id, q.id, selectedFamiliar?.id);
              if (resp && resp.respuestas_json) {
                status = 1;
              }
            }
            return {
              ...q,
              estatusUsuario: status
            };
          })
        );
        
        setQuestionnaires(questionnairesWithStatus);
      } catch (error) {
        console.error("Error al obtener cuestionarios para la categoría:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (auth?.token) {
      fetchCategoryQuestionnaires();
    }
  }, [sectionId, auth?.token, selectedFamiliar, refreshTrigger]);

  // ── Load questions & previous responses when entering a questionnaire ──
  useEffect(() => {
    if (stage !== 'loading') return undefined;

    const loadQuestionsAndResponses = async () => {
      try {
        if (selectedSection && selectedSection.id && auth?.token) {
          const apiQuestions = await getPreguntasCuestionarioApi(auth.token, selectedSection.id);
          setQuestions(apiQuestions);

          const familiarStr = localStorage.getItem('selectedFamiliar');
          const familiarObj = familiarStr ? JSON.parse(familiarStr) : null;
          const familiarId = familiarObj ? familiarObj.id : null;

          const prevRespuestas = await getRespuestasUsuarioApi(auth.token, auth.me.id, selectedSection.id, familiarId);

          if (prevRespuestas) {
            setUserResponseId(prevRespuestas.id || null);
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
            apiQuestions.forEach((q) => { initialValues[q.id] = ''; });
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
    setFormValues((prev) => ({ ...prev, [id]: value }));
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
          const familiarStr = localStorage.getItem('selectedFamiliar');
          const familiarObj = familiarStr ? JSON.parse(familiarStr) : null;
          const familiarId = familiarObj ? familiarObj.id : null;

          const payload = {
            id_usuario: auth.me.id,
            id_cuestionario: selectedSection.id,
            respuestas_json: JSON.stringify(respuestasList),
            estatus_finalizado: 0, // 0 = Incompleto
            id_seccion: sectionId,
            id_sub_usuario: familiarId,
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

        const familiarStr = localStorage.getItem('selectedFamiliar');
        const familiarObj = familiarStr ? JSON.parse(familiarStr) : null;
        const familiarId = familiarObj ? familiarObj.id : null;

        const payload = {
          id_usuario: auth.me.id,
          id_cuestionario: selectedSection.id,
          respuestas_json: JSON.stringify(respuestasList),
          estatus_finalizado: 1, // 1 = Completado
          id_seccion: sectionId,
          id_sub_usuario: familiarId,
        };

        if (userResponseId) {
          await modificarRespuestasUsuarioApi(auth.token, userResponseId, payload);
        } else {
          await guardarRespuestasUsuarioApi(auth.token, payload);
        }

        setSubmitted(true);
        setRefreshTrigger((prev) => prev + 1);

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
      setShowIncompleteModal(true);
      return;
    }

    setShowFinishConfirmModal(true);
  };

  // ─── Not-found guard ───
  if (!sectionId) {
    return (
      <div className="category-detail-container">
        <div className="category-detail-header">
          <button className="back-button" onClick={() => navigate(backPath)}>
            {t('common.back', { defaultValue: '← Volver' })}
          </button>
          <h2>{t('category.notFound', { defaultValue: 'Categoría no encontrada' })}</h2>
        </div>
        <div className="category-detail-empty">
          <p>{t('category.selectValid', { defaultValue: 'Selecciona una categoría válida para ver los cuestionarios disponibles.' })}</p>
          <Link className="btn-secondary" to={backPath}>
            {t('category.returnToCategories', { defaultValue: 'Volver a categorías' })}
          </Link>
        </div>
      </div>
    );
  }

  const categoryTitle = sectionTitle || t(`category.${category}.title`, { defaultValue: category });
  const categoryDescription = sectionDesc || t(`category.${category}.description`, { defaultValue: '' });
  const categoryIntroText = sectionDesc || t(`category.${category}.introText`, { defaultValue: '' }); // Usa translation fallback when state not provided

  const selectedSectionTitle = selectedSectionIndex !== null
    ? t(`category.${category}.questionnaires.${selectedSectionIndex}.title`, { defaultValue: selectedSection?.titulo || selectedSection?.title || sectionTitle })
    : selectedSection?.titulo || selectedSection?.title || sectionTitle;

  const selectedSectionDescription = selectedSectionIndex !== null
    ? t(`category.${category}.questionnaires.${selectedSectionIndex}.description`, { defaultValue: selectedSection?.descripcion || selectedSection?.description || sectionDesc })
    : selectedSection?.descripcion || selectedSection?.description || categoryIntroText;

  const categoryInstructions = t(`category.${category}.instructions`, {
    defaultValue: selectedSection?.instrucciones || selectedSection?.instructions || categoryIntroText,
  });

  const selectedSectionInstructions = selectedSectionIndex !== null
    ? t(`category.${category}.questionnaires.${selectedSectionIndex}.instructions`, { defaultValue: categoryInstructions })
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

  // ── Questionnaire form renderer ──
  const renderQuestionnaireForm = () => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(questions.length / itemsPerPage);
    const visibleQuestions = questions.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
      <div className="questionnaire-screen">
        <div className="questionnaire-header">
          <div>
            <span className="category-card-label">{t('questionnaire.label', { defaultValue: 'Cuestionario' })}</span>
            <h3>{t(`category.${category}.title`, { defaultValue: selectedSection?.titulo || selectedSection?.title || categoryTitle })}{selectedFamiliar ? ` - ${selectedFamiliar.nombre} ${selectedFamiliar.apellido_paterno || ''} ${selectedFamiliar.apellido_materno || ''}`.trim().toUpperCase() : ''}</h3>
            <p>
              {selectedSection
                ? t('questionnaire.respondForSection', { section: selectedSectionTitle })
                : t('questionnaire.respondBelow', { defaultValue: 'Responde las preguntas que aparecen a continuación para completar el cuestionario.' })}
            </p>
          </div>
          <div className="questionnaire-actions-header" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {(selectedSection?.instrucciones || selectedSection?.instructions) && (
              <button type="button" className="instructions-btn" onClick={() => setShowInstructions(true)}>
                💡 {t('questionnaire.instructions', { defaultValue: 'Instrucciones' })}
              </button>
            )}
            <button className="back-button" type="button" onClick={() => setShowExitConfirm(true)}>
              {t('common.back', { defaultValue: '← Volver' })}
            </button>
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
            const qLabel = getQuestionLabel(question);
            const qOptions = getQuestionOptions(question);
            const isSelect = isSelectQuestion(question);

            return (
              <div className="question-item" key={qId}>
                <label htmlFor={qId}>{qLabel}</label>

                {isSelect ? (
                  renderSelectOptions(question, qId)
                ) : (
                  <input
                    id={qId}
                    type={question.type || 'text'}
                    placeholder={getQuestionPlaceholder(question) || t('questionnaire.writeAnswer', { defaultValue: 'Escribe tu respuesta...' })}
                    value={formValues[qId] || ''}
                    onChange={(e) => handleChange(qId, e.target.value)}
                  />
                )}
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="pagination-container">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pagination-number ${currentPage === i ? 'active' : ''}`}
                  onClick={() => { setCurrentPage(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                onClick={() => { setCurrentPage((prev) => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                onClick={() => { setCurrentPage((prev) => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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

  // ── Main render ──
  return (
    <div className="category-detail-container">
      <div className="category-detail-header">
        <button
          className="back-button"
          onClick={() => {
            if (stage === 'questionnaire') {
              setShowExitConfirm(true);
            } else {
              navigate(backPath);
            }
          }}
        >
          {t('common.back', { defaultValue: '← Volver' })}
        </button>
        <h2>{categoryTitle}{selectedFamiliar ? ` - ${selectedFamiliar.nombre} ${selectedFamiliar.apellido_paterno || ''} ${selectedFamiliar.apellido_materno || ''}`.trim().toUpperCase() : ''}</h2>
        <div className="category-detail-header-actions">
          <LanguageSelector lightBg={true} />
        </div>
      </div>

      {stage === 'questionnaire' ? (
        renderQuestionnaireForm()
      ) : (
        <div className="category-detail-content">
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
                    key={index}
                    type="button"
                    className={`cd-section-card ${isCompleted ? 'completed-card' : ''}`}
                    onClick={() => handleSelectSection(section, index)}
                  >
                    <span className="section-card-title">
                      {t(`category.${category}.questionnaires.${index}.title`, { defaultValue: section.titulo || section.title })}
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
              <h3>{selectedSectionTitle}</h3>
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
              <h3 style={{ fontWeight: 'bold', fontSize: '28px', color: '#1f1a38', marginBottom: '16px' }}>
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
              <h3 style={{ fontWeight: 'bold', fontSize: '24px', color: '#1f1a38', marginBottom: '12px' }}>
                {t('familiar.modal.exitTitle')}
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                {t('familiar.modal.exitText')}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <button
                  className="modal-cancel-btn"
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                >
                  {t('familiar.modal.exitCancel')}
                </button>
                <button
                  className="modal-action-btn"
                  type="button"
                  onClick={handleExitAndSavePartial}
                  style={{ backgroundColor: '#2196f3' }}
                >
                  {t('familiar.modal.exitConfirm')}
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
                {t('familiar.modal.completedTitle')}
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                {t('familiar.modal.completedText')}
              </p>
              <button
                className="modal-action-btn"
                type="button"
                onClick={() => {
                  setShowAlreadyCompletedModal(false);
                }}
                style={{ backgroundColor: '#2196f3', minWidth: '120px' }}
              >
                {t('common.ok')}
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
                {t('familiar.modal.finishedTitle')}
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                {t('familiar.modal.finishedText')}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <button
                  className="modal-cancel-btn"
                  type="button"
                  onClick={() => setShowFinishConfirmModal(false)}
                >
                  {t('familiar.modal.finishedBack')}
                </button>
                <button
                  className="modal-action-btn"
                  type="button"
                  onClick={handleFinalSubmit}
                  style={{ backgroundColor: '#2196f3' }}
                >
                  {t('familiar.modal.finishedSave')}
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
                {t('familiar.modal.incompleteTitle')}
              </h3>
              <p style={{ color: '#7f7c93', fontSize: '15px', marginBottom: '26px' }}>
                {t('familiar.modal.incompleteText')}
              </p>
              <button
                className="modal-action-btn"
                type="button"
                onClick={() => setShowIncompleteModal(false)}
                style={{ backgroundColor: '#2196f3', minWidth: '130px' }}
              >
                {t('familiar.modal.incompleteConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
