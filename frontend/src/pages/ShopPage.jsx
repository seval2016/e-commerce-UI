import { useState, useMemo } from "react";
import { Drawer, Button } from "antd";
import { FilterOutlined } from '@ant-design/icons';

import { useData } from '../context/DataContext.jsx';
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import ShopFilters from "../components/shop/ShopFilters.jsx";
import SortWidget from "../components/shop/SortWidget.jsx";
import ProductGrid from "../components/shop/ProductGrid.jsx";
import Pagination from "../components/common/Pagination.jsx";

const PRODUCTS_PER_PAGE = 9;

const ShopPage = () => {
  const { products, loading } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("popularity");
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);

  const initialFilters = {
    category: "all",
    price: [0, 10000],
    colors: [],
    sizes: [],
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); 
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.category?._id === filters.category);
    }
    // Price filter
    if (filters.price) {
        filtered = filtered.filter(p => p.price >= filters.price[0] && p.price <= filters.price[1]);
    }
    // Color filter
    if (filters.colors.length > 0) {
        filtered = filtered.filter(p => p.colors && p.colors.some(color => filters.colors.includes(color)));
    }
    // Size filter
    if (filters.sizes.length > 0) {
        filtered = filtered.filter(p => p.sizes && p.sizes.some(size => filters.sizes.includes(size)));
    }

    // Sorting
    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default: // popularity
        filtered.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
    }

    return filtered;
  }, [products, filters, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [currentPage, filteredAndSortedProducts]);

  const resultText = useMemo(() => {
    const total = filteredAndSortedProducts.length;
    const start = total > 0 ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0;
    const end = Math.min(start + PRODUCTS_PER_PAGE - 1, total);
    return `Showing ${start}–${end} of ${total} results`;
  }, [currentPage, filteredAndSortedProducts]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumb items={[{ label: "Shop" }]} />
      <div className="container mx-auto px-4 max-w-7xl py-12">
        {/* Mobile Filter Button */}
        <div className="text-center mb-6 lg:hidden">
            <Button 
                icon={<FilterOutlined />} 
                onClick={() => setIsFilterDrawerVisible(true)}
                size="large"
            >
                Filters & Sort
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <ShopFilters 
                initialFilters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Products */}
          <main className="lg:col-span-3">
            <div className="hidden lg:flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-600">{resultText}</p>
              <div className="w-56">
                <SortWidget onSortChange={setSortOption} defaultValue={sortOption} />
              </div>
            </div>

            <ProductGrid products={paginatedProducts} loading={loading.products} />
            
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                size="md"
              />
            </div>
          </main>
        </div>
      </div>

      {/* Filter Drawer - Mobile */}
      <Drawer
        title="Filters"
        placement="bottom"
        onClose={() => setIsFilterDrawerVisible(false)}
        open={isFilterDrawerVisible}
        height="90%"
        className="lg:hidden"
      >
        <div className="p-4">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Sort By</h3>
                <SortWidget onSortChange={setSortOption} defaultValue={sortOption} />
            </div>
            <ShopFilters 
                initialFilters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={() => {
                    handleClearFilters();
                    setIsFilterDrawerVisible(false);
                }}
            />
        </div>
      </Drawer>
    </div>
  );
};

export default ShopPage;
