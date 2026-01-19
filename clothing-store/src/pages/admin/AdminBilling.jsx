// Admin Billing Page - Invoice and billing management
import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FiFileText, FiDownload, FiPrinter, FiSearch, FiCalendar } from 'react-icons/fi';
import { getAllBills, getBillsByDateRange } from '../../services/billingService';
import { downloadInvoice, printInvoice } from '../../utils/invoiceGenerator';
import { toast } from 'react-toastify';

const AdminBilling = () => {
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });
    const [paymentFilter, setPaymentFilter] = useState('');

    useEffect(() => {
        loadBills();
    }, []);

    useEffect(() => {
        filterBills();
    }, [bills, dateRange, paymentFilter]);

    const loadBills = async () => {
        try {
            setLoading(true);
            const data = await getAllBills();
            setBills(data);
        } catch (error) {
            console.error('Error loading bills:', error);
            toast.error('Error loading bills');
        } finally {
            setLoading(false);
        }
    };

    const filterBills = () => {
        let filtered = [...bills];

        if (dateRange.start && dateRange.end) {
            const start = new Date(dateRange.start);
            const end = new Date(dateRange.end);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(b => {
                const billDate = new Date(b.createdAt);
                return billDate >= start && billDate <= end;
            });
        }

        if (paymentFilter) {
            filtered = filtered.filter(b => b.paymentMethod === paymentFilter);
        }

        setFilteredBills(filtered);
    };

    const handleDownload = (bill) => {
        try {
            downloadInvoice(bill);
            toast.success('Invoice downloaded');
        } catch (error) {
            toast.error('Error downloading invoice');
        }
    };

    const handlePrint = (bill) => {
        try {
            printInvoice(bill);
        } catch (error) {
            toast.error('Error printing invoice');
        }
    };

    const openBillDetails = (bill) => {
        setSelectedBill(bill);
        setShowModal(true);
    };

    const totalRevenue = filteredBills.reduce((acc, bill) => acc + bill.grandTotal, 0);
    const paidAmount = filteredBills
        .filter(b => b.paymentStatus === 'Paid')
        .reduce((acc, bill) => acc + bill.grandTotal, 0);
    const pendingAmount = filteredBills
        .filter(b => b.paymentStatus === 'Pending')
        .reduce((acc, bill) => acc + bill.grandTotal, 0);

    return (
        <>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">Billing & Invoices</h5>
                    <p className="text-muted mb-0">{bills.length} invoices total</p>
                </div>
            </div>

            {/* Summary Cards */}
            <Row className="mb-4">
                <Col md={4} className="mb-3">
                    <Card className="bg-primary text-white shadow-sm">
                        <Card.Body>
                            <p className="mb-1 opacity-75">Total Revenue</p>
                            <h3 className="mb-0">₹{totalRevenue.toLocaleString()}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="bg-success text-white shadow-sm">
                        <Card.Body>
                            <p className="mb-1 opacity-75">Paid Amount</p>
                            <h3 className="mb-0">₹{paidAmount.toLocaleString()}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="bg-warning text-dark shadow-sm">
                        <Card.Body>
                            <p className="mb-1 opacity-75">Pending Amount</p>
                            <h3 className="mb-0">₹{pendingAmount.toLocaleString()}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={3} className="mb-3 mb-md-0">
                            <Form.Label className="small">From Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            />
                        </Col>
                        <Col md={3} className="mb-3 mb-md-0">
                            <Form.Label className="small">To Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            />
                        </Col>
                        <Col md={3} className="mb-3 mb-md-0">
                            <Form.Label className="small">Payment Method</Form.Label>
                            <Form.Select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                            >
                                <option value="">All Methods</option>
                                <option value="COD">Cash on Delivery</option>
                                <option value="Online">Online Payment</option>
                            </Form.Select>
                        </Col>
                        <Col md={3} className="text-end">
                            <br />
                            <span className="text-muted">
                                Showing {filteredBills.length} of {bills.length} bills
                            </span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Bills Table */}
            <Card className="shadow-sm">
                <div className="table-responsive">
                    <Table className="data-table mb-0">
                        <thead>
                            <tr>
                                <th>Bill No</th>
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
                                    <td colSpan={8} className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBills.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-5">
                                        <FiFileText size={40} className="text-muted mb-2" />
                                        <p className="text-muted mb-0">No bills found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredBills.map((bill) => (
                                    <tr key={bill.id}>
                                        <td className="fw-semibold text-primary">{bill.billNo}</td>
                                        <td>{bill.orderId}</td>
                                        <td>
                                            <span>{bill.customerName}</span>
                                            <br />
                                            <small className="text-muted">{bill.customerPhone}</small>
                                        </td>
                                        <td>
                                            {new Date(bill.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="fw-semibold">₹{bill.grandTotal.toFixed(0)}</td>
                                        <td>
                                            <Badge bg={bill.paymentMethod === 'Online' ? 'info' : 'secondary'}>
                                                {bill.paymentMethod}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={bill.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                                                {bill.paymentStatus}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => openBillDetails(bill)}
                                                    title="View"
                                                >
                                                    <FiFileText />
                                                </Button>
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={() => handleDownload(bill)}
                                                    title="Download"
                                                >
                                                    <FiDownload />
                                                </Button>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => handlePrint(bill)}
                                                    title="Print"
                                                >
                                                    <FiPrinter />
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

            {/* Bill Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Invoice - {selectedBill?.billNo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBill && (
                        <>
                            {/* Shop Info */}
                            <div className="text-center mb-4 pb-3 border-bottom">
                                <h4 className="text-primary mb-1">{selectedBill.shopName}</h4>
                                <p className="text-muted mb-0">{selectedBill.shopAddress}</p>
                                <p className="text-muted mb-0">Phone: {selectedBill.shopPhone}</p>
                                <p className="text-muted mb-0">GST: {selectedBill.shopGst}</p>
                            </div>

                            {/* Invoice Details */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <p className="text-muted mb-1">Bill Number</p>
                                    <p className="fw-semibold">{selectedBill.billNo}</p>
                                    <p className="text-muted mb-1">Order ID</p>
                                    <p className="fw-semibold">{selectedBill.orderId}</p>
                                </Col>
                                <Col md={6} className="text-md-end">
                                    <p className="text-muted mb-1">Date</p>
                                    <p className="fw-semibold">
                                        {new Date(selectedBill.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <Badge
                                        bg={selectedBill.paymentStatus === 'Paid' ? 'success' : 'warning'}
                                        className="px-3 py-2"
                                    >
                                        {selectedBill.paymentStatus}
                                    </Badge>
                                </Col>
                            </Row>

                            {/* Customer Info */}
                            <div className="bg-light rounded p-3 mb-4">
                                <h6 className="mb-2">Bill To:</h6>
                                <p className="mb-1 fw-semibold">{selectedBill.customerName}</p>
                                <p className="mb-1 text-muted">{selectedBill.customerPhone}</p>
                                <p className="mb-0 text-muted">
                                    {typeof selectedBill.customerAddress === 'object'
                                        ? `${selectedBill.customerAddress.street}, ${selectedBill.customerAddress.city}, ${selectedBill.customerAddress.state} - ${selectedBill.customerAddress.pincode}`
                                        : selectedBill.customerAddress
                                    }
                                </p>
                            </div>

                            {/* Items Table */}
                            <Table size="sm" className="mb-4">
                                <thead className="bg-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Item</th>
                                        <th>Size</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th className="text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBill.items?.map((item, index) => {
                                        const itemPrice = item.discount
                                            ? item.price - (item.price * item.discount / 100)
                                            : item.price;
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.size}</td>
                                                <td>₹{itemPrice.toFixed(0)}</td>
                                                <td>{item.quantity}</td>
                                                <td className="text-end">₹{(itemPrice * item.quantity).toFixed(0)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>

                            {/* Summary */}
                            <div className="border-top pt-3">
                                <Row>
                                    <Col md={6}>
                                        <p className="mb-1">
                                            <strong>Payment Method:</strong> {selectedBill.paymentMethod}
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <div className="text-md-end">
                                            <p className="mb-1">Subtotal: ₹{selectedBill.subtotal.toFixed(0)}</p>
                                            <p className="mb-1 text-success">Discount: -₹{selectedBill.discount.toFixed(0)}</p>
                                            <p className="mb-1">GST (5%): ₹{selectedBill.tax.toFixed(0)}</p>
                                            <hr />
                                            <h4 className="text-primary">Grand Total: ₹{selectedBill.grandTotal.toFixed(0)}</h4>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-success" onClick={() => handleDownload(selectedBill)}>
                        <FiDownload className="me-2" /> Download PDF
                    </Button>
                    <Button variant="outline-primary" onClick={() => handlePrint(selectedBill)}>
                        <FiPrinter className="me-2" /> Print
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AdminBilling;
