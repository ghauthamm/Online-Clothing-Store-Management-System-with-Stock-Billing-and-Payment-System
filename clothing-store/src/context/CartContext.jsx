// Cart Context - Manages shopping cart state
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);
    const { currentUser } = useAuth();

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem(`cart_${currentUser?.uid || 'guest'}`);
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        } else {
            setCartItems([]);
        }
    }, [currentUser]);

    // Save cart to localStorage and update totals
    useEffect(() => {
        localStorage.setItem(`cart_${currentUser?.uid || 'guest'}`, JSON.stringify(cartItems));

        const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        const total = cartItems.reduce((acc, item) => {
            const price = item.discount ? item.price - (item.price * item.discount / 100) : item.price;
            return acc + (price * item.quantity);
        }, 0);

        setCartCount(count);
        setCartTotal(total);
    }, [cartItems, currentUser]);

    // Add item to cart
    const addToCart = (product, size, quantity = 1) => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(
                item => item.productId === product.id && item.size === size
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }

            return [...prev, {
                productId: product.id,
                name: product.name,
                price: product.price,
                discount: product.discount || 0,
                imageUrl: product.imageUrl,
                size,
                quantity,
                fabric: product.fabric,
                category: product.category
            }];
        });
    };

    // Update item quantity
    const updateQuantity = (productId, size, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.productId === productId && item.size === size
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // Remove item from cart
    const removeFromCart = (productId, size) => {
        setCartItems(prev =>
            prev.filter(item => !(item.productId === productId && item.size === size))
        );
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Get item quantity in cart
    const getItemQuantity = (productId, size) => {
        const item = cartItems.find(
            item => item.productId === productId && item.size === size
        );
        return item ? item.quantity : 0;
    };

    const value = {
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
