import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { message } from 'antd';
import api from '../services/api.js';

// Context'i varsayılan değerlerle oluştur
const DataContext = createContext({
  // Veri durumları
  products: [],
  categories: [],
  blogs: [],
  orders: [],
  customers: [],
  
  // Yükleme durumları
  loading: {
    products: false,
    categories: false,
    blogs: false,
    orders: false,
    customers: false
  },
  
  // Hata durumları
  errors: {
    products: null,
    categories: null,
    blogs: null,
    orders: null,
    customers: null
  },
  
  // Kategori işlemleri
  loadCategories: () => Promise.resolve(),
  addCategory: () => Promise.resolve(),
  updateCategory: () => Promise.resolve(),
  deleteCategory: () => Promise.resolve(),
  
  // Ürün işlemleri
  loadProducts: () => Promise.resolve(),
  addProduct: () => Promise.resolve(),
  updateProduct: () => Promise.resolve(),
  deleteProduct: () => Promise.resolve(),
  toggleProductStatus: () => Promise.resolve(),
  
  // Blog işlemleri
  loadBlogs: () => Promise.resolve(),
  addBlog: () => Promise.resolve(),
  updateBlog: () => Promise.resolve(),
  deleteBlog: () => Promise.resolve(),
  
  // Sipariş işlemleri
  loadOrders: () => Promise.resolve(),
  addOrder: () => Promise.resolve(),
  updateOrder: () => Promise.resolve(),
  deleteOrder: () => Promise.resolve(),
  updateOrderStatus: () => Promise.resolve(),
  
  // Müşteri işlemleri
  loadCustomers: () => Promise.resolve(),
  deleteCustomer: () => Promise.resolve(),
  
  // Destek işlemleri
  loadSupport: () => Promise.resolve(),
  addSupportTicket: () => Promise.resolve(),
  updateSupportTicket: () => Promise.resolve(),
  deleteSupportTicket: () => Promise.resolve(),
  addSupportResponse: () => Promise.resolve(),
  
  // Yardımcı fonksiyonlar
  refreshData: () => Promise.resolve(),
  clearErrors: () => {},
  
  // İstatistikler
  stats: {
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    totalBlogs: 0,
    totalOrders: 0,
    totalCustomers: 0
  }
});

