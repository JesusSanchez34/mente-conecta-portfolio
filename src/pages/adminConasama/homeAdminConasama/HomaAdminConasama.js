import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useAuth } from '../../../hooks';
import { CardInfoNavigation } from '../../../components/common';
import { getConteoNivelRiesgoAdminApi } from '../../../api/conasama/gestores';

export function HomaAdminConasama() {
    const { auth } = useAuth();
    const [datosAdmin, setDatosAdmin] = useState([]);
    const [loading, setLoading] = useState(true);

   
    const nombresSedes = {
        1: "Ciudad de México",
        2: "Morelos",
        3: "Tlaxcala",
        4: "Hidalgo"
    };

    
    const idSedeUsuario = auth?.user?.id_sede || 1; 
    const nombreSedeActual = nombresSedes[idSedeUsuario] || "Sede General";

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await getConteoNivelRiesgoAdminApi(auth.token);
                setDatosAdmin(response);
            } catch (error) {
                console.error("Error cargando vista de Admin:", error);
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
                                link={`/admin/gestor/conasama/columbia`} 
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