// Admin Orders Page - Order management
import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FiEye, FiDownload, FiCheck, FiTruck, FiPackage, FiFilter } from 'react-icons/fi';
import { getAllOrders, updateOrderStatus, updatePaymentStatus } from '../../services/orderService';
import { getBillByBillNo } from '../../services/billingService';
import { downloadInvoice } from '../../utils/invoiceGenerator';
import { toast } from 'react-toastify';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, statusFilter, paymentFilter]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        if (statusFilter) {
            filtered = filtered.filter(o => o.status === statusFilter);
        }

        if (paymentFilter) {
            filtered = filtered.filter(o => o.paymentStatus === paymentFilter);
        }

        setFilteredOrders(filtered);
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            toast.success(`Order status updated to ${status}`);
            loadOrders();
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const handlePaymentUpdate = async (orderId, paymentStatus) => {
        try {
            await updatePaymentStatus(orderId, paymentStatus);
            toast.success(`Payment status updated to ${paymentStatus}`);
            loadOrders();
        } catch (error) {
            toast.error('Error updating payment status');
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
            toast.error('Error downloading invoice');
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
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

    return (
        <>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">Manage Orders</h5>
                    <p className="text-muted mb-0">{orders.length} orders total</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={4} className="mb-3 mb-md-0">
                            <Form.Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </Form.Select>
                        </Col>
                        <Col md={4} className="mb-3 mb-md-0">
                            <Form.Select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                            >
                                <option value="">All Payments</option>
                                <option value="Pending">Payment Pending</option>
                                <option value="Paid">Paid</option>
                            </Form.Select>
                        </Col>
                        <Col md={4} className="text-end">
                            <span className="text-muted">
                                Showing {filteredOrders.length} of {orders.length}
                            </span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Orders Table */}
            <Card className="shadow-sm">
                <div className="table-responsive">
                    <Table className="data-table mb-0">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5">
                                        <FiPackage size={40} className="text-muted mb-2" />
                                        <p className="text-muted mb-0">No orders found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="fw-semibold text-primary">{order.orderId}</span>
                                            <br />
                                            <small className="text-muted">{order.billNo}</small>
                                        </td>
                                        <td>
                                            <span>{order.shippingAddress?.name || 'N/A'}</span>
                                            <br />
                                            <small className="text-muted">{order.shippingAddress?.phone}</small>
                                        </td>
                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="fw-semibold">₹{order.totalAmount?.toFixed(0)}</td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={order.paymentStatus}
                                                onChange={(e) => handlePaymentUpdate(order.id, e.target.value)}
                                                className={order.paymentStatus === 'Paid' ? 'text-success' : 'text-warning'}
                                                style={{ width: 'auto' }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Paid">Paid</option>
                                            </Form.Select>
                                            <small className="text-muted d-block mt-1">{order.paymentMethod}</small>
                                        </td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                style={{ width: 'auto' }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => openOrderDetails(order)}
                                                    title="View Details"
                                                >
                                                    <FiEye />
                                                </Button>
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={() => handleDownloadInvoice(order.billNo)}
                                                    title="Download Invoice"
                                                >
                                                    <FiDownload />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>

            {/* Order Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Order Details - {selectedOrder?.orderId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            {/* Order Info */}
                            <Row className="mb-4">
                                <Col md={4}>
                                    <p className="text-muted mb-1">Order ID</p>
                                    <p className="fw-semibold">{selectedOrder.orderId}</p>
                                </Col>
                                <Col md={4}>
                                    <p className="text-muted mb-1">Bill Number</p>
                                    <p className="fw-semibold">{selectedOrder.billNo}</p>
                                </Col>
                                <Col md={4}>
                                    <p className="text-muted mb-1">Order Date</p>
                                    <p className="fw-semibold">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}
                                    </p>
                                </Col>
                            </Row>

                            {/* Status */}
                            <Row className="mb-4">
                                <Col md={4}>
                                    <p className="text-muted mb-1">Order Status</p>
                                    <Badge bg={getStatusColor(selectedOrder.status)} className="px-3 py-2">
                                        {selectedOrder.status}
                                    </Badge>
                                </Col>
                                <Col md={4}>
                                    <p className="text-muted mb-1">Payment Status</p>
                                    <Badge
                                        bg={selectedOrder.paymentStatus === 'Paid' ? 'success' : 'warning'}
                                        className="px-3 py-2"
                                    >
                                        {selectedOrder.paymentStatus}
                                    </Badge>
                                </Col>
                                <Col md={4}>
                                    <p className="text-muted mb-1">Payment Method</p>
                                    <p className="fw-semibold">{selectedOrder.paymentMethod}</p>
                                </Col>
                            </Row>

                            {/* Customer Info */}
                            <h6 className="border-bottom pb-2 mb-3">Customer Details</h6>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <p className="text-muted mb-1">Name</p>
                                    <p className="fw-semibold">{selectedOrder.shippingAddress?.name}</p>
                                </Col>
                                <Col md={6}>
                                    <p className="text-muted mb-1">Phone</p>
                                    <p className="fw-semibold">{selectedOrder.shippingAddress?.phone}</p>
                                </Col>
                                <Col md={12}>
                                    <p className="text-muted mb-1">Delivery Address</p>
                                    <p className="fw-semibold">
                                        {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city},
                                        {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                                    </p>
                                </Col>
                            </Row>

                            {/* Order Items */}
                            <h6 className="border-bottom pb-2 mb-3">Order Items</h6>
                            <Table size="sm" className="mb-4">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Size</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items?.map((item, index) => {
                                        const itemPrice = item.discount
                                            ? item.price - (item.price * item.discount / 100)
                                            : item.price;
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <img
                                                            src={item.imageUrl || 'https://via.placeholder.com/40'}
                                                            alt={item.name}
                                                            style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                                        />
                                                        <span>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td>{item.size}</td>
                                                <td>{item.quantity}</td>
                                                <td>₹{itemPrice.toFixed(0)}</td>
                                                <td className="fw-semibold">₹{(itemPrice * item.quantity).toFixed(0)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={4} className="text-end fw-semibold">Grand Total:</td>
                                        <td className="fw-bold text-primary">₹{selectedOrder.totalAmount?.toFixed(0)}</td>
                                    </tr>
                                </tfoot>
                            </Table>

                            {selectedOrder.transactionId && (
                                <p className="text-muted small">
                                    Transaction ID: {selectedOrder.transactionId}
                                </p>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-success"
                        onClick={() => handleDownloadInvoice(selectedOrder?.billNo)}
                    >
                        <FiDownload className="me-2" /> Download Invoice
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AdminOrders;
