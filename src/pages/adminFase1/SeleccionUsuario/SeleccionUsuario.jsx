import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SeleccionUsuario.css';

import personalImg from '../../../assets/img/personal.jpg';
import familiarImg from '../../../assets/img/familiar.jpg';
import cuidadorImg from '../../../assets/img/cuidador.png';

export function SeleccionUsuario() {

    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        localStorage.removeItem('selectedFamiliar');
    }, []);

    const handleSelect = (tipo) => {

        console.log("Seleccionado:", tipo);

        if (tipo === 'personal') {
            navigate('/personal');
        }

        if (tipo === 'familiar') {
            navigate('/familiar');
        }

        if (tipo === 'cuidador') {
            navigate('/cuidador');
        }
    };

    return (
        <div className="seleccion-container">

            <div className="seleccion-header">
                {t('selectUser.whoWillDo')}
            </div>

            {/* PERSONAL */}
            <div
                className="seleccion-card"
                onClick={() => handleSelect('personal')}
            >
                <img src={personalImg} alt="Personal" />

                <div className="overlay">
                    <h2>{t('selectUser.options.personal')}</h2>
                </div>
            </div>

            {/* FAMILIAR */}
            <div
                className="seleccion-card"
                onClick={() => handleSelect('familiar')}
            >
                <img src={familiarImg} alt="Familiar" />

                <div className="overlay">
                    <h2>{t('selectUser.options.familiar')}</h2>
                </div>
            </div>

            {/* CUIDADOR */}
            <div
                className="seleccion-card"
                onClick={() => handleSelect('cuidador')}
            >
                <img
                    src={cuidadorImg}
                    alt="Cuidador Primario"
                    style={{ objectPosition: 'center 20%' }}
                />

                <div className="overlay">
                    <h2>{t('selectUser.options.caregiver')}</h2>
                </div>
            </div>

        </div>
    );
}