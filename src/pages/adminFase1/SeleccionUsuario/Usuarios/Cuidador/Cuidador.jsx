import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import './Cuidador.scss';

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
import {
  getCuidadoresFase1,
  registrarCuidadorFase1,
  eliminarFamiliarFase1
} from '../../../../../api/user';

const cards = [
  { id: 1, title: 'SOCIODEMOGRÁFICOS', slug: 'sociodemograficos', image: socioImg, borderColor: 'border-azul' },
  { id: 2, title: 'SALUD MENTAL', slug: 'salud-mental', image: mentalImg, borderColor: 'border-verde' },
  { id: 3, title: 'SALUD FÍSICA', slug: 'salud-fisica', image: fisicaImg, borderColor: 'border-morado' },
  { id: 4, title: 'DETERMINANTES SOCIALES', slug: 'determinantes-sociales', image: socialImg, borderColor: 'border-amarillo' },
  { id: 5, title: 'COVID-19 Y SALUD MENTAL', slug: 'covid-salud-mental', image: covidImg, borderColor: 'border-azul-claro' },
  { id: 6, title: 'NOM 035', slug: 'nom-035', image: nomImg, borderColor: 'border-rojo' },
];

export function Cuidador() {
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
  const [cuidadores, setCuidadores] = useState([]);
  const [selectedCuidador, setSelectedCuidador] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');

  // Form state
  const [formValues, setFormValues] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    curp: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombre');
    if (nombreGuardado) setNombreUsuario(nombreGuardado);
  }, []);

  // Fetch primary caregivers list
  const fetchCuidadores = async () => {
    const userId = getUserId();
    if (!auth?.token || !userId) return;
    setLoading(true);
    try {
      const data = await getCuidadoresFase1(auth.token, userId);
      setCuidadores(data || []);
    } catch (error) {
      console.error('Error al cargar cuidadores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeCuidador = localStorage.getItem('selectedFamiliar');
    if (activeCuidador) {
      try {
        const parsed = JSON.parse(activeCuidador);
        if (parsed.cuidador_primario === 1 || parsed.cuidador === 1) {
          setSelectedCuidador(parsed);
          setStage('categories');
        } else {
          localStorage.removeItem('selectedFamiliar');
          setStage('list');
          fetchCuidadores();
        }
      } catch (e) {
        localStorage.removeItem('selectedFamiliar');
        setStage('list');
        fetchCuidadores();
      }
    } else {
      setStage('list');
      fetchCuidadores();
    }
  }, [auth?.token, auth?.me]);

  const handleSelectCuidador = (cuidador) => {
    localStorage.setItem('selectedFamiliar', JSON.stringify(cuidador));
    setSelectedCuidador(cuidador);
    setStage('categories');
  };

  const handleBackFromCategories = () => {
    localStorage.removeItem('selectedFamiliar');
    setSelectedCuidador(null);
    setStage('list');
    fetchCuidadores();
  };
  const handleDeleteCuidador = async (id) => {
    Swal.fire({
      title: t('cuidador.alerts.deleteConfirmTitle'),
      text: t('cuidador.alerts.deleteConfirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('cuidador.alerts.deleteConfirmBtn'),
      cancelButtonText: t('cuidador.alerts.deleteCancelBtn')
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarFamiliarFase1(auth.token, id);
          Swal.fire({
            icon: 'success',
            title: t('cuidador.alerts.deleteSuccessTitle'),
            text: t('cuidador.alerts.deleteSuccessText'),
            confirmButtonText: t('cuidador.alerts.accept'),
            confirmButtonColor: '#4DB6AC'
          });
          fetchCuidadores();
        } catch (error) {
          console.error('Error al eliminar cuidador:', error);
          Swal.fire(t('cuidador.alerts.errorTitle'), t('cuidador.alerts.deleteErrorText'), 'error');
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
    if (!formValues.nombre || !formValues.apellidoPaterno || !formValues.apellidoMaterno || !formValues.curp) {
      Swal.fire(t('cuidador.alerts.incompleteTitle'), t('cuidador.alerts.incompleteText'), 'warning');
      return;
    }
    if (formValues.curp.length !== 18) {
      Swal.fire(t('cuidador.alerts.invalidCurpTitle'), t('cuidador.alerts.invalidCurpText'), 'warning');
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
        parentesco: null,
        rango_edad: auth?.me?.edades || 1, // Fallback to 1 if user object not ready
        cuidador_primario: 1,
      };

      await registrarCuidadorFase1(auth.token, payload);
      Swal.fire({
        icon: 'success',
        title: t('cuidador.alerts.registerSuccessTitle'),
        text: t('cuidador.alerts.registerSuccessText'),
        confirmButtonText: t('cuidador.alerts.accept'),
        confirmButtonColor: '#4DB6AC',
      }).then(() => {
        setFormValues({
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          curp: '',
        });
        setStage('list');
        fetchCuidadores();
      });
    } catch (error) {
      console.error('Error al registrar cuidador:', error);
      Swal.fire({
        icon: 'error',
        title: t('cuidador.alerts.registerErrorTitle'),
        text: error.message || t('cuidador.alerts.registerErrorDefault'),
        confirmButtonText: t('cuidador.alerts.accept'),
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
          <h2 className="cuidadores-header-title">{t('cuidador.listTitle')}</h2>
          <LanguageSelector lightBg={true} />
        </header>

        <div className="familiar-list-body">
            {loading ? (
              <div className="loading-container-centered">
                  <div className="loading-circle-centered">
                      <span>{t('cuidador.loading', { defaultValue: 'Cargando...' })}</span>
                  </div>
              </div>
            ) : cuidadores.length === 0 ? (
            <div className="familiar-empty-state"></div>
          ) : (
            <div className="familiar-cards-grid">
              {cuidadores.map((fam) => (
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
                      <p>{t('cuidador.role')}</p>
                    </div>
                  </div>
                  <div className="familiar-card-actions">
                    <button className="btn-select-familiar" onClick={() => handleSelectCuidador(fam)}>
                      {t('cuidador.select')}
                    </button>
                    <button className="btn-delete-familiar" onClick={() => handleDeleteCuidador(fam.id)}>
                      {t('cuidador.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="add-familiar-btn" onClick={() => setStage('register')}>
          {t('cuidador.addBtn')}
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
          <h2 className="cuidadores-header-title">{t('cuidador.registerTitle')}</h2>
          <LanguageSelector lightBg={true} />
        </header>

        <div className="familiar-register-body">
          <div className="avatar-silhouette">
            <svg viewBox="0 0 24 24" width="100" height="100">
              <path fill="#5c5470" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <h3 className="cuidadores-register-label">{t('cuidador.formSectionLabel')}</h3>

          <form onSubmit={handleRegisterSubmit} className="familiar-register-form">
            <div className="input-with-icon-wrapper">
              <input
                type="text"
                name="nombre"
                placeholder={t('cuidador.form.nombre')}
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
                placeholder={t('cuidador.form.apellidoPaterno')}
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
                placeholder={t('cuidador.form.apellidoMaterno')}
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
                placeholder={t('cuidador.form.curp')}
                value={formValues.curp}
                onChange={handleFormChange}
                required
              />
              <span className="input-icon-right curp-icon">AZ</span>
              <span className="curp-char-counter">{formValues.curp.length}/18</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button type="submit" className="btn-cuidador-register" disabled={submitting}>
                {submitting ? t('cuidador.form.submitting') : t('cuidador.form.submit')}
              </button>
            </div>
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
          {t('cuidador.headerPrefix')}: {selectedCuidador ? `${selectedCuidador.nombre} ${selectedCuidador.apellido_paterno || ''} ${selectedCuidador.apellido_materno || ''}`.trim().toUpperCase() : nombreUsuario}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <LanguageSelector lightBg={true} />
          <div className="header-logo-container">
            <img src={logoImg} alt={t('personal.logoAlt', { defaultValue: 'Mente Conecta Logo' })} />
          </div>
        </div>
      </header>

      <div className="cards-container">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={`/cuidador/${card.slug}`}
            state={{ sectionId: card.id, sectionTitle: card.title, sectionDesc: '' }}
            className="card-link"
            aria-label={t('personal.viewQuestionnairesFor', { section: t(`category.${card.slug}.title`, { defaultValue: card.title }) })}
          >
            <div className={`card-item ${card.borderColor}`}>
              <img src={card.image} alt={t(`category.${card.slug}.title`, { defaultValue: card.title })} />
              <div className="card-overlay">
                <h3>{t(`category.${card.slug}.title`, { defaultValue: card.title })}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}