// Cart Page - Shopping cart with items and checkout summary
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const CartPage = () => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const shippingCharge = cartTotal >= 999 ? 0 : 99;
    const tax = cartTotal * 0.05;
    const grandTotal = cartTotal + shippingCharge + tax;

    const handleCheckout = () => {
        if (!currentUser) {
            toast.warning('Please login to proceed to checkout');
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page py-5">
                <Container>
                    <div className="text-center py-5">
                        <FiShoppingBag size={80} className="text-muted mb-4" />
                        <h2>Your Cart is Empty</h2>
                        <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary-custom">
                            Start Shopping
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="cart-page py-5">
            <Container>
                {/* Page Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Shopping Cart</h1>
                        <p className="text-muted mb-0">{cartItems.length} items in your cart</p>
                    </div>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to clear your cart?')) {
                                clearCart();
                                toast.success('Cart cleared');
                            }
                        }}
                    >
                        Clear Cart
                    </Button>
                </div>

                <Row>
                    {/* Cart Items */}
                    <Col lg={8}>
                        <Link to="/products" className="btn btn-link text-decoration-none mb-3 p-0">
                            <FiArrowLeft className="me-2" /> Continue Shopping
                        </Link>

                        {cartItems.map((item, index) => {
                            const itemPrice = item.discount
                                ? item.price - (item.price * item.discount / 100)
                                : item.price;

                            return (
                                <div
                                    key={`${item.productId}-${item.size}`}
                                    className="cart-item animate-fadeInUp"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <Row className="align-items-center">
                                        <Col xs={3} md={2}>
                                            <img
                                                src={item.imageUrl || 'https://via.placeholder.com/100x120'}
                                                alt={item.name}
                                                className="cart-item-image"
                                            />
                                        </Col>
                                        <Col xs={9} md={4}>
                                            <Link
                                                to={`/product/${item.productId}`}
                                                className="text-decoration-none"
                                            >
                                                <h6 className="mb-1">{item.name}</h6>
                                            </Link>
                                            <p className="text-muted small mb-1">
                                                Size: {item.size} | {item.fabric || 'Premium Quality'}
                                            </p>
                                            <span className="badge bg-light text-dark">{item.category}</span>
                                        </Col>
                                        <Col xs={6} md={2} className="mt-3 mt-md-0">
                                            <div className="quantity-control">
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                                >
                                                    <FiMinus />
                                                </button>
                                                <span className="quantity-value">{item.quantity}</span>
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                                >
                                                    <FiPlus />
                                                </button>
                                            </div>
                                        </Col>
                                        <Col xs={4} md={2} className="mt-3 mt-md-0 text-end text-md-center">
                                            <p className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
                                                ₹{(itemPrice * item.quantity).toFixed(0)}
                                            </p>
                                            {item.discount > 0 && (
                                                <small className="text-muted text-decoration-line-through">
                                                    ₹{(item.price * item.quantity).toFixed(0)}
                                                </small>
                                            )}
                                        </Col>
                                        <Col xs={2} className="mt-3 mt-md-0 text-end">
                                            <Button
                                                variant="link"
                                                className="text-danger p-2"
                                                onClick={() => {
                                                    removeFromCart(item.productId, item.size);
                                                    toast.success('Item removed from cart');
                                                }}
                                            >
                                                <FiTrash2 size={20} />
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })}
                    </Col>

                    {/* Cart Summary */}
                    <Col lg={4}>
                        <div className="cart-summary animate-fadeInRight">
                            <h4 className="cart-summary-title">Order Summary</h4>

                            <div className="cart-summary-row">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>₹{cartTotal.toFixed(0)}</span>
                            </div>

                            <div className="cart-summary-row">
                                <span>Shipping</span>
                                <span className={shippingCharge === 0 ? 'text-success' : ''}>
                                    {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                                </span>
                            </div>

                            <div className="cart-summary-row">
                                <span>Tax (5% GST)</span>
                                <span>₹{tax.toFixed(0)}</span>
                            </div>

                            {shippingCharge > 0 && (
                                <div className="alert alert-info py-2 mt-3" style={{ fontSize: '0.85rem' }}>
                                    Add ₹{(999 - cartTotal).toFixed(0)} more for FREE shipping!
                                </div>
                            )}

                            <div className="cart-summary-total">
                                <span>Grand Total</span>
                                <span>₹{grandTotal.toFixed(0)}</span>
                            </div>

                            <Button
                                className="btn-primary-custom w-100 mt-4"
                                size="lg"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>

                            {/* Secure Checkout Badge */}
                            <div className="text-center mt-3">
                                <small className="text-muted">
                                    🔒 Secure Checkout | 💳 Multiple Payment Options
                                </small>
                            </div>

                            {/* Coupon Code */}
                            <div className="mt-4 pt-4 border-top">
                                <label className="form-label">Have a coupon code?</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter code"
                                    />
                                    <Button variant="outline-primary">Apply</Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CartPage;
