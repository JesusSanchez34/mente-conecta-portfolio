import React from 'react';
import { Container } from 'react-bootstrap';

export function PacientesRiesgoSuperior() {
    return (
        <Container className="container-super-admin-sep">
            <header className="header-dashboard mb-5">
                <h1>📊 Reporte Superior SEP</h1>
                <p className="lead">Información de pacientes en riesgo</p>
            </header>
        </Container>
    );
}

export default PacientesRiesgoSuperior;