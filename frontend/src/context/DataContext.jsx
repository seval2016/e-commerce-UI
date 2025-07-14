import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { message } from 'antd';
import api from '../services/api.js';

// Create context with default values
const DataContext = createContext({
  // Data states
  products: [],
  categories: [],
  blogs: [],
  orders: [],
  customers: [],
  
  // Loading states
  loading: {
    products: false,
    categories: false,
    blogs: false,
    orders: false,
    customers: false
  },
  
  // Error states
  errors: {
    products: null,
    categories: null,
    blogs: null,
    orders: null,
    customers: null
  },
  
  // Category operations
  loadCategories: () => Promise.resolve(),
  addCategory: () => Promise.resolve(),
  updateCategory: () => Promise.resolve(),
  deleteCategory: () => Promise.resolve(),
  
  // Product operations
  loadProducts: () => Promise.resolve(),
  addProduct: () => Promise.resolve(),
  updateProduct: () => Promise.resolve(),
  deleteProduct: () => Promise.resolve(),
  toggleProductStatus: () => Promise.resolve(),
  
  // Blog operations
  loadBlogs: () => Promise.resolve(),
  addBlog: () => Promise.resolve(),
  updateBlog: () => Promise.resolve(),
  deleteBlog: () => Promise.resolve(),
  
  // Order operations
  loadOrders: () => Promise.resolve(),
  updateOrderStatus: () => Promise.resolve(),
  
  // Customer operations
  loadCustomers: () => Promise.resolve(),
  
  // Utility functions
  refreshData: () => Promise.resolve(),
  clearErrors: () => {},
  
  // Statistics
  stats: {
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    totalBlogs: 0,
    totalOrders: 0,
    totalCustomers: 0
  }
});

