// User Service - Firebase operations for users
import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const usersCollection = collection(db, 'users');

// Get all users (admin)
export const getAllUsers = async () => {
    const snapshot = await getDocs(query(usersCollection, orderBy('createdAt', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get user by ID
export const getUserById = async (userId) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
};

// Update user profile
export const updateUserProfile = async (userId, data) => {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, data);
};

// Add address to user
export const addUserAddress = async (userId, address) => {
    const user = await getUserById(userId);
    const addresses = user?.address || [];
    addresses.push({
        ...address,
        id: Date.now().toString()
    });
    await updateDoc(doc(db, 'users', userId), { address: addresses });
};

// Update user address
export const updateUserAddress = async (userId, addressId, newAddress) => {
    const user = await getUserById(userId);
    const addresses = user?.address || [];
    const index = addresses.findIndex(addr => addr.id === addressId);
    if (index > -1) {
        addresses[index] = { ...newAddress, id: addressId };
        await updateDoc(doc(db, 'users', userId), { address: addresses });
    }
};

// Delete user address
export const deleteUserAddress = async (userId, addressId) => {
    const user = await getUserById(userId);
    const addresses = (user?.address || []).filter(addr => addr.id !== addressId);
    await updateDoc(doc(db, 'users', userId), { address: addresses });
};

// Update user role (admin)
export const updateUserRole = async (userId, role) => {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, { role });
};

// Get users count
export const getUsersCount = async () => {
    const users = await getAllUsers();
    return users.length;
};

// Get admin users
export const getAdminUsers = async () => {
    const users = await getAllUsers();
    return users.filter(user => user.role === 'admin');
};
