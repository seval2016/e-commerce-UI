import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
  trigger, 
  items = [], 
  position = 'bottom',
  size = 'md',
  className = '',
  onSelect,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Position configurations
  const positionConfig = {
    top: 'bottom-full left-0 mb-2',
    bottom: 'top-full left-0 mt-2',
    left: 'right-full top-0 mr-2',
    right: 'left-full top-0 ml-2'
  };

  // Size configurations
  const sizeConfig = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-3 px-4'
  };

  const config = positionConfig[position];
  const sizeClasses = sizeConfig[size];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item) => {
    if (item.onClick) {
      item.onClick(item);
    }
    onSelect?.(item);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef} {...props}>
      {/* Trigger */}
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute z-50 min-w-48 bg-white rounded-lg shadow-lg border border-gray-200 ${config}`}>
          <div className="py-1">
            {items.map((item, index) => (
              <div key={index}>
                {item.divider ? (
                  <div className="border-t border-gray-200 my-1"></div>
                ) : (
                  <button
                    onClick={() => handleSelect(item)}
                    disabled={item.disabled}
                    className={`w-full text-left ${sizeClasses} ${
                      item.disabled 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    } transition-colors duration-200 flex items-center gap-2`}
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        item.badge.variant === 'danger' ? 'bg-red-100 text-red-800' :
                        item.badge.variant === 'success' ? 'bg-green-100 text-green-800' :
                        item.badge.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.badge.text}
                      </span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    icon: PropTypes.node,
    disabled: PropTypes.bool,
    divider: PropTypes.bool,
    badge: PropTypes.shape({
      text: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(['default', 'danger', 'success', 'warning'])
    })
  })).isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  onSelect: PropTypes.func,
};

export default Dropdown; 