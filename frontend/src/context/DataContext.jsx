import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import api from '../services/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // State for all data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [sliders, _setSliders] = useState([]);
  const [campaigns, _setCampaigns] = useState([]);
  const [brands, _setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Loading states
  const [loading, setLoading] = useState({
    products: false,
    categories: false,
    blogs: false,
    orders: false,
    customers: false
  });

  // Load categories with proper error handling
  const loadCategories = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await api.getCategories();
      if (response.success) {
        const formattedCategories = response.categories.map(cat => ({
          ...cat,
          status: cat.isActive ? 'active' : 'inactive',
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      message.error('Kategoriler yüklenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        await loadCategories();

        // Load products
        setLoading(prev => ({ ...prev, products: true }));
        const productsResponse = await api.getProducts();
        if (productsResponse.success) {
          setProducts(productsResponse.products);
        }
        setLoading(prev => ({ ...prev, products: false }));

        // Load blogs
        setLoading(prev => ({ ...prev, blogs: true }));
        const blogsResponse = await api.getBlogs();
        if (blogsResponse.success) {
          setBlogs(blogsResponse.blogs);
        }
        setLoading(prev => ({ ...prev, blogs: false }));

        // Load orders (admin only)
        setLoading(prev => ({ ...prev, orders: true }));
        const ordersResponse = await api.getOrders();
        if (ordersResponse.success) {
          setOrders(ordersResponse.orders);
        }
        setLoading(prev => ({ ...prev, orders: false }));

        // Load customers (admin only)
        setLoading(prev => ({ ...prev, customers: true }));
        const customersResponse = await api.getUsers();
        if (customersResponse.success) {
          setCustomers(customersResponse.users);
        }
        setLoading(prev => ({ ...prev, customers: false }));

      } catch (error) {
        console.error('DataContext: Error loading data:', error);
        message.error('Veriler yüklenirken hata oluştu');
        setLoading({
          products: false,
          categories: false,
          blogs: false,
          orders: false,
          customers: false
        });
      }
    };
    
    loadData();
  }, [loadCategories]);

  // Category operations
  const addCategory = useCallback(async (category, imageFile = null) => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await api.createCategory(category, imageFile);
      if (response.success) {
        const newCategory = {
          ...response.category,
          status: response.category.isActive ? 'active' : 'inactive',
        };
        setCategories(prev => [...prev, newCategory]);
        message.success('Kategori başarıyla eklendi');
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding category:', error);
      message.error(error.message || 'Kategori eklenirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  const updateCategory = useCallback(async (id, updates, imageFile = null) => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await api.updateCategory(id, updates, imageFile);
      if (response.success) {
        const updatedCategory = {
          ...response.category,
          status: response.category.isActive ? 'active' : 'inactive',
        };
        setCategories(prev => prev.map(category => 
          category._id === id ? updatedCategory : category
        ));
        message.success('Kategori başarıyla güncellendi');
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating category:', error);
      message.error(error.message || 'Kategori güncellenirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await api.deleteCategory(id);
      if (response.success) {
        setCategories(prev => prev.filter(category => category._id !== id));
        message.success('Kategori başarıyla silindi');
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error(error.message || 'Kategori silinirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  // Product operations
  const addProduct = useCallback(async (product, imageFiles = []) => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const response = await api.createProduct(product, imageFiles);
      if (response.success) {
        setProducts(prev => [...prev, response.product]);
        message.success('Ürün başarıyla eklendi');
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding product:', error);
      message.error(error.message || 'Ürün eklenirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  }, []);

  const updateProduct = useCallback(async (id, updates, imageFiles = [], removedImages = []) => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const response = await api.updateProduct(id, updates, imageFiles, removedImages);
      if (response.success) {
        setProducts(prev => prev.map(product => 
          product._id === id ? { ...product, ...response.product } : product
        ));
        message.success('Ürün başarıyla güncellendi');
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating product:', error);
      message.error(error.message || 'Ürün güncellenirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const response = await api.request(`/products/${id}`, { method: 'DELETE' });
      if (response.success) {
        setProducts(prev => prev.filter(product => product._id !== id));
        message.success('Ürün başarıyla silindi');
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error(error.message || 'Ürün silinirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  }, []);

  // Blog operations
  const addBlog = useCallback(async (blog) => {
    try {
      setLoading(prev => ({ ...prev, blogs: true }));
      const response = await api.createBlog(blog);
      if (response.success) {
        setBlogs(prev => [...prev, response.blog]);
        message.success('Blog başarıyla eklendi');
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding blog:', error);
      message.error(error.message || 'Blog eklenirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, blogs: false }));
    }
  }, []);

  const updateBlog = useCallback(async (id, updates) => {
    try {
      setLoading(prev => ({ ...prev, blogs: true }));
      const response = await api.updateBlog(id, updates);
      if (response.success) {
        setBlogs(prev => prev.map(blog => 
          blog._id === id ? { ...blog, ...response.blog } : blog
        ));
        message.success('Blog başarıyla güncellendi');
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      message.error(error.message || 'Blog güncellenirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, blogs: false }));
    }
  }, []);

  const deleteBlog = useCallback(async (id) => {
    try {
      setLoading(prev => ({ ...prev, blogs: true }));
      const response = await api.deleteBlog(id);
      if (response.success) {
        setBlogs(prev => prev.filter(blog => blog._id !== id));
        message.success('Blog başarıyla silindi');
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      message.error(error.message || 'Blog silinirken hata oluştu');
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, blogs: false }));
    }
  }, []);

  // Analytics
  const getAnalytics = useCallback(() => {
    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalBlogs: blogs.length,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      activeCategories: categories.filter(cat => cat.status === 'active').length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      recentOrders: orders.slice(0, 5), // Son 5 sipariş
      topProducts: products.slice(0, 5).map(product => ({
        name: product.name,
        sales: Math.floor(Math.random() * 100) + 1, // Demo veri
        price: product.price || 0
      }))
    };
  }, [products, categories, blogs, orders, customers]);

  const value = {
    // Data
    products,
    categories,
    blogs,
    sliders,
    campaigns,
    brands,
    orders,
    customers,
    
    // Loading states
    loading,
    
    // Operations
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    addBlog,
    updateBlog,
    deleteBlog,
    
    // Utilities
    getAnalytics,
    loadCategories
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 