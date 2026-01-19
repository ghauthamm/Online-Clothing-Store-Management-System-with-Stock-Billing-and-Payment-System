// Seed Data Utility - Creates demo admin and sample products
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Demo Admin Account Details
const DEMO_ADMIN = {
    email: 'admin@samysilks.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '9876543210',
    role: 'admin'
};

// Demo User Account Details
const DEMO_USER = {
    email: 'user@test.com',
    password: 'user123',
    name: 'Test User',
    phone: '9876543211',
    role: 'user'
};

// Sample Products
const SAMPLE_PRODUCTS = [
    {
        name: 'Kanchipuram Silk Saree',
        category: 'Sarees',
        price: 15999,
        discount: 10,
        fabric: 'Pure Silk',
        description: 'Exquisite Kanchipuram silk saree with traditional zari work. Perfect for weddings and special occasions.',
        imageUrl: 'https://images.unsplash.com/photo-1610030469668-58a3ccf84c60?w=500',
        sizes: { S: 5, M: 8, L: 10, XL: 5 },
        totalStock: 28,
        lowStockLimit: 5,
        featured: true,
        createdAt: new Date().toISOString()
    },
    {
        name: 'Men\'s Silk Dhoti Set',
        category: 'Men',
        price: 3999,
        discount: 0,
        fabric: 'Silk',
        description: 'Traditional silk dhoti set with angavastram. Ideal for festivals and ceremonies.',
        imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500',
        sizes: { S: 10, M: 15, L: 12, XL: 8 },
        totalStock: 45,
        lowStockLimit: 5,
        featured: true,
        createdAt: new Date().toISOString()
    },
    {
        name: 'Designer Lehenga Choli',
        category: 'Women',
        price: 8999,
        discount: 15,
        fabric: 'Georgette',
        description: 'Stunning designer lehenga choli with intricate embroidery work.',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
        sizes: { S: 4, M: 6, L: 5, XL: 3 },
        totalStock: 18,
        lowStockLimit: 3,
        featured: true,
        createdAt: new Date().toISOString()
    },
    {
        name: 'Kids Ethnic Kurta Set',
        category: 'Kids',
        price: 1499,
        discount: 0,
        fabric: 'Cotton Silk',
        description: 'Comfortable and stylish kurta set for kids. Perfect for festive occasions.',
        imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500',
        sizes: { S: 12, M: 15, L: 10, XL: 8 },
        totalStock: 45,
        lowStockLimit: 5,
        featured: true,
        createdAt: new Date().toISOString()
    },
    {
        name: 'Banarasi Silk Saree',
        category: 'Sarees',
        price: 12999,
        discount: 5,
        fabric: 'Banarasi Silk',
        description: 'Classic Banarasi silk saree with golden zari border and intricate weaving.',
        imageUrl: 'https://images.unsplash.com/photo-1610030469668-58a3ccf84c60?w=500',
        sizes: { S: 3, M: 5, L: 7, XL: 4 },
        totalStock: 19,
        lowStockLimit: 3,
        featured: false,
        createdAt: new Date().toISOString()
    },
    {
        name: 'Men\'s Cotton Kurta',
        category: 'Men',
        price: 1299,
        discount: 10,
        fabric: 'Pure Cotton',
        description: 'Comfortable cotton kurta for everyday wear. Available in multiple colors.',
        imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500',
        sizes: { S: 20, M: 25, L: 30, XL: 15 },
        totalStock: 90,
        lowStockLimit: 10,
        featured: false,
        createdAt: new Date().toISOString()
    },
    {
        name: 'Pattu Pavadai',
        category: 'Kids',
        price: 2499,
        discount: 0,
        fabric: 'Pattu Silk',
        description: 'Traditional Pattu Pavadai for little girls. Perfect for temple visits and functions.',
        imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500',
        sizes: { S: 8, M: 10, L: 6, XL: 4 },
        totalStock: 28,
        lowStockLimit: 5,
        featured: true,
        createdAt: new Date().toISOString()
    },
    {
        name: 'Women\'s Anarkali Suit',
        category: 'Women',
        price: 4999,
        discount: 20,
        fabric: 'Rayon',
        description: 'Elegant Anarkali suit with palazzo pants. Perfect for parties and gatherings.',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
        sizes: { S: 6, M: 10, L: 8, XL: 4 },
        totalStock: 28,
        lowStockLimit: 5,
        featured: true,
        createdAt: new Date().toISOString()
    }
];

// Create a user account
export const createDemoAccount = async (userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );

        await updateProfile(userCredential.user, { displayName: userData.name });

        await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            address: [],
            authProvider: 'email',
            createdAt: new Date().toISOString()
        });

        console.log(`✅ Created ${userData.role}: ${userData.email}`);
        return true;
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log(`ℹ️ Account already exists: ${userData.email}`);
            return true;
        }
        console.error(`❌ Error creating ${userData.email}:`, error);
        return false;
    }
};

// Add sample products
export const addSampleProducts = async () => {
    try {
        const productsCollection = collection(db, 'products');

        for (const product of SAMPLE_PRODUCTS) {
            await addDoc(productsCollection, product);
            console.log(`✅ Added product: ${product.name}`);
        }

        return true;
    } catch (error) {
        console.error('❌ Error adding products:', error);
        return false;
    }
};

// Main seed function
export const seedDatabase = async () => {
    console.log('🌱 Starting database seeding...\n');

    // Create demo admin
    await createDemoAccount(DEMO_ADMIN);

    // Create demo user
    await createDemoAccount(DEMO_USER);

    // Add sample products
    await addSampleProducts();

    console.log('\n✅ Database seeding completed!');
};

export { DEMO_ADMIN, DEMO_USER, SAMPLE_PRODUCTS };
