// Order Service - Firebase CRUD operations for orders
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { updateProductStock } from './productService';
import { createBill } from './billingService';

const ordersCollection = collection(db, 'orders');

// Generate unique order ID
const generateOrderId = () => {
    return 'ORD' + Date.now().toString().slice(-10);
};

// Create new order
export const createOrder = async (userId, items, shippingAddress, paymentMethod, totalAmount, userData) => {
    const orderId = generateOrderId();
    const billNo = 'BILL' + Date.now().toString().slice(-10);

    const order = {
        orderId,
        userId,
        items,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        transactionId: paymentMethod === 'Online' ? 'TXN' + Date.now() : null,
        totalAmount,
        status: 'Pending',
        billNo,
        createdAt: new Date().toISOString()
    };

    // Create order in Firestore
    const docRef = await addDoc(ordersCollection, order);

    // Update stock for each item
    for (const item of items) {
        await updateProductStock(item.productId, item.size, item.quantity);
    }

    // Create bill
    await createBill(billNo, {
        orderId,
        items,
        totalAmount,
        paymentMethod,
        paymentStatus: order.paymentStatus,
        customerName: userData?.name || 'Guest',
        customerAddress: shippingAddress,
        customerPhone: userData?.phone || ''
    });

    return { id: docRef.id, ...order };
};

// Get all orders (admin)
export const getAllOrders = async () => {
    const snapshot = await getDocs(query(ordersCollection, orderBy('createdAt', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get orders by user
export const getOrdersByUser = async (userId) => {
    const q = query(ordersCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get single order
export const getOrderById = async (id) => {
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
};

// Update order status
export const updateOrderStatus = async (id, status) => {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
};

// Update payment status
export const updatePaymentStatus = async (id, paymentStatus) => {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { paymentStatus });

    // Also update the bill
    const order = await getOrderById(id);
    if (order?.billNo) {
        const billsRef = collection(db, 'bills');
        const q = query(billsRef, where('billNo', '==', order.billNo));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            await updateDoc(doc(db, 'bills', snapshot.docs[0].id), { paymentStatus });
        }
    }
};

// Get orders by date range
export const getOrdersByDateRange = async (startDate, endDate) => {
    const orders = await getAllOrders();
    return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
    });
};

// Get orders by payment method
export const getOrdersByPaymentMethod = async (method) => {
    const q = query(ordersCollection, where('paymentMethod', '==', method));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Calculate total revenue
export const calculateRevenue = async () => {
    const orders = await getAllOrders();
    return orders
        .filter(order => order.paymentStatus === 'Paid')
        .reduce((total, order) => total + order.totalAmount, 0);
};

// Get today's orders
export const getTodaysOrders = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const orders = await getAllOrders();
    return orders.filter(order => new Date(order.createdAt) >= today);
};
