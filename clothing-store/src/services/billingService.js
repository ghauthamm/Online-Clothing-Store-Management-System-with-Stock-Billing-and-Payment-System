// Billing Service - Invoice generation and management
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
import { shopDetails } from '../context/ShopContext';

const billsCollection = collection(db, 'bills');

// Create new bill
export const createBill = async (billNo, orderData) => {
    const subtotal = orderData.items.reduce((acc, item) => {
        const price = item.discount ? item.price - (item.price * item.discount / 100) : item.price;
        return acc + (price * item.quantity);
    }, 0);

    const discount = orderData.items.reduce((acc, item) => {
        return acc + ((item.price * (item.discount || 0) / 100) * item.quantity);
    }, 0);

    const tax = subtotal * 0.05; // 5% GST
    const grandTotal = subtotal + tax;

    const bill = {
        billNo,
        orderId: orderData.orderId,
        shopName: shopDetails.name,
        shopPhone: shopDetails.phone,
        shopAddress: shopDetails.address,
        shopGst: shopDetails.gst,
        customerName: orderData.customerName,
        customerAddress: orderData.customerAddress,
        customerPhone: orderData.customerPhone,
        items: orderData.items,
        subtotal,
        discount,
        tax,
        grandTotal,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(billsCollection, bill);
    return { id: docRef.id, ...bill };
};

// Get all bills
export const getAllBills = async () => {
    const snapshot = await getDocs(query(billsCollection, orderBy('createdAt', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get bill by bill number
export const getBillByBillNo = async (billNo) => {
    const q = query(billsCollection, where('billNo', '==', billNo));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return null;
};

// Get bill by order ID
export const getBillByOrderId = async (orderId) => {
    const q = query(billsCollection, where('orderId', '==', orderId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return null;
};

// Get bills by date range
export const getBillsByDateRange = async (startDate, endDate) => {
    const bills = await getAllBills();
    return bills.filter(bill => {
        const billDate = new Date(bill.createdAt);
        return billDate >= startDate && billDate <= endDate;
    });
};

// Get daily sales summary
export const getDailySales = async (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bills = await getBillsByDateRange(startOfDay, endOfDay);
    return {
        totalBills: bills.length,
        totalAmount: bills.reduce((acc, bill) => acc + bill.grandTotal, 0),
        paidAmount: bills
            .filter(bill => bill.paymentStatus === 'Paid')
            .reduce((acc, bill) => acc + bill.grandTotal, 0),
        pendingAmount: bills
            .filter(bill => bill.paymentStatus === 'Pending')
            .reduce((acc, bill) => acc + bill.grandTotal, 0)
    };
};

// Get monthly sales summary
export const getMonthlySales = async (year, month) => {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const bills = await getBillsByDateRange(startOfMonth, endOfMonth);
    return {
        totalBills: bills.length,
        totalAmount: bills.reduce((acc, bill) => acc + bill.grandTotal, 0),
        codAmount: bills
            .filter(bill => bill.paymentMethod === 'COD')
            .reduce((acc, bill) => acc + bill.grandTotal, 0),
        onlineAmount: bills
            .filter(bill => bill.paymentMethod === 'Online')
            .reduce((acc, bill) => acc + bill.grandTotal, 0)
    };
};
