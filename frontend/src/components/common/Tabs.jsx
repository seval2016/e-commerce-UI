import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const Tabs = ({ 
  tabs = [], 
  defaultActiveTab = null,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultActiveTab || (tabs.length > 0 ? tabs[0].id : null));

  // Use controlled or uncontrolled state
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  useEffect(() => {
    if (defaultActiveTab && defaultActiveTab !== activeTab) {
      setInternalActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  const handleTabClick = (tabId) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  // Variant configurations
  const variantConfig = {
    default: {
      tabClass: (isActive) => `py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
        isActive
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`,
      containerClass: "border-b border-gray-100"
    },
    pills: {
      tabClass: (isActive) => `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
        isActive
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`,
      containerClass: "flex space-x-2"
    },
    underline: {
      tabClass: (isActive) => `py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
        isActive
          ? "border-gray-900 text-gray-900"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`,
      containerClass: "border-b border-gray-200"
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      tabClass: "text-xs py-2",
      contentClass: "p-4"
    },
    md: {
      tabClass: "text-sm py-4",
      contentClass: "p-6"
    },
    lg: {
      tabClass: "text-base py-6",
      contentClass: "p-8"
    }
  };

  const config = variantConfig[variant];
  const sizeClasses = sizeConfig[size];

  if (tabs.length === 0) return null;

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={`bg-white ${className}`} {...props}>
      {/* Tab Navigation */}
      <div className={config.containerClass}>
        <nav className={`flex ${variant === 'pills' ? 'space-x-2' : 'space-x-8'} px-6 lg:px-8`} aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`${config.tabClass(tab.id === activeTab)} ${sizeClasses.tabClass}`}
              aria-selected={tab.id === activeTab}
              role="tab"
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className={sizeClasses.contentClass}>
        {activeTabData?.content || (
          <div className="text-gray-500 text-center py-8">
            Tab içeriği bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    content: PropTypes.node,
    icon: PropTypes.node
  })).isRequired,
  defaultActiveTab: PropTypes.string,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'pills', 'underline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Tabs; 
