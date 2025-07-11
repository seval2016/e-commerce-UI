import PropTypes from 'prop-types';

const Loading = ({ 
  type = 'spinner', 
  size = 'md', 
  text = 'Loading...',
  className = '',
  ...props 
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  // Spinner component
  const Spinner = () => (
    <svg 
      className={`animate-spin ${sizeClasses[size]} text-current`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Dots component
  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  // Skeleton component
  const Skeleton = () => (
    <div className="animate-pulse bg-gray-200 rounded h-full w-full" />
  );

  // Render based on type
  const renderLoading = () => {
    switch (type) {
      case 'spinner':
        return <Spinner />;
      case 'dots':
        return <Dots />;
      case 'skeleton':
        return <Skeleton />;
      default:
        return <Spinner />;
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      {renderLoading()}
      {text && type !== 'skeleton' && (
        <span className="ml-2 text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
};

Loading.propTypes = {
  type: PropTypes.oneOf(['spinner', 'dots', 'skeleton']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  text: PropTypes.string,
  className: PropTypes.string,
};

export default Loading; 