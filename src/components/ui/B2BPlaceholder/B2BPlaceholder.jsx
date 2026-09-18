import React from 'react';
import { Container, Card } from 'react-bootstrap';
import './B2BPlaceholder.scss';

export function B2BPlaceholder({ title, description, icon, type }) {
  return (
    <Container fluid className="b2b-placeholder-page">
      <div className="placeholder-header mb-4">
        <h4 className="fw-bold text-slate-800"><i className={`bi ${icon} me-2 text-primary`}></i> {title}</h4>
        <p className="text-slate-500">{description}</p>
      </div>

      <Card className="executive-card placeholder-content">
        <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5">
          
          {type === 'table' && (
            <div className="skeleton-table w-100">
              <div className="skeleton-header"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
            </div>
          )}

          {type === 'chart' && (
            <div className="skeleton-chart w-100 d-flex justify-content-around align-items-end">
              <div className="bar h-25"></div>
              <div className="bar h-50"></div>
              <div className="bar h-75"></div>
              <div className="bar h-100"></div>
              <div className="bar h-50"></div>
            </div>
          )}

          {type === 'upload' && (
            <div className="skeleton-upload">
              <i className="bi bi-cloud-arrow-up text-slate-300"></i>
              <div className="skeleton-line short mt-3"></div>
              <div className="skeleton-line long"></div>
            </div>
          )}

          {type === 'form' && (
            <div className="skeleton-form w-100">
              <div className="d-flex gap-3 mb-3">
                <div className="skeleton-input flex-grow-1"></div>
                <div className="skeleton-input flex-grow-1"></div>
              </div>
              <div className="skeleton-input full-width mb-3"></div>
              <div className="skeleton-input full-width h-75px mb-3"></div>
              <div className="skeleton-button"></div>
            </div>
          )}

          <div className="mt-5 text-center">
            <span className="badge bg-slate-100 text-slate-600 px-3 py-2 border">
              <i className="bi bi-tools me-1"></i> Módulo en construcción (Fase 2)
            </span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
