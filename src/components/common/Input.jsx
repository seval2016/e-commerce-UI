import PropTypes from 'prop-types';

const Input = ({ 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  success,
  size = 'md',
  fullWidth = true,
  icon,
  className = '',
  ...props 
}) => {
  // Base classes
  const baseClasses = 'border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };
  
  // State classes
  const stateClasses = error 
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
    : success 
    ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Icon padding
  const iconPadding = icon ? (type === 'textarea' ? 'pl-10' : 'pl-10') : '';
  
  // Combine all classes
  const inputClasses = `${baseClasses} ${sizeClasses[size]} ${stateClasses} ${widthClass} ${iconPadding} ${className}`;
  
  // Textarea specific classes
  const textareaClasses = type === 'textarea' ? 'resize-none' : '';
  
  const InputElement = type === 'textarea' ? 'textarea' : 'input';
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <InputElement
          type={type === 'textarea' ? undefined : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${inputClasses} ${textareaClasses}`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {success && (
        <p className="mt-1 text-sm text-green-600">{success}</p>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'textarea', 'checkbox', 'tel', 'url']),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default Input; 