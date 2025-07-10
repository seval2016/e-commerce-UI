# E-commerce MERN Stack Application

Modern e-commerce web application built with React, Node.js, Express, and MongoDB.

## Features

- 🛍️ **Product Management**: Add, edit, delete products with multiple images
- 📊 **Admin Dashboard**: Analytics, order management, customer tracking
- 🛒 **Shopping Cart**: Add to cart, quantity management, checkout
- 👥 **User Authentication**: Register, login, profile management
- 📝 **Blog System**: Create and manage blog posts
- 📱 **Responsive Design**: Mobile-friendly interface
- 🖼️ **Image Management**: Cloudinary integration for optimized image storage

## Tech Stack

### Frontend
- **React 18** with Vite
- **Ant Design** for UI components
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image storage
- **Multer** for file uploads

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd e-commerce-UI
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_store?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Update the `.env` file with your Cloudinary credentials

### 4. Frontend Setup

```bash
cd ../
npm install
```

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
npm run dev
```

## Admin Access

The application automatically creates a default admin user on first startup:

- **Email**: `admin@example.com`
- **Password**: `admin123`

You can change these credentials in `backend/server.js` or create a new admin user through the API.

## Image Upload System

The application uses Cloudinary for image storage, which provides:

- ✅ **Automatic optimization**: Images are compressed and optimized
- ✅ **CDN delivery**: Fast global image delivery
- ✅ **Multiple formats**: Automatic format conversion
- ✅ **Responsive images**: Different sizes for different devices
- ✅ **Secure URLs**: HTTPS by default

### Supported Image Formats
- JPEG, JPG
- PNG
- GIF
- WebP

### Image Limits
- Maximum file size: 5MB
- Maximum images per product: 6
- Automatic resizing for large images

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (with image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

### Users
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Deployment

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Backend (Heroku/Railway)
1. Deploy to your preferred platform
2. Set environment variables
3. Update frontend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
