import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ 
  items = [], 
  separator = 'chevron-right',
  size = 'md',
  className = '',
  ...props 
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      textClass: 'text-xs',
      iconClass: 'text-xs',
      spacing: 'space-x-1'
    },
    md: {
      textClass: 'text-sm',
      iconClass: 'text-sm',
      spacing: 'space-x-1 md:space-x-3'
    },
    lg: {
      textClass: 'text-base',
      iconClass: 'text-base',
      spacing: 'space-x-2 md:space-x-4'
    }
  };

  // Separator configurations
  const separatorConfig = {
    'chevron-right': 'bi bi-chevron-right',
    'chevron-left': 'bi bi-chevron-left',
    'arrow-right': 'bi bi-arrow-right',
    'arrow-left': 'bi bi-arrow-left',
    'slash': 'bi bi-slash',
    'dot': 'bi bi-dot'
  };

  const config = sizeConfig[size];
  const separatorIcon = separatorConfig[separator] || separatorConfig['chevron-right'];

  if (items.length === 0) return null;

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb" {...props}>
      <ol className={`inline-flex items-center ${config.spacing}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="inline-flex items-center">
              {!isFirst && (
                <i className={`${separatorIcon} text-gray-400 mx-2 ${config.iconClass}`}></i>
              )}
              
              {isLast ? (
                <span 
                  className={`${config.textClass} font-medium text-gray-500 truncate max-w-xs`}
                  aria-current="page"
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <Link 
                  to={item.href || '#'} 
                  className={`inline-flex items-center ${config.textClass} font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200`}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string,
    icon: PropTypes.node
  })).isRequired,
  separator: PropTypes.oneOf(['chevron-right', 'chevron-left', 'arrow-right', 'arrow-left', 'slash', 'dot']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Breadcrumb; 
