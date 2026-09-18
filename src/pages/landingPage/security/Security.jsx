import React from 'react';
import './Security.css';
import { IoEyeOutline, IoHandRightSharp } from "react-icons/io5";
import { LuLock } from "react-icons/lu";
import { HiOutlineUsers } from "react-icons/hi2";
import { FiLock, FiCheckCircle } from "react-icons/fi";
import { BsPersonXFill } from "react-icons/bs";
import { AiOutlineWarning } from "react-icons/ai";

const securityFeatures = [
    {
        icon: <LuLock />,
        title: 'Encriptación End-to-End',
        description: 'Todos los datos se encriptan antes de ser almacenados y durante la transmisión.',
        iconBg: 'rgba(204, 252, 211, 0.80)',
        iconColor: '#66C870'
    },
    {
        icon: <HiOutlineUsers />,
        title: 'Control Total del Usuario',
        description: 'Solo los usuarios pueden acceder y modificar su información personal.',
        iconBg: 'rgba(136, 165, 229, 0.74)',
        iconColor: '#2C5FCC'
    },
    {
        icon: <IoEyeOutline />,
        title: 'Cumplimiento HIPAA',
        description: 'Cumplimos con todas las regulaciones de privacidad en salud.',
        iconBg: 'rgba(222, 137, 227, 0.45)',
        iconColor: '#75257D'
    }
];

const Security = () => {
    return (
        <div className="security-body">
            <div className="security-header">
                <h1>Privacidad y Seguridad</h1>
                <p>Tu seguridad y privacidad son nuestra máxima prioridad. Conoce cómo protegemos tu información.</p>
            </div>
            <div className="sub-header">
                <div className="security-compromise">
                    <FiLock size={30} className='mb-3' />
                    <h1>Nuestro Compromiso</h1>
                    <p>"Tu información personal nunca será compartida, vendida o usada sin tu consentimiento explícito. Creemos que la privacidad es un derecho fundamental."</p>
                </div>
            </div>
            <div className="row security-cards">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-3 px-3 py-3">
                    <div class="card h-100 pb-5">
                        <div class="card-body" style={{ margin: '20px 0px'}}>
                            <div className="row" style={{ height: 'auto' }}>
                                <div className="col-md-2">
                                    <button className="secutiry-card-icon"><FiLock size={24} /></button>
                                </div>
                                <div className="col-md-10">
                                    <span className='security-card-title'>Cifrado de Extremo a Extremo</span>
                                </div>
                                <div className="row d-flex justify-content-end">
                                    <div className="col-md-10">
                                        <p class="security-card-text">Toda tu información está cifrada con AES'256, el mismo estándar usado por bancos y gobiernos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="security-card-list">
                            <ul style={{ margin: 0, padding: 0 }}>
                                <li class="list-group-item">
                                    <div className="row">
                                         <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element'>Tus mensajes solo son accesibles para ti</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div className="row">
                                        <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element'>Ni siquiera nuestros administradores pueden leerlos</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div className="row">
                                        <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element'>Claves únicas por usuario y sesión</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-3 px-3 py-3">
                    <div class="card h-100 pb-5">
                        <div class="card-body" style={{ margin: '20px 0px'}}>
                            <div className="row" style={{ height: 'auto' }}>
                                <div className="col-md-2">
                                    <button className="secutiry-card-icon"><BsPersonXFill size={24} /></button>
                                </div>
                                <div className="col-md-10">
                                    <span className='security-card-title'>Sin Venta de Datos</span>
                                </div>
                                <div className="row d-flex justify-content-end">
                                    <div className="col-md-10">
                                        <p class="security-card-text">Nunca vendemos, compartimos o monetizamos tu información personal.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="security-card-list">
                            <ul style={{ margin: 0, padding: 0 }}>
                                <li class="list-group-item">
                                    <div className="row">
                                         <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element'>Tus datos son tuyos</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div className="row">
                                        <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element'>No hay terceros con acceso</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div className="row">
                                        <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element'>Sin publicidad personalizada</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-3 px-3 py-3">
                    <div class="card h-100 pb-5">
                        <div class="card-body" style={{ margin: '20px 0px'}}>
                            <div className="row" style={{ height: 'auto' }}>
                                <div className="col-md-2">
                                    <button className="secutiry-card-icon"><AiOutlineWarning size={24} /></button>
                                </div>
                                <div className="col-md-10">
                                    <span className='security-card-title'>Control de Acceso</span>
                                </div>
                                <div className="row d-flex justify-content-end">
                                    <div className="col-md-10">
                                        <p class="security-card-text">Solo tú decides qué informaciń compartir y con quién.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="security-card-list">
                            <ul style={{ margin: 0, padding: 0 }}>
                                <li class="list-group-item">
                                    <div className="row">
                                         <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element'>Permisos granulares</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div className="row">
                                        <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element'>Elimina tus datos cuando quieras</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div className="row">
                                        <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element'>Descarga tu información</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-3 px-3 py-3">
                    <div class="card h-100 pb-5">
                        <div class="card-body" style={{ margin: '20px 0px'}}>
                            <div className="row" style={{ height: 'auto' }}>
                                <div className="col-md-2">
                                    <button className="secutiry-card-icon"><IoHandRightSharp size={24} /></button>
                                </div>
                                <div className="col-md-10">
                                    <span className='security-card-title'>Tus Derechos</span>
                                </div>
                            </div>
                        </div>
                        <div class="security-card-list">
                            <ul style={{ margin: 0, padding: 0 }}>
                                <li class="list-group-item">
                                    <div className="row">
                                         <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element' style={{ fontWeight: 700, color: '#04547B' }}>Acceso: </span>
                                            <span style={{ fontSize: '14px', color: '#7A7A7A' }}>Ver toda la información que tenemos sobre ti</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div className="row">
                                         <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element' style={{ fontWeight: 700, color: '#04547B' }}>Rectificación: </span>
                                            <span style={{ fontSize: '14px', color: '#7A7A7A' }}>Corregir datos incorrectos</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div className="row">
                                         <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element' style={{ fontWeight: 700, color: '#04547B' }}>Eliminación: </span>
                                            <span style={{ fontSize: '14px', color: '#7A7A7A' }}>Borrar tu cuenta y datos permanentemente</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div className="row">
                                         <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element' style={{ fontWeight: 700, color: '#04547B' }}>Portabilidad: </span>
                                            <span style={{ fontSize: '14px', color: '#7A7A7A' }}>Descargar tus datos en formato estándar</span>
                                        </div>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div className="row">
                                         <div className="col-md-1">
                                            <FiCheckCircle size={20} color='#71BEE9' />
                                        </div>
                                        <div className="col-md-11">
                                            <span className='security-list-element' style={{ fontWeight: 700, color: '#04547B' }}>Oposición: </span>
                                            <span style={{ fontSize: '14px', color: '#7A7A7A' }}>Rechazar ciertos usos de tu información</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;