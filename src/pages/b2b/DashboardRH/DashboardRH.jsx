import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../../hooks';
import './DashboardRH.scss';
import { BASE_API_F1, TOKEN } from '../../../utils/constants';

export function DashboardRH() {
  const { auth } = useAuth();
  const [kpis, setKpis] = useState({
    total_trabajadores: 0,
    total_evaluados: 0,
    cuestionarios_aplicados: 0,
    cuestionarios_pendientes: 0,
    casos_ats_activos: 0,
    quejas_abiertas: 0,
    cumplimiento_porcentaje: 0,
    cfinal_promedio: 0,
    categorias: [],
    niveles_riesgo: { "Nulo": 0, "Bajo": 0, "Medio": 0, "Alto": 0, "Muy alto": 0 }
  });

  useEffect(() => {
    const fetchKpis = async () => {
        try {
            const token = auth?.token || sessionStorage.getItem(TOKEN);
            const url = `${BASE_API_F1 || 'http://localhost:8000'}/dashboards/b2b/kpis/`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setKpis(data);
            }
        } catch (error) {
            console.error("Fetch error", error);
        }
    }
    fetchKpis();
  }, [auth]);

  const trabajadoresPendientes = kpis.total_trabajadores - kpis.total_evaluados;
  const riesgoBajo = (kpis.niveles_riesgo?.Nulo || 0) + (kpis.niveles_riesgo?.Bajo || 0);
  const riesgoAlto = (kpis.niveles_riesgo?.Alto || 0) + (kpis.niveles_riesgo?.['Muy alto'] || 0);
  const riesgoMedio = kpis.niveles_riesgo?.Medio || 0;
  
  const atsRequiere = kpis.niveles_riesgo?.['Requiere valoración'] || 0;
  const atsNoRequiere = kpis.niveles_riesgo?.['No requiere valoración'] || 0;

  return (
    <Container fluid className="dashboard-rh-executive">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <h3 className="fw-bold text-navy">Resumen NOM-035</h3>
      </div>

      {/* FILA 1: KPIs Principales de Progreso */}
      <Row className="mb-4 gx-3 gy-3">
        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card border-primary shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Total de Trabajadores</h6>
                  <h2 className="mb-0 fw-bold">{kpis.total_trabajadores}</h2>
                </div>
                <div className="kpi-icon bg-primary-light text-primary rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card border-success shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Trabajadores Evaluados</h6>
                  <h2 className="mb-0 fw-bold text-success">{kpis.total_evaluados}</h2>
                </div>
                <div className="kpi-icon bg-success-light text-success rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-person-check-fill fs-4"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card border-warning shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Trabajadores Pendientes</h6>
                  <h2 className="mb-0 fw-bold text-warning">{Math.max(0, trabajadoresPendientes)}</h2>
                </div>
                <div className="kpi-icon bg-warning-light text-warning rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-person-dash-fill fs-4"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="kpi-card border-info shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Avance Global</h6>
                  <h2 className="mb-0 fw-bold text-info">{kpis.cumplimiento_porcentaje}%</h2>
                </div>
                <div className="kpi-icon bg-info-light text-info rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-bar-chart-fill fs-4"></i>
                </div>
              </div>
              <ProgressBar now={kpis.cumplimiento_porcentaje} variant="info" className="mt-3" style={{ height: '8px' }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FILA 2: Indicadores de Riesgo G2/G3 (sólo si aplica) */}
      {kpis.has_g2_g3 && (
        <Row className="mb-4 gx-3 gy-3">
          <Col xs={12} md={6}>
            <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #198754' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Riesgo Bajo / Nulo</h6>
                    <h2 className="mb-0 fw-bold text-success">{riesgoBajo} <span className="fs-6 text-muted fw-normal">trabajadores</span></h2>
                  </div>
                  <div className="kpi-icon text-success">
                    <i className="bi bi-shield-check" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #dc3545' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Riesgo Alto / Muy Alto</h6>
                    <h2 className="mb-0 fw-bold text-danger">{riesgoAlto} <span className="fs-6 text-muted fw-normal">trabajadores</span></h2>
                  </div>
                  <div className="kpi-icon text-danger">
                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* FILA 3: Indicadores ATS y Buzón */}
      <Row className="mb-4 gx-3 gy-3">
        <Col xs={12} md={4}>
          <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #198754' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">No Requiere Atención</h6>
                  <h2 className="mb-0 fw-bold text-success">{atsNoRequiere} <span className="fs-6 text-muted fw-normal">trabajadores</span></h2>
                </div>
                <div className="kpi-icon text-success">
                  <i className="bi bi-shield-check" style={{ fontSize: '2.5rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #dc3545' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Requiere Atención Clínica</h6>
                  <h2 className="mb-0 fw-bold text-danger">{atsRequiere} <span className="fs-6 text-muted fw-normal">trabajadores</span></h2>
                </div>
                <div className="kpi-icon text-danger">
                  <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '2.5rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #6f42c1' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Quejas en Buzón</h6>
                  <h2 className="mb-0 fw-bold" style={{ color: '#6f42c1' }}>{kpis.quejas_abiertas} <span className="fs-6 text-muted fw-normal">reportes</span></h2>
                </div>
                <div className="kpi-icon" style={{ color: '#6f42c1' }}>
                  <i className="bi bi-envelope-exclamation-fill" style={{ fontSize: '2.5rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Opcional: Detalle de riesgo y ATS */}
      <Row className="mb-4 gx-3 gy-3 justify-content-center">
        <Col xs={12} lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white pt-4 pb-2 border-0 text-center">
              <h5 className="fw-bold text-navy">{kpis.has_g2_g3 ? "Distribución de Niveles de Riesgo" : "Distribución de Resultados ATS"}</h5>
            </Card.Header>
            <Card.Body>
               {kpis.has_g2_g3 ? (
                 <>
                   <div className="d-flex align-items-center mb-3">
                      <div className="flex-grow-1">
                          <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted">Nulo / Bajo</span>
                              <strong>{riesgoBajo}</strong>
                          </div>
                          <ProgressBar now={kpis.total_evaluados ? (riesgoBajo / kpis.total_evaluados) * 100 : 0} variant="success" />
                      </div>
                   </div>
                   <div className="d-flex align-items-center mb-3">
                      <div className="flex-grow-1">
                          <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted">Medio</span>
                              <strong>{riesgoMedio}</strong>
                          </div>
                          <ProgressBar now={kpis.total_evaluados ? (riesgoMedio / kpis.total_evaluados) * 100 : 0} variant="warning" />
                      </div>
                   </div>
                   <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                          <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted">Alto / Muy Alto</span>
                              <strong>{riesgoAlto}</strong>
                          </div>
                          <ProgressBar now={kpis.total_evaluados ? (riesgoAlto / kpis.total_evaluados) * 100 : 0} variant="danger" />
                      </div>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="d-flex align-items-center mb-4">
                      <div className="flex-grow-1">
                          <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted">No Requiere Valoración</span>
                              <strong>{atsNoRequiere}</strong>
                          </div>
                          <ProgressBar now={kpis.total_evaluados ? (atsNoRequiere / kpis.total_evaluados) * 100 : 0} variant="success" style={{ height: '10px' }} />
                      </div>
                   </div>
                   <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                          <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted">Requiere Valoración Clínica</span>
                              <strong>{atsRequiere}</strong>
                          </div>
                          <ProgressBar now={kpis.total_evaluados ? (atsRequiere / kpis.total_evaluados) * 100 : 0} variant="danger" style={{ height: '10px' }} />
                      </div>
                   </div>
                 </>
               )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
