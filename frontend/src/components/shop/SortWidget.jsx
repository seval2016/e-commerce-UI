import PropTypes from 'prop-types';

const SortWidget = ({ onSortChange, defaultValue }) => {
  return (
    <div className="relative">
      <select
        id="sort"
        name="sort"
        className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
        value={defaultValue}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="popularity">Sort by popularity</option>
        <option value="price-asc">Sort by price: low to high</option>
        <option value="price-desc">Sort by price: high to low</option>
        <option value="rating">Sort by average rating</option>
        <option value="newest">Sort by latest</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <i className="bi bi-chevron-down text-sm"></i>
      </div>
    </div>
  );
};

SortWidget.propTypes = {
    onSortChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.string.isRequired,
};

export default SortWidget; 