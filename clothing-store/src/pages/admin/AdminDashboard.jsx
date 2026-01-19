// Admin Dashboard - Main admin panel
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {
    FiHome, FiPackage, FiShoppingCart, FiUsers, FiDollarSign,
    FiFileText, FiSettings, FiLogOut, FiMenu, FiX, FiAlertTriangle,
    FiTrendingUp, FiBarChart2
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { getAllOrders, calculateRevenue, getTodaysOrders } from '../../services/orderService';
import { getAllProducts, getLowStockProducts } from '../../services/productService';
import { getAllUsers } from '../../services/userService';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { shopDetails } = useShop();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
        todaysOrders: 0,
        lowStockProducts: 0
    });
    const [loading, setLoading] = useState(true);

    const menuItems = [
        { path: '/admin', icon: <FiHome />, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
        { path: '/admin/orders', icon: <FiShoppingCart />, label: 'Orders' },
        { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
        { path: '/admin/billing', icon: <FiFileText />, label: 'Billing' },
        { path: '/admin/reports', icon: <FiBarChart2 />, label: 'Reports' },
        { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
    ];

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            const [users, products, orders, revenue, todaysOrders, lowStock] = await Promise.all([
                getAllUsers(),
                getAllProducts(),
                getAllOrders(),
                calculateRevenue(),
                getTodaysOrders(),
                getLowStockProducts()
            ]);

            setStats({
                totalUsers: users.length,
                totalProducts: products.length,
                totalOrders: orders.length,
                revenue: revenue,
                todaysOrders: todaysOrders.length,
                lowStockProducts: lowStock.length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Error logging out');
        }
    };

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    // Show overview stats only on main dashboard
    const showOverview = location.pathname === '/admin';

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
                <div className="admin-sidebar-brand">
                    <Link to="/admin" className="text-decoration-none d-flex align-items-center gap-2">
                        <div className="brand-logo" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>S</div>
                        <div>
                            <h5 className="mb-0 text-white">Admin Panel</h5>
                            <small style={{ color: 'rgba(255,255,255,0.6)' }}>Samy Silks</small>
                        </div>
                    </Link>
                    <button
                        className="btn btn-link text-white d-lg-none"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <nav className="admin-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto p-3">
                    <Button
                        variant="outline-light"
                        className="w-100"
                        onClick={handleLogout}
                    >
                        <FiLogOut className="me-2" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-content">
                {/* Top Bar */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <Button
                            variant="outline-secondary"
                            className="d-lg-none"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <FiMenu />
                        </Button>
                        <div>
                            <h4 className="mb-0">
                                {showOverview ? 'Dashboard Overview' : menuItems.find(m => isActive(m.path))?.label || 'Admin'}
                            </h4>
                            <small className="text-muted">{shopDetails.name}</small>
                        </div>
                    </div>
                    <Link to="/" className="btn btn-outline-primary btn-sm">
                        View Store
                    </Link>
                </div>

                {showOverview ? (
                    <>
                        {/* Stats Cards */}
                        <Row className="mb-4">
                            <Col lg={3} md={6} className="mb-4">
                                <Card className="stat-card animate-fadeInUp">
                                    <div className="stat-icon primary">
                                        <FiUsers />
                                    </div>
                                    <div className="stat-value">{loading ? '...' : stats.totalUsers}</div>
                                    <div className="stat-label">Total Users</div>
                                </Card>
                            </Col>
                            <Col lg={3} md={6} className="mb-4">
                                <Card className="stat-card animate-fadeInUp delay-1">
                                    <div className="stat-icon info">
                                        <FiPackage />
                                    </div>
                                    <div className="stat-value">{loading ? '...' : stats.totalProducts}</div>
                                    <div className="stat-label">Total Products</div>
                                </Card>
                            </Col>
                            <Col lg={3} md={6} className="mb-4">
                                <Card className="stat-card animate-fadeInUp delay-2">
                                    <div className="stat-icon success">
                                        <FiShoppingCart />
                                    </div>
                                    <div className="stat-value">{loading ? '...' : stats.totalOrders}</div>
                                    <div className="stat-label">Total Orders</div>
                                </Card>
                            </Col>
                            <Col lg={3} md={6} className="mb-4">
                                <Card className="stat-card animate-fadeInUp delay-3">
                                    <div className="stat-icon warning">
                                        <FiDollarSign />
                                    </div>
                                    <div className="stat-value">₹{loading ? '...' : stats.revenue.toLocaleString()}</div>
                                    <div className="stat-label">Total Revenue</div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Alerts */}
                        <Row className="mb-4">
                            <Col md={6} className="mb-4">
                                <Card className="h-100 shadow-sm">
                                    <Card.Header className="bg-white py-3">
                                        <h5 className="mb-0"><FiTrendingUp className="me-2" /> Today's Activity</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xs={6}>
                                                <div className="text-center p-3 bg-light rounded">
                                                    <h3 className="text-primary mb-0">{loading ? '...' : stats.todaysOrders}</h3>
                                                    <small className="text-muted">Orders Today</small>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                <div className="text-center p-3 bg-light rounded">
                                                    <h3 className="text-success mb-0">
                                                        ₹{loading ? '...' : (stats.revenue / (stats.totalOrders || 1)).toFixed(0)}
                                                    </h3>
                                                    <small className="text-muted">Avg. Order Value</small>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6} className="mb-4">
                                <Card className={`h-100 shadow-sm ${stats.lowStockProducts > 0 ? 'border-warning' : ''}`}>
                                    <Card.Header className="bg-white py-3">
                                        <h5 className="mb-0"><FiAlertTriangle className="me-2 text-warning" /> Stock Alerts</h5>
                                    </Card.Header>
                                    <Card.Body className="d-flex flex-column justify-content-center">
                                        {stats.lowStockProducts > 0 ? (
                                            <div className="text-center">
                                                <h2 className="text-warning mb-2">{stats.lowStockProducts}</h2>
                                                <p className="text-muted mb-3">Products with low stock</p>
                                                <Link to="/admin/products" className="btn btn-warning btn-sm">
                                                    View Products
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="text-center text-success">
                                                <FiPackage size={40} className="mb-2" />
                                                <p className="mb-0">All products are well stocked!</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Quick Links */}
                        <Row>
                            <Col>
                                <Card className="shadow-sm">
                                    <Card.Header className="bg-white py-3">
                                        <h5 className="mb-0">Quick Actions</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={3} sm={6} className="mb-3">
                                                <Link to="/admin/products/add" className="btn btn-outline-primary w-100 py-3">
                                                    <FiPackage className="d-block mx-auto mb-2" size={24} />
                                                    Add Product
                                                </Link>
                                            </Col>
                                            <Col md={3} sm={6} className="mb-3">
                                                <Link to="/admin/orders" className="btn btn-outline-success w-100 py-3">
                                                    <FiShoppingCart className="d-block mx-auto mb-2" size={24} />
                                                    View Orders
                                                </Link>
                                            </Col>
                                            <Col md={3} sm={6} className="mb-3">
                                                <Link to="/admin/billing" className="btn btn-outline-info w-100 py-3">
                                                    <FiFileText className="d-block mx-auto mb-2" size={24} />
                                                    View Bills
                                                </Link>
                                            </Col>
                                            <Col md={3} sm={6} className="mb-3">
                                                <Link to="/admin/reports" className="btn btn-outline-warning w-100 py-3">
                                                    <FiBarChart2 className="d-block mx-auto mb-2" size={24} />
                                                    Sales Reports
                                                </Link>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
