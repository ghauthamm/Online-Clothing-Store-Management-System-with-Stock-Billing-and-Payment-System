// Home Page - Landing page with hero section and featured products
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/products/ProductCard';
import { getFeaturedProducts } from '../services/productService';
import { useShop } from '../context/ShopContext';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { shopDetails } = useShop();

    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        try {
            const products = await getFeaturedProducts(8);
            setFeaturedProducts(products);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        {
            name: 'Men',
            image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500',
            count: '200+ Products'
        },
        {
            name: 'Women',
            image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
            count: '500+ Products'
        },
        {
            name: 'Kids',
            image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500',
            count: '150+ Products'
        },
        {
            name: 'Sarees',
            image: 'https://images.unsplash.com/photo-1610030469668-58a3ccf84c60?w=500',
            count: '300+ Products'
        }
    ];

    const features = [
        { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders above ₹999' },
        { icon: <FiShield />, title: 'Secure Payment', desc: '100% secure checkout' },
        { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '7 days return policy' },
        { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Dedicated support team' }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={7}>
                            <div className="hero-content">
                                <h1 className="hero-title animate-fadeInUp">
                                    Discover the Elegance of <span className="text-warning">Traditional Wear</span>
                                </h1>
                                <p className="hero-subtitle">
                                    Explore our exquisite collection of silks, sarees, and readymade garments.
                                    Experience the perfect blend of tradition and contemporary fashion at {shopDetails.name}.
                                </p>
                                <div className="hero-cta">
                                    <Link to="/products" className="btn btn-primary-custom btn-lg">
                                        Shop Now <FiArrowRight className="ms-2" />
                                    </Link>
                                    <Link to="/products?category=Sarees" className="btn btn-outline-custom btn-lg">
                                        Explore Sarees
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Features Section */}
            <section className="py-5 bg-white">
                <Container>
                    <Row>
                        {features.map((feature, index) => (
                            <Col md={3} sm={6} key={index} className="mb-4 mb-md-0">
                                <div className="feature-card animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h5 className="feature-title">{feature.title}</h5>
                                    <p className="feature-desc">{feature.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Categories Section */}
            <section className="py-5">
                <Container>
                    <div className="section-header">
                        <h2 className="section-title">Shop by Category</h2>
                        <p className="section-subtitle">
                            Browse our wide range of traditional and modern clothing for the entire family
                        </p>
                    </div>
                    <Row>
                        {categories.map((category, index) => (
                            <Col lg={3} md={6} key={index} className="mb-4">
                                <Link to={`/products?category=${category.name}`} className="text-decoration-none">
                                    <div className="category-card animate-scaleIn" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <img src={category.image} alt={category.name} />
                                        <div className="category-overlay">
                                            <h3 className="category-title">{category.name}</h3>
                                            <p className="category-count">{category.count}</p>
                                        </div>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Featured Products Section */}
            <section className="py-5 bg-white">
                <Container>
                    <div className="section-header">
                        <h2 className="section-title">Featured Products</h2>
                        <p className="section-subtitle">
                            Handpicked collections from our finest range
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <Row>
                            {featuredProducts.map((product, index) => (
                                <Col lg={3} md={4} sm={6} key={product.id} className="mb-4">
                                    <div className="animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <ProductCard product={product} />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-muted">No products available yet. Check back soon!</p>
                        </div>
                    )}

                    <div className="text-center mt-4">
                        <Link to="/products" className="btn btn-primary-custom btn-lg">
                            View All Products <FiArrowRight className="ms-2" />
                        </Link>
                    </div>
                </Container>
            </section>

            {/* Newsletter Section */}
            <section className="py-5" style={{ background: 'var(--primary-gradient)' }}>
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={6}>
                            <h2 className="text-white mb-3">Subscribe to Our Newsletter</h2>
                            <p className="text-white opacity-75 mb-4">
                                Get exclusive offers, new arrivals updates, and special discounts directly in your inbox
                            </p>
                            <div className="d-flex gap-2 justify-content-center flex-wrap">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    style={{ maxWidth: '300px', borderRadius: 'var(--radius-xl)' }}
                                />
                                <Button className="btn-gold">Subscribe</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* About Section */}
            <section className="py-5 bg-white">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <img
                                src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600"
                                alt="About Us"
                                className="img-fluid rounded-4 shadow-lg"
                            />
                        </Col>
                        <Col lg={6}>
                            <h2 className="section-title text-start mb-4">About {shopDetails.name}</h2>
                            <p className="text-muted mb-4">
                                Established in 1990, {shopDetails.name} has been serving customers with the finest
                                traditional and contemporary clothing. Located in the heart of Viluppuram, we take
                                pride in offering authentic silks, elegant sarees, and quality readymade garments
                                for men, women, and kids.
                            </p>
                            <p className="text-muted mb-4">
                                Our commitment to quality and customer satisfaction has made us a trusted name in
                                traditional clothing. We source our fabrics from the best weavers across Tamil Nadu
                                and ensure every piece meets our high standards.
                            </p>
                            <Link to="/about" className="btn btn-primary-custom">
                                Learn More About Us
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default HomePage;
