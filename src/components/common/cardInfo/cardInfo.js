import { FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

export const cardClasses = (riskLevel) => `risk-card risk-level-${riskLevel}`;

export const getIcon = (riskLevel) => {
    switch (riskLevel) {
      case 1:
        return <FiCheckCircle className="card-icon-navigation" />; 
      case 2:
        return <FiInfo className="card-icon-navigation" />;
      case 3:
      default:
        return <FiAlertTriangle className="card-icon-navigation" />; 
    }
  };