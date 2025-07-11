const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Helper method to set auth headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Helper method to get auth headers for file uploads
  getUploadHeaders() {
    const headers = {};
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Upload file method
  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'POST',
      headers: this.getUploadHeaders(),
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  // Auth endpoints
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

  // Products endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // Product operations with file upload
  async createProduct(productData, imageFiles = []) {
    const formData = new FormData();
    
    // Add product data
    Object.keys(productData).forEach(key => {
      if (typeof productData[key] === 'object') {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    });

    // Add image files
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    return this.uploadFile('/products', formData);
  }

  async updateProduct(id, productData, imageFiles = []) {
    const formData = new FormData();
    
    // Add product data
    Object.keys(productData).forEach(key => {
      if (typeof productData[key] === 'object') {
        formData.append(key, JSON.stringify(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    });

    // Add image files
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    return this.uploadFile(`/products/${id}`, formData);
  }

  // Categories endpoints
  async getCategories() {
    return this.request('/categories');
  }

  // Category operations
  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, { method: 'DELETE' });
  }

  // Orders endpoints
  async getOrders() {
    return this.request('/orders');
  }

  // Users endpoints
  async getUsers() {
    return this.request('/users');
  }

  // Blogs endpoints
  async getBlogs() {
    return this.request('/blogs');
  }

  // Blog operations with file upload
  async createBlog(blogData, imageFile = null) {
    const formData = new FormData();
    
    // Add blog data
    Object.keys(blogData).forEach(key => {
      if (typeof blogData[key] === 'object') {
        formData.append(key, JSON.stringify(blogData[key]));
      } else {
        formData.append(key, blogData[key]);
      }
    });

    // Add image file
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.uploadFile('/blogs', formData);
  }

  async updateBlog(id, blogData, imageFile = null) {
    const formData = new FormData();
    
    // Add blog data
    Object.keys(blogData).forEach(key => {
      if (typeof blogData[key] === 'object') {
        formData.append(key, JSON.stringify(blogData[key]));
      } else {
        formData.append(key, blogData[key]);
      }
    });

    // Add image file
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.uploadFile(`/blogs/${id}`, formData);
  }

  async deleteBlog(id) {
    return this.request(`/blogs/${id}`, { method: 'DELETE' });
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.request('/admin/dashboard');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 