import React from 'react';
// import { NavBar } from '../../components/landingPage/navBar/NavBar'; // Este import no se está utilizando
import { Header } from '../../components/landing/header/Header';
import { Footer } from '../../components/landing/footer';

export function LandingLayout(props) {

    const { children } = props;


    return (
        <div className="col-xs-12 col-md-12 col-lg-12 landing-layout">
            <Header />
            <main className="landing-content">
                {children}
            </main>
            <Footer />
            <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center">
                <i className="bi bi-arrow-up-short"></i>
            </a>
        </div>
    )
}
