import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ReporteSituacion.scss';
import { FaLock, FaArrowLeft } from 'react-icons/fa';

export const ReporteSituacion = () => {
  const navigate = useNavigate();

  return (
    <div className="reporte-situacion-container">
      {/* Botón de regresar */}
      <button className="btn-back-dashboard" onClick={() => navigate('/personal/nom-035')}>
        <FaArrowLeft /> Regresar al dashboard
      </button>

      {/* Banner de confidencialidad */}
      <div className="confidentiality-banner">
        <FaLock className="lock-icon" />
        <p>
          <strong>Tu reporte es confidencial.</strong> Si eliges la opción anónima, no se registrará ningún dato que te identifique. La NOM-035 garantiza que no habrá represalias. (Art. 8.2 NOM-035)
        </p>
      </div>

      <div className="report-card">
        <h2 className="report-title">Nuevo reporte</h2>
        
        <form className="report-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label>TIPO DE SITUACIÓN</label>
              <select defaultValue="Acoso laboral (mobbing)">
                <option>Acoso laboral (mobbing)</option>
                <option>Hostigamiento sexual</option>
                <option>Discriminación</option>
                <option>Malos tratos</option>
                <option>Violencia verbal</option>
                <option>Violencia física</option>
                <option>Carga de trabajo excesiva</option>
                <option>Condiciones inseguras</option>
                <option>Otro</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>DESCRIPCIÓN DE LOS HECHOS</label>
            <textarea 
              placeholder="Describe brevemente la situación que deseas reportar. No incluyas datos que te identifiquen si eliges reporte anónimo..."
              rows={4}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>¿DESEAS REPORTAR DE FORMA ANÓNIMA?</label>
              <select defaultValue="Sí — reporte anónimo">
                <option>Sí — reporte anónimo</option>
                <option>No</option>
              </select>
            </div>
            <div className="form-group">
              <label>FECHA APROXIMADA DEL HECHO</label>
              <input type="date" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>¿EL HECHO ES RECURRENTE?</label>
              <select defaultValue="No">
                <option>No</option>
                <option>Sí</option>
              </select>
            </div>
            <div className="form-group">
              <label>TESTIGOS (OPCIONAL)</label>
              <input type="text" placeholder="Número de testigos, sin nombres" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-enviar-reporte">
              Enviar reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
