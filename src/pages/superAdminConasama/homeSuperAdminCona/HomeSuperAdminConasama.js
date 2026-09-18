import { Row, Col, Tabs, Tab, Container } from 'react-bootstrap'; 
import { useState, useEffect } from 'react'; 
import { useAuth } from '../../../hooks';
import { CardInfoNavigation } from '../../../components/common';
import { getConteoNivelRiesgoApi } from '../../../api/conasama/gestores';

import './HomeSuperAdminConasama.css'; 

const sedesPorOrganizacion = {
  0: {
    1: "Ciudad de México",
    2: "Morelos",
    3: "Tlaxcala",
    4: "Hidalgo",
    5: "UPEM Ecatepec",
    6: "UPEM Tecamac",
    7: "Dra. Alma",
  },
  1: {
    1: "Ciudad de México",
    2: "Morelos",
    3: "Tlaxcala",
    4: "Hidalgo",
  },
  2: {
    5: "UPEM Ecatepec",
    6: "UPEM Tecamac",
    7: "Dra. Alma",
  }
};

export function HomeSuperAdminConasama() {
    const { auth } = useAuth();

    const organizacion = auth?.me?.organizacion;

    const sedesDisponibles = sedesPorOrganizacion[organizacion] || {};
    const idsSedes = Object.keys(sedesDisponibles);

    const [key, setKey] = useState(null);
    const [sedesData, setSedesData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (idsSedes.length > 0) {
            setKey(idsSedes[0]);
        }
    }, [organizacion]);

    useEffect(() => {
        if (!key || !auth?.token) return;

        const fetchData = async () => {
            try {
            setLoading(true);

            const data = await getConteoNivelRiesgoApi(Number(key), auth.token);

            setSedesData((prev) => ({
                ...prev,
                [key]: data || []
            }));

            } catch (error) {
            console.error(error);
            } finally {
            setLoading(false);
            }
        };

        fetchData();
    }, [key, auth?.token]);

    return (
        <Container className="mt-4 container-home-admin-fase-1" style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div className="header-dashboard mb-4">
                <h1 className="fw-bold text-primary">Panel Super Admin</h1>
                <p className="text-muted">Indicadores específicos por estado.</p>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2">Cargando datos regionales...</p>
                </div>
            ) : (
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-4 custom-tabs"
                    fill
                >
                {idsSedes.map((id) => (
                    <Tab
                        eventKey={id}
                        title={sedesDisponibles[id]}
                        key={id}
                    >
                    <div className="p-4 bg-light rounded shadow-sm border">
                        <h3 className="mb-4 text-secondary">
                        Sede: {sedesDisponibles[id]}
                        </h3>

                        <Row>
                        {sedesData[id]?.length > 0 ? (
                            sedesData[id].map((item) => (
                            <Col
                                key={`${id}-${item.id_cuestionario}`}
                                xs={12}
                                sm={6}
                                lg={4}
                                className="mb-4"
                            >
                                <CardInfoNavigation
                                riskLevel={item.score}
                                account={item.score}
                                title={item.Cuestionario}
                                textLink="Ver análisis"
                                link={`/admin/super-gestor/conasama/pacientes-riesgo`}
                                />
                            </Col>
                            ))
                        ) : (
                            <Col xs={12} className="text-center py-5">
                            <p className="text-muted italic">
                                No se encontraron datos para {sedesDisponibles[id]}.
                            </p>
                            </Col>
                        )}
                        </Row>
                    </div>
                    </Tab>
                ))}
                </Tabs>
            )}
        </Container>
    );
}