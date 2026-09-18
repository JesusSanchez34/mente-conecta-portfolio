import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { FiUser, FiCreditCard } from 'react-icons/fi';
import './cuidadorNX.scss';
import socioImg from '../../../../../assets/img/sociodemograficos.jpeg';
import mentalImg from '../../../../../assets/img/saludmental.jpeg';
import fisicaImg from '../../../../../assets/img/saludfisica.jpeg';
import socialImg from '../../../../../assets/img/determinantes.jpeg';
import logoImg from '../../../../../assets/img/Icono_home.jpeg';
import { SidebarNX as Sidebar } from '../personalNX/sidebarNX';
import { LanguageSelector } from '../../../../../components/ui';
import { useAuth } from '../../../../../hooks';
import {
  getCuidadoresNeuroXpand,
  registrarCuidadorNeuroXpand,
  eliminarFamiliarNeuroXpand
} from '../../../../../api/user';

const cards = [
  { id: 1, title: 'SOCIODEMOGRÁFICOS', slug: 'sociodemograficos', image: socioImg, borderColor: 'border-azul' },
  { id: 2, title: 'SALUD MENTAL', slug: 'salud-mental', image: mentalImg, borderColor: 'border-verde' },
  { id: 3, title: 'SALUD FÍSICA', slug: 'salud-fisica', image: fisicaImg, borderColor: 'border-morado' },
  { id: 4, title: 'DETERMINANTES SOCIALES', slug: 'determinantes-sociales', image: socialImg, borderColor: 'border-amarillo' },
];

