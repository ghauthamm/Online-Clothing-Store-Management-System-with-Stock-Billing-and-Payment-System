// Product Details Page - Single product view
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Breadcrumb, Tab, Tabs } from 'react-bootstrap';
import { FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw, FiMinus, FiPlus } from 'react-icons/fi';
import { getProductById } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { currentUser } = useAuth();

    const sizes = ['S', 'M', 'L', 'XL'];

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await getProductById(id);
            if (data) {
                setProduct(data);
            } else {
                navigate('/products');
                toast.error('Product not found');
            }
        } catch (error) {
            console.error('Error loading product:', error);
            toast.error('Error loading product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!currentUser) {
            toast.warning('Please login to add items to cart');
            navigate('/login');
            return;
        }

        if (!selectedSize) {
            toast.warning('Please select a size');
            return;
        }

        if (product.sizes[selectedSize] < quantity) {
            toast.error(`Only ${product.sizes[selectedSize]} items available in this size`);
            return;
        }

        addToCart(product, selectedSize, quantity);
        toast.success(`${product.name} added to cart!`);
    };

    const handleBuyNow = () => {
        if (!currentUser) {
            toast.warning('Please login to continue');
            navigate('/login');
            return;
        }

        if (!selectedSize) {
            toast.warning('Please select a size');
            return;
        }

        addToCart(product, selectedSize, quantity);
        navigate('/checkout');
    };

    const getSizeStock = (size) => {
        return product?.sizes?.[size] || 0;
    };

    const discountedPrice = product?.discount
        ? product.price - (product.price * product.discount / 100)
        : product?.price || 0;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="product-details-page py-5">
            <Container>
                {/* Breadcrumb */}
                <Breadcrumb className="mb-4">
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/products' }}>Products</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/products?category=${product.category}` }}>
                        {product.category}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
                </Breadcrumb>

                <Row>
                    {/* Product Image */}
                    <Col lg={6} className="mb-4">
                        <div className="position-relative">
                            <img
                                src={product.imageUrl || 'https://via.placeholder.com/600x800?text=No+Image'}
                                alt={product.name}
                                className="img-fluid rounded-4 shadow-lg"
                                style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }}
                            />
                            {product.discount > 0 && (
                                <Badge
                                    bg="danger"
                                    className="position-absolute"
                                    style={{ top: '20px', left: '20px', fontSize: '1rem', padding: '10px 20px' }}
                                >
                                    {product.discount}% OFF
                                </Badge>
                            )}
                            {product.totalStock === 0 && (
                                <Badge
                                    bg="secondary"
                                    className="position-absolute"
                                    style={{ top: '20px', left: '20px', fontSize: '1rem', padding: '10px 20px' }}
                                >
                                    Out of Stock
                                </Badge>
                            )}
                        </div>
                    </Col>

                    {/* Product Info */}
                    <Col lg={6}>
                        <div className="product-details-info">
                            <span className="text-muted text-uppercase" style={{ letterSpacing: '2px', fontSize: '0.85rem' }}>
                                {product.category}
                            </span>
                            <h1 className="mt-2 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {product.name}
                            </h1>

                            {product.fabric && (
                                <p className="text-muted mb-3">Fabric: {product.fabric}</p>
                            )}

                            {/* Price */}
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                                    ₹{discountedPrice.toFixed(0)}
                                </span>
                                {product.discount > 0 && (
                                    <>
                                        <span className="text-muted text-decoration-line-through" style={{ fontSize: '1.3rem' }}>
                                            ₹{product.price.toFixed(0)}
                                        </span>
                                        <Badge bg="success" style={{ fontSize: '0.9rem' }}>
                                            Save ₹{(product.price - discountedPrice).toFixed(0)}
                                        </Badge>
                                    </>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="mb-4">
                                {product.totalStock > 0 ? (
                                    product.totalStock <= 5 ? (
                                        <Badge bg="warning" text="dark">Only {product.totalStock} left in stock!</Badge>
                                    ) : (
                                        <Badge bg="success">In Stock</Badge>
                                    )
                                ) : (
                                    <Badge bg="danger">Out of Stock</Badge>
                                )}
                            </div>

                            {/* Size Selection */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Select Size:</label>
                                <div className="d-flex gap-2 flex-wrap">
                                    {sizes.map(size => {
                                        const stock = getSizeStock(size);
                                        return (
                                            <button
                                                key={size}
                                                className={`btn ${selectedSize === size ? 'btn-primary' : 'btn-outline-primary'} ${stock === 0 ? 'disabled' : ''}`}
                                                style={{ minWidth: '60px', padding: '12px' }}
                                                onClick={() => stock > 0 && setSelectedSize(size)}
                                                disabled={stock === 0}
                                            >
                                                {size}
                                                {stock === 0 && <small className="d-block" style={{ fontSize: '0.65rem' }}>Sold Out</small>}
                                                {stock > 0 && stock <= 3 && <small className="d-block" style={{ fontSize: '0.65rem' }}>{stock} left</small>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Quantity:</label>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="quantity-control">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            <FiMinus />
                                        </button>
                                        <span className="quantity-value">{quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => setQuantity(Math.min(getSizeStock(selectedSize) || 10, quantity + 1))}
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>
                                    {selectedSize && (
                                        <small className="text-muted">{getSizeStock(selectedSize)} available</small>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-3 mb-4">
                                <Button
                                    className="btn-primary-custom flex-grow-1"
                                    onClick={handleAddToCart}
                                    disabled={product.totalStock === 0}
                                >
                                    <FiShoppingCart className="me-2" /> Add to Cart
                                </Button>
                                <Button
                                    className="btn-gold flex-grow-1"
                                    onClick={handleBuyNow}
                                    disabled={product.totalStock === 0}
                                >
                                    Buy Now
                                </Button>
                            </div>

                            <div className="d-flex gap-3 mb-4">
                                <Button variant="outline-secondary">
                                    <FiHeart className="me-2" /> Wishlist
                                </Button>
                                <Button variant="outline-secondary">
                                    <FiShare2 className="me-2" /> Share
                                </Button>
                            </div>

                            {/* Features */}
                            <div className="border-top pt-4">
                                <Row>
                                    <Col xs={4} className="text-center">
                                        <FiTruck size={24} className="text-primary mb-2" />
                                        <p className="small mb-0">Free Delivery</p>
                                    </Col>
                                    <Col xs={4} className="text-center">
                                        <FiShield size={24} className="text-primary mb-2" />
                                        <p className="small mb-0">Secure Payment</p>
                                    </Col>
                                    <Col xs={4} className="text-center">
                                        <FiRefreshCw size={24} className="text-primary mb-2" />
                                        <p className="small mb-0">Easy Returns</p>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Product Tabs */}
                <Row className="mt-5">
                    <Col>
                        <Tabs defaultActiveKey="description" className="mb-4">
                            <Tab eventKey="description" title="Description">
                                <div className="bg-white rounded-4 p-4 shadow-sm">
                                    <h5>Product Description</h5>
                                    <p className="text-muted">
                                        {product.description || `This exquisite ${product.name} from our ${product.category} collection 
                    is crafted with premium ${product.fabric} fabric. Perfect for both casual and formal occasions, 
                    this piece exemplifies traditional elegance with a modern touch.`}
                                    </p>
                                    <h6 className="mt-4">Product Details:</h6>
                                    <ul className="text-muted">
                                        <li>Category: {product.category}</li>
                                        <li>Fabric: {product.fabric || 'Premium Quality'}</li>
                                        <li>Size: S, M, L, XL</li>
                                        <li>Care: Dry Clean Recommended</li>
                                    </ul>
                                </div>
                            </Tab>
                            <Tab eventKey="shipping" title="Shipping & Returns">
                                <div className="bg-white rounded-4 p-4 shadow-sm">
                                    <h5>Shipping Information</h5>
                                    <ul className="text-muted">
                                        <li>Free shipping on orders above ₹999</li>
                                        <li>Delivery within 5-7 business days</li>
                                        <li>Express delivery available at extra cost</li>
                                    </ul>
                                    <h5 className="mt-4">Return Policy</h5>
                                    <ul className="text-muted">
                                        <li>7 days easy return policy</li>
                                        <li>Product must be unused with original tags</li>
                                        <li>Refund will be processed within 5-7 business days</li>
                                    </ul>
                                </div>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProductDetailsPage;
