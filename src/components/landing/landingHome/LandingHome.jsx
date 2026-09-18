import React, { useState } from 'react'
import { Carousel } from 'react-bootstrap';
import './landingHome.css';
import { FaArrowRight } from "react-icons/fa6";
import { CiPlay1 } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

export function LandingHome() {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    const nextIcon = (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="70" height="70" rx="35" fill="#4DB6AC" fillOpacity="0.34" />
            <path d="M36.1538 20L50 35L36.1538 50M48.0769 35H20" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const prevIcon = (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="70" height="70" rx="35" transform="matrix(-1 0 0 1 70 0)" fill="#4DB6AC" fillOpacity="0.34" />
            <path d="M33.8462 20L20 35L33.8462 50M21.9231 35H50" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <div className="w-10 content-main">
            <div className="row w-100  text-content">

                {/* TEXTO */}
                <div className=" col-12 col-lg-6  ">

                    <div className="title-conectando">
                        Conectando
                    </div>

                    <div className="title-mentes">
                        Mentes y Corazones
                    </div>

                    <div className="description">
                        Plataforma integral de salud mental que conecta pacientes con profesionales de la salud, ofrece herramientas de evaluación personalizadas y brinda soporte continuo.
                    </div>

                    <div className="d-flex gap-3 justify-content-center">


                        <button className="button-next primary">
                            Comenzar Ahora
                            <FaArrowRight size={20} />
                        </button>

                        <button className="button-next primary" onClick={() => navigate('/demo')}>
                            <CiPlay1 size={20} />
                            Ver Demo
                        </button>

                    </div>
                </div>

                {/* IMAGEN */}
                <div className="col-12 col-lg-6 position-relative d-flex justify-content-center">

                    <img
                        src="/image/doctors.png"
                        alt="doctor-one"
                        className="doctors-image"
                    />

                    <svg
                        className="image-background-svg"
                        width="600"
                        height="740"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M481.181 558.349C640.221 500.594 735.579 209.152 681.073 59.059C626.567 -91.034 446.41 86.2264 287.371 143.981C128.331 201.737 -43.8337 312.808 10.6724 462.9C65.1785 612.993 322.142 616.104 481.181 558.349Z"
                            fill="rgba(4, 84, 123, 1)"
                            fillOpacity="0.34"
                        />
                    </svg>

                </div>

            </div>
        </div>
        // <div className="row landing-home-container">
        // <div className="col-sm-12 col-md-5 col-lg-6 col-xl-7 text-content">
        //     <div className="title-conectando">
        //         Conectando
        //     </div>
        //     <div className="title-mentes">
        //         Mentes y Corazones
        //     </div>
        //     <div className="description">
        //         Plataforma integral de salud mental que conecta pacientes con profesionales de la salud, ofrece herramientas de evaluación personalizadas y brinda soporte continuo.
        //     </div>
        //     <div className='d-flex gap-5'>
        //         <button className="button-next primary">
        //             Comenzar Ahora
        //             <div className="button-icon">
        //                 <FaArrowRight size={20} />
        //             </div>
        //         </button>
        //         <button className="button-next primary">
        //             <div className="button-icon">
        //                 <CiPlay1 size={20} />
        //             </div>
        //             Ver Demo
        //         </button>
        //     </div>
        // </div>
        // <div className="images-content">
        //     <svg className="background-svg" width="697" height="594" viewBox="0 0 697 594" fill="none" xmlns="http://www.w3.org/2000/svg">
        //         <path d="M481.181 558.349C640.221 500.594 735.579 209.152 681.073 59.059C626.567 -91.034 446.41 86.2264 287.371 143.981C128.331 201.737 -43.8337 312.808 10.6724 462.9C65.1785 612.993 322.142 616.104 481.181 558.349Z" fill="#4DB6AC" fillOpacity="0.34" />
        //     </svg>
        //     <svg className="image-background-svg"
        //         width="697" height="594" viewBox="0 0 697 594" fill="none" xmlns="http://www.w3.org/2000/svg">
        //         <path d="M481.181 558.349C640.221 500.594 735.579 209.152 681.073 59.059C626.567 -91.034 446.41 86.2264 287.371 143.981C128.331 201.737 -43.8337 312.808 10.6724 462.9C65.1785 612.993 322.142 616.104 481.181 558.349Z" fill="#4DB6AC" fillOpacity="0.34" />
        //     </svg>
        //     <img src="/image/Doctor2.png" alt="doctor-one" className="doctor-image" />
        //     <img src="/image/Doctora1.png" alt="doctora-second" className="doctora-image" />
        // </div>
        // <div className="row w-100 stats-banner">
        //     <div className="stat-item col-sm-12 col-md-6 col-lg-4">
        //         <div className="stat-number">1000+</div>
        //         <div className="stat-label">Pacientes</div>
        //     </div>
        //     <div className="stat-item col-sm-12 col-md-6 col-lg-4">
        //         <div className="stat-number">50+</div>
        //         <div className="stat-label">Profesionales</div>
        //     </div>
        //     <div className="stat-item col-sm-12 col-md-6 col-lg-4">
        //         <div className="stat-number">24/7</div>
        //         <div className="stat-label">Soporte Disponible</div>
        //     </div>
        // </div>
        // </div>
    )
}