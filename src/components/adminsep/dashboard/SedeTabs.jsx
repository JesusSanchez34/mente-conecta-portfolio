import { Tabs, Tab } from "react-bootstrap";
import styles from "./Tabs.module.css";

export default function SedeTabs({ value, onChange, organizacion }) {

  const sedesPorOrganizacion = {
    0: [
      { id: 29, nombre: "Centro de Estudios Tecnológicos Ecatepec" },
      { id: 30, nombre: "Preparatoria Oficial No. 128" },
      { id: 31, nombre: "Secundaria Técnica 55" },
      { id: 32, nombre: "Universidad Tecnológica de Nezahualcóyotl" },
      { id: 33, nombre: "CBT No. 2 Nezahualcóyotl" },
      { id: 34, nombre: "UAEM - Unidad Académica Toluca" },
      { id: 35, nombre: "Instituto Tecnológico de Toluca" },
      { id: 36, nombre: "Escuela Secundaria Oficial No. 1" },
      { id: 37, nombre: "UAM Iztapalapa - Plantel Central" },
      { id: 38, nombre: "CETIS No. 53 Iztapalapa" },
      { id: 39, nombre: "Secundaria Diurna No. 115" },
      { id: 40, nombre: "IPN - Escuela Superior de Ingeniería (ESIME)" },
      { id: 41, nombre: "Preparatoria Nacional Plantel 9 UNAM" },
      { id: 42, nombre: "Facultad de Filosofía y Letras UNAM" },
      { id: 43, nombre: "CBTIS No. 2 Coyoacán" },
      { id: 44, nombre: "Secundaria Técnica No. 17" },
    ],
    1: [
      { id: 29, nombre: "Centro de Estudios Tecnológicos Ecatepec" },
      { id: 30, nombre: "Preparatoria Oficial No. 128" },
      { id: 31, nombre: "Secundaria Técnica 55" },
      { id: 32, nombre: "Universidad Tecnológica de Nezahualcóyotl" },
      { id: 33, nombre: "CBT No. 2 Nezahualcóyotl" },
      { id: 34, nombre: "UAEM - Unidad Académica Toluca" },
      { id: 35, nombre: "Instituto Tecnológico de Toluca" },
      { id: 36, nombre: "Escuela Secundaria Oficial No. 1" },
      { id: 37, nombre: "UAM Iztapalapa - Plantel Central" },
      { id: 38, nombre: "CETIS No. 53 Iztapalapa" },
      { id: 39, nombre: "Secundaria Diurna No. 115" },
      { id: 40, nombre: "IPN - Escuela Superior de Ingeniería (ESIME)" },
      { id: 41, nombre: "Preparatoria Nacional Plantel 9 UNAM" },
      { id: 42, nombre: "Facultad de Filosofía y Letras UNAM" },
      { id: 43, nombre: "CBTIS No. 2 Coyoacán" },
      { id: 44, nombre: "Secundaria Técnica No. 17" },
    ],
  };

  const sedes = sedesPorOrganizacion[organizacion] || [];

  return (
    <Tabs
      activeKey={value}
      onSelect={(k) => onChange(Number(k))}
      className={`mb-3 ${styles.customTabs}`}
      fill
    >
      {sedes.map((sede) => (
        <Tab
          key={sede.id}
          eventKey={sede.id}
          title={sede.nombre}
        />
      ))}
    </Tabs>
  );
}