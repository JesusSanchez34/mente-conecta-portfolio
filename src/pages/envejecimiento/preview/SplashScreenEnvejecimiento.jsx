import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeImg from '../../../assets/img/Home.jpeg';
import './SplashScreenEnvejecimiento.css';

export function SplashScreenEnvejecimiento() {
    const navigate = useNavigate();
    const [opacity, setOpacity] = useState(0);
    const [transitionDuration, setTransitionDuration] = useState('900ms');

    useEffect(() => {
        // 1. Animación de Entrada (Fade-In)
        const fadeInTimer = setTimeout(() => {
            setTransitionDuration('900ms');
            setOpacity(1);
        }, 200);

        // 2. Animación de Salida (Fade-Out)
        const fadeOutTimer = setTimeout(() => {
            setTransitionDuration('700ms');
            setOpacity(0);
        }, 3000);

        // 3. Redirección
        const redirectTimer = setTimeout(() => {
            navigate('/tutorial', { replace: true });
        }, 3700);

        return () => {
            clearTimeout(fadeInTimer);
            clearTimeout(fadeOutTimer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <div className="env-splash-screen" style={{ backgroundColor: '#ffffff' }}>
            <img 
                src={HomeImg} 
                alt="Mente Conecta Envejecimiento" 
                className="env-splash-image"
                style={{ 
                    opacity: opacity, 
                    transition: `opacity ${transitionDuration} ease-in-out` 
                }}
            />
        </div>
    );
}
