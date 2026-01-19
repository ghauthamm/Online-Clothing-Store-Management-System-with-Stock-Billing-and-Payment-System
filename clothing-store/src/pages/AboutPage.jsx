// About Page
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FiAward, FiHeart, FiUsers, FiTruck } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';

const AboutPage = () => {
    const { shopDetails } = useShop();

    return (
        <div className="about-page py-5">
            {/* Hero Section */}
            <section className="py-5 text-center" style={{ background: 'var(--primary-gradient)' }}>
                <Container>
                    <h1 className="display-4 text-white mb-3">About Us</h1>
                    <p className="lead text-white opacity-75">
                        Crafting Elegance Since 1990
                    </p>
                </Container>
            </section>

            {/* Story Section */}
            <section className="py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <img
                                src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600"
                                alt="Our Store"
                                className="img-fluid rounded-4 shadow-lg"
                            />
                        </Col>
                        <Col lg={6}>
                            <h2 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Our Story
                            </h2>
                            <p className="text-muted mb-4">
                                Founded in 1990, <strong>{shopDetails.name}</strong> began as a small family-owned
                                shop in Viluppuram with a vision to bring the finest traditional clothing to our
                                community. Over three decades, we have grown into a trusted destination for
                                exquisite silks, sarees, and readymade garments.
                            </p>
                            <p className="text-muted mb-4">
                                Our founder believed that traditional clothing is not just attire—it's an art form
                                that connects us to our heritage. This belief continues to guide us as we carefully
                                curate collections that honor tradition while embracing contemporary styles.
                            </p>
                            <p className="text-muted">
                                Today, we serve customers across Tamil Nadu and beyond, offering premium quality
                                products for men, women, and children. Every piece in our collection is chosen
                                with care, ensuring our customers receive nothing but the best.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Values Section */}
            <section className="py-5 bg-white">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title">Our Values</h2>
                        <p className="section-subtitle">What we stand for</p>
                    </div>
                    <Row>
                        <Col md={3} sm={6} className="mb-4">
                            <Card className="feature-card h-100 text-center">
                                <Card.Body>
                                    <div className="feature-icon mx-auto">
                                        <FiAward />
                                    </div>
                                    <h5 className="feature-title">Quality</h5>
                                    <p className="feature-desc">
                                        We source only the finest fabrics and ensure every product meets our high standards.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} className="mb-4">
                            <Card className="feature-card h-100 text-center">
                                <Card.Body>
                                    <div className="feature-icon mx-auto">
                                        <FiHeart />
                                    </div>
                                    <h5 className="feature-title">Tradition</h5>
                                    <p className="feature-desc">
                                        We celebrate and preserve traditional craftsmanship in every piece we offer.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} className="mb-4">
                            <Card className="feature-card h-100 text-center">
                                <Card.Body>
                                    <div className="feature-icon mx-auto">
                                        <FiUsers />
                                    </div>
                                    <h5 className="feature-title">Customer First</h5>
                                    <p className="feature-desc">
                                        Your satisfaction is our priority. We go above and beyond to serve you better.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6} className="mb-4">
                            <Card className="feature-card h-100 text-center">
                                <Card.Body>
                                    <div className="feature-icon mx-auto">
                                        <FiTruck />
                                    </div>
                                    <h5 className="feature-title">Trust</h5>
                                    <p className="feature-desc">
                                        Three decades of service have built lasting relationships with our customers.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-5" style={{ background: 'var(--primary-gradient)' }}>
                <Container>
                    <Row className="text-center text-white">
                        <Col md={3} sm={6} className="mb-4 mb-md-0">
                            <h2 className="display-4 fw-bold">30+</h2>
                            <p className="opacity-75">Years of Service</p>
                        </Col>
                        <Col md={3} sm={6} className="mb-4 mb-md-0">
                            <h2 className="display-4 fw-bold">50K+</h2>
                            <p className="opacity-75">Happy Customers</p>
                        </Col>
                        <Col md={3} sm={6} className="mb-4 mb-md-0">
                            <h2 className="display-4 fw-bold">5K+</h2>
                            <p className="opacity-75">Products</p>
                        </Col>
                        <Col md={3} sm={6}>
                            <h2 className="display-4 fw-bold">100+</h2>
                            <p className="opacity-75">Weavers Network</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Location Section */}
            <section className="py-5 bg-white">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <h2 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Visit Our Store
                            </h2>
                            <p className="text-muted mb-4">
                                We invite you to experience the elegance of our collection in person.
                                Our showroom in Viluppuram offers a wide range of traditional and modern
                                clothing for the entire family.
                            </p>
                            <div className="mb-3">
                                <h6 className="mb-1">Address</h6>
                                <p className="text-muted">{shopDetails.address}</p>
                            </div>
                            <div className="mb-3">
                                <h6 className="mb-1">Phone</h6>
                                <p className="text-muted">{shopDetails.phone}</p>
                            </div>
                            <div className="mb-3">
                                <h6 className="mb-1">Working Hours</h6>
                                <p className="text-muted">{shopDetails.workingHours}</p>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="rounded-4 overflow-hidden shadow-lg">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.0!2d79.49!3d11.94!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDU2JzI0LjAiTiA3OcKwMjknMjQuMCJF!5e0!3m2!1sen!2sin!4v1609459200000!5m2!1sen!2sin"
                                    width="100%"
                                    height="350"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Store Location"
                                ></iframe>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default AboutPage;
