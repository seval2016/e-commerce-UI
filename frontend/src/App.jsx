import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import UserOrdersPage from "./pages/OrdersPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFoundPage from "./pages/NotFoundPage";
import TestPage from "./pages/TestPage";
import ErrorBoundary from "./components/common/ErrorBoundary";
import AdminLayout from "./layouts/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductsPage from "./pages/admin/ProductsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import OrdersPage from "./pages/admin/OrdersPage";
import CustomersPage from "./pages/admin/CustomersPage";
import BlogsPage from "./pages/admin/BlogsPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SupportPage from "./pages/admin/SupportPage";
import SettingsPage from "./pages/admin/SettingsPage";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ScrollToTop from "./components/common/ScrollToTop";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { DataProvider } from "./context/DataContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import CommentsPage from "./pages/admin/CommentsPage";
import ProfilePageAdmin from "./pages/admin/ProfilePage";


function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <CartProvider>
          <DataProvider>
            <FavoritesProvider>
              <ScrollToTop />
              <Routes>
                {/* Public Routes with Layout */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
                <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
                <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
                <Route path="/cart" element={<Layout><CartPage /></Layout>} />
                <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
                <Route path="/product/:id" element={<Layout><ProductDetailsPage /></Layout>} />
                <Route path="/blog/:slug" element={<Layout><BlogDetailsPage /></Layout>} />
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                <Route path="/orders" element={<Layout><UserOrdersPage /></Layout>} />
                <Route path="/favorites" element={<Layout><FavoritesPage /></Layout>} />
                <Route path="/test" element={<Layout><TestPage /></Layout>} />
                
                {/* Admin Login Route */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                
                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardPage />} />
                  <Route path="products" element={
                    <ProtectedRoute requiredPermission="products">
                      <ProductsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="categories" element={
                    <ProtectedRoute requiredPermission="categories">
                      <CategoriesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="orders" element={
                    <ProtectedRoute requiredPermission="orders">
                      <OrdersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="customers" element={
                    <ProtectedRoute requiredPermission="customers">
                      <CustomersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="blogs" element={
                    <ProtectedRoute requiredPermission="blogs">
                      <BlogsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="analytics" element={
                    <ProtectedRoute requiredPermission="analytics">
                      <AnalyticsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="support" element={
                    <ProtectedRoute requiredPermission="support">
                      <SupportPage />
                    </ProtectedRoute>
                  } />
                  <Route path="settings" element={
                    <ProtectedRoute requiredPermission="settings">
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="comments" element={<CommentsPage />} />
                  <Route path="profile" element={<ProfilePageAdmin />} />
                </Route>
                
                <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
              </Routes>
            </FavoritesProvider>
          </DataProvider>
        </CartProvider>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
