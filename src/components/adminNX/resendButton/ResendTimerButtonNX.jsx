import React, { useState, useEffect } from 'react';

export function ResendTimerButtonNX({ onResend, isResending, initialSeconds = 300 }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const handleClick = async () => {
        await onResend();
        setTimeLeft(initialSeconds);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const isDisabled = isResending || timeLeft > 0;
    const percentage = timeLeft > 0 ? (timeLeft / initialSeconds) * 100 : 0;

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            style={{
                width: '100%',
                padding: '14px',
                borderRadius: '30px',
                border: isDisabled ? '1px solid #d1d1d1' : '1px solid #e8d8e6',
                color: isDisabled ? '#777' : '#8c5d8a',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'transparent',
                transition: 'border-color 0.3s ease, color 0.3s ease',
            }}
        >
            {timeLeft > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: '#f3e8f1', 
                        transition: 'width 1s linear', 
                        zIndex: 0
                    }}
                />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>
                {isResending ? 'Enviando...'
                    : timeLeft > 0 ? `Reenviar en ${formatTime(timeLeft)}`
                        : '¿No recibiste el código? Reenviar'}
            </span>
        </button>
    );
}