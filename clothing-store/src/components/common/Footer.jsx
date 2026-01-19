// Footer Component - Site footer with shop details
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import {
    FiFacebook, FiInstagram, FiTwitter,
    FiPhone, FiMail, FiMapPin, FiClock,
    FiChevronRight
} from 'react-icons/fi';
import { useShop } from '../../context/ShopContext';

const Footer = () => {
    const { shopDetails } = useShop();

    return (
        <footer className="footer">
            <Container>
                <Row>
                    {/* Brand Section */}
                    <Col lg={4} md={6} className="mb-4">
                        <div className="footer-brand">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="brand-logo">S</div>
                                <div>
                                    <h4 className="brand-name mb-0">{shopDetails.name}</h4>
                                    <small style={{ color: 'rgba(255,255,255,0.6)' }}>Since 1990</small>
                                </div>
                            </div>
                        </div>
                        <p className="footer-desc">
                            {shopDetails.tagline}. We offer the finest collection of traditional silks,
                            sarees, and readymade garments for men, women, and kids. Experience the
                            perfect blend of tradition and modern fashion.
                        </p>
                        <div className="footer-social">
                            <a href={shopDetails.socialMedia.facebook} className="social-link" target="_blank" rel="noopener noreferrer">
                                <FiFacebook />
                            </a>
                            <a href={shopDetails.socialMedia.instagram} className="social-link" target="_blank" rel="noopener noreferrer">
                                <FiInstagram />
                            </a>
                            <a href={shopDetails.socialMedia.twitter} className="social-link" target="_blank" rel="noopener noreferrer">
                                <FiTwitter />
                            </a>
                        </div>
                    </Col>

                    {/* Quick Links */}
                    <Col lg={2} md={6} className="mb-4">
                        <h5 className="footer-title">Quick Links</h5>
                        <ul className="footer-links">
                            <li><Link to="/"><FiChevronRight /> Home</Link></li>
                            <li><Link to="/products"><FiChevronRight /> All Products</Link></li>
                            <li><Link to="/about"><FiChevronRight /> About Us</Link></li>
                            <li><Link to="/contact"><FiChevronRight /> Contact</Link></li>
                            <li><Link to="/orders"><FiChevronRight /> Track Order</Link></li>
                        </ul>
                    </Col>

                    {/* Categories */}
                    <Col lg={2} md={6} className="mb-4">
                        <h5 className="footer-title">Categories</h5>
                        <ul className="footer-links">
                            <li><Link to="/products?category=Men"><FiChevronRight /> Men</Link></li>
                            <li><Link to="/products?category=Women"><FiChevronRight /> Women</Link></li>
                            <li><Link to="/products?category=Kids"><FiChevronRight /> Kids</Link></li>
                            <li><Link to="/products?category=Sarees"><FiChevronRight /> Sarees</Link></li>
                            <li><Link to="/products?category=Silks"><FiChevronRight /> Silks</Link></li>
                        </ul>
                    </Col>

                    {/* Contact Info */}
                    <Col lg={4} md={6} className="mb-4">
                        <h5 className="footer-title">Contact Us</h5>
                        <div className="footer-contact-item">
                            <FiMapPin />
                            <span>{shopDetails.address}</span>
                        </div>
                        <div className="footer-contact-item">
                            <FiPhone />
                            <span>{shopDetails.phone}</span>
                        </div>
                        <div className="footer-contact-item">
                            <FiMail />
                            <span>{shopDetails.email}</span>
                        </div>
                        <div className="footer-contact-item">
                            <FiClock />
                            <span>{shopDetails.workingHours}</span>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <Container>
                    <div className="footer-bottom-content">
                        <p>&copy; {new Date().getFullYear()} {shopDetails.name}. All Rights Reserved.</p>
                        <div className="d-flex gap-4">
                            <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy Policy</Link>
                            <Link to="/terms" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Terms & Conditions</Link>
                        </div>
                    </div>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;
