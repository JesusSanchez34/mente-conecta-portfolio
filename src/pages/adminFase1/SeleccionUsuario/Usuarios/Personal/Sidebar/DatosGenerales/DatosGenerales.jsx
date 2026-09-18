import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../../../../../../hooks';
import { getFamiliaresFase1, getCuidadoresFase1 } from '../../../../../../../api/user';

import './DatosGenerales.scss';

export function DatosGenerales() {

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { auth } = useAuth();
    const [relaciones, setRelaciones] = useState([]);

    const getUserId = () => {
        try {
            return auth?.me?.id || (auth?.token ? jwtDecode(auth.token)?.user_id : null);
        } catch (e) {
            return auth?.me?.id || null;
        }
    };

    useEffect(() => {
        const userId = getUserId();
        if (!auth?.token || !userId) return;

        const fetchRelaciones = async () => {
            try {
                const [familiaresData, cuidadoresData] = await Promise.all([
                    getFamiliaresFase1(auth.token, userId),
                    getCuidadoresFase1(auth.token, userId),
                ]);

                const familiares = (familiaresData || []).map(item => ({
                    ...item,
                    tipo: 'FAMILIAR',
                }));
                const cuidadores = (cuidadoresData || []).map(item => ({
                    ...item,
                    tipo: 'CUIDADOR',
                }));

                setRelaciones([...familiares, ...cuidadores]);
            } catch (error) {
                console.error('Error al cargar relaciones:', error);
                setRelaciones([]);
            }
        };

        fetchRelaciones();
    }, [auth?.token, auth?.me?.id]);

    const fromPath = location.state?.from || (() => {
        const fam = localStorage.getItem('selectedFamiliar');
        if (fam) {
            try {
                const parsed = JSON.parse(fam);
                if (parsed.cuidador_primario === 1 || parsed.cuidador === 1) {
                    return '/cuidador';
                }
            } catch (e) {}
            return '/familiar';
        }
        return '/personal';
    })();

    const usuario = auth?.me;

    return (
        <div className="datos-container">

            {/* HEADER */}
            <div className="datos-header">

                <button
                    className="back-btn"
                    onClick={() => navigate(fromPath)}
                >
                    ←
                </button>

                <h1>{t('sidebar.dataGeneral', { defaultValue: 'Datos Generales' })}</h1>

            </div>

            {/* TARJETAS */}
            <div className="datos-cards">

                <div className="dato-card morado">
                    <span className="icon">👤</span>
                    <span>{usuario?.nombre}</span>
                </div>

                <div className="dato-card gris">
                    <span className="icon">👤</span>
                    <span>{usuario?.apellido_paterno}</span>
                </div>

                <div className="dato-card morado">
                    <span className="icon">👤</span>
                    <span>{usuario?.apellido_materno}</span>
                </div>

                <div className="dato-card gris">
                    <span className="icon">🪪</span>
                    <span>{usuario?.curp}</span>
                </div>

                <div className="dato-card morado">
                    <span className="icon">✉️</span>
                    <span>{usuario?.email}</span>
                </div>

            </div>

            {relaciones.length > 0 && (
                <div className="datos-familiar-box">
                    <p className="datos-familiar-title">{t('datosGenerales.familiaresYCuidadores')}</p>
                    <div className="datos-familiar-grid">
                        {relaciones.map((item) => {
                            const nombre = `${item.nombre || ''} ${item.apellido_paterno || ''} ${item.apellido_materno || ''}`.trim();
                            const rawParentesco = item.parentesco || item.relacion || item.parentesco_nombre || '';
                            const translatedParentesco = rawParentesco
                                ? t(`parentescoMap.${rawParentesco.toUpperCase()}`, { defaultValue: rawParentesco })
                                : (item.tipo === 'CUIDADOR' ? t('datosGenerales.tipoCuidador') : t('datosGenerales.tipoFamiliar'));
                            const translatedTipo = item.tipo === 'CUIDADOR'
                                ? t('datosGenerales.tipoCuidador')
                                : t('datosGenerales.tipoFamiliar');
                            return (
                                <div className="datos-familiar-card" key={`${item.tipo}-${item.id || nombre}`}>
                                    <span className="icon">👨‍👩‍👧‍👦</span>
                                    <div>
                                        <strong>{nombre}</strong>
                                        <p>{translatedParentesco}</p>
                                        <small>{translatedTipo}</small>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
}