import React from 'react'

export function SeccionDestacada() {
    return (
        <section id="features" className="featured section">

            <div className="container section-title" data-aos="fade-up">
                <h2>Caracteristicas del sistema</h2>
            </div>

            <div className="container">

                <div className="row gy-4" data-aos="fade-up" data-aos-delay="100">

                    <div className="col-md-4">
                        <div className="card">
                            <div className="img">
                                <img src="assets/img/cards-4.png" alt="" className="img-fluid" />
                                <div className="icon"><i className="bi bi-hdd-stack"></i></div>
                            </div>
                            <h2 className="title">Evaluación del Estado Mental</h2>
                            <p>
                                La plataforma incluye formularios diseñados para evaluar el estado mental del usuario. Con base en las respuestas, se genera un prediagnóstico que ofrece una primera aproximación a su salud mental.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
                        <div className="card">
                            <div className="img">
                                <img src="assets/img/cards-2.png" alt="" className="img-fluid" />
                                <div className="icon"><i className="bi bi-brightness-high"></i></div>
                            </div>
                            <h2 className="title">Conexión con Especialistas</h2>
                            <p>
                                Tras el prediagnóstico, se presenta al usuario una lista de médicos especialistas que pueden ayudar en el tratamiento de múltiples padecimientos. Esto incluye la posibilidad de agendar citas, tanto telemedicina como presenciales.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
                        <div className="card">
                            <div className="img">
                                <img src="assets/img/cards-6.png" alt="" className="img-fluid" />
                                <div className="icon"><i className="bi bi-calendar4-week"></i></div>
                            </div>
                            <h2 className="title">Dashboard para Administradores</h2>
                            <p>
                                Se ofrecen herramientas para administradores, dashboards con estadísticas sobre la salud de los pacientes, garantizando la integridad y privacidad de la información personal.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

        </section>
    )
}
