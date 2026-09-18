import React, { useEffect, useState } from "react";

import { usePacientesSensibles } from "../../../hooks/conasama";
import { DividerIcon } from "../../../components/common";
import { TablePacientesSensibles } from "../../../components/adminconasama/columbia/tablePacientesSensibles";

export function ColumbiaPageCona() {
  const { pacientesSensibles, loadingPacientes, getPacientesSensibles } =
    usePacientesSensibles();

  const [refetch, setRefetch] = useState(false);
  const onRefetch = () => setRefetch((prev) => !prev);

  useEffect(() => {
    getPacientesSensibles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  return (
    <div>
      <center>
        <h1 style={{ color: "#4DB6AC" }}>
          Pacientes por grupo de riesgo
        </h1>
      </center>
      {loadingPacientes ? (
        <h3>Cargando...</h3>
      ) : (
        <TablePacientesSensibles
          data={pacientesSensibles}
          onRefetch={onRefetch}
        />
      )}
    </div>
  );
  /*
  const {
    columbiaPatiensInAlert,
    getTableDataAlertsColumbia,
    loadingColumbia,
    errorColumbia,
    setMarkPatientSeen
  } = useColumbia()

  const [refetch, setRefetch] = useState(false);
  const onRefetch = () => setRefetch((prev) => !prev);

  const getData = async () => {
    await getTableDataAlertsColumbia();
  }

  useEffect(() => {
    getData()
  }, [refetch])
  

  return (
    <div>
      <DividerIcon
        titulo="Pacientes en riesgo (Cuestionario Columbia)"
      />
        {
          loadingColumbia 
          ? <hi>Cargando</hi>
          : 
            <TableColumbiaRisk
              data={columbiaPatiensInAlert}
              onRefetch={onRefetch}
              setMarkPatientSeen={setMarkPatientSeen}
            />
        }

    </div>
  )*/
}