// Context'i kullanmak için özel hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Veri Sağlayıcı Bileşeni
export const DataProvider = ({ children }) => {
  // Durum yönetimi
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('orders');
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch{
      return [];
    }
  });
  const [customers, setCustomers] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  
  const [loading, setLoading] = useState({
    products: false,
    categories: false,
    blogs: false,
    orders: false,
    customers: false,
    support: false
  });
  
  const [errors, setErrors] = useState({
    products: null,
    categories: null,
    blogs: null,
    orders: null,
    customers: null,
    support: null
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
      customers: null,
      support: null
    });
  }, []);

  // Category operations
  const loadCategories = useCallback(
    withLoading('categories', async () => {
      const response = await api.getCategories();
      
      if (response.success) {
        // Backend'den gelen kategorilerde isActive'den status'a dönüşüm yap
        const categoriesWithStatus = (response.categories || []).map(category => ({
          ...category,
          status: category.isActive ? 'active' : 'inactive'
        }));
        setCategories(categoriesWithStatus);
        return { success: true };
      } else {
        throw new Error(response.message || 'Kategoriler yüklenemedi');
      }
    }),
    [withLoading]
  );

  const addCategory = useCallback(
    withLoading('categories', async (categoryData, imageFile = null) => {

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

      const response = await api.getProducts(params);
      
      if (response.success) {
        setProducts(response.products || []);

        return { success: true, pagination: response.pagination };
      } else {
        throw new Error(response.message || 'Ürünler yüklenemedi');
      }
    }),
    [withLoading]
  );

  const addProduct = useCallback(
    withLoading('products', async (productData, imageFiles = []) => {
      const response = await api.createProduct(productData, imageFiles);
      
      return handleApiResponse(response, 'Ürün başarıyla eklendi', (res) => {
        setProducts(prev => [...prev, res.product]);
      });
    }),
    [withLoading, handleApiResponse]
  );

  const updateProduct = useCallback(
    withLoading('products', async (id, updates, imageFiles = [], removedImages = []) => {
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
      const response = await api.deleteProduct(id);
      
      return handleApiResponse(response, 'Ürün başarıyla silindi', () => {
        setProducts(prev => prev.filter(product => product._id !== id));
      });
    }),
    [withLoading, handleApiResponse]
  );

  const toggleProductStatus = useCallback(
    withLoading('products', async (id) => {

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
      try {
        // Ana sayfa için direkt public endpoint kullan
        const response = await api.getBlogs();
        
        if (response.success) {
          setBlogs(response.blogs || []);
          return { success: true };
        } else {
          throw new Error(response.message || 'Bloglar yüklenemedi');
        }
      } catch { 
        setBlogs([]);
        throw new Error('Bloglar yüklenemedi');
      }
    }),
    [withLoading]
  );

  const addBlog = useCallback(
    withLoading('blogs', async (blogData, imageFile = null) => {

      const response = await api.createBlog(blogData, imageFile);
      
      return handleApiResponse(response, 'Blog başarıyla eklendi', (res) => {
        setBlogs(prev => [...prev, res.blog]);
      });
    }),
    [withLoading, handleApiResponse]
  );

  const updateBlog = useCallback(
    withLoading('blogs', async (id, updates, imageFile = null) => {

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
      try {
        // Backend'den siparişleri çek
        const response = await api.getOrders();
        
        if (response.success) {
          setOrders(response.orders || []);
          // Eski localStorage verilerini temizle
          localStorage.removeItem('orders');
          return { success: true };
        } else {
          throw new Error(response.message || 'Siparişler yüklenemedi');
        }
      } catch { 
        // Backend'e erişilemezse localStorage'dan yükle (fallback)
        try {
          const savedOrders = localStorage.getItem('orders');
          if (savedOrders) {
            const localOrders = JSON.parse(savedOrders);
            setOrders(localOrders);
            return { success: true, warning: 'Siparişler yerel depodan yüklendi' };
          }
        } catch { return; }
        throw new Error('Siparişler yüklenemedi');
      }
    }),
    [withLoading]
  );

  const updateOrderStatus = useCallback(
    withLoading('orders', async (id, status) => {
      const response = await api.updateOrderStatus(id, status);
      
      return handleApiResponse(response, 'Sipariş durumu güncellendi', () => {
        setOrders(prev => prev.map(order => 
          order._id === id || order.id === id ? { 
            ...order, 
            status,
            updatedAt: new Date().toISOString()
          } : order
        ));
      });
    }),
    [withLoading, handleApiResponse]
  );

  const addOrder = useCallback(
    withLoading('orders', async (orderData) => {
      try {
        // Backend'e sipariş gönder
        const response = await api.createOrder({
          items: orderData.products.map(product => ({
            product: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            size: product.selectedSize,
            color: product.selectedColor,
            image: product.image
          })),
          shippingAddress: {
            firstName: orderData.customerInfo.firstName,
            lastName: orderData.customerInfo.lastName,
            email: orderData.customerInfo.email,
            phone: orderData.customerInfo.phone,
            address: orderData.customerInfo.address,
            city: orderData.customerInfo.city,
            postalCode: orderData.customerInfo.postalCode,
            country: orderData.customerInfo.country
          },
          billingAddress: {
            firstName: orderData.customerInfo.firstName,
            lastName: orderData.customerInfo.lastName,
            email: orderData.customerInfo.email,
            phone: orderData.customerInfo.phone,
            address: orderData.customerInfo.address,
            city: orderData.customerInfo.city,
            postalCode: orderData.customerInfo.postalCode,
            country: orderData.customerInfo.country
          },
          paymentMethod: orderData.paymentMethod,
          notes: orderData.notes
        });

        if (response.success) {
          // Backend'den gelen sipariş verisini state'e ekle
          setOrders(prev => [response.order, ...prev]);
          
          return { success: true, order: response.order };
        } else {
          throw new Error(response.message || 'Sipariş oluşturulamadı');
        }
      } catch { 
        // Backend hatası varsa fallback olarak local state'e kaydet
        const fallbackOrder = {
          _id: orderData.id,
          ...orderData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setOrders(prev => [fallbackOrder, ...prev]);
        // Warning message ile kullanıcıya bilgi ver
        return { 
          success: true, 
          order: fallbackOrder, 
          warning: 'Sipariş oluşturuldu ancak sunucuya kaydedilemedi' 
        };
      }
    }),
    [withLoading]
  );

  const updateOrder = useCallback(
    withLoading('orders', async (id, updates) => {
      try {
        // Backend'e güncelleme gönder
        const response = await api.updateOrderStatus(id, updates.status);
        
        if (response.success) {
          // Backend'den başarılı güncellendiyse local state'i de güncelle
          setOrders(prev => prev.map(order => 
            order._id === id || order.id === id ? { 
              ...order, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } : order
          ));
          return { success: true };
        } else {
          throw new Error(response.message || 'Sipariş güncellenemedi');
        }
      } catch { return; }
    }),
    [withLoading]
  );

  const deleteOrder = useCallback(
    withLoading('orders', async (id) => {
      try {
        // Backend'den sil
        const response = await api.deleteOrder(id);
        
        if (response.success) {
          // Backend'den başarılı silindiyse local state'ten de kaldır
          setOrders(prev => prev.filter(order => order._id !== id && order.id !== id));
          return { success: true };
        } else {
          throw new Error(response.message || 'Sipariş silinemedi');
        }
      } catch { return; }
    }),
    [withLoading]
  );

  // Customer operations
  const loadCustomers = useCallback(
    withLoading('customers', async () => {
      const response = await api.getUsers();
      if (response.success) {
        // Sadece 'user' rolündeki müşterileri al
        const customers = (response.users || []).filter(user => user.role === 'user' || !user.role);
        setCustomers(customers);
        return { success: true };
      } else {
        throw new Error(response.message || 'Müşteriler yüklenemedi');
      }
    }),
    [withLoading]
  );

  const deleteCustomer = useCallback(
    withLoading('customers', async (id) => {
      const response = await api.deleteUser(id);
      return handleApiResponse(response, 'Müşteri başarıyla silindi', () => {
        setCustomers(prev => prev.filter(customer => customer._id !== id));
      });
    }),
    [withLoading, handleApiResponse]
  );

  // Support operations
  const loadSupport = useCallback(
    withLoading('support', async (params = {}) => {
      const response = await api.getSupport(params);
      
      if (response.success) {
        setSupportTickets(response.tickets || []);
        return { success: true, pagination: response.pagination };
      } else {
        throw new Error(response.message || 'Destek talepleri yüklenemedi');
      }
    }),
    [withLoading]
  );

  const addSupportTicket = useCallback(
    withLoading('support', async (ticketData) => {
      const response = await api.createSupportTicket(ticketData);
      
      return handleApiResponse(response, 'Destek talebi başarıyla oluşturuldu', (res) => {
        setSupportTickets(prev => [res.ticket, ...prev]);
      });
    }),
    [withLoading, handleApiResponse]
  );

  const updateSupportTicket = useCallback(
    withLoading('support', async (id, updates) => {
      const response = await api.updateSupportTicket(id, updates);
      
      return handleApiResponse(response, 'Destek talebi güncellendi', (res) => {
        setSupportTickets(prev => prev.map(ticket => 
          ticket._id === id ? res.ticket : ticket
        ));
      });
    }),
    [withLoading, handleApiResponse]
  );

  const deleteSupportTicket = useCallback(
    withLoading('support', async (id) => {
      const response = await api.deleteSupportTicket(id);
      
      return handleApiResponse(response, 'Destek talebi silindi', () => {
        setSupportTickets(prev => prev.filter(ticket => ticket._id !== id));
      });
    }),
    [withLoading, handleApiResponse]
  );

  const addSupportResponse = useCallback(
    withLoading('support', async (id, responseData) => {
      const response = await api.addSupportResponse(id, responseData);
      
      return handleApiResponse(response, 'Yanıt eklendi', (res) => {
        setSupportTickets(prev => prev.map(ticket => 
          ticket._id === id ? res.ticket : ticket
        ));
      });
    }),
    [withLoading, handleApiResponse]
  );

  // Refresh all data
  const refreshData = useCallback(async () => {

    
    try {
      await Promise.allSettled([
        loadCategories(),
        loadProducts(),
        loadBlogs(),
        loadOrders(),
        loadCustomers(),
        loadSupport()
      ]);

    } catch { return; }
  }, [loadCategories, loadProducts, loadBlogs, loadOrders, loadCustomers, loadSupport]);

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
      publishedBlogs: blogs.filter(b => b.status === 'published' || b.isPublished === true).length,
      
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

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    try {
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch { return; }
  }, [orders]);

  // Load initial data
  useEffect(() => {
    const initializeData = async () => {

      
      try {
        // Load categories first as they're needed for products
        await loadCategories();
        
        // Then load other data in parallel
        await Promise.allSettled([
          loadProducts(),
          loadBlogs(),
          loadOrders(),
          loadCustomers(),
          loadSupport()
        ]);
        

      } catch { return; }
    };
    
    initializeData();
  }, []); // Empty dependency array for initialization

  // Periyodik güncelleme için useEffect
  useEffect(() => {
    // Her 30 saniyede bir siparişleri ve destek taleplerini güncelle
    const interval = setInterval(async () => {
      try {
        await Promise.allSettled([
          loadOrders(),
          loadSupport()
        ]);
      } catch { return; }
    }, 30000); // 30 saniye

    return () => clearInterval(interval);
  }, [loadOrders, loadSupport]);

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
    addOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    
    // Customer operations
    loadCustomers,
    deleteCustomer,
    
    // Support operations
    supportTickets,
    loadSupport,
    addSupportTicket,
    updateSupportTicket,
    deleteSupportTicket,
    addSupportResponse,
    
    // Utilities
    refreshData,
    clearErrors,
    getAnalytics
  }), [
    products, categories, blogs, orders, customers, supportTickets,
    loading, errors, stats,
    loadCategories, addCategory, updateCategory, deleteCategory,
    loadProducts, addProduct, updateProduct, deleteProduct, toggleProductStatus,
    loadBlogs, addBlog, updateBlog, deleteBlog,
    loadOrders, updateOrderStatus,
    loadCustomers, deleteCustomer,
    loadSupport, addSupportTicket, updateSupportTicket, deleteSupportTicket, addSupportResponse,
    refreshData, clearErrors, getAnalytics
  ]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext; 
