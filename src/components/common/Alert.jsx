import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  showIcon = true,
  closable = false,
  autoClose = false,
  autoCloseDelay = 5000,
  onClose,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto close effect
  useEffect(() => {
    if (autoClose && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  // Type configurations
  const typeConfig = {
    success: {
      icon: 'bi-check-circle',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400'
    },
    error: {
      icon: 'bi-x-circle',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: 'bi-exclamation-triangle',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: 'bi-info-circle',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400'
    }
  };

  const config = typeConfig[type];

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`border rounded-lg p-4 ${config.bgColor} ${config.borderColor} ${className}`}
      {...props}
    >
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0">
            <i className={`bi ${config.icon} text-xl ${config.iconColor}`}></i>
          </div>
        )}
        
        <div className={`flex-1 ${showIcon ? 'ml-3' : ''}`}>
          {title && (
            <h3 className={`text-sm font-medium ${config.textColor}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`mt-1 text-sm ${config.textColor}`}>
              {message}
            </div>
          )}
        </div>

        {closable && (
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 ${config.bgColor} ${config.textColor} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-600`}
              aria-label="Close alert"
            >
              <i className="bi bi-x text-lg"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  message: PropTypes.string,
  showIcon: PropTypes.bool,
  closable: PropTypes.bool,
  autoClose: PropTypes.bool,
  autoCloseDelay: PropTypes.number,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

export default Alert; 