import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PantallaCarga.css';

export function PantallaCarga() {
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setCargando(false);
            navigate('/secciones');
        }, 1000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="pc-bg">
            <div className="pc-spinner" />
        </div>
    );
}
