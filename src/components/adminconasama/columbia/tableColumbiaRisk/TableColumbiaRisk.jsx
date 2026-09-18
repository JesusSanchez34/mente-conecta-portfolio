import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import DataTable from "react-data-table-component";
import "./TableColumbiaRisk.css";

export function TableColumbiaRisk(props) {
  const { data, setMarkPatientSeen, onRefetch } = props;

  const columns = [
    {
      name: "Paciente",
      selector: (row) => row.nombre_completo,
      sortable: true
    },
    {
      name: "correo",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Riesgo",
      selector: (row) => row.nivel_riesgo,
      sortable: true,
    },
    {
      name: "Puntaje",
      selector: (row) => row.columbia_score,
      sortable: true,
    },
    {
      name: "fecha de evaluación",
      selector: (row) => row.fecha_evaluacion,
      sortable: true,
    },
    {
      name: "Asignar paciente",
      button: true,
      cell: (row) => (
        <>
          <Button
            size="sm"
            variant="success"
            className="table-webinar-admin__boton btn-boton"
            onClick={ async () => {
                await setMarkPatientSeen(row.id_registro)
                await onRefetch()
            }}
          >
            <FontAwesomeIcon icon={faPencil} />
          </Button>
        </>
      )
    }
  ]


  return (
    <DataTable
      columns={columns}
      data={data}
      defaultSortField="name"
      striped
      pagination
      subHeader
      noDataComponent={<spam>No hay registros disponibles</spam>}
    />
  );
}