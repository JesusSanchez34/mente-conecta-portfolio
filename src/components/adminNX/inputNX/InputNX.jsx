import React from 'react';
import './InputNX.scss';

export const InputNX = ({
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    icon,
    rightElement,
    isSelect = false,
    children,
    ...rest
}) => {
    const hasError = touched && error;

    return (
        <div className="nx-wrapper-group">
            <div className={`nx-input-container ${hasError ? 'nx-input-error' : ''}`}>
                {icon && <span className="nx-icon-left">{icon}</span>}
                {isSelect ? (
                    <select
                        className="nx-field nx-select"
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        {...rest}
                    >
                        {placeholder && <option value="" disabled hidden>{placeholder}</option>}
                        {children}
                    </select>
                ) : (
                    <input
                        className="nx-field nx-input"
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        {...rest}
                    />
                )}
                {rightElement && (
                    <span className="nx-right-element">{rightElement}</span>
                )}
            </div>
            {hasError && (
                <div className="nx-native-tooltip">
                    <div className="nx-tooltip-icon">!</div>
                    <div className="nx-tooltip-message">{error}</div>
                </div>
            )}
        </div>
    );
};