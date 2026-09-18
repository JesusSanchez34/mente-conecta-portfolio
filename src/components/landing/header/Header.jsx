import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { LanguageSelector } from '../../ui';

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false); // 👈 cerrar drawer al navegar
    };

    return (
        <>
            <div className="header container-fluid">
                <div className="row align-items-center w-100">

                    {/* LOGO */}
                    <div className="col-6 col-lg-3">
                        <button
                            className="logo-btn"
                            onClick={() => handleNavigation('/')}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                            <img
                                src="/image/mcLogo.jpeg"
                                alt="MC Logo"
                                className="logo"
                            />
                        </button>
                    </div>

                    {/* BOTÓN HAMBURGUESA */}
                    <div className="col-6 d-lg-none text-end">
                        <button
                            className="hamburger-btn"
                            onClick={() => setIsOpen(true)}
                            
                        >
                            ☰
                        </button>
                    </div>

                    {/* MENÚ DESKTOP */}
                    <div className="col-lg-9 d-none d-lg-flex justify-content-end">
                        <div className="header-buttons">

                            <button className="header-btn" onClick={() => handleNavigation('/')}>
                                INICIO
                            </button>

                            <button className="header-btn" onClick={() => handleNavigation('/services')}>
                                SERVICIOS
                            </button>

                            <button className="header-btn" onClick={() => handleNavigation('/characteristics')}>
                                CARACTERÍSTICAS
                            </button>

                            <button className="header-btn" onClick={() => handleNavigation('/security')}>
                                SEGURIDAD
                            </button>

                            <button className="header-btn primary px-3" onClick={() => handleNavigation('/login')}>
                                ACCEDER AL PANEL
                            </button>

                        </div>
                    </div>

                </div>
            </div>

            {/* OVERLAY */}
            {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

            {/* DRAWER */}
            <div className={`side-drawer ${isOpen ? "open" : ""}`}>

                <div className="drawer-header">
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        ✕
                    </button>
                </div>

                <div className="drawer-menu">

                    <button onClick={() => handleNavigation('/')}>
                        INICIO
                    </button>

                    <button onClick={() => handleNavigation('/services')}>
                        SERVICIOS
                    </button>

                    <button onClick={() => handleNavigation('/characteristics')}>
                        CARACTERÍSTICAS
                    </button>

                    <button onClick={() => handleNavigation('/security')}>
                        SEGURIDAD
                    </button>

                    <button className="primary" onClick={() => handleNavigation('/login')}>
                        ACCEDER AL PANEL
                    </button>

                </div>
            </div>
        </>
    )
}