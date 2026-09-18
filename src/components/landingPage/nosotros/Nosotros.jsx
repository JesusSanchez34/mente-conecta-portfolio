import React from 'react'

export function Nosotros() {
    return (
        <section id="about" className="about section">

            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <div className="row align-items-xl-center gy-5">

                    <div className="col-xl-5 content">
                        <h3>Acerca de nosotros</h3>
                        <h2>Mente Conecta</h2>
                        <p>Es un innovador sistema web y aplicación móvil diseñado para mejorar la salud mental de sus usuarios a través de diversas funcionalidades interactivas. En un mundo donde la salud mental es cada vez más reconocida como un aspecto crucial del bienestar general.</p>
                        {/*<a href="#" className="read-more"><span>Read More</span><i className="bi bi-arrow-right"></i></a>*/}
                    </div>

                    <div className="col-xl-7">
                        <div className="row gy-4 icon-boxes">

                            <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
                                <div className="icon-box">
                                    <i className="bi bi-buildings"></i>
                                    <h3>Eficiencia</h3>
                                    <p>Ofrece una plataforma integral que facilita el acceso a recursos de salud mental.</p>
                                </div>
                            </div>

                            <div className="col-md-6" data-aos="fade-up" data-aos-delay="300">
                                <div className="icon-box">
                                    <i className="bi bi-clipboard-pulse"></i>
                                    <h3>Siempre conectados</h3>
                                    <p>Conexión con especialistas, y la recopilación de datos relevantes para un manejo más efectivo.</p>
                                </div>
                            </div>



                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}
