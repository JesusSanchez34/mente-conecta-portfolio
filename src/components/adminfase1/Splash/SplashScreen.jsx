import React from 'react';
import './SplashScreen.css';
import logo from '../../../assets/img/logomenteconecta.png'; 

const SplashScreen = () => {
  return (
    <div className="splash-container">
      <div className="splash-content">
        <img src={logo} alt="Mente Conecta" className="splash-logo" />
      </div>
    </div>
  );
};

export default SplashScreen;