import React from 'react';
import {
    BannerHeader,
    DescripcionMente,
    Nosotros,
    PreguntasFrecuentes,
    SeccionDestacada
} from '../../components/landingPage';
// import useAppEffects from '../../hooks/useAppEffects';


export function Home() {
    // useAppEffects();

    return (
        <div>
            <BannerHeader />
            <Nosotros />
            <SeccionDestacada />
            <DescripcionMente />
            <PreguntasFrecuentes />
        </div>
    )
}
