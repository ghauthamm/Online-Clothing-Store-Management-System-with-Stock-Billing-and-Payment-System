// Main Application Component with Routing
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ShopProvider } from './context/ShopContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PageLoader from './components/common/PageLoader';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User Pages
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/user/OrdersPage';
import ProfilePage from './pages/user/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBilling from './pages/admin/AdminBilling';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  return (
    <Router>
      <AuthProvider>
        <ShopProvider>
          <CartProvider>
            {loading && <PageLoader onLoadComplete={handleLoadComplete} />}

            <div className={`app ${loading ? 'd-none' : ''}`}>
              <Routes>
                {/* Auth Routes - No Navbar/Footer */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Admin Routes - Custom Layout */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />}>
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="orders" element={<AdminOrders />} />
                          <Route path="billing" element={<AdminBilling />} />
                          <Route path="reports" element={<AdminReports />} />
                          <Route path="users" element={<AdminUsers />} />
                        </Route>
                      </Routes>
                    </AdminRoute>
                  }
                />

                {/* Public & User Routes - With Navbar/Footer */}
                <Route
                  path="/*"
                  element={
                    <>
                      <Navbar />
                      <main className="main-content" style={{ minHeight: 'calc(100vh - 400px)' }}>
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<HomePage />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route path="/product/:id" element={<ProductDetailsPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/contact" element={<ContactPage />} />

                          {/* Protected User Routes */}
                          <Route
                            path="/checkout"
                            element={
                              <ProtectedRoute>
                                <CheckoutPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/order-success"
                            element={
                              <ProtectedRoute>
                                <OrderSuccessPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/orders"
                            element={
                              <ProtectedRoute>
                                <OrdersPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/profile"
                            element={
                              <ProtectedRoute>
                                <ProfilePage />
                              </ProtectedRoute>
                            }
                          />

                          {/* 404 Page */}
                          <Route
                            path="*"
                            element={
                              <div className="text-center py-5">
                                <h1>404</h1>
                                <p>Page not found</p>
                              </div>
                            }
                          />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </div>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </CartProvider>
        </ShopProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
