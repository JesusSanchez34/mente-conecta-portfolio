import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { BASE_API_F1, TOKEN } from '../../../utils/constants';
import { FaArrowLeft } from 'react-icons/fa';

export function QuejasTrabajador() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    tipo: 'Violencia Laboral',
    descripcion: '',
    fecha_suceso: '',
    involucrados: '',
    es_anonimo: false
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [otroTipo, setOtroTipo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });
    try {
      const payload = { ...formData };
      if (payload.tipo === 'Otros') {
        payload.tipo = otroTipo.trim().substring(0, 100) || 'Otros';
      }

      const token = auth?.token || sessionStorage.getItem(TOKEN);
      const response = await fetch(`${BASE_API_F1 || 'http://localhost:8000'}/dashboards/trabajador/quejas/enviar/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ ...formData, descripcion: '', fecha_suceso: '', involucrados: '', es_anonimo: false });
        setOtroTipo('');
      } else {
        setStatus({ loading: false, success: false, error: "Hubo un error al enviar el reporte." });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="container py-4">
      <Button variant="link" className="text-decoration-none mb-3 px-0 text-navy" onClick={() => navigate('/personal/nom-035')}>
        <FaArrowLeft className="me-2" /> Regresar al dashboard
      </Button>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4">
          <h4 className="mb-0 text-navy fw-bold">Buzón de Quejas y Denuncias (NOM-035)</h4>
        </Card.Header>
        <Card.Body className="p-4">
          <Alert variant="info" className="mb-4">
            Este espacio es para reportar prácticas opuestas al entorno organizacional favorable, casos de violencia laboral, acoso o condiciones inseguras. Puedes decidir si deseas enviar este reporte de forma 100% anónima.
          </Alert>

          {status.success && <Alert variant="success">El reporte ha sido enviado exitosamente y será revisado por Recursos Humanos.</Alert>}
          {status.error && <Alert variant="danger">{status.error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Reporte</Form.Label>
              <Form.Select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} required>
                <option value="Violencia Laboral">Violencia Laboral / Acoso</option>
                <option value="Condiciones Inseguras">Condiciones de Trabajo Inseguras</option>
                <option value="Acontecimientos Traumáticos">Acontecimientos Traumáticos Severos</option>
                <option value="Discriminación o Trato Desigual">Discriminación o Trato Desigual</option>
                <option value="Hostigamiento Sexual">Hostigamiento Sexual</option>
                <option value="Sobrecarga de Trabajo">Sobrecarga de Trabajo</option>
                <option value="Falta de Claridad en Funciones">Falta de Claridad en Funciones</option>
                <option value="Conflicto con Compañeros">Conflicto con Compañeros</option>
                <option value="Liderazgo Negativo / Jefatura">Liderazgo Negativo / Jefatura</option>
                <option value="Incompatibilidad Familia-Trabajo">Incompatibilidad Familia-Trabajo</option>
                <option value="Falta de Capacitación">Falta de Capacitación</option>
                <option value="Problemas de Comunicación Interna">Problemas de Comunicación Interna</option>
                <option value="Falta de Reconocimiento">Falta de Reconocimiento o Retroalimentación</option>
                <option value="Sugerencia">Sugerencia de Mejora</option>
                <option value="Otros">Otros</option>
              </Form.Select>
            </Form.Group>

            {formData.tipo === 'Otros' && (
              <Form.Group className="mb-3">
                <Form.Label>Especifica el motivo de tu queja <small className="text-muted">(Máximo 100 caracteres)</small></Form.Label>
                <Form.Control 
                  type="text" 
                  maxLength={100} 
                  value={otroTipo} 
                  onChange={e => setOtroTipo(e.target.value)} 
                  required 
                  placeholder="Escribe brevemente el tipo de reporte..." 
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Descripción detallada de los hechos</Form.Label>
              <Form.Control as="textarea" rows={5} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} required placeholder="Describe qué ocurrió, dónde y cómo..." />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha del suceso (opcional)</Form.Label>
              <Form.Control type="date" value={formData.fecha_suceso} onChange={e => setFormData({...formData, fecha_suceso: e.target.value})} />
            </Form.Group>


            <Form.Group className="mb-4 border p-3 rounded bg-light">
              <Form.Check 
                type="switch"
                id="anonimo-switch"
                label={<strong className="text-danger">Enviar de forma 100% anónima</strong>}
                checked={formData.es_anonimo}
                onChange={e => setFormData({...formData, es_anonimo: e.target.checked})}
              />
              <Form.Text className="text-muted d-block mt-2">
                Si activas esta opción, el sistema no guardará tu nombre ni correo electrónico, y el área de Recursos Humanos no podrá saber quién envió este reporte.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button type="submit" variant="primary" size="lg" disabled={status.loading}>
                {status.loading ? 'Enviando...' : 'Enviar Reporte'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
