import React from 'react'

export function BannerHeader() {
    return (
        <section id="hero" className="hero section dark-background">

            <div className="container">
                <div className="row gy-4">
                    <div className="col-lg-4 order-lg-last hero-img" data-aos="zoom-out">
                        <img src="/assets/img/phone_1.png" alt="Phone 1" className="phone-1" />
                        <img src="/assets/img/phone_2.png" alt="Phone 2" className="phone-2" />
                    </div>
                    <div className="col-lg-8 d-flex flex-column justify-content-center align-items text-center text-md-start" data-aos="fade-up">
                        <h2>Prediagnósicos de transtornos mentales</h2>
                        <p>Mucho más que un simple aplicativo.</p>
                        <div className="d-flex mt-4 justify-content-center justify-content-md-start">
                            <a href="#" className="download-btn"><i className="bi bi-google-play"></i> <span>Google Play</span></a>
                            <a href="#" className="download-btn"><i className="bi bi-apple"></i> <span>App Store</span></a>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}
