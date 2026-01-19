// Admin Reports Page - Sales reports and analytics
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Table, Button } from 'react-bootstrap';
import { FiCalendar, FiDollarSign, FiShoppingCart, FiTrendingUp, FiDownload } from 'react-icons/fi';
import { getAllBills, getDailySales, getMonthlySales } from '../../services/billingService';
import { getAllOrders } from '../../services/orderService';
import { toast } from 'react-toastify';

const AdminReports = () => {
    const [reportType, setReportType] = useState('daily');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [dailyReport, setDailyReport] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadReports();
    }, [reportType, selectedDate, selectedMonth, selectedYear]);

    const loadReports = async () => {
        setLoading(true);
        try {
            if (reportType === 'daily') {
                const report = await getDailySales(new Date(selectedDate));
                setDailyReport(report);
            } else {
                const report = await getMonthlySales(selectedYear, selectedMonth);
                setMonthlyReport(report);
            }

            const allOrders = await getAllOrders();
            setOrders(allOrders);
        } catch (error) {
            console.error('Error loading reports:', error);
            toast.error('Error loading reports');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredOrders = () => {
        if (reportType === 'daily') {
            const date = new Date(selectedDate);
            return orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.toDateString() === date.toDateString();
            });
        } else {
            return orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getMonth() === selectedMonth && orderDate.getFullYear() === selectedYear;
            });
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    const currentReport = reportType === 'daily' ? dailyReport : monthlyReport;
    const filteredOrders = getFilteredOrders();

    return (
        <>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">Sales Reports</h5>
                    <p className="text-muted mb-0">View detailed sales analytics</p>
                </div>
                <Button variant="outline-primary">
                    <FiDownload className="me-2" /> Export Report
                </Button>
            </div>

            {/* Report Type Selection */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small">Report Type</Form.Label>
                                <Form.Select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                >
                                    <option value="daily">Daily Report</option>
                                    <option value="monthly">Monthly Report</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        {reportType === 'daily' ? (
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="small">Select Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        ) : (
                            <>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="small">Month</Form.Label>
                                        <Form.Select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        >
                                            {months.map((month, index) => (
                                                <option key={index} value={index}>{month}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="small">Year</Form.Label>
                                        <Form.Select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        >
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </>
                        )}
                    </Row>
                </Card.Body>
            </Card>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <Row className="mb-4">
                        <Col md={3} className="mb-3">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="text-center">
                                    <FiShoppingCart size={30} className="text-primary mb-2" />
                                    <h3 className="mb-1">{currentReport?.totalBills || 0}</h3>
                                    <p className="text-muted mb-0">Total Orders</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="text-center">
                                    <FiDollarSign size={30} className="text-success mb-2" />
                                    <h3 className="mb-1">₹{(currentReport?.totalAmount || 0).toLocaleString()}</h3>
                                    <p className="text-muted mb-0">Total Revenue</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Card className="shadow-sm h-100 bg-success text-white">
                                <Card.Body className="text-center">
                                    <FiTrendingUp size={30} className="mb-2" />
                                    <h3 className="mb-1">₹{(currentReport?.paidAmount || currentReport?.onlineAmount || 0).toLocaleString()}</h3>
                                    <p className="mb-0 opacity-75">{reportType === 'daily' ? 'Paid' : 'Online'} Amount</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Card className="shadow-sm h-100 bg-warning text-dark">
                                <Card.Body className="text-center">
                                    <FiCalendar size={30} className="mb-2" />
                                    <h3 className="mb-1">₹{(currentReport?.pendingAmount || currentReport?.codAmount || 0).toLocaleString()}</h3>
                                    <p className="mb-0 opacity-75">{reportType === 'daily' ? 'Pending' : 'COD'} Amount</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Orders List */}
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white py-3">
                            <h5 className="mb-0">
                                Orders for {reportType === 'daily'
                                    ? new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : `${months[selectedMonth]} ${selectedYear}`
                                }
                            </h5>
                        </Card.Header>
                        <div className="table-responsive">
                            <Table className="data-table mb-0">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Payment Method</th>
                                        <th>Status</th>
                                        <th className="text-end">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-5">
                                                <p className="text-muted mb-0">No orders found for this period</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="fw-semibold text-primary">{order.orderId}</td>
                                                <td>{order.shippingAddress?.name || 'N/A'}</td>
                                                <td>
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td>
                                                    <span className={`badge ${order.paymentMethod === 'Online' ? 'bg-info' : 'bg-secondary'}`}>
                                                        {order.paymentMethod}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="text-end fw-semibold">₹{order.totalAmount?.toFixed(0)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                {filteredOrders.length > 0 && (
                                    <tfoot>
                                        <tr className="bg-light">
                                            <td colSpan={5} className="text-end fw-bold">Total:</td>
                                            <td className="text-end fw-bold text-primary">
                                                ₹{filteredOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </Table>
                        </div>
                    </Card>
                </>
            )}
        </>
    );
};

export default AdminReports;