export function CuidadorNX() {
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

  const [stage, setStage] = useState('list'); 
  const [cuidadores, setCuidadores] = useState([]);
  const [selectedCuidador, setSelectedCuidador] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
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

  const fetchCuidadores = async () => {
    const userId = getUserId();
    if (!auth?.token || !userId) return;
    setLoading(true);
    try {
      const data = await getCuidadoresNeuroXpand(auth.token, userId);
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
          await eliminarFamiliarNeuroXpand(auth.token, id);
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
        rango_edad: auth?.me?.edades || 1,
        cuidador_primario: 1,
      };
      await registrarCuidadorNeuroXpand(auth.token, payload);
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

  const handleBackFromCategories = () => {
    localStorage.removeItem('selectedFamiliar');
    setSelectedCuidador(null);
    setStage('list');
    fetchCuidadores();
  };
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  // VISTA 1: LISTA
  if (stage === 'list') {
    return (
      <div className="familiarNX-list-container">
        <header className="familiarNX-list-header">
          <button className="back-arrow-btn-familiarNX" onClick={() => navigate('/seleccion-usuarioNX')} aria-label="Volver">
            ←
          </button>
          <h2>{t('cuidador.listTitle', { defaultValue: 'Cuidador Listado' })}</h2>
          <LanguageSelector lightBg={true} />
        </header>
        <div className="familiarNX-list-body">
          {loading ? (
            <div className="loading-container-centered-familiarNX">
              <div className="loading-circle-centered-familiarNX">
                <span>{t('cuidador.loading', { defaultValue: 'Cargando...' })}</span>
              </div>
            </div>
          ) : cuidadores.length === 0 ? (
            <div className="familiarNX-empty-state"></div>
          ) : (
            <div className="familiarNX-cards-grid">
              {cuidadores.map((fam) => (
                <div className="familiarNX-card" key={fam.id}>
                  <div className="familiarNX-card-info">
                    <div className="familiarNX-card-avatar">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="#8b4c95" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="familiarNX-card-details">
                      <h4>
                        {(fam.nombre || '').toUpperCase()} {(fam.apellido_paterno || '').toUpperCase()} {(fam.apellido_materno || '').toUpperCase()}
                      </h4>
                      <p>{t('cuidador.role', { defaultValue: 'CUIDADOR' })}</p>
                    </div>
                  </div>
                  <div className="familiarNX-card-actions">
                    <button className="btn-select-familiarNX" onClick={() => handleSelectCuidador(fam)}>
                      {t('cuidador.select', { defaultValue: 'Seleccionar' })}
                    </button>
                    <button className="btn-delete-familiarNX" onClick={() => handleDeleteCuidador(fam.id)}>
                      {t('cuidador.delete', { defaultValue: 'Eliminar' })}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button 
          className="btn-cuidadorNX-register" 
          onClick={() => setStage('register')} 
          style={{ 
            position: 'absolute', 
            bottom: '40px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            margin: 0
          }}
        >
          {t('cuidador.addBtn', { defaultValue: '+ Agregar Cuidador Primario' })}
        </button>
      </div>
    );
  }

  // VISTA 2: REGISTRO
  if (stage === 'register') {
    return (
      <div className="familiarNX-register-container">
        <header className="familiarNX-list-header">
          <button className="back-arrow-btn-familiarNX" onClick={() => setStage('list')} aria-label="Volver">
            ←
          </button>
          <h2>{t('cuidador.registerTitle', { defaultValue: 'Registrar Cuidador' })}</h2>
          <LanguageSelector lightBg={true} />
        </header>
        <div className="familiarNX-register-body">
          <div className="avatar-silhouette-familiarNX">
            <svg viewBox="0 0 24 24" width="100" height="100">
              <path fill="#5c5470" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h3 className="cuidadorNX-register-label" style={{ textAlign: 'center' }}>{t('cuidador.formSectionLabel', { defaultValue: 'Ingresa los datos' })}</h3>
          <form onSubmit={handleRegisterSubmit} className="familiarNX-register-form">
            <div className="input-with-icon-wrapper-familiarNX">
              <input
                type="text"
                name="nombre"
                placeholder={t('cuidador.form.nombre', { defaultValue: 'Nombre' })}
                value={formValues.nombre}
                onChange={handleFormChange}
                required
              />
              <span className="input-icon-right"><FiUser /></span>
            </div>
            <div className="input-with-icon-wrapper-familiarNX">
              <input
                type="text"
                name="apellidoPaterno"
                placeholder={t('cuidador.form.apellidoPaterno', { defaultValue: 'Apellido Paterno' })}
                value={formValues.apellidoPaterno}
                onChange={handleFormChange}
                required
              />
              <span className="input-icon-right"><FiUser /></span>
            </div>
            <div className="input-with-icon-wrapper-familiarNX">
              <input
                type="text"
                name="apellidoMaterno"
                placeholder={t('cuidador.form.apellidoMaterno', { defaultValue: 'Apellido Materno' })}
                value={formValues.apellidoMaterno}
                onChange={handleFormChange}
                required
              />
              <span className="input-icon-right"><FiUser /></span>
            </div>
            <div className="input-with-icon-wrapper-familiarNX curp-wrapper-familiarNX">
              <input
                type="text"
                name="curp"
                placeholder={t('cuidador.form.curp', { defaultValue: 'CURP' })}
                value={formValues.curp}
                onChange={handleFormChange}
                required
              />
              <span className="input-icon-right"><FiCreditCard /></span>
              <span className="curp-char-counter-familiarNX">{formValues.curp.length}/18</span>
            </div>
            <button type="submit" className="submit-register-btn-familiarNX" disabled={submitting}>
              {submitting ? t('cuidador.form.submitting', { defaultValue: 'Enviando...' }) : t('cuidador.form.submit', { defaultValue: '¡Regístrate!' })}
            </button>
          </form>
        </div>
      </div>
    );
  }

 // VISTA 3: CATEGORÍAS
  return (
    <div className="cuidadorNX-container">
      <Sidebar isOpen={menuAbierto} onClose={toggleMenu} />

      <header className="cuidadorNX-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>


          <button className="hamburger-btn-familiarNX" onClick={toggleMenu} aria-label={t('personal.openMenu')}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>

        <h2 className="cuidadorNX-header-title" style={{ margin: 0 }}>
          {t('cuidador.headerPrefix', { defaultValue: 'CUIDADOR' })}: {selectedCuidador ? `${selectedCuidador.nombre} ${selectedCuidador.apellido_paterno || ''} ${selectedCuidador.apellido_materno || ''}`.trim().toUpperCase() : nombreUsuario}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <LanguageSelector lightBg={true} />
          <div className="header-logo-container">
            <img src={logoImg} alt={t('personal.logoAlt', { defaultValue: 'Mente Conecta Logo' })} style={{ width: '40px' }} />
          </div>
        </div>
      </header>

      <div className="categories-grid-familiarNX">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={`/cuidadorNX/${card.slug}`} 
            state={{ sectionId: card.id, sectionTitle: card.title, sectionDesc: '' }}
            style={{ textDecoration: 'none' }}
            aria-label={t('personal.viewQuestionnairesFor', { section: t(`category.${card.slug}.title`, { defaultValue: card.title }) })}
          >
            <div className={`category-card-familiarNX ${card.borderColor}`}>
              <img src={card.image} alt={t(`category.${card.slug}.title`, { defaultValue: card.title })} />
              <div className="card-overlay-familiarNX">
                <h3>{t(`category.${card.slug}.title`, { defaultValue: card.title })}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}