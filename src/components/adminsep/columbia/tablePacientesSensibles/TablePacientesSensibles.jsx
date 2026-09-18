import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import DataTable from "react-data-table-component";
import Modal from "react-bootstrap/Modal";
import { marcarAtencionEspecialSeP } from "../../../../api/sep/pacientesSensiblesSEP";
import { useAuth } from "../../../../hooks/useAuth";
import "./TablePacientesSensibles.css";
import React, { useState } from "react";

function TablePacientesSensibles(props) {
  const { data, onRefetch } = props;
  const { auth } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id || row.evaluacion?.[0]?.id || "-",
      sortable: true,
      width: "80px",
    },
    {
      name: "Paciente",
      selector: (row) => {
        if (row.usuario) {
          return `${row.usuario.nombre || ""} `.trim();
        }
        return "";
      },
      sortable: true,
      wrap: true,
      minWidth: "200px",
    },
    {
      name: "Correo",
      selector: (row) => row.usuario?.email,
      sortable: true,
      wrap: true,
      minWidth: "200px",
    },
    {
      name: "Riesgo",
      selector: (row) => row.nivel_riesgo || row.riesgo || "No disponible",
      sortable: true,
      minWidth: "300px",
      wrap: true,
    },
    {
      name: "Fecha de Evaluación",
      selector: (row) => row.fecha_evaluacion,
      sortable: true,
      minWidth: "180px",
      format: (row) => {
        if (!row.fecha_evaluacion) return "-";
        const fecha = new Date(row.fecha_evaluacion);
        return fecha.toLocaleString("es-MX", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      name: "Celular De Emergencia",
      selector: (row) => {
        const celularUsuario =
          row.usuario?.celular_paciente ||
          row.usuario?.celular ||
          row.celular_paciente ||
          row.celular;
        if (celularUsuario) return celularUsuario;
        if (
          Array.isArray(row.usuario?.contactos_emergencia) &&
          row.usuario.contactos_emergencia.length > 0
        ) {
          return row.usuario.contactos_emergencia[0].celular || "";
        }
        return "";
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Parentesco",
      selector: (row) => {
        if (
          Array.isArray(row.usuario?.contactos_emergencia) &&
          row.usuario.contactos_emergencia.length > 0
        ) {
          return row.usuario.contactos_emergencia[0].parentesco || "";
        }
        return "";
      },
      sortable: true,
      width: "120px",
    },
    {
      name: "Asignar paciente",
      button: true,
      width: "150px",
      cell: (row) => (
        <Button
          size="sm"
          variant="success"
          className="table-pacientes-sensibles__boton btn-boton"
          onClick={() => {
            setSelectedPaciente(row);
            setShowDialog(true);
          }}
          title="Asignarte a este paciente"
        >
          <FontAwesomeIcon icon={faPencil} />
        </Button>
      ),
    },
  ];

  // Función para marcar atención
  const handleMarcarAtencion = async () => {
    if (!selectedPaciente) return;
    const evaluacionId = selectedPaciente.id || selectedPaciente.evaluacion?.[0]?.id || "";
    if (!evaluacionId) {
      setErrorMsg("No se puede asignar: el paciente no tiene evaluación válida.");
      return;
    }
    setLoading(true);
    try {
      await marcarAtencionEspecialSeP(evaluacionId, { atendido: true }, auth.token);
      setShowDialog(false);
      setSelectedPaciente(null);
      setErrorMsg("");
      if (onRefetch) onRefetch();
    } catch (error) {
      setErrorMsg("Error al asignar paciente. Intenta nuevamente o consulta al administrador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        defaultSortField="name"
        striped
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30, 50]}
        subHeader
        noDataComponent={<span>No hay registros disponibles</span>}
      />
      {/* Dialogo de confirmación */}
      <Modal show={showDialog} onHide={() => setShowDialog(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar asignación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de asignarte a este paciente "{selectedPaciente ? (selectedPaciente.usuario?.nombre || "") : ""}"?
          {errorMsg && (
            <div style={{ color: 'red', marginTop: 10 }}>{errorMsg}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowDialog(false); setErrorMsg(""); }} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleMarcarAtencion} disabled={loading}>
            {loading ? "Procesando..." : "Aceptar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export { TablePacientesSensibles };
export default TablePacientesSensibles;
