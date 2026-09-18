import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import './AtsRH.scss';

export function AtsRH() {
  return (
    <Container fluid className="ats-rh-executive">
      {/* 1. Alert Block */}
      <Row className="mb-4">
        <Col xs={12}>
          <Alert className="ats-alert d-flex align-items-center mb-0">
            <i className="bi bi-exclamation-triangle-fill text-danger me-3 fs-5"></i>
            <div>
              <strong>0 casos activos</strong> requieren seguimiento médico. Coordina inmediatamente con el servicio médico del trabajo.
            </div>
          </Alert>
        </Col>
      </Row>

      {/* 2. Main Table Card */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="panel-card ats-main-card border-red-left">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center pt-4 pb-2 px-4">
              <h5 className="panel-title mb-0">Registro de casos ATS</h5>
              <Button variant="outline-danger" className="btn-add-case fw-bold rounded-pill px-4">
                + Registrar caso
              </Button>
            </Card.Header>
            <Card.Body className="p-0 mt-3">
              <div className="table-responsive">
                <Table borderless hover className="executive-table mb-0 text-center align-middle">
                  <thead>
                    <tr>
                      <th className="text-start ps-4">FOLIO</th>
                      <th className="text-start">TRABAJADOR</th>
                      <th className="text-start">ÁREA</th>
                      <th>TIPO DE EVENTO</th>
                      <th>FECHA</th>
                      <th>SEC. I</th>
                      <th>SEC. II</th>
                      <th>SEC. III</th>
                      <th>SEC. IV</th>
                      <th>¿ATENCIÓN CLÍNICA?</th>
                      <th>MÉDICO ASIGNADO</th>
                      <th className="pe-4">ESTATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="12" className="text-center text-muted py-4">No hay casos ATS registrados por el momento.</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 3. Info Card */}
      <Row>
        <Col xs={12}>
          <Card className="panel-card pb-3">
            <Card.Header className="bg-white border-0 pt-4 pb-2 px-4">
              <h5 className="panel-title mb-0">Criterios de diagnóstico GR-I</h5>
            </Card.Header>
            <Card.Body className="px-4">
              <div className="info-box mb-4">
                El trabajador requiere atención clínica si <strong>cumple alguno</strong> de los siguientes criterios (después de responder Sí en la Sección I):
              </div>
              <ul className="text-muted criteria-list">
                <li><strong>Sección II:</strong> Responde SÍ en al menos 1 pregunta (recuerdos persistentes)</li>
                <li><strong>Sección III:</strong> Responde SÍ en 3 o más preguntas (esfuerzo por evitar)</li>
                <li><strong>Sección IV:</strong> Responde SÍ en 2 o más preguntas (afectación)</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>
  );
}
