import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  trigger = 'hover',
  delay = 200,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  // Position configurations
  const positionConfig = {
    top: {
      tooltipClass: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      arrowClass: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900'
    },
    bottom: {
      tooltipClass: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      arrowClass: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900'
    },
    left: {
      tooltipClass: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      arrowClass: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900'
    },
    right: {
      tooltipClass: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
      arrowClass: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900'
    }
  };

  const config = positionConfig[position];

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      hideTooltip();
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus') {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`relative inline-block ${className}`}
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${config.tooltipClass}`}
          role="tooltip"
        >
          {content}
          <div className={`absolute w-0 h-0 border-4 border-transparent ${config.arrowClass}`}></div>
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  trigger: PropTypes.oneOf(['hover', 'click', 'focus']),
  delay: PropTypes.number,
  className: PropTypes.string,
};

export default Tooltip; 