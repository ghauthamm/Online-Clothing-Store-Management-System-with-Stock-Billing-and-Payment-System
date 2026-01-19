// Products Page - Browse and filter products
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import ProductCard from '../components/products/ProductCard';
import { getAllProducts, getProductsByCategory, searchProducts } from '../services/productService';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['Men', 'Women', 'Kids', 'Sarees', 'Silks'];

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, [searchParams]);

    useEffect(() => {
        applyFilters();
    }, [products, selectedCategory, priceRange, sortBy, searchTerm]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.fabric?.toLowerCase().includes(term)
            );
        }

        // Filter by price range
        if (priceRange.min) {
            filtered = filtered.filter(p => p.price >= parseFloat(priceRange.min));
        }
        if (priceRange.max) {
            filtered = filtered.filter(p => p.price <= parseFloat(priceRange.max));
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredProducts(filtered);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category === selectedCategory ? '' : category);
        if (category) {
            setSearchParams({ category });
        } else {
            setSearchParams({});
        }
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchTerm('');
        setPriceRange({ min: '', max: '' });
        setSortBy('newest');
        setSearchParams({});
    };

    const activeFiltersCount = [
        selectedCategory,
        searchTerm,
        priceRange.min,
        priceRange.max
    ].filter(Boolean).length;

    return (
        <div className="products-page py-5">
            <Container>
                {/* Page Header */}
                <div className="section-header mb-4">
                    <h1 className="section-title">
                        {selectedCategory ? `${selectedCategory}'s Collection` : 'All Products'}
                    </h1>
                    <p className="section-subtitle">
                        Explore our exquisite collection of traditional and modern clothing
                    </p>
                </div>

                <Row>
                    {/* Filters Sidebar - Desktop */}
                    <Col lg={3} className="d-none d-lg-block">
                        <div className="bg-white rounded-4 p-4 shadow-sm sticky-top" style={{ top: '100px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">Filters</h5>
                                {activeFiltersCount > 0 && (
                                    <Button variant="link" size="sm" onClick={clearFilters} className="text-danger p-0">
                                        Clear All
                                    </Button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Search</label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <InputGroup.Text><FiSearch /></InputGroup.Text>
                                </InputGroup>
                            </div>

                            {/* Categories */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Categories</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <Badge
                                            key={category}
                                            bg={selectedCategory === category ? 'primary' : 'light'}
                                            text={selectedCategory === category ? 'white' : 'dark'}
                                            className="px-3 py-2 cursor-pointer"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleCategoryChange(category)}
                                        >
                                            {category}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Price Range</label>
                                <Row className="g-2">
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                        />
                                    </Col>
                                </Row>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="form-label fw-semibold">Sort By</label>
                                <Form.Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </Form.Select>
                            </div>
                        </div>
                    </Col>

                    {/* Products Grid */}
                    <Col lg={9}>
                        {/* Mobile Filter Button */}
                        <div className="d-lg-none mb-4">
                            <Button
                                variant="outline-primary"
                                className="w-100"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FiFilter className="me-2" />
                                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                            </Button>
                        </div>

                        {/* Results Count */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <p className="mb-0 text-muted">
                                Showing {filteredProducts.length} of {products.length} products
                            </p>
                            <div className="d-lg-none">
                                <Form.Select
                                    size="sm"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{ width: 'auto' }}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price ↑</option>
                                    <option value="price-high">Price ↓</option>
                                </Form.Select>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {activeFiltersCount > 0 && (
                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {selectedCategory && (
                                    <Badge bg="primary" className="d-flex align-items-center gap-1 px-3 py-2">
                                        {selectedCategory}
                                        <FiX style={{ cursor: 'pointer' }} onClick={() => handleCategoryChange('')} />
                                    </Badge>
                                )}
                                {searchTerm && (
                                    <Badge bg="secondary" className="d-flex align-items-center gap-1 px-3 py-2">
                                        "{searchTerm}"
                                        <FiX style={{ cursor: 'pointer' }} onClick={() => setSearchTerm('')} />
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Products */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <Row>
                                {filteredProducts.map((product, index) => (
                                    <Col md={4} sm={6} key={product.id} className="mb-4">
                                        <div className="animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                                            <ProductCard product={product} />
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className="text-center py-5">
                                <img
                                    src="https://illustrations.popsy.co/gray/no-data.svg"
                                    alt="No products"
                                    style={{ maxWidth: '200px', marginBottom: '20px' }}
                                />
                                <h4>No Products Found</h4>
                                <p className="text-muted">Try adjusting your filters or search term</p>
                                <Button onClick={clearFilters} className="btn-primary-custom">
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProductsPage;
