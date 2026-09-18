import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { FiUser, FiCreditCard, FiMail, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../../../../../../hooks';
import { getFamiliaresNeuroXpand, getCuidadoresNeuroXpand, getMeApiNeuroXpand } from '../../../../../../../api/user';
import './datosGeneralesNX.scss';

export function DatosGeneralesNX() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { auth } = useAuth();
    const [relaciones, setRelaciones] = useState([]);
    const [usuarioCompleto, setUsuarioCompleto] = useState(auth?.me || {});

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

        const fetchDatos = async () => {
            try {
            const [familiaresData, cuidadoresData, userData] = await Promise.all([
                    getFamiliaresNeuroXpand(auth.token, userId),
                    getCuidadoresNeuroXpand(auth.token, userId),
                    getMeApiNeuroXpand(auth.token, 2)
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

                if (userData) {
                    setUsuarioCompleto(userData);
                }

            } catch (error) {
                console.error('Error al cargar datos:', error);
                setRelaciones([]);
            }
        };
        
        fetchDatos();
    }, [auth?.token, auth?.me?.id]);

    const fromPath = location.state?.from || (() => {
        const fam = localStorage.getItem('selectedFamiliar');
        if (fam) {
            try {
                const parsed = JSON.parse(fam);
                if (parsed.cuidador_primario === 1 || parsed.cuidador === 1) {
                    return '/cuidadorNX';
                }
            } catch (e) {}
            return '/familiarNX';
        }
        return '/personalNX';
    })();

    return (
        <div className="datosNX-container">
            <div className="datosNX-header">
                <button
                    className="back-btn-datosNX"
                    onClick={() => navigate(fromPath)}
                >
                    ←
                </button>
                <h1>{t('sidebar.dataGeneral', { defaultValue: 'Datos Generales' })}</h1>
            </div>

            <div className="datosNX-cards">
                <div className="datoNX-card morado">
                    <span className="icon"><FiUser /></span>
                    <span>{usuarioCompleto?.nombre}</span>
                </div>
                <div className="datoNX-card gris-datosNX">
                    <span className="icon"><FiUser /></span>
                    <span>{usuarioCompleto?.apellido_paterno}</span>
                </div>
                <div className="datoNX-card morado">
                    <span className="icon"><FiUser /></span>
                    <span>{usuarioCompleto?.apellido_materno}</span>
                </div>
                <div className="datoNX-card gris-datosNX">
                    <span className="icon"><FiCreditCard /></span>
                    <span>{usuarioCompleto?.curp}</span>
                </div>
                <div className="datoNX-card morado">
                    <span className="icon"><FiMail /></span>
                    <span>{usuarioCompleto?.email || usuarioCompleto?.correo}</span>
                </div>
            </div>

            {relaciones.length > 0 && (
                <div className="datosNX-familiar-box">
                    <p className="datosNX-familiar-title">{t('datosGenerales.familiaresYCuidadores')}</p>
                    <div className="datosNX-familiar-grid">
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
                                <div className="datosNX-familiar-card" key={`${item.tipo}-${item.id || nombre}`}>
                                    <span className="icon"><FiUsers /></span>
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