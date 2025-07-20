import { useState, useMemo, useCallback } from "react";
import { useData } from "../context/DataContext";

const useEntityData = (entityType, initialFilters = {}) => {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const dataContext = useData();

  const { items, deleteItem, loading, error } = useMemo(() => {
    switch (entityType) {
      case 'categories':
        return { 
          items: dataContext.categories, 
          deleteItem: dataContext.deleteCategory,
          loading: dataContext.loading.categories,
          error: dataContext.errors.categories
        };
      case 'products':
        return { 
          items: dataContext.products, 
          deleteItem: dataContext.deleteProduct,
          loading: dataContext.loading.products,
          error: dataContext.errors.products
        };
      case 'blogs':
        return { 
          items: dataContext.blogs, 
          deleteItem: dataContext.deleteBlog,
          loading: dataContext.loading.blogs,
          error: dataContext.errors.blogs
        };
      case 'customers':
        return {
          items: dataContext.customers,
          deleteItem: dataContext.deleteCustomer,
          loading: dataContext.loading.customers,
          error: dataContext.errors.customers
        };
      default:
        return { 
          items: [], 
          deleteItem: () => console.error('Invalid entity type'),
          loading: false,
          error: null
        };
    }
  }, [entityType, dataContext]);

  const handleSearch = useCallback((value) => {
    setSearchText(value);
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchText('');
  }, [initialFilters]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
    }
  }, [deleteItem, entityType]);

  const filteredData = useMemo(() => {
    return items.filter(item => {
      // Metin araması
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const searchMatch = 
          (item.name || '').toLowerCase().includes(searchLower) ||
          (item.description || '').toLowerCase().includes(searchLower) ||
          (item.brand || '').toLowerCase().includes(searchLower) ||
          (item.sku || '').toLowerCase().includes(searchLower) ||
          (item.title || '').toLowerCase().includes(searchLower) || // Bloglar için
          (item.email || '').toLowerCase().includes(searchLower) || // Müşteriler için
          (item.phone || '').toLowerCase().includes(searchLower); // Müşteriler için
        if (!searchMatch) return false;
      }

      // Kategori filtresi
      if (filters.category && filters.category !== 'all') {
        const itemCategoryId = item.category && typeof item.category === 'object' 
          ? item.category._id 
          : item.category;
        if (itemCategoryId !== filters.category) return false;
      }

      // Durum filtresi (isActive veya isPublished)
      if (filters.status && filters.status !== 'all') {
        const status = Object.prototype.hasOwnProperty.call(item, 'isActive') ? item.isActive : item.isPublished;
        if (filters.status === 'active' && !status) return false;
        if (filters.status === 'inactive' && status) return false;
      }

      // Stok filtresi (sadece ürünler için)
      if (entityType === 'products' && filters.inStock && filters.inStock !== 'all') {
        const stock = item.stock || 0;
        const lowStockThreshold = item.lowStockThreshold || 5;
        if (filters.inStock === 'in_stock' && stock <= 0) return false;
        if (filters.inStock === 'out_of_stock' && stock > 0) return false;
        if (filters.inStock === 'low_stock' && (stock > lowStockThreshold || stock <= 0)) return false;
      }

      return true;
    });
  }, [items, searchText, filters, entityType]);

  return {
    filteredData,
    loading,
    error,
    filters,
    handleSearch,
    setSearchText,
    handleFilterChange,
    handleClearFilters,
    handleDelete,
  };
};

export default useEntityData; 