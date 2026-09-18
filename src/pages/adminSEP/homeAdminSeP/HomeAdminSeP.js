import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useAuth } from '../../../hooks';
import { CardInfoNavigation } from '../../../components/common';
import { getConteoNivelRiesgoSePAdminApi } from '../../../api/sep/gestoresSEP';

export function HomeAdminSeP() {
    const { auth } = useAuth();
    const [datosAdmin, setDatosAdmin] = useState([]);
    const [loading, setLoading] = useState(true);

   
    const nombresSedes = {

        29: "Centro de Estudios Tecnológicos Ecatepec",
        30: "Preparatoria Oficial No. 128",
        31: "Secundaria Técnica 55",
        32: "Universidad Tecnológica de Nezahualcóyotl",
        33: "CBT No. 2 Nezahualcóyotl",
        34: "UAEM - Unidad Académica Toluca",
        35: "Instituto Tecnológico de Toluca",
        36: "Escuela Secundaria Oficial No. 1",
        37: "UAM Iztapalapa - Plantel Central",
        38: "CETIS No. 53 Iztapalapa",
        39: "Secundaria Diurna No. 115",
        40: "IPN - Escuela Superior de Ingeniería (ESIME)",
        41: "Preparatoria Nacional Plantel 9 UNAM",
        42: "Facultad de Filosofía y Letras UNAM",
        43: "CBTIS No. 2 Coyoacán",
        44: "Secundaria Técnica No. 17"
    };

    
    const idSedeUsuario = auth?.me?.sede_id || 8; 
    const nombreSedeActual = nombresSedes[idSedeUsuario] || "Sede General";

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await getConteoNivelRiesgoSePAdminApi(auth.token);
                setDatosAdmin(response);
            } catch (error) {
                console.error("Error cargando vista de Admin SEP:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [auth.token]);

    return (
        <Container className="container-home-admin-fase-1" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
            
            <div className="admin-header mb-5">
                <h1 className="fw-bold text-primary">
                    Panel de Administración: {nombreSedeActual}
                </h1>
                <p className="lead text-secondary">
                    Resumen de indicadores de riesgo para esta región.
                </p>
            </div>

            <Row>
                {loading ? (
                    <Col className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2">Sincronizando datos...</p>
                    </Col>
                ) : (
                    datosAdmin.map((item) => (
                        <Col key={item.id_cuestionario} xs={12} sm={6} md={4} className="mb-4">
                            <CardInfoNavigation
                                riskLevel={item.score}
                                account={item.score}
                                title={item.Cuestionario}
                                subTitle={`Sede: ${nombreSedeActual}`}
                                textLink="Ver Reporte Completo"
                                link={`/admin/gestor/sep/columbia`} 
                            />
                        </Col>
                    ))
                )}
            </Row>

            {!loading && (
                <div className="mt-4 p-3 bg-light rounded border">
                    <small className="text-muted">
                        * Datos acumulados de la sede <strong>{nombreSedeActual}</strong>.
                    </small>
                </div>
            )}
        </Container>
    );
}

export default HomeAdminSeP;
