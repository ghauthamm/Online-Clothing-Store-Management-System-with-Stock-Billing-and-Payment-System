// Product Card Component - Display individual products
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const { addToCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const sizes = ['S', 'M', 'L', 'XL'];
    const discountedPrice = product.discount
        ? product.price - (product.price * product.discount / 100)
        : product.price;

    const isOutOfStock = product.totalStock === 0;
    const isLowStock = product.totalStock > 0 && product.totalStock <= 5;

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

        if (product.sizes[selectedSize] === 0) {
            toast.error('Selected size is out of stock');
            return;
        }

        addToCart(product, selectedSize, 1);
        toast.success(`${product.name} added to cart!`);
        setSelectedSize('');
    };

    const getSizeStock = (size) => {
        return product.sizes?.[size] || 0;
    };

    return (
        <Card className="product-card h-100">
            <div className="product-image-wrapper">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={product.name}
                    className="product-image"
                />

                {/* Badges */}
                {isOutOfStock && (
                    <span className="product-badge out-of-stock">Out of Stock</span>
                )}
                {!isOutOfStock && product.discount > 0 && (
                    <span className="product-badge">{product.discount}% OFF</span>
                )}
                {!isOutOfStock && isLowStock && (
                    <span className="product-badge low-stock">Only {product.totalStock} left</span>
                )}

                {/* Wishlist Button */}
                <button className="product-wishlist">
                    <FiHeart />
                </button>

                {/* Quick Actions */}
                <div className="product-quick-actions">
                    <div className="d-flex gap-2 justify-content-center">
                        <Link
                            to={`/product/${product.id}`}
                            className="btn btn-light btn-sm"
                        >
                            <FiEye /> View Details
                        </Link>
                    </div>
                </div>
            </div>

            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h5 className="product-name">{product.name}</h5>
                {product.fabric && (
                    <p className="product-fabric">{product.fabric}</p>
                )}

                <div className="product-price">
                    <span className="price-current">₹{discountedPrice.toFixed(0)}</span>
                    {product.discount > 0 && (
                        <>
                            <span className="price-original">₹{product.price.toFixed(0)}</span>
                            <span className="price-discount">Save ₹{(product.price - discountedPrice).toFixed(0)}</span>
                        </>
                    )}
                </div>

                {/* Size Selection */}
                {!isOutOfStock && (
                    <div className="product-sizes">
                        {sizes.map(size => (
                            <button
                                key={size}
                                className={`size-option ${selectedSize === size ? 'active' : ''} ${getSizeStock(size) === 0 ? 'disabled' : ''}`}
                                onClick={() => getSizeStock(size) > 0 && setSelectedSize(size)}
                                disabled={getSizeStock(size) === 0}
                                title={getSizeStock(size) === 0 ? 'Out of stock' : `${getSizeStock(size)} available`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                )}

                {/* Add to Cart Button */}
                <Button
                    className="btn-primary-custom w-100 mt-3"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                >
                    <FiShoppingCart className="me-2" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;
