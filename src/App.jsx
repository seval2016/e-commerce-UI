import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorBoundary from "./components/common/ErrorBoundary";
import AdminLayout from "./layouts/AdminLayout";
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

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes with Layout */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
        <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetailsPage /></Layout>} />
        <Route path="/blog/:id" element={<Layout><BlogDetailsPage /></Layout>} />
        
        {/* Admin Routes without Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;