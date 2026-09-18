import React, {useEffect, useState} from 'react'

import { useColumbia } from '../../../hooks';
import { DividerIcon } from '../../../components/common';
import { TableColumbiaRisk } from '../../../components/adminfase1';


export function ColumbiaPage() {

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
  )
}
