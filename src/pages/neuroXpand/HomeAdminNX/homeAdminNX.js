import React, { useState, useEffect } from 'react';

import { 
    CardInfoNavigation, 
    DemoCardInfoNavigation 
} from '../../../components/common';
import { useDashboardAdmin } from '../../../hooks';


import './homeAdminNX.css'; 

export function HomeAdminNX() {
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
        <div className="container-home-adminNX"> 
            <div className="box">
                <CardInfoNavigation
                    riskLevel = {1}
                    account = {1}
                    title = "Ver dashboard de analíticas"
                    subTitle = "Cuestionario de Columbia"
                    textLink = "Ver más detalles"
                    link = "/admin/neuroXpand/estadisticas" 
                />
            </div>
            <div className="box">
                <CardInfoNavigation
                    riskLevel = {2}
                    account = {2}
                    title = "Pacientes en riesgo"
                    subTitle = "Cuestionario Alcoholismo"
                    textLink = "Ver más detalles"
                    link = "/admin/neuroXpand/Home"
                />
            </div>
            <div className="box">
                {
                    loadingAlertsColumbia 
                    ? <h1>Cargando...</h1>
                    :  
                        <CardInfoNavigation
                            riskLevel = {alertsColumbia?.pacientes_en_alerta === 0 ? 1: 3}
                            account = {alertsColumbia?.pacientes_en_alerta}
                            title = "Pacientes en riesgo"
                            subTitle = "Cuestionario de Columbia"
                            textLink = "Ver más detalles"
                            link = "/admin/neuroXpand/columbia"
                        />
                }
                
            </div>
            <div className="box">
                <DemoCardInfoNavigation/>
            </div>
        </div>
    )
}