import PropTypes from 'prop-types';

const Card = ({
  children,
  className = '',
  padding = 'p-4',
  rounded = 'rounded-2xl',
  shadow = 'shadow-sm',
  hoverShadow = 'hover:shadow-xl',
  border = 'border border-gray-100',
  bg = 'bg-white',
  ...props
}) => {
  const cardClasses = `${bg} ${border} ${rounded} ${shadow} ${hoverShadow} transition-all duration-300 overflow-hidden ${padding} ${className}`;
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.string,
  rounded: PropTypes.string,
  shadow: PropTypes.string,
  hoverShadow: PropTypes.string,
  border: PropTypes.string,
  bg: PropTypes.string,
};

export default Card; 
