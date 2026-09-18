import { Tabs, Tab } from "react-bootstrap";
import styles from "./Tabs.module.css";

export default function SedeTabs({ value, onChange, organizacion }) {

  const sedesPorOrganizacion = {
    0: [
      { id: 1, nombre: "Ciudad de México" },
      { id: 2, nombre: "Morelos" },
      { id: 3, nombre: "Tlaxcala" },
      { id: 4, nombre: "Hidalgo" },
      { id: 5, nombre: "UPEM Ecatepec" },
      { id: 6, nombre: "UPEM Tecamac" },
      { id: 7, nombre: "Dra. Alma" },
    ],
    1: [
      { id: 1, nombre: "Ciudad de México" },
      { id: 2, nombre: "Morelos" },
      { id: 3, nombre: "Tlaxcala" },
      { id: 4, nombre: "Hidalgo" },
    ],
    2: [
      { id: 5, nombre: "UPEM Ecatepec" },
      { id: 6, nombre: "UPEM Tecamac" },
      { id: 7, nombre: "Dra. Alma" },
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