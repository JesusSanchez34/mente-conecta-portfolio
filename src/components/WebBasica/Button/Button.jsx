import React from 'react';
import './Button.scss';

export function Button({ children, onClick, type = 'button', variant = 'primary', fullWidth = false, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`sep-btn sep-btn--${variant} ${fullWidth ? 'sep-btn--full' : ''}`}
    >
      {children}
    </button>
  );
}
