import { Tabs, Tab } from "react-bootstrap";
import styles from "./Tabs.module.css";

export default function TipoGraficasTabs({ value, onChange }) {
  return (
    <Tabs
      activeKey={value}
      onSelect={(k) => onChange(k)}
      className={`mb-4 ${styles.customTabs}`}
      justify
    >
      <Tab eventKey="cuestionarios" title="Cuestionarios" />
      <Tab eventKey="preguntas" title="Sociodemograficos" />
      <Tab eventKey="rangos" title="Rangos" />
    </Tabs>
  );
}