import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Real-time update listeners
  const [updateListeners, setUpdateListeners] = useState([]);

  // Add update listener
  const addUpdateListener = (callback) => {
    setUpdateListeners(prev => [...prev, callback]);
    return () => {
      setUpdateListeners(prev => prev.filter(listener => listener !== callback));
    };
  };

  // Notify all listeners of data changes
  const notifyUpdate = (dataType, action, data) => {
    updateListeners.forEach(listener => {
      try {
        listener(dataType, action, data);
      } catch (error) {
        console.error('Error in update listener:', error);
      }
    });
  };

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        setLoading(prev => ({ ...prev, categories: true }));
        const categoriesResponse = await api.getCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.categories);
        }
        setLoading(prev => ({ ...prev, categories: false }));

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
  }, []);

  // Product operations
  const addProduct = async (product, imageFiles = []) => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const response = await api.createProduct(product, imageFiles);
      if (response.success) {
        setProducts(prev => [...prev, response.product]);
        notifyUpdate('products', 'add', response.product);
        message.success('Ürün başarıyla eklendi');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('Ürün eklenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const updateProduct = async (id, updates, imageFiles = []) => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const response = await api.updateProduct(id, updates, imageFiles);
      if (response.success) {
        setProducts(prev => prev.map(product => 
          product.id === id ? { ...product, ...updates } : product
        ));
        notifyUpdate('products', 'update', { id, ...updates });
        message.success('Ürün başarıyla güncellendi');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Ürün güncellenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const response = await api.request(`/products/${id}`, { method: 'DELETE' });
      if (response.success) {
        setProducts(prev => prev.filter(product => product.id !== id));
        notifyUpdate('products', 'delete', { id });
        message.success('Ürün başarıyla silindi');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Ürün silinirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Category operations
  const addCategory = async (category) => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await api.createCategory(category);
      if (response.success) {
        setCategories(prev => [...prev, response.category]);
        notifyUpdate('categories', 'add', response.category);
        message.success('Kategori başarıyla eklendi');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      message.error('Kategori eklenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await api.updateCategory(id, updates);
      if (response.success) {
        setCategories(prev => prev.map(category => 
          category.id === id ? { ...category, ...updates } : category
        ));
        notifyUpdate('categories', 'update', { id, ...updates });
        message.success('Kategori başarıyla güncellendi');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      message.error('Kategori güncellenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await api.deleteCategory(id);
      if (response.success) {
        setCategories(prev => prev.filter(category => category.id !== id));
        notifyUpdate('categories', 'delete', { id });
        message.success('Kategori başarıyla silindi');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('Kategori silinirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  // Blog operations
  const addBlog = async (blog) => {
    try {
      setLoading(prev => ({ ...prev, blogs: true }));
      const response = await api.createBlog(blog);
      if (response.success) {
        setBlogs(prev => [...prev, response.blog]);
        notifyUpdate('blogs', 'add', response.blog);
        message.success('Blog başarıyla eklendi');
      }
    } catch (error) {
      console.error('Error adding blog:', error);
      message.error('Blog eklenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, blogs: false }));
    }
  };

  const updateBlog = async (id, updates) => {
    try {
      setLoading(prev => ({ ...prev, blogs: true }));
      const response = await api.updateBlog(id, updates);
      if (response.success) {
        setBlogs(prev => prev.map(blog => 
          blog.id === id ? { ...blog, ...updates } : blog
        ));
        notifyUpdate('blogs', 'update', { id, ...updates });
        message.success('Blog başarıyla güncellendi');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      message.error('Blog güncellenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, blogs: false }));
    }
  };

  const deleteBlog = async (id) => {
    try {
      setLoading(prev => ({ ...prev, blogs: true }));
      const response = await api.deleteBlog(id);
      if (response.success) {
        setBlogs(prev => prev.filter(blog => blog.id !== id));
        notifyUpdate('blogs', 'delete', { id });
        message.success('Blog başarıyla silindi');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      message.error('Blog silinirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, blogs: false }));
    }
  };

  // Order operations
  const addOrder = async (order) => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const response = await api.request('/orders', {
        method: 'POST',
        body: JSON.stringify(order)
      });
      if (response.success) {
        setOrders(prev => [...prev, response.order]);
        notifyUpdate('orders', 'add', response.order);
        message.success('Sipariş başarıyla eklendi');
      }
    } catch (error) {
      console.error('Error adding order:', error);
      message.error('Sipariş eklenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const updateOrder = async (id, updates) => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const response = await api.request(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      if (response.success) {
        setOrders(prev => prev.map(order => 
          order.id === id ? { ...order, ...updates } : order
        ));
        notifyUpdate('orders', 'update', { id, ...updates });
        message.success('Sipariş başarıyla güncellendi');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      message.error('Sipariş güncellenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const deleteOrder = async (id) => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const response = await api.request(`/orders/${id}`, { method: 'DELETE' });
      if (response.success) {
        setOrders(prev => prev.filter(order => order.id !== id));
        notifyUpdate('orders', 'delete', { id });
        message.success('Sipariş başarıyla silindi');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      message.error('Sipariş silinirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // Customer operations
  const addCustomer = async (customer) => {
    try {
      setLoading(prev => ({ ...prev, customers: true }));
      const response = await api.request('/users', {
        method: 'POST',
        body: JSON.stringify(customer)
      });
      if (response.success) {
        setCustomers(prev => [...prev, response.user]);
        notifyUpdate('customers', 'add', response.user);
        message.success('Müşteri başarıyla eklendi');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      message.error('Müşteri eklenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  };

  const updateCustomer = async (id, updates) => {
    try {
      setLoading(prev => ({ ...prev, customers: true }));
      const response = await api.request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      if (response.success) {
        setCustomers(prev => prev.map(customer => 
          customer.id === id ? { ...customer, ...updates } : customer
        ));
        notifyUpdate('customers', 'update', { id, ...updates });
        message.success('Müşteri başarıyla güncellendi');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      message.error('Müşteri güncellenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  };

  const deleteCustomer = async (id) => {
    try {
      setLoading(prev => ({ ...prev, customers: true }));
      const response = await api.request(`/users/${id}`, { method: 'DELETE' });
      if (response.success) {
        setCustomers(prev => prev.filter(customer => customer.id !== id));
        notifyUpdate('customers', 'delete', { id });
        message.success('Müşteri başarıyla silindi');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      message.error('Müşteri silinirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  };

  // Analytics
  const getAnalytics = () => {
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalBlogs = blogs.length;

    // Kategori bazında ürün sayıları
    const categoryStats = categories.map(category => ({
      name: category.name,
      productCount: products.filter(product => product.category === category.name).length
    }));

    // Sipariş durumu istatistikleri
    const orderStatusStats = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Toplam satış tutarı
    const totalRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.total || 0), 0);

    // Son siparişler (son 5 sipariş)
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        customerName: order.customerName || 'Bilinmeyen Müşteri',
        total: order.total || 0,
        status: order.status || 'pending',
        createdAt: order.createdAt || new Date().toISOString()
      }));

    // En çok satan ürünler (mock data)
    const topProducts = products.slice(0, 5).map(product => ({
      name: product.name,
      sales: Math.floor(Math.random() * 100) + 10, // Mock sales data
      price: product.price || 0
    }));

    return {
      totalProducts,
      totalCategories,
      totalOrders,
      totalCustomers,
      totalBlogs,
      categoryStats,
      orderStatusStats,
      totalRevenue,
      recentOrders,
      topProducts
    };
  };

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
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addBlog,
    updateBlog,
    deleteBlog,
    addOrder,
    updateOrder,
    deleteOrder,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    // Utilities
    addUpdateListener,
    getAnalytics
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 