import React, { useState, useEffect, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from '../../../hooks';
import { CardInfoNavigation } from '../../../components/common';
import { getConteoNivelRiesgoSePBySedeApi } from '../../../api/sep/gestoresSEP';

import './HomeSuperAdminSeP.css';

const sedesPorSubsistemaConstant = {
  'SUBSISTEMA DE UNIVERSIDADES DEL ESTADO DE MEXICO': {
    1: 'U DIGITAL DEL ESTADO DE MEXICO',
    2: 'U MEXIQUENSE DEL BICENTENARIO',
    3: 'U INTERCULTURAL DEL ESTADO DE MEXICO'
  },
  'SUBSISTEMA TECNOLOGICOS': {
    4: 'TES ECATEPEC',
    5: 'TES COACALCO',
    6: 'TES CHIMALHUACAN',
    7: 'TES CHALCO',
    8: 'TES CUAUTITLAN IZCALLI',
    9: 'TES HUIXQUILUCAN',
    10: 'TES IXTAPALUCA',
    11: 'TES JOCOTITLAN',
    12: 'TES SAN FELIPE DEL PROGRESO',
    13: 'TES TIANGUISTENGO',
    14: 'TES VALLE DE BRAVO',
    15: 'TES VILLA GUERRERO'
  },
  'SUBSISTEMA DE UNIVERSIDADES POLITECNICAS': {
    16: 'UP VALLE DE TOLUCA',
    17: 'UP VALLE DE MEXICO',
    18: 'UP TEXCOCO',
    19: 'UP ATLAUTLA',
    20: 'UP TECAMAC',
    21: 'UP ATLACOMULCO',
    22: 'UP OTZOLOTEPEC',
    23: 'UP CUATITLAN IZCALLI',
    24: 'UP CHIMALHUACAN'
  },
  'SUBSISTEMA DE UNIVERSIDADES TECNOLOGICAS': {
    25: 'UT NEZAHUALCOYOTL',
    26: 'UT DEL VALLE DE TOLUCA',
    27: 'UT FIDEL VELAZQUEZ',
    28: 'UT TECAMAC',
    29: 'UT ZINACANTEPEC',
    30: 'UT DEL SUR DEL ESTADO DE MEXICO'
  }
};

export function HomeSuperior() {
    const { auth } = useAuth();

    const [subsistemaSeleccionado, setSubsistemaSeleccionado] = useState('SUBSISTEMA DE UNIVERSIDADES DEL ESTADO DE MEXICO');
    const [sedeSeleccionada, setSedeSeleccionada] = useState('1'); 
    const [sedesData, setSedesData] = useState({});
    const [loading, setLoading] = useState(false);

    const sedesPorSubsistema = useMemo(() => sedesPorSubsistemaConstant, []);
    const sedesDelSubsistema = useMemo(
        () => sedesPorSubsistema[subsistemaSeleccionado] || {},
        [subsistemaSeleccionado, sedesPorSubsistema]
    );

    const idsSedes = useMemo(
        () => Object.keys(sedesDelSubsistema),
        [sedesDelSubsistema]
    );

    useEffect(() => {
        const cargarDatos = async () => {
            if (!auth?.token || !sedeSeleccionada) return;

            try {
                setLoading(true);

                const data = await getConteoNivelRiesgoSePBySedeApi(
                    Number(sedeSeleccionada),
                    auth.token
                );

                setSedesData({
                    [sedeSeleccionada]: data || []
                });
            } catch (error) {
                console.error("Error cargando datos:", error);
                setSedesData({ [sedeSeleccionada]: [] });
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [sedeSeleccionada, auth?.token]);

    return (
        <Container className="container-super-admin-sep">
            <header className="header-dashboard mb-5">
                <h1>🎓 Inicio Superior SEP</h1>
                <p className="lead">Sistema de Evaluación y Prevención de Riesgos</p>
            </header>

            <div className="filtros-container mb-5">
                <div className="filtro-wrapper">
                    <label className="filtro-label">🏫 Seleccionar Subsistema:</label>

                    <select
                        className="filtro-select"
                        value={subsistemaSeleccionado}
                        onChange={(e) => {
                            const nuevoSubsistema = e.target.value;
                            const primeraSede = Object.keys(
                                sedesPorSubsistemaConstant[nuevoSubsistema]
                            )[0];

                            setSubsistemaSeleccionado(nuevoSubsistema);
                            setSedeSeleccionada(primeraSede);
                        }}
                    >
                        {Object.keys(sedesPorSubsistema).map((subsistema) => (
                            <option key={subsistema} value={subsistema}>
                                {subsistema} ({Object.keys(sedesPorSubsistema[subsistema]).length} escuelas)
                            </option>
                        ))}
                    </select>
                </div>

                {idsSedes.length > 0 && (
                    <div className="filtro-wrapper">
                        <label className="filtro-label">🏢 Seleccionar Escuela:</label>

                        <select
                            className="filtro-select"
                            value={sedeSeleccionada || ''}
                            onChange={(e) => setSedeSeleccionada(e.target.value)}
                        >
                            {idsSedes.map((id) => (
                                <option key={id} value={id}>
                                    {sedesDelSubsistema[id]}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {sedeSeleccionada && (
                <div className="estado-resumen mb-5">
                    <div className="resumen-contenido">
                        <h2 className="resumen-titulo">
                            {sedesDelSubsistema[sedeSeleccionada]}
                        </h2>
                        <p className="resumen-subtitulo">{subsistemaSeleccionado}</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading-container-super">
                    <div className="loading-spinner-super" role="status"></div>
                    <p className="loading-text-super">Sincronizando datos...</p>
                </div>
            ) : sedeSeleccionada && sedesData[sedeSeleccionada] ? (
                <div className="sedes-container">
                    <div className="sedes-grid-super">
                        {sedesData[sedeSeleccionada].length > 0 ? (
                            sedesData[sedeSeleccionada].map((item) => (
                                <div key={item.id_cuestionario} className="sede-card-super">
                                    <div className="sede-card-header">
                                        <h4 className="sede-nombre">{item.Cuestionario}</h4>
                                    </div>

                                    <div className="sede-card-content">
                                        <CardInfoNavigation
                                            riskLevel={item.score}
                                            account={item.score}
                                            title={item.Cuestionario}
                                            subTitle={sedesDelSubsistema[sedeSeleccionada]}
                                            textLink="Ver Reporte"
                                            link="/admin/superior-gestor/sep/pacientes-riesgo"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="sede-sin-datos">
                                <p>Sin datos de evaluación</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="loading-container-super">
                    <p className="loading-text-super">
                        Selecciona una escuela para ver los datos
                    </p>
                </div>
            )}
        </Container>
    );
}

export default HomeSuperior;