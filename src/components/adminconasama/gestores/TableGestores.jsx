import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { map } from 'lodash';

export function TableGestores(props) {
    const { gestores, hospitales, onViewGestor } = props;

    return (
        <Table striped bordered hover responsive className="mt-4">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Celular</th>
                    <th>Matrícula</th>
                    <th>Sede</th>
                    <th>Estatus</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {map(gestores, (gestor) => (
                    <tr key={gestor.id}>
                        <td>{gestor.id}</td>
                        <td>{`${gestor.nombre} ${gestor.apellido_paterno} ${gestor.apellido_materno}`}</td>
                        <td>{gestor.email}</td>
                        <td>{gestor.celular_paciente}</td>
                        <td>{gestor.matricula_laboral}</td>
                        <td>
                            {hospitales?.find(h => h.id === gestor.sede_id)?.nombre || gestor.sede_id}
                        </td>
                        <td>
                            {gestor.is_active ? (
                                <Badge bg="success">Activo</Badge>
                            ) : (
                                <Badge bg="danger">Inactivo</Badge>
                            )}
                        </td>
                        <td>
                            <Button
                                variant="info"
                                size="sm"
                                className="me-2"
                                style={{ color: "white" }}
                                onClick={() => onViewGestor(gestor)}
                            >
                                Ver más
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
