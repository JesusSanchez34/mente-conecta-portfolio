import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../../../hooks';
import './ResultadosRH.scss';
import { BASE_API_F1, TOKEN } from '../../../utils/constants';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export function ResultadosRH() {
  const { auth } = useAuth();
  
  const [data, setData] = useState({
    cfinal_promedio: 0,
    categorias: []
  });
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultados = async () => {
        try {
            const token = auth?.token || sessionStorage.getItem(TOKEN);
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const kpisUrl = `${BASE_API_F1 || 'http://localhost:8000'}/dashboards/b2b/kpis/`;
            const listaUrl = `${BASE_API_F1 || 'http://localhost:8000'}/dashboards/b2b/resultados_lista/`;

            const [resKpis, resLista] = await Promise.all([
                fetch(kpisUrl, { headers }),
                fetch(listaUrl, { headers })
            ]);

            if (resKpis.ok) {
                const kpis = await resKpis.json();
                setData({
                  cfinal_promedio: kpis.cfinal_promedio,
                  categorias: kpis.categorias || []
                });
            }
            if (resLista.ok) {
                const lista = await resLista.json();
                setEmpleados(lista.resultados || []);
            }
        } catch (error) {
            console.error("Error fetching resultados:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchResultados();
  }, [auth]);

  const riskLevelLabel = (cfinal, isG3) => {
    if (cfinal === 0 && data.categorias.length === 0) return { label: 'Sin datos', badgeClass: 'badge-nulo' };
    
    let Nulo, Bajo, Medio, Alto;
    if (isG3) { Nulo = 50; Bajo = 75; Medio = 99; Alto = 140; }
    else { Nulo = 20; Bajo = 45; Medio = 70; Alto = 90; }

    if (cfinal < Nulo) return { label: 'Nulo', badgeClass: 'badge-nulo' };
    if (cfinal < Bajo) return { label: 'Bajo', badgeClass: 'badge-bajo' };
    if (cfinal < Medio) return { label: 'Medio', badgeClass: 'badge-medio' };
    if (cfinal < Alto) return { label: 'Alto', badgeClass: 'badge-alto' };
    return { label: 'Muy Alto', badgeClass: 'badge-muy-alto' };
  };

  const getCategoryRisk = (category, score, isG3) => {
    if (score === undefined || score === null || score === 'N/A') return null;
    let Nulo, Bajo, Medio, Alto;
    if (category === 'Ambiente') {
      if (isG3) { Nulo = 5; Bajo = 9; Medio = 11; Alto = 14; }
      else { Nulo = 3; Bajo = 5; Medio = 7; Alto = 9; }
    } else if (category === 'Factores') {
      if (isG3) { Nulo = 15; Bajo = 30; Medio = 45; Alto = 60; }
      else { Nulo = 10; Bajo = 20; Medio = 30; Alto = 40; }
    } else if (category === 'Organizacion') {
      if (isG3) { Nulo = 5; Bajo = 7; Medio = 10; Alto = 13; }
      else { Nulo = 4; Bajo = 6; Medio = 9; Alto = 12; }
    } else if (category === 'Liderazgo') {
      if (isG3) { Nulo = 14; Bajo = 29; Medio = 42; Alto = 58; }
      else { Nulo = 10; Bajo = 18; Medio = 28; Alto = 38; }
    } else if (category === 'Entorno') {
      if (isG3) { Nulo = 10; Bajo = 14; Medio = 18; Alto = 23; }
      else { return null; }
    }
  
    let level = "Muy Alto";
    if (score < Nulo) level = "Nulo";
    else if (score < Bajo) level = "Bajo";
    else if (score < Medio) level = "Medio";
    else if (score < Alto) level = "Alto";
  
    let cls = 'badge-muy-alto';
    if (level === 'Nulo') cls = 'badge-nulo';
    else if (level === 'Bajo') cls = 'badge-bajo';
    else if (level === 'Medio') cls = 'badge-medio';
    else if (level === 'Alto') cls = 'badge-alto';
  
    return { level, cls, score };
  };
  
  const hasG3ForRisk = empleados.some(e => e.guia === 'G3');
  const risk = riskLevelLabel(data.cfinal_promedio, hasG3ForRisk);

  const exportToExcel = () => {
    if (empleados.length === 0) return;
    const hasG3 = empleados.some(e => e.guia === 'G3');
    const hasG2 = empleados.some(e => e.guia === 'G2');
    const hasG2OrG3 = hasG2 || hasG3;
    const hasATS = empleados.some(e => e.ats_requiere_atencion !== null);

    const worksheetData = empleados.map(emp => {
      const guiaText = hasG3 ? 'GUÍA III' : 'GUÍA II';
      const row = { 'FOLIO': emp.folio, 'NOMBRE': emp.nombre };
      if (hasATS) {
        let atsText = 'N/A';
        if (emp.ats_requiere_atencion === 'SÍ') atsText = 'REQUIERE VALORACIÓN CLÍNICA';
        if (emp.ats_requiere_atencion === 'NO') atsText = 'NO REQUIERE VALORACIÓN CLÍNICA';
        row['GUÍA I ATS'] = atsText;
      }
      if (hasG2OrG3) {
        row[`${guiaText} CAT.1 AMB.`] = emp.cat_ambiente;
        row[`${guiaText} CAT.2 FACTORES`] = emp.cat_factores;
        row[`${guiaText} CAT.3 ORG.`] = emp.cat_organizacion;
        row[`${guiaText} CAT.4 LIDERAZGO`] = emp.cat_liderazgo;
        if (hasG3) row[`${guiaText} CAT.5 ENTORNO`] = emp.guia === 'G3' ? emp.cat_entorno : 'N/A';
        row['GLOBAL CFINAL'] = emp.cfinal;
        row['RESULTADO NIVEL FINAL'] = emp.nivel_final;
      }
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados NOM-035");
    XLSX.writeFile(workbook, "Resultados_NOM035.xlsx");
  };

  const exportToPDF = () => {
    if (empleados.length === 0) return;
    const doc = new jsPDF('landscape'); // landscape para que quepan las columnas
    const hasG3 = empleados.some(e => e.guia === 'G3');
    const hasG2 = empleados.some(e => e.guia === 'G2');
    const hasG2OrG3 = hasG2 || hasG3;
    const hasATS = empleados.some(e => e.ats_requiere_atencion !== null);
    
    const guiaText = hasG3 ? 'GUÍA III' : 'GUÍA II';
    let head = [['FOLIO', 'NOMBRE']];
    if (hasATS) head[0].push('GUÍA I\nATS');
    
    if (hasG2OrG3) {
      head[0].push(
        `${guiaText}\nCAT.1 AMB.`, 
        `${guiaText}\nCAT.2 FACTORES`, 
        `${guiaText}\nCAT.3 ORG.`, 
        `${guiaText}\nCAT.4 LIDERAZGO`
      );
      if (hasG3) head[0].push(`${guiaText}\nCAT.5 ENTORNO`);
      head[0].push('GLOBAL\nCFINAL', 'RESULTADO\nNIVEL FINAL');
    }

    const body = empleados.map(emp => {
      const row = [emp.folio, emp.nombre];
      if (hasATS) {
        let atsText = 'N/A';
        if (emp.ats_requiere_atencion === 'SÍ') atsText = 'REQUIERE VALORACIÓN CLÍNICA';
        if (emp.ats_requiere_atencion === 'NO') atsText = 'NO REQUIERE VALORACIÓN CLÍNICA';
        row.push(atsText);
      }
      
      if (hasG2OrG3) {
        row.push(emp.cat_ambiente, emp.cat_factores, emp.cat_organizacion, emp.cat_liderazgo);
        if (hasG3) row.push(emp.guia === 'G3' ? emp.cat_entorno : 'N/A');
        row.push(emp.cfinal, emp.nivel_final);
      }
      
      return row;
    });

    doc.setFontSize(14);
    doc.text("Registro Colectivo de Evaluaciones NOM-035", 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: head,
      body: body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [27, 54, 93], textColor: 255 } // #1b365d
    });

    doc.save("Resultados_NOM035.pdf");
  };

  return (
    <Container fluid className="resultados-rh-executive p-0 m-0" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
        <h4 className="fw-bold text-navy m-0">Resultados y Diagnóstico</h4>
        <div className="d-flex gap-2">
          <Button variant="success" size="sm" className="d-flex align-items-center gap-2 px-3" onClick={exportToExcel} disabled={empleados.length === 0}>
            <i className="bi bi-file-earmark-excel-fill"></i> Exportar Excel
          </Button>
          <Button variant="danger" size="sm" className="d-flex align-items-center gap-2 px-3" onClick={exportToPDF} disabled={empleados.length === 0}>
            <i className="bi bi-file-earmark-pdf-fill"></i> Exportar PDF
          </Button>
        </div>
      </div>

      <div className="w-100">
        <div className="text-white text-center py-3 fw-bold" style={{ backgroundColor: '#1b365d', fontSize: '1.2rem' }}>
          REGISTRO COLECTIVO DE EVALUACIONES
        </div>
        <div className="table-responsive">
          <Table bordered hover className="mb-0 text-center align-middle" style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', minWidth: '60px', borderColor: '#2c4b78' }}>Folio</th>
                <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', minWidth: '200px', borderColor: '#2c4b78' }}>Nombre</th>
                
                {empleados.some(e => e.ats_requiere_atencion !== null) && (
                  <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', minWidth: '100px', borderColor: '#2c4b78' }}>
                    <div style={{ opacity: 0.7, fontSize: '0.65rem', marginBottom: '2px', letterSpacing: '1px' }}>GUÍA I</div>
                    <div>ATS</div>
                  </th>
                )}
                
                {empleados.some(e => e.guia === 'G3' || e.guia === 'G2') && (
                  <>
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', minWidth: '95px', borderColor: '#2c4b78' }}>
                      <div style={{ opacity: 0.7, fontSize: '0.65rem', marginBottom: '2px', letterSpacing: '1px' }}>{empleados.some(e => e.guia === 'G3') ? 'GUÍA III' : 'GUÍA II'}</div>
                      <div>Cat.1 Amb.</div>
                    </th>
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', minWidth: '105px', borderColor: '#2c4b78' }}>
                      <div style={{ opacity: 0.7, fontSize: '0.65rem', marginBottom: '2px', letterSpacing: '1px' }}>{empleados.some(e => e.guia === 'G3') ? 'GUÍA III' : 'GUÍA II'}</div>
                      <div>Cat.2 Factores</div>
                    </th>
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', minWidth: '95px', borderColor: '#2c4b78' }}>
                      <div style={{ opacity: 0.7, fontSize: '0.65rem', marginBottom: '2px', letterSpacing: '1px' }}>{empleados.some(e => e.guia === 'G3') ? 'GUÍA III' : 'GUÍA II'}</div>
                      <div>Cat.3 Org.</div>
                    </th>
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', minWidth: '105px', borderColor: '#2c4b78' }}>
                      <div style={{ opacity: 0.7, fontSize: '0.65rem', marginBottom: '2px', letterSpacing: '1px' }}>{empleados.some(e => e.guia === 'G3') ? 'GUÍA III' : 'GUÍA II'}</div>
                      <div>Cat.4 Liderazgo</div>
                    </th>
                    
                    {empleados.some(e => e.guia === 'G3') && (
                      <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', minWidth: '105px', borderColor: '#2c4b78' }}>
                        <div style={{ opacity: 0.7, fontSize: '0.65rem', marginBottom: '2px', letterSpacing: '1px' }}>GUÍA III</div>
                        <div>Cat.5 Entorno</div>
                      </th>
                    )}
                    
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', minWidth: '70px', borderColor: '#2c4b78' }}>
                      <div style={{ opacity: 0.7, fontSize: '0.65rem', marginBottom: '2px', letterSpacing: '1px' }}>GLOBAL</div>
                      <div>Cfinal</div>
                    </th>
                    <th className="py-3 px-2" style={{ backgroundColor: '#1b365d', color: 'white', minWidth: '130px', borderColor: '#2c4b78' }}>
                      <div style={{ opacity: 0.7, fontSize: '0.65rem', marginBottom: '2px', letterSpacing: '1px' }}>RESULTADO</div>
                      <div>Nivel Final</div>
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#ffffff' }}>
              {loading ? (
                <tr><td colSpan="12" className="py-5 text-muted fw-bold">Cargando registros de la BD...</td></tr>
              ) : empleados.length > 0 ? (
                empleados.map((emp, i) => {
                  let badgeCls = 'badge-nulo';
                  if (emp.nivel_final === 'Bajo') badgeCls = 'badge-bajo';
                  if (emp.nivel_final === 'Medio') badgeCls = 'badge-medio';
                  if (emp.nivel_final === 'Alto') badgeCls = 'badge-alto';
                  if (emp.nivel_final === 'Muy Alto') badgeCls = 'badge-muy-alto';
                  
                  let atsBadgeCls = emp.ats_requiere_atencion === 'SÍ' ? 'badge-muy-alto' : 'badge-nulo';

                  const renderLevel = (level, cls) => {
                    if (!level) return null;
                    return (
                      <Badge className={`${cls} py-1`} style={{fontSize:'0.7rem'}}>
                        {level === 'Muy Alto' ? <><i className="bi bi-exclamation-triangle-fill me-1"></i> Muy Alto</> : level}
                      </Badge>
                    );
                  };

                  const rAmb = getCategoryRisk('Ambiente', emp.cat_ambiente, emp.guia === 'G3');
                  const rFac = getCategoryRisk('Factores', emp.cat_factores, emp.guia === 'G3');
                  const rOrg = getCategoryRisk('Organizacion', emp.cat_organizacion, emp.guia === 'G3');
                  const rLid = getCategoryRisk('Liderazgo', emp.cat_liderazgo, emp.guia === 'G3');
                  const rEnt = emp.guia === 'G3' ? getCategoryRisk('Entorno', emp.cat_entorno, true) : null;

                  const renderCell = (riskObj) => {
                    if (!riskObj) return <span className="text-muted">N/A</span>;
                    return (
                      <div className="d-flex flex-column align-items-center justify-content-center gap-1">
                        <span className="fw-bold fs-6" style={{ color: '#1a2a47' }}>{riskObj.score}</span>
                        {renderLevel(riskObj.level, riskObj.cls)}
                      </div>
                    );
                  };

                  return (
                    <tr key={i}>
                      <td className="fw-semibold text-secondary">{emp.folio}</td>
                      <td className="text-start fw-semibold text-dark">{emp.nombre}</td>
                      
                      {empleados.some(e => e.ats_requiere_atencion !== null) && (
                        <td>
                          {emp.ats_requiere_atencion ? (
                            <Badge className={`${emp.ats_requiere_atencion === 'SÍ' ? 'badge-muy-alto' : 'badge-bajo'} w-100 py-2`} style={{fontSize:'0.65rem', marginTop: '4px', whiteSpace: 'normal', lineHeight: '1.2'}}>
                              {emp.ats_requiere_atencion === 'SÍ' ? (
                                <><i className="bi bi-exclamation-triangle-fill me-1"></i> Requiere valoración clínica</>
                              ) : (
                                "No requiere valoración clínica"
                              )}
                            </Badge>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                      )}

                      {empleados.some(e => e.guia === 'G3' || e.guia === 'G2') && (
                        <>
                          <td>{renderCell(rAmb)}</td>
                          <td>{renderCell(rFac)}</td>
                          <td>{renderCell(rOrg)}</td>
                          <td>{renderCell(rLid)}</td>
                          
                          {empleados.some(e => e.guia === 'G3') && (
                            <td>{renderCell(rEnt)}</td>
                          )}
                          
                          <td className="fw-bold fs-6" style={{ color: '#1b365d' }}>{emp.cfinal}</td>
                          <td>
                            <Badge className={`${badgeCls} w-100 py-2`} style={{fontSize:'0.75rem', marginTop: '4px'}}>
                              {emp.nivel_final === 'Muy Alto' ? <><i className="bi bi-exclamation-triangle-fill me-1"></i> Muy Alto</> : emp.nivel_final}
                            </Badge>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="12" className="py-5 text-muted">No hay cuestionarios completados aún.</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
}
