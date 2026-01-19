// Order Success Page - After successful order placement
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FiCheckCircle, FiPackage, FiFileText, FiHome } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const OrderSuccessPage = () => {
    const location = useLocation();
    const order = location.state?.order;

    useEffect(() => {
        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    if (!order) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="order-success-page py-5 bg-light min-vh-100">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow-lg border-0 text-center animate-fadeInUp">
                            <Card.Body className="p-5">
                                <div
                                    className="success-icon mx-auto mb-4"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <FiCheckCircle size={50} color="white" />
                                </div>

                                <h1 className="text-success mb-3">Order Placed Successfully!</h1>
                                <p className="text-muted mb-4">
                                    Thank you for your order. We've received your order and will begin processing it soon.
                                </p>

                                <div className="bg-light rounded-3 p-4 mb-4">
                                    <Row>
                                        <Col md={4} className="mb-3 mb-md-0">
                                            <small className="text-muted">Order ID</small>
                                            <h5 className="mb-0 text-primary">{order.orderId}</h5>
                                        </Col>
                                        <Col md={4} className="mb-3 mb-md-0">
                                            <small className="text-muted">Bill Number</small>
                                            <h5 className="mb-0">{order.billNo}</h5>
                                        </Col>
                                        <Col md={4}>
                                            <small className="text-muted">Payment Method</small>
                                            <h5 className="mb-0">{order.paymentMethod}</h5>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="bg-light rounded-3 p-4 mb-4">
                                    <Row>
                                        <Col md={6} className="mb-3 mb-md-0">
                                            <small className="text-muted">Payment Status</small>
                                            <h5 className={`mb-0 ${order.paymentStatus === 'Paid' ? 'text-success' : 'text-warning'}`}>
                                                {order.paymentStatus}
                                            </h5>
                                        </Col>
                                        <Col md={6}>
                                            <small className="text-muted">Total Amount</small>
                                            <h5 className="mb-0 text-primary">₹{order.totalAmount.toFixed(0)}</h5>
                                        </Col>
                                    </Row>
                                </div>

                                <p className="text-muted mb-4">
                                    {order.paymentMethod === 'COD'
                                        ? 'Please keep the exact amount ready at the time of delivery.'
                                        : 'Your payment has been processed successfully.'}
                                </p>

                                <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                                    <Link to="/orders" className="btn btn-primary-custom">
                                        <FiPackage className="me-2" /> View Orders
                                    </Link>
                                    <Link to={`/invoice/${order.billNo}`} className="btn btn-outline-primary">
                                        <FiFileText className="me-2" /> Download Invoice
                                    </Link>
                                    <Link to="/" className="btn btn-outline-secondary">
                                        <FiHome className="me-2" /> Continue Shopping
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Order Details */}
                        <Card className="mt-4 shadow-sm border-0 animate-fadeInUp delay-2">
                            <Card.Header className="bg-white py-3">
                                <h5 className="mb-0">Order Items</h5>
                            </Card.Header>
                            <Card.Body>
                                {order.items.map((item, index) => {
                                    const itemPrice = item.discount
                                        ? item.price - (item.price * item.discount / 100)
                                        : item.price;
                                    return (
                                        <div
                                            key={index}
                                            className="d-flex gap-3 align-items-center py-3 border-bottom"
                                        >
                                            <img
                                                src={item.imageUrl || 'https://via.placeholder.com/70'}
                                                alt={item.name}
                                                style={{ width: '70px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{item.name}</h6>
                                                <small className="text-muted">Size: {item.size} | Qty: {item.quantity}</small>
                                            </div>
                                            <span className="fw-bold">₹{(itemPrice * item.quantity).toFixed(0)}</span>
                                        </div>
                                    );
                                })}
                            </Card.Body>
                        </Card>

                        {/* Delivery Info */}
                        <Card className="mt-4 shadow-sm border-0 animate-fadeInUp delay-3">
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <h6 className="text-muted mb-2">Delivery Address</h6>
                                        <p className="mb-0">
                                            {order.shippingAddress.name}<br />
                                            {order.shippingAddress.street}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                                            Phone: {order.shippingAddress.phone}
                                        </p>
                                    </Col>
                                    <Col md={6} className="mt-3 mt-md-0">
                                        <h6 className="text-muted mb-2">Estimated Delivery</h6>
                                        <p className="mb-0">
                                            {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default OrderSuccessPage;
