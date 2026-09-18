import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../../hooks';
import { BASE_API_F1, TOKEN } from '../../../utils/constants';
import './QuejasRH.scss';

export function QuejasRH() {
  const { auth } = useAuth();
  const [quejas, setQuejas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedQueja, setSelectedQueja] = useState(null);
  const [formData, setFormData] = useState({ estatus: '', notas_rh: '' });

  const fetchQuejas = async () => {
    try {
      const token = auth?.token || sessionStorage.getItem(TOKEN);
      const url = `${BASE_API_F1 || 'http://localhost:8000'}/dashboards/b2b/quejas_lista/`;
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        setQuejas(data.resultados);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuejas();
  }, [auth]);

  const handleOpenModal = (q) => {
    setSelectedQueja(q);
    setFormData({ estatus: q.estatus, notas_rh: q.notas_rh || '' });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const token = auth?.token || sessionStorage.getItem(TOKEN);
      const url = `${BASE_API_F1 || 'http://localhost:8000'}/dashboards/b2b/quejas_update/`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedQueja.id, ...formData })
      });
      setShowModal(false);
      fetchQuejas();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container fluid className="quejas-rh-executive">


      <Row className="mb-4">
        <Col xs={12}>
          <Card className="panel-card quejas-main-card border-purple-left">
            <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
              <h5 className="panel-title mb-0">Buzón de Quejas y Denuncias (Activos)</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table borderless hover className="executive-table mb-0 text-center align-middle">
                  <thead>
                    <tr>
                      <th className="text-start ps-4">ID</th>
                      <th className="text-start">FECHA CREACIÓN</th>
                      <th className="text-start">TIPO</th>
                      <th className="text-start">DESCRIPCIÓN</th>
                      <th className="text-start">REMITENTE</th>
                      <th className="text-start">ESTATUS</th>
                      <th className="pe-4">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6" className="py-4">Cargando...</td></tr>
                    ) : quejas.length === 0 ? (
                      <tr><td colSpan="6" className="text-center text-muted py-4">No hay quejas registradas por el momento.</td></tr>
                    ) : (
                      quejas.map(q => (
                        <tr key={q.id}>
                          <td className="text-start ps-4 fw-bold">#{q.id}</td>
                          <td className="text-start">{q.fecha_creacion}</td>
                          <td className="text-start">{q.tipo}</td>
                          <td className="text-start" style={{ maxWidth: '200px' }}>
                            <div className="text-truncate">{q.descripcion}</div>
                          </td>
                          <td className="text-start">{q.remitente}</td>
                          <td className="text-start">
                            <Badge bg={q.estatus === 'Resuelto' ? 'success' : q.estatus === 'En Proceso' ? 'warning' : 'danger'}>
                              {q.estatus}
                            </Badge>
                          </td>
                          <td className="pe-4">
                            <Button variant="outline-primary" size="sm" onClick={() => handleOpenModal(q)}>Revisar</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Reporte #{selectedQueja?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQueja && (
            <>
              <p><strong>Remitente:</strong> {selectedQueja.remitente}</p>
              <p><strong>Tipo:</strong> {selectedQueja.tipo}</p>
              <p><strong>Fecha Suceso:</strong> {selectedQueja.fecha_suceso || 'No especificada'}</p>
              <p><strong>Descripción:</strong></p>
              <div className="p-3 bg-light rounded mb-3">{selectedQueja.descripcion}</div>
              
              <Form.Group className="mb-3">
                <Form.Label>Cambiar Estatus</Form.Label>
                <Form.Select value={formData.estatus} onChange={e => setFormData({...formData, estatus: e.target.value})}>
                  <option value="Abierto">Abierto</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Resuelto">Resuelto</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Notas Internas (RH)</Form.Label>
                <Form.Control as="textarea" rows={3} value={formData.notas_rh} onChange={e => setFormData({...formData, notas_rh: e.target.value})} placeholder="Anotaciones confidenciales de RH" />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleUpdate}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
