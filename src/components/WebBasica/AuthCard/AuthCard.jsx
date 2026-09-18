import React from 'react';
import './AuthCard.scss';

export function AuthCard({ children, className = '' }) {
  return (
    <div className={`auth-card ${className}`}>
      {children}
    </div>
  );
}