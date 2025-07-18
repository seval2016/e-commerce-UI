import PropTypes from 'prop-types';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  size = 'md',
  className = '',
  ...props 
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      buttonClass: 'px-2 py-1 text-xs',
      gapClass: 'gap-1'
    },
    md: {
      buttonClass: 'px-3 py-2 text-sm',
      gapClass: 'gap-2'
    },
    lg: {
      buttonClass: 'px-4 py-2 text-base',
      gapClass: 'gap-3'
    }
  };

  const config = sizeConfig[size];

  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const renderPageButton = (page, label = page, isActive = false, isDisabled = false) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      disabled={isDisabled}
      className={`${config.buttonClass} rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : isDisabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300'
      }`}
    >
      {label}
    </button>
  );

  const renderEllipsis = (key) => (
    <span key={key} className={`${config.buttonClass} text-gray-500`}>
      ...
    </span>
  );

  return (
    <div className={`flex items-center justify-center ${config.gapClass} ${className}`} {...props}>
      {/* First Page */}
      {showFirstLast && currentPage > 1 && (
        renderPageButton(1, 'İlk', false, false)
      )}
      
      {/* Previous Page */}
      {showPrevNext && (
        renderPageButton(
          currentPage - 1, 
          <i className="bi bi-chevron-left"></i>, 
          false, 
          currentPage === 1
        )
      )}
      
      {/* Page Numbers */}
      {visiblePages.map((page, index) => {
        const isActive = page === currentPage;
        
        // Show ellipsis before first visible page if there are more pages
        if (index === 0 && page > 1) {
          return (
            <div key={`ellipsis-start-${page}`} className="flex items-center">
              {renderEllipsis(`ellipsis-start-${page}`)}
              {renderPageButton(page, page, isActive)}
            </div>
          );
        }
        
        // Show ellipsis after last visible page if there are more pages
        if (index === visiblePages.length - 1 && page < totalPages) {
          return (
            <div key={`ellipsis-end-${page}`} className="flex items-center">
              {renderPageButton(page, page, isActive)}
              {renderEllipsis(`ellipsis-end-${page}`)}
            </div>
          );
        }
        
        return renderPageButton(page, page, isActive);
      })}
      
      {/* Next Page */}
      {showPrevNext && (
        renderPageButton(
          currentPage + 1, 
          <i className="bi bi-chevron-right"></i>, 
          false, 
          currentPage === totalPages
        )
      )}
      
      {/* Last Page */}
      {showFirstLast && currentPage < totalPages && (
        renderPageButton(totalPages, 'Son', false, false)
      )}
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showFirstLast: PropTypes.bool,
  showPrevNext: PropTypes.bool,
  maxVisiblePages: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Pagination; 
