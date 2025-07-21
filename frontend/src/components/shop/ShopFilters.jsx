import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Slider, Checkbox, Tag } from 'antd';
import { useData } from '../../context/DataContext';

const Widget = ({ title, children, extra }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
    <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {extra && <div className="text-sm">{extra}</div>}
    </div>
    {children}
  </div>
);

Widget.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    extra: PropTypes.node,
};

const ShopFilters = ({ initialFilters, onFilterChange, onClearFilters }) => {
    const { categories, products } = useData();
    const [priceRange, setPriceRange] = useState(initialFilters.price || [0, 1000]);

    // Popüler renkler ve bedenler (sabit + ürünlerden dinamik)
    const availableColors = useMemo(() => {
      const popularColors = [
        "black", "white", "gray", "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "beige"
      ];
      const allColors = products.flatMap(p => p.colors || []);
      const uniqueColors = Array.from(new Set([...popularColors, ...allColors]));
      return uniqueColors;
    }, [products]);

    const availableSizes = useMemo(() => {
      const popularSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
      const allSizes = products.flatMap(p => p.sizes || []);
      const uniqueSizes = Array.from(new Set([...popularSizes, ...allSizes]));
      return uniqueSizes;
    }, [products]);

    const handleCategoryChange = (e, categoryId) => {
        const newCategory = e.target.checked ? categoryId : 'all';
        onFilterChange('category', newCategory);
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
        onFilterChange('price', value);
    };

    const handleColorChange = (color, isSelected) => {
        const currentColors = initialFilters.colors || [];
        const newColors = isSelected
            ? [...currentColors, color]
            : currentColors.filter(c => c !== color);
        onFilterChange('colors', newColors);
    };
    
    const handleSizeChange = (size, isSelected) => {
        const currentSizes = initialFilters.sizes || [];
        const newSizes = isSelected
            ? [...currentSizes, size]
            : currentSizes.filter(s => s !== size);
        onFilterChange('sizes', newSizes);
    };


  return (
    <div className="w-full">
      <Widget title="Product Categories" extra={<a href="#" onClick={(e) => { e.preventDefault(); onFilterChange('category', 'all'); }} className="text-blue-600 hover:underline">Reset</a>}>
        <ul className="space-y-3">
          {categories.map(cat => (
             <li key={cat._id}>
                <Checkbox 
                    onChange={(e) => handleCategoryChange(e, cat._id)}
                    checked={initialFilters.category === cat._id}
                >
                    {cat.name}
                </Checkbox>
             </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Filter by Price" extra={`₺${priceRange[0]} - ₺${priceRange[1]}`}>
        <Slider
          range
          defaultValue={priceRange}
          max={10000}
          onAfterChange={handlePriceChange}
        />
      </Widget>

      <Widget title="Filter by Color">
        <div className="flex flex-wrap gap-3">
          {availableColors.map(color => {
            const isSelected = initialFilters.colors?.includes(color);
            return (
              <button
                key={color}
                type="button"
                onClick={() => handleColorChange(color, !isSelected)}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none relative
                  ${isSelected ? 'border-blue-600 ring-2 ring-blue-200 scale-110 shadow-lg' : 'border-gray-300 hover:border-blue-400'}
                `}
                style={{ backgroundColor: color, minWidth: 36, minHeight: 36 }}
                title={color.charAt(0).toUpperCase() + color.slice(1)}
              >
                {isSelected && (
                  <span className="absolute right-0 bottom-0 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-blue-600 shadow">
                    <i className="bi bi-check-lg text-blue-600 text-xs"></i>
                  </span>
                )}
                <span className="sr-only">{color}</span>
              </button>
            );
          })}
        </div>
      </Widget>

      <Widget title="Filter by Size">
        <div className="flex flex-wrap gap-2">
          {availableSizes.map(size => {
            const isSelected = initialFilters.sizes?.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeChange(size, !isSelected)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 focus:outline-none relative
                  ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                `}
                style={{ minWidth: 44 }}
                title={size}
              >
                {isSelected && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shadow">
                    <i className="bi bi-check"></i>
                  </span>
                )}
                {size}
              </button>
            );
          })}
        </div>
      </Widget>

      <button
        onClick={onClearFilters}
        className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

ShopFilters.propTypes = {
    initialFilters: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired,
};

export default ShopFilters; 