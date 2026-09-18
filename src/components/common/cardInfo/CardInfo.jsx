/**
 * @fileoverview Este archivo contiene componentes de React para mostrar
 * tarjetas de información, incluyendo una versión navegable y una de demostración.
 * @author IO Merengues papu :D <uliescodi@gmail.com>
 */

import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import {
  cardClasses,
  getIcon
} from './cardInfo'

import './CardInfo.css';

/**
 * Componente de UI que renderiza una tarjeta de información navegable.
 * Al hacer clic, redirige al usuario a una ruta específica. La apariencia
 * de la tarjeta (color e ícono) cambia según el `riskLevel`.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string | number} props.riskLevel - Determina el estilo visual y el ícono de la tarjeta.
 * @param {string | number} props.account - El contador principal que se muestra en la tarjeta.
 * @param {string} props.title - El título principal de la tarjeta.
 * @param {string} props.subTitle - El texto secundario que se muestra debajo del contador.
 * @param {string} props.textLink - El texto de la llamada a la acción en el pie de la tarjeta.
 * @param {string} props.link - La ruta de destino para la navegación (ej. "/pacientes").
 * @returns {JSX.Element} Un elemento de enlace (`<Link>`) que contiene la tarjeta de información.
 */

export function CardInfoNavigation(props) {

  const {
    riskLevel,
    account,
    title,
    subTitle,
    textLink,
    link
  } = props;


  return (
    <div className='container-card-info-1'>
      <Link to={link}>
        <div className={cardClasses(riskLevel)} onClick={console.log("Me pushaste papu")}>
          <div className="card-header-navigation">
            <div className="card-icon-container-navigation">
              {getIcon(riskLevel)}
            </div>
            <h3 className="card-title-navigation">{title}</h3>
          </div>
          <div className="card-body-navigation">
            <p className="patient-count">{account}</p>
            <p className="card-subtitle-navigation">{subTitle}</p>
          </div>
          <div className="card-footer-navigation">
            <span className="footer-link-navigation">{textLink}</span>
          </div>
        </div>
      </Link>

    </div>
  );
};


export function DemoCardInfoNavigation() {

  const [conteo, setConteo] = useState(1);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setConteo(conteoAnterior => {
        if (conteoAnterior >= 3) return 1;
        return conteoAnterior + 1;
      });
    }, 3000);
    return () => clearInterval(intervalo);
  }, []);
  return (
    <div className='container-card-info-1'>
      <div className={cardClasses(conteo)} onClick={() => console.log("Me pushaste papu")}>
        <div className="card-header-navigation">
          <div className="card-icon-container-navigation">
            {getIcon(conteo)}
          </div>
          <h3 className="card-title-navigation">Demo de tarjeta</h3>
        </div>
        <div className="card-body-navigation">
          <p className="patient-count">{conteo}</p>
          <p className="card-subtitle-navigation">Muestra las posibles tarjetas disponibles.</p>
        </div>
        <div className="card-footer-navigation">
          <span className="footer-link-navigation">Ver detalles</span>
        </div>
      </div>
    </div>
  )
} 