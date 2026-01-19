// Authentication Context - Manages user authentication state
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

// Google Provider
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmationResult, setConfirmationResult] = useState(null);

    // Register new user with email/password
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
            authProvider: 'email',
            createdAt: new Date().toISOString()
        });

        return userCredential;
    };

    // Login user with email/password
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            // Create new user document
            await setDoc(doc(db, 'users', user.uid), {
                name: user.displayName,
                email: user.email,
                phone: user.phoneNumber || '',
                photoURL: user.photoURL,
                role: 'user',
                address: [],
                authProvider: 'google',
                createdAt: new Date().toISOString()
            });
        }

        return result;
    };

    // Setup reCAPTCHA for phone auth
    const setupRecaptcha = (containerId) => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                'size': 'invisible',
                'callback': () => {
                    // reCAPTCHA solved
                }
            });
        }
        return window.recaptchaVerifier;
    };

    // Send OTP to phone number
    const sendOTP = async (phoneNumber, containerId) => {
        const recaptchaVerifier = setupRecaptcha(containerId);
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
        setConfirmationResult(confirmation);
        return confirmation;
    };

    // Verify OTP
    const verifyOTP = async (otp, userName) => {
        if (!confirmationResult) {
            throw new Error('Please request OTP first');
        }

        const result = await confirmationResult.confirm(otp);
        const user = result.user;

        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            // Create new user document
            await setDoc(doc(db, 'users', user.uid), {
                name: userName || 'User',
                email: '',
                phone: user.phoneNumber,
                role: 'user',
                address: [],
                authProvider: 'phone',
                createdAt: new Date().toISOString()
            });
        }

        return result;
    };

    // Logout user
    const logout = async () => {
        // Clear recaptcha
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }
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
        confirmationResult,
        register,
        login,
        signInWithGoogle,
        sendOTP,
        verifyOTP,
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
