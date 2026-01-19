// Navbar Component - Main navigation bar
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { FiShoppingCart, FiUser, FiSearch, FiPhone, FiMail, FiMapPin, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useShop } from '../../context/ShopContext';

const NavBar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { currentUser, userRole, logout } = useAuth();
    const { cartCount } = useCart();
    const { shopDetails } = useShop();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            {/* Top Bar */}
            <div className="top-bar d-none d-lg-block">
                <Container>
                    <div className="top-bar-content">
                        <div className="top-bar-left">
                            <span className="top-bar-item">
                                <FiPhone /> {shopDetails.phone}
                            </span>
                            <span className="top-bar-item">
                                <FiMail /> {shopDetails.email}
                            </span>
                        </div>
                        <div className="top-bar-right">
                            <span className="top-bar-item">
                                <FiMapPin /> {shopDetails.address}
                            </span>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main Navbar */}
            <Navbar expand="lg" className={`navbar-main ${scrolled ? 'scrolled' : ''}`}>
                <Container>
                    <Link to="/" className="navbar-brand">
                        <div className="brand-logo">S</div>
                        <div className="brand-text">
                            <span className="brand-name">{shopDetails.name}</span>
                            <span className="brand-tagline">Traditional Elegance</span>
                        </div>
                    </Link>

                    <Navbar.Toggle aria-controls="main-navbar">
                        <FiMenu size={24} />
                    </Navbar.Toggle>

                    <Navbar.Collapse id="main-navbar">
                        <Nav className="mx-auto">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                            <NavDropdown title="Products" id="products-dropdown">
                                <NavDropdown.Item as={Link} to="/products">All Products</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/products?category=Men">Men</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/products?category=Women">Women</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/products?category=Kids">Kids</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/products?category=Sarees">Sarees</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/products?category=Silks">Silks</NavDropdown.Item>
                            </NavDropdown>
                            <NavLink to="/about" className="nav-link">About</NavLink>
                            <NavLink to="/contact" className="nav-link">Contact</NavLink>
                        </Nav>

                        <Nav className="align-items-center">
                            <NavLink to="/cart" className="nav-link cart-icon">
                                <FiShoppingCart size={22} />
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </NavLink>

                            {currentUser ? (
                                <NavDropdown
                                    title={<><FiUser size={20} /> {currentUser.displayName || 'Account'}</>}
                                    id="user-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/orders">My Orders</NavDropdown.Item>
                                    {userRole === 'admin' && (
                                        <>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={Link} to="/admin">Admin Dashboard</NavDropdown.Item>
                                        </>
                                    )}
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <div className="d-flex gap-2 ms-3">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => navigate('/login')}
                                        style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        className="btn-primary-custom"
                                        size="sm"
                                        onClick={() => navigate('/register')}
                                    >
                                        Register
                                    </Button>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default NavBar;
