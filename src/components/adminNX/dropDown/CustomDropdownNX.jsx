import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdownNX.scss';

const formatearNumerosMorados = (texto) => {
    return texto.split(/(\d+)/).map((parte, index) =>
        /\d+/.test(parte) ? (
            <span key={index} className="nx-numero-morado">{parte}</span>
        ) : (
            parte
        )
    );
};

export function CustomDropdownNX({
    value,
    onChange,
    onBlur,
    options,
    placeholder,
    error,
    touched
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hasError = touched && error;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (isOpen && onBlur) onBlur();
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onBlur]);

    const opcionSeleccionada = options.find(opt => opt.value === value);

    const handleSelect = (selectedValue) => {
        onChange(selectedValue);
        setIsOpen(false);
    };

    return (
        <div className="nx-wrapper-group" ref={dropdownRef}>
            <div
                className={`nx-custom-dropdown-container ${isOpen ? 'focused' : ''} ${hasError ? 'nx-input-error' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`nx-dropdown-text ${!value ? 'nx-dropdown-placeholder' : ''}`}>
                    {value && opcionSeleccionada ? formatearNumerosMorados(opcionSeleccionada.label) : placeholder}
                </div>

                <svg className={`nx-dropdown-arrow ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>

            {isOpen && (
                <ul className="nx-dropdown-list">
                    {options.map((opcion) => (
                        <li
                            key={opcion.value}
                            className={`nx-dropdown-item ${value === opcion.value ? 'selected' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(opcion.value);
                            }}
                        >
                            {formatearNumerosMorados(opcion.label)}
                        </li>
                    ))}
                </ul>
            )}
            {hasError && (
                <div className="nx-native-tooltip">
                    <div className="nx-tooltip-icon">!</div>
                    <div className="nx-tooltip-message">{error}</div>
                </div>
            )}
        </div>
    );
}