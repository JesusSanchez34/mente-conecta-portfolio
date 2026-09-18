import React from 'react';

const CharacteristicCard = ({ icon, title, description, className }) => {
    return (
        <div className={`characteristic-card ${className || ''}`}>
            <div className="card-header">
                <span className="card-icon">{icon}</span>
                <h3>{title}</h3>
            </div>
            <p>{description}</p>
        </div>
    );
};

export default CharacteristicCard;