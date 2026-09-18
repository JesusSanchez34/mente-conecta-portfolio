import React, {useState, useEffect} from 'react'

import { 
    CardInfoNavigation, 
    DemoCardInfoNavigation 
} from '../../../components/common'
import { useDashboardAdmin } from '../../../hooks';

import './HomaAdminFase1.css'

export function HomaAdminFase1() {
      const { 
        alertsColumbia, 
        loadingAlertsColumbia, 
        getAlertsColumbia
      } = useDashboardAdmin();
    
      const getData = async () => {
        await getAlertsColumbia();
      }
    
      useEffect(() => {
        getData()
      }, [])
      
    return (
        <div className="container-home-admin-fase-1">
            <div className="box">
                <CardInfoNavigation
                    riskLevel = {1}
                    account = {1}
                    title = "Ver dashboard de analíticas"
                    subTitle = "Cuestionario de Columbia"
                    textLink = "Ver más detalles"
                    link = "/admin/f1/estadisticas"
                />
            </div>
            <div className="box">
                <CardInfoNavigation
                    riskLevel = {2}
                    account = {2}
                    title = "Pacientes en riesgo"
                    subTitle = "Cuestionario Alcoholismo"
                    textLink = "Ver más detalles"
                    link = "/admin/f1/"
                />
            </div>
            <div className="box">
                {
                    loadingAlertsColumbia 
                    ? <h1>Cargando</h1>
                    :  
                        <CardInfoNavigation
                            riskLevel = {alertsColumbia?.pacientes_en_alerta === 0 ? 1: 3}
                            account = {alertsColumbia?.pacientes_en_alerta}
                            title = "Pacientes en riesgo"
                            subTitle = "Cuestionario de Columbia"
                            textLink = "Ver más detalles"
                            link = "/admin/f1/columbia"
                        />
                }
                
            </div>
            <div className="box">
                <DemoCardInfoNavigation/>
            </div>
        </div>
    )
}