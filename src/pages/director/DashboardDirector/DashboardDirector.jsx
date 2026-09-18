import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Badge, Table } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../../hooks';
import { BASE_API_F1, TOKEN } from '../../../utils/constants';
import './DashboardDirector.scss';

export function DashboardDirector() {
  const { auth } = useAuth();
  const [data, setData] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [rhEmpleados, setRhEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const exportarPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Directorio de Trabajadores y Resultados Globales", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    const empresaNombre = data?.empresa_info?.nombre || 'N/A';
    doc.text(`Empresa: ${empresaNombre}`, 14, 30);
    
    const hasG2OrG3 = empleados.some(e => e.guia === 'G2' || e.guia === 'G3');
    
    const tableColumn = ["FOLIO", "NOMBRE COMPLETO", "CORREO ELECTRÓNICO", "GUÍA I (ATS)", "FECHA GUÍA I"];
    if (hasG2OrG3) {
      const dynamicDateHeader = empleados.length > 0 ? (empleados[0].guia === 'G3' ? 'Fecha Guía III' : 'Fecha Guía II') : 'Fecha Guía';
      tableColumn.push("GUÍA EVALUADA Y NIVEL DE RIESGO", dynamicDateHeader.toUpperCase());
    }
    
    const tableRows = [];

    empleados.forEach(emp => {
      let atsText = "PENDIENTE";
      if (emp.ats_requiere_atencion === 'SÍ') atsText = "REQUIERE VALORACIÓN CLÍNICA";
      if (emp.ats_requiere_atencion === 'NO') atsText = "NO REQUIERE VALORACIÓN";

      const rowData = [
        emp.folio,
        emp.nombre,
        emp.email || 'No registrado',
        atsText,
        emp.fecha_g1 || 'Pendiente'
      ];
      
      if (hasG2OrG3) {
        const guiaText = emp.guia === 'G3' ? 'Guía III' : (emp.guia === 'G2' ? 'Guía II' : 'Guía');
        const nivelRiesgoText = emp.nivel_final ? emp.nivel_final.toUpperCase() : 'PENDIENTE';
        rowData.push(`${guiaText}\n${nivelRiesgoText}`, emp.fecha_riesgo || 'Pendiente');
      }
      
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [27, 54, 93] } // Azul navy similar al dashboard
    });

    if (rhEmpleados && rhEmpleados.length > 0) {
      const finalY = doc.lastAutoTable.finalY || 40;
      
      doc.setFontSize(12);
      doc.setTextColor(27, 54, 93);
      doc.text("Personal de Recursos Humanos", 14, finalY + 15);

      const rhColumns = ["FOLIO", "NOMBRE COMPLETO", "CORREO ELECTRÓNICO"];
      const rhRows = [];

      rhEmpleados.forEach(rh => {
        rhRows.push([
          rh.folio,
          rh.nombre,
          rh.email || 'No registrado'
        ]);
      });

      autoTable(doc, {
        head: [rhColumns],
        body: rhRows,
        startY: finalY + 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [71, 99, 138] } // Color #47638a
      });
    }

    doc.save("directorio_trabajadores.pdf");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = auth?.token || sessionStorage.getItem(TOKEN);
        const [responseKpis, responseLista] = await Promise.all([
          fetch(`${BASE_API_F1}/director/dashboard/kpis/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${BASE_API_F1}/dashboards/b2b/resultados_lista/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (responseKpis.ok) {
          const result = await responseKpis.json();
          setData(result);
        } else {
          console.error("Error fetching director dashboard KPIs");
        }

        if (responseLista.ok) {
          const resultLista = await responseLista.json();
          setEmpleados(resultLista.resultados || []);
          setRhEmpleados(resultLista.rh_workers || []);
        } else {
          console.error("Error fetching director empleados lista");
        }
      } catch (error) {
        console.error("Error fetching director dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [auth]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Valores por defecto en caso de error
  const totalTrabajadores = data?.total_trabajadores || 0;
  const cumplimiento = data?.cumplimiento || 0;
  const cfinal = data?.cfinal_promedio || 0;
  const riesgos = data?.niveles_riesgo || { "Nulo": 0, "Bajo": 0, "Medio": 0, "Alto": 0, "Muy alto": 0, "Requiere valoración": 0, "No requiere valoración": 0 };
  const empresaInfo = data?.empresa_info || { nombre: 'Desconocido', rfc: 'N/A', razon_social: 'N/A', rh_count: 0 };
  const hasG2OrG3 = data?.has_g2_g3 ?? true;
  
  // Total riesgos evaluados para calcular porcentajes de la barra
  const totalEvaluados = riesgos["Nulo"] + riesgos["Bajo"] + riesgos["Medio"] + riesgos["Alto"] + riesgos["Muy alto"];

  const evaluados = data?.total_evaluados || 0;
  const pendientes = Math.max(0, totalTrabajadores - evaluados);
  const riesgoBajo = riesgos["Nulo"] + riesgos["Bajo"];
  const riesgoAlto = riesgos["Alto"] + riesgos["Muy alto"];
  
  const atsRequiere = riesgos["Requiere valoración"] || 0;
  const atsNoRequiere = riesgos["No requiere valoración"] || 0;

  const riskLevelLabel = (cfinal) => {
    if (cfinal < 20) return { label: 'Nulo', color: 'badge-nulo' };
    if (cfinal < 45) return { label: 'Bajo', color: 'badge-bajo' };
    if (cfinal < 70) return { label: 'Medio', color: 'badge-medio' };
    if (cfinal < 90) return { label: 'Alto', color: 'badge-alto' };
    return { label: 'Muy Alto', color: 'badge-muy-alto' };
  };

  const risk = riskLevelLabel(cfinal);

  return (
    <Container fluid className="dashboard-director-executive pt-3">
      <h2 className="mb-4 fw-bold text-navy" style={{ letterSpacing: '-0.5px' }}>Panel de Dirección</h2>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 director-tabs"
      >
        <Tab eventKey="dashboard" title="Dashboard">
          {/* 1. TOP CARDS */}
          <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Card className="kpi-card border-blue">
            <Card.Body className="kpi-content">
              <div className="kpi-text">
                <h2>{totalTrabajadores}</h2>
                <p>Total trabajadores</p>
              </div>
              <i className="bi bi-people-fill kpi-icon"></i>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3 mb-md-0">
          <Card className="kpi-card border-green">
            <Card.Body className="kpi-content">
              <div className="kpi-text">
                <h2>{cumplimiento}%</h2>
                <p>Cumplimiento Global</p>
              </div>
              <i className="bi bi-check-circle-fill kpi-icon"></i>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 1.5. SECONDARY CARDS */}
      <Row className="mb-4">
        <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
          <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #10b981' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Evaluados</h6>
                  <h3 className="mb-0 fw-bold text-success">{evaluados}</h3>
                </div>
                <div className="kpi-icon text-success">
                  <i className="bi bi-person-check-fill" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
          <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #f97316' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Pendientes</h6>
                  <h3 className="mb-0 fw-bold text-warning">{pendientes}</h3>
                </div>
                <div className="kpi-icon text-warning">
                  <i className="bi bi-person-dash-fill" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {hasG2OrG3 ? (
          <>
            <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
              <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #1a56db' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Riesgo Bajo / Nulo</h6>
                      <h3 className="mb-0 fw-bold text-primary">{riesgoBajo}</h3>
                    </div>
                    <div className="kpi-icon text-primary">
                      <i className="bi bi-shield-check" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #dc2626' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Riesgo Alto / Muy Alto</h6>
                      <h3 className="mb-0 fw-bold text-danger">{riesgoAlto}</h3>
                    </div>
                    <div className="kpi-icon text-danger">
                      <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        ) : (
          <>
            <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
              <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #10b981' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">No Requiere Atención</h6>
                      <h3 className="mb-0 fw-bold text-success">{atsNoRequiere}</h3>
                    </div>
                    <div className="kpi-icon text-success">
                      <i className="bi bi-shield-check" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #dc2626' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Requiere Atención Clínica</h6>
                      <h3 className="mb-0 fw-bold text-danger">{atsRequiere}</h3>
                    </div>
                    <div className="kpi-icon text-danger">
                      <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>

      {hasG2OrG3 && (
        <Row className="mb-4">
          <Col xs={12} sm={6} md={6} className="mb-3 mb-md-0">
            <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #10b981' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">No Requiere Atención Clínica</h6>
                    <h3 className="mb-0 fw-bold text-success">{atsNoRequiere}</h3>
                  </div>
                  <div className="kpi-icon text-success">
                    <i className="bi bi-shield-check" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} md={6}>
            <Card className="kpi-card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #dc2626' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Requiere Atención Clínica</h6>
                    <h3 className="mb-0 fw-bold text-danger">{atsRequiere}</h3>
                  </div>
                  <div className="kpi-icon text-danger">
                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 2. DISTRIBUCION DE NIVELES DE RIESGO y OBLIGACIONES */}
      <Row>
        <Col xs={12} lg={12} className="mb-4">
          <Card className="panel-card h-100 pb-2 shadow-sm border-0">
            <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
              <h5 className="panel-title mb-0 fw-bold text-navy">{hasG2OrG3 ? "Distribución de niveles de riesgo" : "Distribución de resultados ATS"}</h5>
            </Card.Header>
            <Card.Body className="px-5 pt-5 pb-4">
              
              {hasG2OrG3 ? (
                <div className="risk-distribution-container">
                  {/* Nulo */}
                  <div className="risk-column">
                    <div className="risk-number fw-bold text-dark">{riesgos["Nulo"]}</div>
                    <div className="risk-bar bar-nulo" style={{ height: totalEvaluados ? `${(riesgos["Nulo"]/totalEvaluados)*100}%` : '5px' }}></div>
                    <div className="risk-label fw-semibold">Nulo</div>
                  </div>
                  
                  {/* Bajo */}
                  <div className="risk-column">
                    <div className="risk-number fw-bold text-dark">{riesgos["Bajo"]}</div>
                    <div className="risk-bar bar-bajo" style={{ height: totalEvaluados ? `${(riesgos["Bajo"]/totalEvaluados)*100}%` : '5px' }}></div>
                    <div className="risk-label fw-semibold">Bajo</div>
                  </div>
                  
                  {/* Medio */}
                  <div className="risk-column">
                    <div className="risk-number fw-bold text-dark">{riesgos["Medio"]}</div>
                    <div className="risk-bar bar-medio" style={{ height: totalEvaluados ? `${(riesgos["Medio"]/totalEvaluados)*100}%` : '5px' }}></div>
                    <div className="risk-label fw-semibold">Medio</div>
                  </div>
  
                  {/* Alto */}
                  <div className="risk-column">
                    <div className="risk-number fw-bold text-dark">{riesgos["Alto"]}</div>
                    <div className="risk-bar bar-alto" style={{ height: totalEvaluados ? `${(riesgos["Alto"]/totalEvaluados)*100}%` : '5px' }}></div>
                    <div className="risk-label fw-semibold">Alto</div>
                  </div>
  
                  {/* Muy alto */}
                  <div className="risk-column">
                    <div className="risk-number fw-bold text-dark">{riesgos["Muy alto"]}</div>
                    <div className="risk-bar bar-muy-alto" style={{ height: totalEvaluados ? `${(riesgos["Muy alto"]/totalEvaluados)*100}%` : '5px' }}></div>
                    <div className="risk-label fw-semibold">Muy alto</div>
                  </div>
                </div>
              ) : (
                <div className="risk-distribution-container justify-content-center gap-5">
                  <div className="risk-column">
                    <div className="risk-number fw-bold text-dark">{atsNoRequiere}</div>
                    <div className="risk-bar bar-bajo" style={{ height: totalEvaluados ? `${(atsNoRequiere/totalEvaluados)*100}%` : '5px', backgroundColor: '#198754' }}></div>
                    <div className="risk-label fw-semibold">No Requiere<br/>Valoración</div>
                  </div>
                  
                  <div className="risk-column">
                    <div className="risk-number fw-bold text-dark">{atsRequiere}</div>
                    <div className="risk-bar bar-muy-alto" style={{ height: totalEvaluados ? `${(atsRequiere/totalEvaluados)*100}%` : '5px', backgroundColor: '#dc3545' }}></div>
                    <div className="risk-label fw-semibold">Requiere<br/>Valoración</div>
                  </div>
                </div>
              )}


            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Tab>

      <Tab eventKey="trabajadores" title="Trabajadores">
          <div className="bg-white rounded p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-navy mb-0">Directorio de Trabajadores y Resultados Globales</h4>
              <button 
                className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold"
                onClick={exportarPDF}
              >
                <i className="bi bi-file-earmark-pdf-fill me-2"></i> Reporte Consolidado
              </button>
            </div>
            
            <div className="table-responsive">
              <Table hover className="align-middle text-center" style={{ fontSize: '0.9rem' }}>
                <thead style={{ backgroundColor: '#1b365d', color: 'white' }}>
                  <tr>
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', borderColor: '#2c4b78' }}>Folio</th>
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', borderColor: '#2c4b78' }}>Nombre Completo</th>
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', borderColor: '#2c4b78' }}>Correo Electrónico</th>
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', borderColor: '#2c4b78' }}>Guía I (ATS)</th>
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', borderColor: '#2c4b78' }}>Fecha Guía I</th>
                    {empleados.some(e => e.guia === 'G2' || e.guia === 'G3') && (
                      <>
                        <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', borderColor: '#2c4b78' }}>
                          Guía Evaluada y Nivel de Riesgo
                        </th>
                        <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', borderColor: '#2c4b78' }}>
                          {empleados.length > 0 ? (empleados[0].guia === 'G3' ? 'Fecha Guía III' : 'Fecha Guía II') : 'Fecha Guía'}
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {empleados.length > 0 ? (
                    empleados.map((emp, i) => {
                      let badgeCls = 'badge-nulo';
                      if (emp.nivel_final === 'Bajo') badgeCls = 'badge-bajo';
                      if (emp.nivel_final === 'Medio') badgeCls = 'badge-medio';
                      if (emp.nivel_final === 'Alto') badgeCls = 'badge-alto';
                      if (emp.nivel_final === 'Muy Alto') badgeCls = 'badge-muy-alto';
                      
                      return (
                        <tr key={i}>
                          <td className="fw-semibold text-secondary">{emp.folio}</td>
                          <td className="text-start fw-semibold text-dark">{emp.nombre}</td>
                          <td className="text-start text-muted">{emp.email || 'No registrado'}</td>
                          <td>
                            {emp.ats_requiere_atencion === 'SÍ' ? (
                              <Badge bg="danger" className="px-3 py-2 text-wrap w-100" style={{ fontSize: '0.80rem', maxWidth: '160px' }}>Requiere Valoración Clínica</Badge>
                            ) : emp.ats_requiere_atencion === 'NO' ? (
                              <Badge bg="primary" className="px-3 py-2 text-wrap w-100" style={{ fontSize: '0.80rem', maxWidth: '160px' }}>No Requiere Valoración</Badge>
                            ) : (
                              <Badge bg="secondary" className="px-3 py-2 text-wrap w-100" style={{ fontSize: '0.80rem' }}>Pendiente</Badge>
                            )}
                          </td>
                          <td className="text-muted">{emp.fecha_g1 || 'Pendiente'}</td>
                          {empleados.some(e => e.guia === 'G2' || e.guia === 'G3') && (
                            <>
                              <td>
                                <div className="d-flex flex-column align-items-center justify-content-center gap-1 mx-auto" style={{ maxWidth: '140px' }}>
                                  <Badge bg="dark" className="px-3 py-1 w-100">{emp.guia === 'G3' ? 'Guía III' : 'Guía II'}</Badge>
                                  <Badge className={`${badgeCls} px-3 py-1 w-100`} style={{ fontSize: '0.85rem' }}>
                                    {emp.nivel_final === 'Muy Alto' ? <><i className="bi bi-exclamation-triangle-fill me-1"></i> Muy Alto</> : emp.nivel_final}
                                  </Badge>
                                </div>
                              </td>
                              <td className="text-muted">{emp.fecha_riesgo || 'Pendiente'}</td>
                            </>
                          )}
                        </tr>
                      )
                    })
                  ) : (
                    <tr><td colSpan="7" className="py-5 text-muted fw-bold">No hay trabajadores evaluados todavía.</td></tr>
                  )}
                </tbody>
              </Table>
            </div>
            
            <div className="mt-5">
              <h5 className="fw-bold text-navy mb-3">Personal de Recursos Humanos</h5>
              <div className="table-responsive">
                <Table hover className="align-middle text-center" style={{ fontSize: '0.9rem' }}>
                  <thead style={{ backgroundColor: '#47638a', color: 'white' }}>
                    <tr>
                      <th className="py-3 px-2" style={{ backgroundColor: '#47638a', color: 'white', borderColor: '#3a5273' }}>Folio</th>
                      <th className="py-3 px-2" style={{ backgroundColor: '#47638a', color: 'white', borderColor: '#3a5273' }}>Nombre Completo</th>
                      <th className="py-3 px-2" style={{ backgroundColor: '#47638a', color: 'white', borderColor: '#3a5273' }}>Correo Electrónico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rhEmpleados.length > 0 ? (
                      rhEmpleados.map((rh, i) => (
                        <tr key={`rh-${i}`}>
                          <td className="fw-semibold text-secondary">{rh.folio}</td>
                          <td className="text-start fw-semibold text-dark">{rh.nombre}</td>
                          <td className="text-start text-muted">{rh.email || 'No registrado'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" className="py-4 text-muted fw-bold">No hay personal de Recursos Humanos registrado.</td></tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Tab>

        <Tab eventKey="empresa" title="Empresa">
          <Row>
            <Col md={8} className="mx-auto mt-3">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white pt-4 pb-2 border-0 text-center">
                  <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', color: '#1b365d' }}>
                    <i className="bi bi-building fs-1"></i>
                  </div>
                  <h4 className="fw-bold text-navy mb-1">{empresaInfo.nombre}</h4>
                  <Badge bg="success" className="mt-2 px-3 py-2" style={{ fontSize: '0.85rem' }}>Estatus Activa</Badge>
                </Card.Header>
                <Card.Body className="px-5 pb-5">
                  <hr className="my-3" style={{ opacity: 0.1 }} />

                  <Row className="mb-4">
                    <Col xs={12} md={6} className="mb-3">
                      <Card className="bg-light border-0 text-center py-4 h-100 shadow-sm">
                        <i className="bi bi-people text-primary fs-1 mb-3"></i>
                        <h3 className="fw-bold mb-1 text-dark">{totalTrabajadores}</h3>
                        <p className="text-muted mb-0 fw-semibold">Trabajadores Totales</p>
                      </Card>
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Card className="bg-light border-0 text-center py-4 h-100 shadow-sm">
                        <i className="bi bi-person-vcard text-info fs-1 mb-3"></i>
                        <h3 className="fw-bold mb-1 text-dark">{empresaInfo.rh_count}</h3>
                        <p className="text-muted mb-0 fw-semibold">Personal de RH</p>
                      </Card>
                    </Col>
                  </Row>
                  
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}
