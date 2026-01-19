// Checkout Page - Address selection and payment
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import { FiMapPin, FiPlus, FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/orderService';
import { addUserAddress, getUserById } from '../../services/userService';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { currentUser, userData } = useAuth();

    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: 'Tamil Nadu',
        pincode: ''
    });

    const shippingCharge = cartTotal >= 999 ? 0 : 99;
    const tax = cartTotal * 0.05;
    const grandTotal = cartTotal + shippingCharge + tax;

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (cartItems.length === 0) {
            navigate('/cart');
            return;
        }
        loadAddresses();
    }, [currentUser, cartItems]);

    const loadAddresses = async () => {
        try {
            const user = await getUserById(currentUser.uid);
            if (user?.address) {
                setAddresses(user.address);
                if (user.address.length > 0) {
                    setSelectedAddress(user.address[0]);
                }
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    };

    const handleAddAddress = async () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.pincode) {
            toast.error('Please fill all address fields');
            return;
        }

        try {
            await addUserAddress(currentUser.uid, newAddress);
            toast.success('Address added successfully');
            setShowAddressModal(false);
            setNewAddress({
                name: '',
                phone: '',
                street: '',
                city: '',
                state: 'Tamil Nadu',
                pincode: ''
            });
            loadAddresses();
        } catch (error) {
            toast.error('Error adding address');
        }
    };

    const simulateOnlinePayment = () => {
        return new Promise((resolve) => {
            setShowPaymentModal(true);
            // Simulate payment processing
            setTimeout(() => {
                setShowPaymentModal(false);
                resolve(true);
            }, 3000);
        });
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        setLoading(true);

        try {
            // If online payment, simulate payment
            if (paymentMethod === 'Online') {
                await simulateOnlinePayment();
            }

            // Create order
            const order = await createOrder(
                currentUser.uid,
                cartItems,
                selectedAddress,
                paymentMethod,
                grandTotal,
                userData
            );

            // Clear cart
            clearCart();

            // Navigate to success page
            navigate('/order-success', { state: { order } });
            toast.success('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Error placing order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page py-5">
            <Container>
                <h1 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Checkout</h1>

                <Row>
                    {/* Left Column - Address & Payment */}
                    <Col lg={8}>
                        {/* Delivery Address */}
                        <Card className="mb-4 shadow-sm">
                            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <FiMapPin className="me-2" /> Delivery Address
                                </h5>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => setShowAddressModal(true)}
                                >
                                    <FiPlus className="me-1" /> Add New
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {addresses.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-muted mb-3">No saved addresses</p>
                                        <Button
                                            className="btn-primary-custom"
                                            onClick={() => setShowAddressModal(true)}
                                        >
                                            Add Address
                                        </Button>
                                    </div>
                                ) : (
                                    <Row>
                                        {addresses.map((address, index) => (
                                            <Col md={6} key={address.id || index} className="mb-3">
                                                <div
                                                    className={`border rounded-3 p-3 cursor-pointer ${selectedAddress?.id === address.id ? 'border-primary bg-light' : ''}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setSelectedAddress(address)}
                                                >
                                                    <div className="d-flex justify-content-between">
                                                        <strong>{address.name}</strong>
                                                        {selectedAddress?.id === address.id && (
                                                            <FiCheck className="text-primary" />
                                                        )}
                                                    </div>
                                                    <p className="mb-1 small text-muted">{address.phone}</p>
                                                    <p className="mb-0 small">
                                                        {address.street}, {address.city}, {address.state} - {address.pincode}
                                                    </p>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Payment Method */}
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white py-3">
                                <h5 className="mb-0">
                                    <FiCreditCard className="me-2" /> Payment Method
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6} className="mb-3 mb-md-0">
                                        <div
                                            className={`border rounded-3 p-4 text-center cursor-pointer ${paymentMethod === 'COD' ? 'border-primary bg-light' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setPaymentMethod('COD')}
                                        >
                                            <FiTruck size={40} className={paymentMethod === 'COD' ? 'text-primary' : 'text-muted'} />
                                            <h6 className="mt-3 mb-1">Cash on Delivery</h6>
                                            <small className="text-muted">Pay when you receive</small>
                                            {paymentMethod === 'COD' && (
                                                <div className="mt-2">
                                                    <FiCheck className="text-success" /> Selected
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div
                                            className={`border rounded-3 p-4 text-center cursor-pointer ${paymentMethod === 'Online' ? 'border-primary bg-light' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setPaymentMethod('Online')}
                                        >
                                            <FiCreditCard size={40} className={paymentMethod === 'Online' ? 'text-primary' : 'text-muted'} />
                                            <h6 className="mt-3 mb-1">Online Payment</h6>
                                            <small className="text-muted">Card / UPI / Net Banking</small>
                                            {paymentMethod === 'Online' && (
                                                <div className="mt-2">
                                                    <FiCheck className="text-success" /> Selected
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Right Column - Order Summary */}
                    <Col lg={4}>
                        <div className="cart-summary">
                            <h4 className="cart-summary-title">Order Summary</h4>

                            {/* Items List */}
                            <div className="mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {cartItems.map((item, index) => {
                                    const itemPrice = item.discount
                                        ? item.price - (item.price * item.discount / 100)
                                        : item.price;
                                    return (
                                        <div key={index} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                                            <img
                                                src={item.imageUrl || 'https://via.placeholder.com/60'}
                                                alt={item.name}
                                                style={{ width: '60px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                            <div className="flex-grow-1">
                                                <p className="mb-0 fw-semibold" style={{ fontSize: '0.9rem' }}>{item.name}</p>
                                                <small className="text-muted">Size: {item.size} × {item.quantity}</small>
                                            </div>
                                            <span className="fw-semibold">₹{(itemPrice * item.quantity).toFixed(0)}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="cart-summary-row">
                                <span>Subtotal</span>
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

                            <div className="cart-summary-total">
                                <span>Grand Total</span>
                                <span>₹{grandTotal.toFixed(0)}</span>
                            </div>

                            <Button
                                className="btn-primary-custom w-100 mt-4"
                                size="lg"
                                onClick={handlePlaceOrder}
                                disabled={loading || !selectedAddress}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>Place Order</>
                                )}
                            </Button>

                            <p className="text-center text-muted small mt-3">
                                By placing this order, you agree to our Terms & Conditions
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Add Address Modal */}
                <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Address</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newAddress.name}
                                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                            placeholder="Enter full name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            placeholder="Enter phone number"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Street Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={newAddress.street}
                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                    placeholder="House No, Building, Street, Area"
                                />
                            </Form.Group>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                            placeholder="City"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>PIN Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newAddress.pincode}
                                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                            placeholder="PIN Code"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
                            Cancel
                        </Button>
                        <Button className="btn-primary-custom" onClick={handleAddAddress}>
                            Save Address
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Payment Processing Modal */}
                <Modal show={showPaymentModal} centered backdrop="static">
                    <Modal.Body className="text-center py-5">
                        <div className="spinner-border text-primary mb-4" role="status" style={{ width: '60px', height: '60px' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h4>Processing Payment</h4>
                        <p className="text-muted">Please wait while we process your payment...</p>
                        <p className="small text-muted">(Demo - No real transaction)</p>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default CheckoutPage;
