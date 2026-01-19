// Product Service - Firebase CRUD operations for products
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

const productsCollection = collection(db, 'products');

// Get all products
export const getAllProducts = async () => {
    const snapshot = await getDocs(query(productsCollection, orderBy('createdAt', 'desc')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get products by category
export const getProductsByCategory = async (category) => {
    const q = query(productsCollection, where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get single product
export const getProductById = async (productId) => {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
};

// Add new product
export const addProduct = async (productData, imageFile) => {
    let imageUrl = '';

    if (imageFile) {
        const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
    }

    const product = {
        ...productData,
        imageUrl,
        totalStock: Object.values(productData.sizes).reduce((a, b) => a + b, 0),
        createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(productsCollection, product);
    return { id: docRef.id, ...product };
};

// Update product
export const updateProduct = async (productId, productData, imageFile) => {
    const docRef = doc(db, 'products', productId);
    let updateData = { ...productData };

    if (imageFile) {
        const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        updateData.imageUrl = await getDownloadURL(imageRef);
    }

    if (productData.sizes) {
        updateData.totalStock = Object.values(productData.sizes).reduce((a, b) => a + b, 0);
    }

    await updateDoc(docRef, updateData);
    return { id: productId, ...updateData };
};

// Delete product
export const deleteProduct = async (productId) => {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
};

// Update stock after order
export const updateProductStock = async (productId, size, quantity) => {
    const product = await getProductById(productId);
    if (product) {
        const newSizes = { ...product.sizes };
        newSizes[size] = Math.max(0, newSizes[size] - quantity);

        await updateDoc(doc(db, 'products', productId), {
            sizes: newSizes,
            totalStock: Object.values(newSizes).reduce((a, b) => a + b, 0)
        });
    }
};

// Get low stock products
export const getLowStockProducts = async (threshold = 5) => {
    const products = await getAllProducts();
    return products.filter(product => product.totalStock <= threshold);
};

// Get featured products
export const getFeaturedProducts = async (count = 8) => {
    const q = query(productsCollection, orderBy('createdAt', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Search products
export const searchProducts = async (searchTerm) => {
    const products = await getAllProducts();
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.fabric?.toLowerCase().includes(term)
    );
};