// Custom hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Data Provider Component
export const DataProvider = ({ children }) => {
  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  const [loading, setLoading] = useState({
    products: false,
    categories: false,
    blogs: false,
    orders: false,
    customers: false
  });
  
  const [errors, setErrors] = useState({
    products: null,
    categories: null,
    blogs: null,
    orders: null,
    customers: null
  });

  // Helper function to handle loading states
  const withLoading = useCallback((key, asyncOperation) => {
    return async (...args) => {
      try {
        setLoading(prev => ({ ...prev, [key]: true }));
        setErrors(prev => ({ ...prev, [key]: null }));
        
        const result = await asyncOperation(...args);
        return result;
      } catch (error) {
        console.error(`${key} operation failed:`, error);
        setErrors(prev => ({ ...prev, [key]: error.message }));
        throw error;
      } finally {
        setLoading(prev => ({ ...prev, [key]: false }));
      }
    };
  }, []);

  // Helper function to handle API responses
  const handleApiResponse = useCallback((response, successMessage, onSuccess) => {
    if (response.success) {
      if (successMessage) message.success(successMessage);
      if (onSuccess) onSuccess(response);
      return { success: true, data: response };
    } else {
      const errorMsg = response.message || 'İşlem başarısız';
      message.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({
      products: null,
      categories: null,
      blogs: null,
      orders: null,
      customers: null
    });
  }, []);

  // Category operations
  const loadCategories = useCallback(
    withLoading('categories', async () => {
      console.log('📂 Loading categories...');
      const response = await api.getCategories();
      
      if (response.success) {
        setCategories(response.categories || []);
        console.log('✅ Categories loaded:', response.categories?.length || 0);
        return { success: true };
      } else {
        throw new Error(response.message || 'Kategoriler yüklenemedi');
      }
    }),
    [withLoading]
  );

  const addCategory = useCallback(
    withLoading('categories', async (categoryData, imageFile = null) => {
      console.log('➕ Adding category:', categoryData.name);
      const response = await api.createCategory(categoryData, imageFile);
      
      return handleApiResponse(response, 'Kategori başarıyla eklendi', (res) => {
        const newCategory = {
          ...res.category,
          status: res.category.isActive ? 'active' : 'inactive',
        };
        setCategories(prev => [...prev, newCategory]);
      });
    }),
    [withLoading, handleApiResponse]
  );

  const updateCategory = useCallback(
    withLoading('categories', async (id, updates, imageFile = null) => {
      console.log('✏️ Updating category:', id);
      const response = await api.updateCategory(id, updates, imageFile);
      
      return handleApiResponse(response, 'Kategori başarıyla güncellendi', (res) => {
        const updatedCategory = {
          ...res.category,
          status: res.category.isActive ? 'active' : 'inactive',
        };
        setCategories(prev => prev.map(category => 
          category._id === id ? updatedCategory : category
        ));
      });
    }),
    [withLoading, handleApiResponse]
  );

  const deleteCategory = useCallback(
    withLoading('categories', async (id) => {
      console.log('🗑️ Deleting category:', id);
      const response = await api.deleteCategory(id);
      
      return handleApiResponse(response, 'Kategori başarıyla silindi', () => {
        setCategories(prev => prev.filter(category => category._id !== id));
      });
    }),
    [withLoading, handleApiResponse]
  );

  // Product operations
  const loadProducts = useCallback(
    withLoading('products', async (params = {}) => {
      console.log('📦 Loading products...', params);
      const response = await api.getProducts(params);
      
      if (response.success) {
        setProducts(response.products || []);
        console.log('✅ Products loaded:', response.products?.length || 0);
        return { success: true, pagination: response.pagination };
      } else {
        throw new Error(response.message || 'Ürünler yüklenemedi');
      }
    }),
    [withLoading]
  );

  const addProduct = useCallback(
    withLoading('products', async (productData, imageFiles = []) => {
      console.log('➕ Adding product:', productData.name, {
        category: productData.category,
        imageCount: imageFiles.length
      });
      
      const response = await api.createProduct(productData, imageFiles);
      
      return handleApiResponse(response, 'Ürün başarıyla eklendi', (res) => {
        setProducts(prev => [...prev, res.product]);
      });
    }),
    [withLoading, handleApiResponse]
  );

  const updateProduct = useCallback(
    withLoading('products', async (id, updates, imageFiles = [], removedImages = []) => {
      console.log('✏️ Updating product:', id, {
        newImages: imageFiles.length,
        removedImages: removedImages.length
      });
      
      const response = await api.updateProduct(id, updates, imageFiles, removedImages);
      
      return handleApiResponse(response, 'Ürün başarıyla güncellendi', (res) => {
        setProducts(prev => prev.map(product => 
          product._id === id ? res.product : product
        ));
      });
    }),
    [withLoading, handleApiResponse]
  );

  const deleteProduct = useCallback(
    withLoading('products', async (id) => {
      console.log('🗑️ Deleting product:', id);
      const response = await api.deleteProduct(id);
      
      return handleApiResponse(response, 'Ürün başarıyla silindi', () => {
        setProducts(prev => prev.filter(product => product._id !== id));
      });
    }),
    [withLoading, handleApiResponse]
  );

  const toggleProductStatus = useCallback(
    withLoading('products', async (id) => {
      console.log('🔄 Toggling product status:', id);
      const response = await api.toggleProductStatus(id);
      
      return handleApiResponse(response, null, (res) => {
        setProducts(prev => prev.map(product => 
          product._id === id ? { ...product, ...res.product } : product
        ));
        message.success(`Ürün ${res.product.isActive ? 'aktif' : 'pasif'} hale getirildi`);
      });
    }),
    [withLoading, handleApiResponse]
  );

  // Blog operations
  const loadBlogs = useCallback(
    withLoading('blogs', async () => {
      console.log('📝 Loading blogs...');
      const response = await api.getBlogs();
      
      if (response.success) {
        setBlogs(response.blogs || []);
        console.log('✅ Blogs loaded:', response.blogs?.length || 0);
        return { success: true };
      } else {
        throw new Error(response.message || 'Bloglar yüklenemedi');
      }
    }),
    [withLoading]
  );

  const addBlog = useCallback(
    withLoading('blogs', async (blogData, imageFile = null) => {
      console.log('➕ Adding blog:', blogData.title);
      const response = await api.createBlog(blogData, imageFile);
      
      return handleApiResponse(response, 'Blog başarıyla eklendi', (res) => {
        setBlogs(prev => [...prev, res.blog]);
      });
    }),
    [withLoading, handleApiResponse]
  );

  const updateBlog = useCallback(
    withLoading('blogs', async (id, updates, imageFile = null) => {
      console.log('✏️ Updating blog:', id);
      const response = await api.updateBlog(id, updates, imageFile);
      
      return handleApiResponse(response, 'Blog başarıyla güncellendi', (res) => {
        setBlogs(prev => prev.map(blog => 
          blog._id === id ? res.blog : blog
        ));
      });
    }),
    [withLoading, handleApiResponse]
  );

  const deleteBlog = useCallback(
    withLoading('blogs', async (id) => {
      console.log('🗑️ Deleting blog:', id);
      const response = await api.deleteBlog(id);
      
      return handleApiResponse(response, 'Blog başarıyla silindi', () => {
        setBlogs(prev => prev.filter(blog => blog._id !== id));
      });
    }),
    [withLoading, handleApiResponse]
  );

  // Order operations
  const loadOrders = useCallback(
    withLoading('orders', async () => {
      console.log('📋 Loading orders...');
      const response = await api.getOrders();
      
      if (response.success) {
        setOrders(response.orders || []);
        console.log('✅ Orders loaded:', response.orders?.length || 0);
        return { success: true };
      } else {
        throw new Error(response.message || 'Siparişler yüklenemedi');
      }
    }),
    [withLoading]
  );

  const updateOrderStatus = useCallback(
    withLoading('orders', async (id, status) => {
      console.log('📋 Updating order status:', id, status);
      const response = await api.updateOrderStatus(id, status);
      
      return handleApiResponse(response, 'Sipariş durumu güncellendi', (res) => {
        setOrders(prev => prev.map(order => 
          order._id === id ? { ...order, status } : order
        ));
      });
    }),
    [withLoading, handleApiResponse]
  );

  // Customer operations
  const loadCustomers = useCallback(
    withLoading('customers', async () => {
      console.log('👥 Loading customers...');
      const response = await api.getUsers();
      
      if (response.success) {
        setCustomers(response.users || []);
        console.log('✅ Customers loaded:', response.users?.length || 0);
        return { success: true };
      } else {
        throw new Error(response.message || 'Müşteriler yüklenemedi');
      }
    }),
    [withLoading]
  );

  // Refresh all data
  const refreshData = useCallback(async () => {
    console.log('🔄 Refreshing all data...');
    
    try {
      await Promise.allSettled([
        loadCategories(),
        loadProducts(),
        loadBlogs(),
        loadOrders(),
        loadCustomers()
      ]);
      console.log('✅ Data refresh completed');
    } catch (error) {
      console.error('❌ Data refresh failed:', error);
      message.error('Veriler yeniden yüklenirken hata oluştu');
    }
  }, [loadCategories, loadProducts, loadBlogs, loadOrders, loadCustomers]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      inactiveProducts: products.filter(p => !p.isActive).length,
      lowStockProducts: products.filter(p => p.stock <= (p.lowStockThreshold || 5)).length,
      outOfStockProducts: products.filter(p => p.stock === 0).length,
      
      totalCategories: categories.length,
      activeCategories: categories.filter(c => c.isActive).length,
      
      totalBlogs: blogs.length,
      publishedBlogs: blogs.filter(b => b.status === 'published').length,
      
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.isActive).length
    };
  }, [products, categories, blogs, orders, customers]);

  // Analytics function for dashboard
  const getAnalytics = useCallback(() => {
    const totalRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.total || 0), 0);

    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const topProducts = products
      .map(product => ({
        name: product.name,
        sales: Math.floor(Math.random() * 50) + 1, // Mock sales data
        price: product.price || 0
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalProducts: products.length,
      recentOrders,
      topProducts
    };
  }, [orders, customers, products]);

  // Load initial data
  useEffect(() => {
    const initializeData = async () => {
      console.log('🚀 Initializing DataContext...');
      
      try {
        // Load categories first as they're needed for products
        await loadCategories();
        
        // Then load other data in parallel
        await Promise.allSettled([
          loadProducts(),
          loadBlogs(),
          loadOrders(),
          loadCustomers()
        ]);
        
        console.log('✅ DataContext initialized successfully');
      } catch (error) {
        console.error('❌ DataContext initialization failed:', error);
        message.error('Uygulama verisi yüklenirken hata oluştu');
      }
    };
    
    initializeData();
  }, []); // Empty dependency array for initialization

  // Context value
  const contextValue = useMemo(() => ({
    // Data
    products,
    categories,
    blogs,
    orders,
    customers,
    
    // States
    loading,
    errors,
    stats,
    
    // Category operations
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Product operations
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    
    // Blog operations
    loadBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
    
    // Order operations
    loadOrders,
    updateOrderStatus,
    
    // Customer operations
    loadCustomers,
    
    // Utilities
    refreshData,
    clearErrors,
    getAnalytics
  }), [
    products, categories, blogs, orders, customers,
    loading, errors, stats,
    loadCategories, addCategory, updateCategory, deleteCategory,
    loadProducts, addProduct, updateProduct, deleteProduct, toggleProductStatus,
    loadBlogs, addBlog, updateBlog, deleteBlog,
    loadOrders, updateOrderStatus,
    loadCustomers,
    refreshData, clearErrors, getAnalytics
  ]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext; 