const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 30000; // 30 seconds timeout
  }

  // Helper method to get authentication token
  getAuthToken() {
    const tokenSources = [
      'adminUser',
      'token', 
      'accessToken',
      'authToken',
      'userToken'
    ];

    for (const source of tokenSources) {
      const stored = localStorage.getItem(source);
      
      if (stored) {
        try {
          // If it's a JSON object, extract token
          if (stored.startsWith('{')) {
            const data = JSON.parse(stored);
            if (data.token) {
              return data.token;
            }
            if (data.accessToken) {
              return data.accessToken;
            }
          } else {
            // Direct token string
            return stored;
          }
        } catch {
          // Error parsing token
        }
      }
    }
    return null;
  }

  // Helper method to build request headers
  buildHeaders(isUpload = false) {
    const headers = {};
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Only set Content-Type for non-upload requests
    if (!isUpload) {
      headers['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  // Enhanced request method with better error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const isUpload = options.body instanceof FormData;
    
    const config = {
      headers: this.buildHeaders(isUpload),
      timeout: this.timeout,
      ...options,
    };



    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Try to parse response as JSON
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text, raw: text };
      }



      if (!response.ok) {
        // Handle specific error cases
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}`;
        
        // Handle authentication errors more gracefully
        if (response.status === 401) {
          // Don't immediately clear tokens, let AdminAuthContext handle it
          // The user might just need to refresh their session
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      

      
      throw error;
    }
  }

  // Specialized upload method
  async uploadFile(endpoint, formData, method = 'POST') {
    return this.request(endpoint, {
      method,
      body: formData
    });
  }

  // Helper to clear auth tokens
  clearAuthTokens() {
    const keys = ['token', 'adminUser', 'authToken', 'userToken'];
    keys.forEach(key => localStorage.removeItem(key));
  }

  // Helper to validate FormData
  validateFormData(formData, requiredFields = []) {
    for (const field of requiredFields) {
      if (!formData.has(field)) {
        throw new Error(`Required field missing: ${field}`);
      }
    }
  }

  // Authentication endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async adminLogin(email, password) {
    return this.request('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Enhanced product endpoints with comprehensive CRUD
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return this.request(endpoint);
  }

  async getProduct(id) {
    if (!id) throw new Error('Product ID is required');
    return this.request(`/products/${id}`);
  }

  async createProduct(productData, imageFiles = []) {
    const formData = new FormData();
    
    // Add product data to FormData
    Object.entries(productData).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return; // Skip empty values
      }
      
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    // Add image files
    imageFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);

      }
    });

    // Validate required fields
    this.validateFormData(formData, ['name', 'description', 'price', 'category']);

    return this.uploadFile('/products', formData);
  }

  async updateProduct(id, productData, imageFiles = [], removedImages = []) {
    if (!id) throw new Error('Product ID is required');
    
    const formData = new FormData();
    
    // Add product data
    Object.entries(productData).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return; // Skip null/undefined
      }
      
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    // Add new image files
    imageFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file);

      }
    });

    // Add removed images info
    if (removedImages.length > 0) {
      formData.append('removedImages', JSON.stringify(removedImages));
    }

    return this.uploadFile(`/products/${id}`, formData, 'PUT');
  }

  async deleteProduct(id) {
    if (!id) throw new Error('Product ID is required');
    
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  async toggleProductStatus(id) {
    if (!id) throw new Error('Product ID is required');
    
    return this.request(`/products/${id}/toggle-status`, { method: 'POST' });
  }

  async getProductsByCategory(categoryId) {
    if (!categoryId) throw new Error('Category ID is required');
    
    return this.request(`/products/category/${categoryId}`);
  }

  async searchProducts(query, options = {}) {
    if (!query) throw new Error('Search query is required');
    
    const params = new URLSearchParams(options).toString();
    const endpoint = params ? `/products/search/${encodeURIComponent(query)}?${params}` : `/products/search/${encodeURIComponent(query)}`;
    
    return this.request(endpoint);
  }

  // Enhanced category endpoints
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(id) {
    if (!id) throw new Error('Category ID is required');
    return this.request(`/categories/${id}`);
  }

  async createCategory(categoryData, imageFile = null) {
    if (imageFile && imageFile instanceof File) {
      const formData = new FormData();
      
      // Add category data
      Object.entries(categoryData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'image') {
          formData.append(key, String(value));
        }
      });

      // Add image file
      formData.append('image', imageFile);

      return this.uploadFile('/categories', formData);
    } else {
      // Create without image
      return this.request('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
    }
  }

  async updateCategory(id, categoryData, imageFile = null) {
    if (!id) throw new Error('Category ID is required');
    
    if (imageFile && imageFile instanceof File) {
      const formData = new FormData();
      
      // Add category data
      Object.entries(categoryData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'image') {
          formData.append(key, String(value));
        }
      });

      // Add image file
      formData.append('image', imageFile);

      return this.uploadFile(`/categories/${id}`, formData, 'PUT');
    } else {
      // Update without image
      return this.request(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });
    }
  }

  async deleteCategory(id) {
    if (!id) throw new Error('Category ID is required');
    
    return this.request(`/categories/${id}`, { method: 'DELETE' });
  }

  // Blog endpoints
  async getBlogs() {
    return this.request('/blogs');
  }

  async getAdminBlogs() {
    return this.request('/blogs/admin');
  }

  async getBlog(id) {
    if (!id) throw new Error('Blog ID is required');
    return this.request(`/blogs/${id}`);
  }

  async createBlog(blogData, imageFile = null) {
    if (imageFile && imageFile instanceof File) {
      const formData = new FormData();
      
      Object.entries(blogData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      formData.append('featuredImage', imageFile); // Use featuredImage field name

      return this.uploadFile('/blogs', formData);
    } else {
      return this.request('/blogs', {
        method: 'POST',
        body: JSON.stringify(blogData)
      });
    }
  }

  async updateBlog(id, blogData, imageFile = null) {
    if (!id) throw new Error('Blog ID is required');
    
    if (imageFile && imageFile instanceof File) {
      const formData = new FormData();
      
      Object.entries(blogData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      formData.append('featuredImage', imageFile); // Use featuredImage field name

      return this.uploadFile(`/blogs/${id}`, formData, 'PUT');
    } else {
      return this.request(`/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(blogData)
      });
    }
  }

  async deleteBlog(id) {
    if (!id) throw new Error('Blog ID is required');
    return this.request(`/blogs/${id}`, { method: 'DELETE' });
  }

  // Order endpoints
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    if (!id) throw new Error('Order ID is required');
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async updateOrderStatus(id, status) {
    if (!id) throw new Error('Order ID is required');
    if (!status) throw new Error('Status is required');
    
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // User management endpoints
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    if (!id) throw new Error('User ID is required');
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    if (!id) throw new Error('User ID is required');
    
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    if (!id) throw new Error('User ID is required');
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  // Analytics endpoints
  async getAnalytics() {
    return this.request('/analytics');
  }

  async getDashboardStats() {
    return this.request('/analytics/dashboard');
  }
}

// Create and export singleton instance
const api = new ApiService();
export default api; 
