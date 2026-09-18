import React from 'react'

export function DescripcionMente() {
    return (
        <section className="features section">

            <div className="container">

                <div className="row gy-4 align-items-center features-item">
                    <div className="col-md-5 d-flex align-items-center" data-aos="zoom-out" data-aos-delay="100">
                        <img src="assets/img/features-1.svg" className="img-fluid" alt="" />
                    </div>
                    <div className="col-md-7" data-aos="fade-up" data-aos-delay="100">
                        <h3>Test médicos.</h3>
                        <p className="fst-italic">
                            Es una solución integral que promueve el bienestar mental al facilitar el acceso a recursos y especialistas, además de proporcionar un marco seguro y privado para el manejo de la salud mental.
                        </p>
                        <ul>
                            <li><i className="bi bi-check"></i><span>Sección para acceder a múltiples test diseñados por expertos en salud mental.</span></li>
                            <li><i className="bi bi-check"></i> <span>Descripción de cada test y su objetivo (ej. evaluar ansiedad, depresión, etc.).</span>
                            </li>
                            <li><i className="bi bi-check"></i> <span>Proceso para que el usuario complete los test y reciba un prediagnóstico.</span></li>
                        </ul>
                    </div>
                </div>

                <div className="row gy-4 align-items-center features-item">
                    <div className="col-md-5 order-1 order-md-2 d-flex align-items-center" data-aos="zoom-out" data-aos-delay="200">
                        <img src="assets/img/features-2.svg" className="img-fluid" alt="" />
                    </div>
                    <div className="col-md-7 order-2 order-md-1" data-aos="fade-up" data-aos-delay="200">
                        <h3>Resultados y Diagnósticos</h3>
                        <p className="fst-italic">
                            Con su enfoque en la tecnología y la personalización, Mente Conecta se posiciona como un aliado valioso para aquellos que buscan mejorar su salud mental y recibir la atención que merecen.
                        </p>
                        <ul>
                            <li><i className="bi bi-check"></i><span>Visualización clara de los resultados de los test.</span></li>
                            <li><i className="bi bi-check"></i> <span>Explicación del prediagnóstico basado en las respuestas.</span></li>
                            <li><i className="bi bi-check"></i> <span>Información sobre posibles riesgos a padecimientos mentales.</span></li>
                        </ul>
                    </div>
                </div>

                <div className="row gy-4 align-items-center features-item">
                    <div className="col-md-5 d-flex align-items-center" data-aos="zoom-out">
                        <img src="assets/img/features-3.svg" className="img-fluid" alt="" />
                    </div>
                    <div className="col-md-7" data-aos="fade-up">
                        <h3>Contacto y catálogo de médicos.</h3>
                        <p>Los usuarios tienen la opción de conectarse con profesionales de la salud a través de consultas programadas, lo que facilita el acceso a atención médica sin necesidad de desplazamientos.</p>
                        <ul>
                            <li><i className="bi bi-check"></i> <span>Listado de médicos especializados en salud mental.</span></li>
                            <li><i className="bi bi-check"></i><span> Filtros para buscar por especialidad, ubicación y disponibilidad.</span>
                            </li>
                            <li><i className="bi bi-check"></i> <span>Opción para que el usuario seleccione un médico y programe una cita (presencial o telemedicina).</span>.</li>

                            <li><i className="bi bi-check"></i> <span>Sistema de programación de citas, con opciones para telemedicina</span>.</li>
                        </ul>




                    </div>
                </div>
            </div>

        </section>
    )
}
