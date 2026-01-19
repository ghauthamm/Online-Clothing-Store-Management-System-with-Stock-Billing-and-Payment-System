// Contact Page
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiInstagram, FiTwitter, FiSend } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { toast } from 'react-toastify';

const ContactPage = () => {
    const { shopDetails } = useShop();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            toast.success('Thank you for your message! We will get back to you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setLoading(false);
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="contact-page py-5">
            {/* Hero Section */}
            <section className="py-5 text-center" style={{ background: 'var(--primary-gradient)' }}>
                <Container>
                    <h1 className="display-4 text-white mb-3">Contact Us</h1>
                    <p className="lead text-white opacity-75">
                        We'd love to hear from you
                    </p>
                </Container>
            </section>

            <section className="py-5">
                <Container>
                    <Row>
                        {/* Contact Info */}
                        <Col lg={4} className="mb-4 mb-lg-0">
                            <h4 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Get in Touch
                            </h4>
                            <p className="text-muted mb-4">
                                Have questions about our products or services? We're here to help!
                            </p>

                            <Card className="border-0 shadow-sm mb-3">
                                <Card.Body className="d-flex gap-3">
                                    <div className="p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
                                        <FiMapPin size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1">Address</h6>
                                        <p className="text-muted mb-0 small">{shopDetails.address}</p>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm mb-3">
                                <Card.Body className="d-flex gap-3">
                                    <div className="p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
                                        <FiPhone size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1">Phone</h6>
                                        <p className="text-muted mb-0 small">{shopDetails.phone}</p>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm mb-3">
                                <Card.Body className="d-flex gap-3">
                                    <div className="p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
                                        <FiMail size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1">Email</h6>
                                        <p className="text-muted mb-0 small">{shopDetails.email}</p>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body className="d-flex gap-3">
                                    <div className="p-3 rounded" style={{ background: 'var(--bg-secondary)' }}>
                                        <FiClock size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1">Working Hours</h6>
                                        <p className="text-muted mb-0 small">{shopDetails.workingHours}</p>
                                        <p className="text-muted mb-0 small">Open all days</p>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Social Links */}
                            <h6 className="mb-3">Follow Us</h6>
                            <div className="d-flex gap-2">
                                <a
                                    href={shopDetails.socialMedia.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary rounded-circle p-2"
                                >
                                    <FiFacebook size={20} />
                                </a>
                                <a
                                    href={shopDetails.socialMedia.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-danger rounded-circle p-2"
                                >
                                    <FiInstagram size={20} />
                                </a>
                                <a
                                    href={shopDetails.socialMedia.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-info rounded-circle p-2"
                                >
                                    <FiTwitter size={20} />
                                </a>
                            </div>
                        </Col>

                        {/* Contact Form */}
                        <Col lg={8}>
                            <Card className="border-0 shadow-lg">
                                <Card.Body className="p-4 p-lg-5">
                                    <h4 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                                        Send us a Message
                                    </h4>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Your Name *</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="Enter your name"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email Address *</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="Enter your email"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Phone Number</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="Enter your phone"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Subject *</Form.Label>
                                                    <Form.Select
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">Select subject</option>
                                                        <option value="general">General Inquiry</option>
                                                        <option value="product">Product Inquiry</option>
                                                        <option value="order">Order Status</option>
                                                        <option value="support">Customer Support</option>
                                                        <option value="feedback">Feedback</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Message *</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Write your message here..."
                                                required
                                            />
                                        </Form.Group>
                                        <Button
                                            type="submit"
                                            className="btn-primary-custom btn-lg"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <FiSend className="me-2" /> Send Message
                                                </>
                                            )}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Map Section */}
            <section className="pb-5">
                <Container>
                    <div className="rounded-4 overflow-hidden shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.0!2d79.49!3d11.94!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDU2JzI0LjAiTiA3OcKwMjknMjQuMCJF!5e0!3m2!1sen!2sin!4v1609459200000!5m2!1sen!2sin"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Store Location"
                        ></iframe>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default ContactPage;
