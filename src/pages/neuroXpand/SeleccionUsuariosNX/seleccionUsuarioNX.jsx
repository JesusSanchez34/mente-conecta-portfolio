import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './seleccionUsuarioNX.css'; 

import personalImg from '../../../assets/img/personal.jpg';
import familiarImg from '../../../assets/img/familiar.jpg';
import cuidadorImg from '../../../assets/img/cuidador.png';

export function SeleccionUsuarioNX() { 

    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        localStorage.removeItem('selectedFamiliar');
    }, []);

    const handleSelect = (tipo) => {
        if (tipo === 'personal') {
            navigate('/personalNX'); 
        }
        if (tipo === 'familiar') {
            navigate('/familiarNX');
        }
        if (tipo === 'cuidador') {
            navigate('/cuidadorNX');
        }
    };

    return (
        <div className="seleccionNX-container"> 

            <div className="seleccionNX-header">
                {t('selectUser.whoWillDo')}
            </div>

            {/* PERSONAL */}
            <div
                className="seleccionNX-card"
                onClick={() => handleSelect('personal')}
            >
                <img src={personalImg} alt="Personal" />

                <div className="overlayNX">
                    <h2>{t('selectUser.options.personal')}</h2>
                </div>
            </div>

            {/* FAMILIAR */}
            <div
                className="seleccionNX-card"
                onClick={() => handleSelect('familiar')}
            >
                <img src={familiarImg} alt="Familiar" />

                <div className="overlayNX">
                    <h2>{t('selectUser.options.familiar')}</h2>
                </div>
            </div>

            {/* CUIDADOR */}
            <div
                className="seleccionNX-card"
                onClick={() => handleSelect('cuidador')}
            >
                <img
                    src={cuidadorImg}
                    alt="Cuidador Primario"
                    style={{ objectPosition: 'center 20%' }}
                />

                <div className="overlayNX">
                    <h2>{t('selectUser.options.caregiver')}</h2>
                </div>
            </div>

        </div>
    );
}