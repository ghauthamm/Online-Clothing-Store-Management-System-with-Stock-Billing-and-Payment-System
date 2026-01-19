// Authentication Context - Manages user authentication state
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register new user
    const register = async (email, password, name, phone) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile with display name
        await updateProfile(userCredential.user, { displayName: name });

        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            name,
            email,
            phone,
            role: 'user',
            address: [],
            createdAt: new Date().toISOString()
        });

        return userCredential;
    };

    // Login user
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Logout user
    const logout = () => {
        return signOut(auth);
    };

    // Get user data from Firestore
    const getUserData = async (uid) => {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    };

    // Update user profile
    const updateUserProfile = async (uid, data) => {
        await setDoc(doc(db, 'users', uid), data, { merge: true });
        setUserData(prev => ({ ...prev, ...data }));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                const data = await getUserData(user.uid);
                setUserData(data);
                setUserRole(data?.role || 'user');
            } else {
                setUserData(null);
                setUserRole(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        userData,
        loading,
        register,
        login,
        logout,
        getUserData,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
