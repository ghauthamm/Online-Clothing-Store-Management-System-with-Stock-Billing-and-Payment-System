// Admin Products Page - Product management
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Table, Button, Badge, Form, Modal, InputGroup } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiAlertTriangle } from 'react-icons/fi';
import { getAllProducts, deleteProduct, addProduct, updateProduct } from '../../services/productService';
import { toast } from 'react-toastify';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        discount: '',
        fabric: '',
        description: '',
        sizes: { S: 0, M: 0, L: 0, XL: 0 },
        lowStockLimit: 5
    });

    const categories = ['Men', 'Women', 'Kids', 'Sarees', 'Silks'];

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, categoryFilter]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
            toast.error('Error loading products');
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.fabric?.toLowerCase().includes(term)
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        setFilteredProducts(filtered);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            category: '',
            price: '',
            discount: '',
            fabric: '',
            description: '',
            sizes: { S: 0, M: 0, L: 0, XL: 0 },
            lowStockLimit: 5
        });
        setImageFile(null);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            discount: product.discount || '',
            fabric: product.fabric || '',
            description: product.description || '',
            sizes: product.sizes || { S: 0, M: 0, L: 0, XL: 0 },
            lowStockLimit: product.lowStockLimit || 5
        });
        setImageFile(null);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category || !formData.price) {
            toast.error('Please fill required fields');
            return;
        }

        setSaving(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                discount: formData.discount ? parseFloat(formData.discount) : 0,
                lowStockLimit: parseInt(formData.lowStockLimit) || 5
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData, imageFile);
                toast.success('Product updated successfully');
            } else {
                await addProduct(productData, imageFile);
                toast.success('Product added successfully');
            }

            setShowModal(false);
            loadProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Error saving product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            try {
                await deleteProduct(productId);
                toast.success('Product deleted');
                loadProducts();
            } catch (error) {
                toast.error('Error deleting product');
            }
        }
    };

    const handleSizeChange = (size, value) => {
        setFormData({
            ...formData,
            sizes: {
                ...formData.sizes,
                [size]: parseInt(value) || 0
            }
        });
    };

    return (
        <>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">Manage Products</h5>
                    <p className="text-muted mb-0">{products.length} products total</p>
                </div>
                <Button className="btn-primary-custom" onClick={openAddModal}>
                    <FiPlus className="me-2" /> Add Product
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={6} className="mb-3 mb-md-0">
                            <InputGroup>
                                <InputGroup.Text><FiSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            <Form.Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={3} className="text-end">
                            <span className="text-muted">
                                Showing {filteredProducts.length} of {products.length}
                            </span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Products Table */}
            <Card className="shadow-sm">
                <div className="table-responsive">
                    <Table className="data-table mb-0">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-5">
                                        <FiImage size={40} className="text-muted mb-2" />
                                        <p className="text-muted mb-0">No products found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={product.imageUrl || 'https://via.placeholder.com/50'}
                                                    alt={product.name}
                                                    style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                                <div>
                                                    <p className="mb-0 fw-semibold">{product.name}</p>
                                                    <small className="text-muted">{product.fabric}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg="light" text="dark">{product.category}</Badge>
                                        </td>
                                        <td>
                                            <span className="fw-semibold">₹{product.price}</span>
                                            {product.discount > 0 && (
                                                <Badge bg="success" className="ms-2">{product.discount}% OFF</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <span>{product.totalStock}</span>
                                                {product.totalStock <= (product.lowStockLimit || 5) && product.totalStock > 0 && (
                                                    <FiAlertTriangle className="text-warning" title="Low stock" />
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {product.totalStock === 0 ? (
                                                <Badge bg="danger">Out of Stock</Badge>
                                            ) : product.totalStock <= (product.lowStockLimit || 5) ? (
                                                <Badge bg="warning" text="dark">Low Stock</Badge>
                                            ) : (
                                                <Badge bg="success">In Stock</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => openEditModal(product)}
                                                >
                                                    <FiEdit2 />
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                >
                                                    <FiTrash2 />
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

            {/* Add/Edit Product Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editingProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter product name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category *</Form.Label>
                                    <Form.Select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (₹) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Discount (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fabric</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.fabric}
                                        onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                                        placeholder="e.g., Cotton, Silk"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Product description"
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                    />
                                    {editingProduct?.imageUrl && !imageFile && (
                                        <small className="text-muted">Current image will be kept if no new image is selected</small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Low Stock Alert Limit</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.lowStockLimit}
                                        onChange={(e) => setFormData({ ...formData, lowStockLimit: e.target.value })}
                                        min="1"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Stock by Size</Form.Label>
                            <Row>
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <Col xs={3} key={size}>
                                        <Form.Label className="small">{size}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.sizes[size]}
                                            onChange={(e) => handleSizeChange(size, e.target.value)}
                                            min="0"
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button className="btn-primary-custom" onClick={handleSubmit} disabled={saving}>
                        {saving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Saving...
                            </>
                        ) : (
                            editingProduct ? 'Update Product' : 'Add Product'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AdminProducts;
