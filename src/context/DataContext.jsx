import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { 
  products as initialProducts, 
  categories as initialCategories,
  blogs as initialBlogs,
  sliders as initialSliders,
  campaigns as initialCampaigns,
  brands as initialBrands
} from '../data';

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
  const [sliders, setSliders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [brands, setBrands] = useState([]);
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

  // Kategori ürün sayılarını hesapla
  const calculateCategoryProductCounts = () => {
    const categoryCounts = {};
    
    // Her ürünün kategorisini say
    products.forEach(product => {
      if (product.category) {
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
      }
    });
    
    // Kategorileri güncelle
    const updatedCategories = categories.map(category => ({
      ...category,
      productCount: categoryCounts[category.name] || 0,
      updatedAt: new Date().toISOString()
    }));
    
    setCategories(updatedCategories);
    saveToStorage('categories', updatedCategories);
  };

  // Initialize data from localStorage or default data
  useEffect(() => {
    const loadData = () => {
      try {
        // Kategorileri yükle
        const savedCategories = localStorage.getItem('categories');
        
        if (savedCategories) {
          const parsedCategories = JSON.parse(savedCategories);
          setCategories(parsedCategories);
        } else {
          setCategories(initialCategories);
        }
        
        // Diğer verileri yükle
        const savedProducts = localStorage.getItem('products');
        setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
        
        const savedBlogs = localStorage.getItem('blogs');
        setBlogs(savedBlogs ? JSON.parse(savedBlogs) : initialBlogs);
        
        const savedSliders = localStorage.getItem('sliders');
        setSliders(savedSliders ? JSON.parse(savedSliders) : initialSliders);
        
        const savedCampaigns = localStorage.getItem('campaigns');
        setCampaigns(savedCampaigns ? JSON.parse(savedCampaigns) : initialCampaigns);
        
        const savedBrands = localStorage.getItem('brands');
        setBrands(savedBrands ? JSON.parse(savedBrands) : initialBrands);
        
        const savedOrders = localStorage.getItem('orders');
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);
        
        const savedCustomers = localStorage.getItem('customers');
        setCustomers(savedCustomers ? JSON.parse(savedCustomers) : []);
        
      } catch (error) {
        console.error('DataContext: Error loading data:', error);
        // Fallback to initial data
        setCategories(initialCategories);
        setProducts(initialProducts);
        setBlogs(initialBlogs);
        setSliders(initialSliders);
        setCampaigns(initialCampaigns);
        setBrands(initialBrands);
        setOrders([]);
        setCustomers([]);
      }
    };
    loadData();
  }, []);

  // Kategori ürün sayılarını hesapla (veriler yüklendikten sonra)
  useEffect(() => {
    if (products.length > 0 && categories.length > 0) {
      calculateCategoryProductCounts();
    }
  }, [products.length, categories.length]);

  // Save data to localStorage whenever it changes
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Products CRUD
  const addProduct = (product) => {
    console.log('DataContext addProduct called with:', product);
    
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('DataContext newProduct created:', newProduct);
    
    // Ürünü ekle
    const updatedProducts = [...products, newProduct];
    console.log('DataContext updatedProducts:', updatedProducts);
    
    setProducts(updatedProducts);
    saveToStorage('products', updatedProducts);
    
    // Kategori ürün sayısını güncelle
    if (product.category) {
      const categoryToUpdate = categories.find(cat => cat.name === product.category);
      if (categoryToUpdate) {
        const updatedCategories = categories.map(category => 
          category.name === product.category 
            ? { ...category, productCount: (category.productCount || 0) + 1, updatedAt: new Date().toISOString() }
            : category
        );
        setCategories(updatedCategories);
        saveToStorage('categories', updatedCategories);
      }
    }
    
    notifyUpdate('products', 'add', newProduct);
    message.success('Ürün başarıyla eklendi');
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    const productToUpdate = products.find(p => p.id === id);
    if (!productToUpdate) return;
    
    // Kategori değişikliği kontrol et
    const oldCategory = productToUpdate.category;
    const newCategory = updates.category;
    
    const updatedProducts = products.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
    saveToStorage('products', updatedProducts);
    
    // Kategori ürün sayılarını güncelle
    if (oldCategory !== newCategory) {
      let updatedCategories = [...categories];
      
      // Eski kategorinin sayısını azalt
      if (oldCategory) {
        updatedCategories = updatedCategories.map(category => 
          category.name === oldCategory 
            ? { ...category, productCount: Math.max(0, (category.productCount || 0) - 1), updatedAt: new Date().toISOString() }
            : category
        );
      }
      
      // Yeni kategorinin sayısını artır
      if (newCategory) {
        updatedCategories = updatedCategories.map(category => 
          category.name === newCategory 
            ? { ...category, productCount: (category.productCount || 0) + 1, updatedAt: new Date().toISOString() }
            : category
        );
      }
      
      setCategories(updatedCategories);
      saveToStorage('categories', updatedCategories);
    }
    
    notifyUpdate('products', 'update', { id, updates });
    message.success('Ürün başarıyla güncellendi');
  };

  const deleteProduct = (id) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;
    
    // Ürünü sil
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    saveToStorage('products', updatedProducts);
    
    // Kategori ürün sayısını azalt
    if (productToDelete.category) {
      const updatedCategories = categories.map(category => 
        category.name === productToDelete.category 
          ? { ...category, productCount: Math.max(0, (category.productCount || 0) - 1), updatedAt: new Date().toISOString() }
          : category
      );
      setCategories(updatedCategories);
      saveToStorage('categories', updatedCategories);
    }
    
    notifyUpdate('products', 'delete', { id });
    message.success('Ürün başarıyla silindi');
  };

  // Categories CRUD
  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    saveToStorage('categories', updatedCategories);
    notifyUpdate('categories', 'add', newCategory);
    message.success('Kategori başarıyla eklendi');
    return newCategory;
  };

  const updateCategory = (id, updates) => {
    const updatedCategories = categories.map(category => 
      category.id === id 
        ? { ...category, ...updates, updatedAt: new Date().toISOString() }
        : category
    );
    setCategories(updatedCategories);
    saveToStorage('categories', updatedCategories);
    notifyUpdate('categories', 'update', { id, updates });
    message.success('Kategori başarıyla güncellendi');
  };

  const deleteCategory = (id) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    saveToStorage('categories', updatedCategories);
    notifyUpdate('categories', 'delete', { id });
    message.success('Kategori başarıyla silindi');
  };

  // Blogs CRUD
  const addBlog = (blog) => {
    const newBlog = {
      ...blog,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedBlogs = [...blogs, newBlog];
    setBlogs(updatedBlogs);
    saveToStorage('blogs', updatedBlogs);
    notifyUpdate('blogs', 'add', newBlog);
    message.success('Blog başarıyla eklendi');
    return newBlog;
  };

  const updateBlog = (id, updates) => {
    const updatedBlogs = blogs.map(blog => 
      blog.id === id 
        ? { ...blog, ...updates, updatedAt: new Date().toISOString() }
        : blog
    );
    setBlogs(updatedBlogs);
    saveToStorage('blogs', updatedBlogs);
    notifyUpdate('blogs', 'update', { id, updates });
    message.success('Blog başarıyla güncellendi');
  };

  const deleteBlog = (id) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== id);
    setBlogs(updatedBlogs);
    saveToStorage('blogs', updatedBlogs);
    notifyUpdate('blogs', 'delete', { id });
    message.success('Blog başarıyla silindi');
  };

  // Orders CRUD
  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveToStorage('orders', updatedOrders);
    message.success('Sipariş başarıyla eklendi');
    return newOrder;
  };

  const updateOrder = (id, updates) => {
    const updatedOrders = orders.map(order => 
      order.id === id 
        ? { ...order, ...updates, updatedAt: new Date().toISOString() }
        : order
    );
    setOrders(updatedOrders);
    saveToStorage('orders', updatedOrders);
    message.success('Sipariş başarıyla güncellendi');
  };

  const deleteOrder = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    saveToStorage('orders', updatedOrders);
    message.success('Sipariş başarıyla silindi');
  };

  // Customers CRUD
  const addCustomer = (customer) => {
    const newCustomer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    saveToStorage('customers', updatedCustomers);
    message.success('Müşteri başarıyla eklendi');
    return newCustomer;
  };

  const updateCustomer = (id, updates) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === id 
        ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
        : customer
    );
    setCustomers(updatedCustomers);
    saveToStorage('customers', updatedCustomers);
    message.success('Müşteri başarıyla güncellendi');
  };

  const deleteCustomer = (id) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    setCustomers(updatedCustomers);
    saveToStorage('customers', updatedCustomers);
    message.success('Müşteri başarıyla silindi');
  };

  // Analytics functions
  const getAnalytics = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalProducts = products.length;
    
    const monthlyRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        const currentDate = new Date();
        return orderDate.getMonth() === currentDate.getMonth() && 
               orderDate.getFullYear() === currentDate.getFullYear();
      })
      .reduce((sum, order) => sum + (order.total || 0), 0);

    const topProducts = products
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, 5);

    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      monthlyRevenue,
      topProducts,
      recentOrders
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
    setLoading,
    
    // Real-time updates
    addUpdateListener,
    
    // CRUD operations
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
    
    // Analytics
    getAnalytics
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 