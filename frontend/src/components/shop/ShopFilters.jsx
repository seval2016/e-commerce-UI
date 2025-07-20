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

    // Beden ve Renkleri ürünlerden dinamik olarak al
    const availableSizes = useMemo(() => {
        const allSizes = products.flatMap(p => p.sizes || []);
        return [...new Set(allSizes)];
    }, [products]);

    const availableColors = useMemo(() => {
        const allColors = products.flatMap(p => p.colors || []);
        return [...new Set(allColors)];
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
        <div className="flex flex-wrap gap-2">
            {availableColors.map(color => (
                <Tag.CheckableTag
                    key={color}
                    checked={initialFilters.colors?.includes(color)}
                    onChange={(checked) => handleColorChange(color, checked)}
                    style={{ 
                        backgroundColor: initialFilters.colors?.includes(color) ? color : '#f0f0f0',
                        color: initialFilters.colors?.includes(color) ? 'white' : 'black',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        textTransform: 'capitalize'
                    }}
                >
                    {color}
                </Tag.CheckableTag>
            ))}
        </div>
      </Widget>

      <Widget title="Filter by Size">
        <div className="flex flex-wrap gap-2">
            {availableSizes.map(size => (
                 <Tag.CheckableTag
                    key={size}
                    checked={initialFilters.sizes?.includes(size)}
                    onChange={(checked) => handleSizeChange(size, checked)}
                 >
                    {size}
                 </Tag.CheckableTag>
            ))}
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