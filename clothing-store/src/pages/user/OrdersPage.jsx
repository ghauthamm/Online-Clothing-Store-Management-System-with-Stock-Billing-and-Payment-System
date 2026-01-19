// Orders Page - User order history
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Tab, Tabs } from 'react-bootstrap';
import { FiPackage, FiEye, FiDownload, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByUser } from '../../services/orderService';
import { getBillByBillNo } from '../../services/billingService';
import { downloadInvoice } from '../../utils/invoiceGenerator';
import { toast } from 'react-toastify';

const OrdersPage = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (currentUser) {
            loadOrders();
        }
    }, [currentUser]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrdersByUser(currentUser.uid);
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (billNo) => {
        try {
            const bill = await getBillByBillNo(billNo);
            if (bill) {
                downloadInvoice(bill);
                toast.success('Invoice downloaded');
            } else {
                toast.error('Invoice not found');
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Error downloading invoice');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Shipped': return 'info';
            case 'Delivered': return 'success';
            case 'Cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <FiClock />;
            case 'Shipped': return <FiTruck />;
            case 'Delivered': return <FiCheckCircle />;
            default: return <FiPackage />;
        }
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        return order.status.toLowerCase() === activeTab;
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page py-5">
            <Container>
                <div className="section-header mb-4">
                    <h1 className="section-title">My Orders</h1>
                    <p className="section-subtitle">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-5">
                        <FiPackage size={80} className="text-muted mb-4" />
                        <h3>No Orders Yet</h3>
                        <p className="text-muted mb-4">You haven't placed any orders yet.</p>
                        <Link to="/products" className="btn btn-primary-custom">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="mb-4"
                        >
                            <Tab eventKey="all" title={`All (${orders.length})`} />
                            <Tab eventKey="pending" title={`Pending (${orders.filter(o => o.status === 'Pending').length})`} />
                            <Tab eventKey="shipped" title={`Shipped (${orders.filter(o => o.status === 'Shipped').length})`} />
                            <Tab eventKey="delivered" title={`Delivered (${orders.filter(o => o.status === 'Delivered').length})`} />
                        </Tabs>

                        {/* Orders List */}
                        {filteredOrders.map((order, index) => (
                            <Card
                                key={order.id}
                                className="mb-4 shadow-sm animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <Card.Header className="bg-white py-3">
                                    <Row className="align-items-center">
                                        <Col md={3}>
                                            <small className="text-muted">Order ID</small>
                                            <h6 className="mb-0 text-primary">{order.orderId}</h6>
                                        </Col>
                                        <Col md={3}>
                                            <small className="text-muted">Placed on</small>
                                            <h6 className="mb-0">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </h6>
                                        </Col>
                                        <Col md={2}>
                                            <small className="text-muted">Total</small>
                                            <h6 className="mb-0">₹{order.totalAmount.toFixed(0)}</h6>
                                        </Col>
                                        <Col md={2}>
                                            <Badge
                                                bg={getStatusColor(order.status)}
                                                className="d-flex align-items-center gap-1 px-3 py-2"
                                                style={{ width: 'fit-content' }}
                                            >
                                                {getStatusIcon(order.status)} {order.status}
                                            </Badge>
                                        </Col>
                                        <Col md={2} className="text-end">
                                            <Badge
                                                bg={order.paymentStatus === 'Paid' ? 'success' : 'warning'}
                                                className="px-3 py-2"
                                            >
                                                {order.paymentStatus}
                                            </Badge>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={8}>
                                            {/* Order Items */}
                                            {order.items.map((item, idx) => {
                                                const itemPrice = item.discount
                                                    ? item.price - (item.price * item.discount / 100)
                                                    : item.price;
                                                return (
                                                    <div key={idx} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                                                        <img
                                                            src={item.imageUrl || 'https://via.placeholder.com/80'}
                                                            alt={item.name}
                                                            style={{
                                                                width: '80px',
                                                                height: '100px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px'
                                                            }}
                                                        />
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-1">{item.name}</h6>
                                                            <p className="text-muted small mb-1">
                                                                Size: {item.size} | Qty: {item.quantity}
                                                            </p>
                                                            <span className="fw-semibold">₹{(itemPrice * item.quantity).toFixed(0)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </Col>
                                        <Col md={4}>
                                            {/* Delivery Address */}
                                            <div className="bg-light rounded p-3 mb-3">
                                                <h6 className="mb-2">Delivery Address</h6>
                                                <p className="small mb-0">
                                                    {order.shippingAddress?.name}<br />
                                                    {order.shippingAddress?.street}<br />
                                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                                                </p>
                                            </div>

                                            {/* Payment Info */}
                                            <div className="bg-light rounded p-3">
                                                <p className="mb-1 small">
                                                    <strong>Payment:</strong> {order.paymentMethod}
                                                </p>
                                                {order.transactionId && (
                                                    <p className="mb-0 small">
                                                        <strong>Transaction ID:</strong> {order.transactionId}
                                                    </p>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer className="bg-white py-3">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleDownloadInvoice(order.billNo)}
                                        >
                                            <FiDownload className="me-1" /> Download Invoice
                                        </Button>
                                        {order.status === 'Delivered' && (
                                            <Button variant="outline-success" size="sm">
                                                Rate & Review
                                            </Button>
                                        )}
                                        {order.status === 'Pending' && (
                                            <Button variant="outline-danger" size="sm">
                                                Cancel Order
                                            </Button>
                                        )}
                                    </div>
                                </Card.Footer>
                            </Card>
                        ))}
                    </>
                )}
            </Container>
        </div>
    );
};

export default OrdersPage;
