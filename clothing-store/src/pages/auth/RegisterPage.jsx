// Register Page - User registration with Email, Google, and Phone
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiSmartphone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userName, setUserName] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [activeTab, setActiveTab] = useState('email');

    const { register, signInWithGoogle, sendOTP, verifyOTP } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Email/Password Registration
    const handleEmailRegister = async (e) => {
        e.preventDefault();
        setError('');

        const { name, email, phone, password, confirmPassword } = formData;

        // Validations
        if (!name || !email || !phone || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);

        try {
            await register(email, password, name, phone);
            toast.success('Registration successful! Welcome to Samy Silks!');
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email format');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak');
                    break;
                default:
                    setError(`Registration failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Google Sign Up
    const handleGoogleSignUp = async () => {
        setError('');
        setLoading(true);

        try {
            await signInWithGoogle();
            toast.success('Welcome! Signed up with Google');
            navigate('/');
        } catch (err) {
            console.error('Google sign up error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign up cancelled');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup blocked. Please allow popups for this site.');
            } else {
                setError(`Google sign up failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Send OTP
    const handleSendOTP = async () => {
        setError('');

        if (!userName.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);

        try {
            await sendOTP(phoneNumber, 'recaptcha-container');
            setOtpSent(true);
            toast.success('OTP sent to your phone!');
        } catch (err) {
            console.error('Send OTP error:', err);
            if (err.code === 'auth/invalid-phone-number') {
                setError('Invalid phone number format');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many requests. Please try again later.');
            } else {
                setError(`Failed to send OTP: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            await verifyOTP(otp, userName);
            toast.success('Phone verified! Welcome to Samy Silks!');
            navigate('/');
        } catch (err) {
            console.error('Verify OTP error:', err);
            if (err.code === 'auth/invalid-verification-code') {
                setError('Invalid OTP. Please try again.');
            } else {
                setError(`Verification failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} lg={8} xl={6}>
                        <div className="auth-card animate-scaleIn">
                            <div className="auth-header">
                                <Link to="/" className="text-decoration-none">
                                    <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                                        <div className="brand-logo" style={{ background: 'rgba(255,255,255,0.2)' }}>S</div>
                                        <h2 className="mb-0 text-white">Samy Silks</h2>
                                    </div>
                                </Link>
                                <h4 className="mb-2">Create Account</h4>
                                <p className="mb-0 opacity-75">Join us for exclusive offers and updates</p>
                            </div>

                            <div className="auth-body">
                                {error && (
                                    <Alert variant="danger" className="animate-fadeInDown">
                                        {error}
                                    </Alert>
                                )}

                                {/* Google Sign Up Button */}
                                <Button
                                    variant="outline-dark"
                                    className="w-100 py-3 mb-4 d-flex align-items-center justify-content-center gap-2"
                                    onClick={handleGoogleSignUp}
                                    disabled={loading}
                                >
                                    <FcGoogle size={24} />
                                    <span>Continue with Google</span>
                                </Button>

                                <div className="divider-text mb-4">
                                    <span>or register with</span>
                                </div>

                                {/* Tabs for Email and Phone */}
                                <Tabs
                                    activeKey={activeTab}
                                    onSelect={(k) => {
                                        setActiveTab(k);
                                        setError('');
                                        setOtpSent(false);
                                    }}
                                    className="mb-4"
                                >
                                    {/* Email Tab */}
                                    <Tab eventKey="email" title={<span><FiMail className="me-2" />Email</span>}>
                                        <Form onSubmit={handleEmailRegister}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Full Name</Form.Label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <FiUser />
                                                    </span>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        placeholder="Enter your full name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Email Address</Form.Label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <FiMail />
                                                    </span>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        placeholder="Enter your email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Phone Number</Form.Label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <FiPhone />
                                                    </span>
                                                    <Form.Control
                                                        type="tel"
                                                        name="phone"
                                                        placeholder="Enter 10-digit phone number"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                        maxLength={10}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Password</Form.Label>
                                                        <div className="input-group">
                                                            <span className="input-group-text bg-light">
                                                                <FiLock />
                                                            </span>
                                                            <Form.Control
                                                                type={showPassword ? 'text' : 'password'}
                                                                name="password"
                                                                placeholder="Create password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Confirm Password</Form.Label>
                                                        <div className="input-group">
                                                            <span className="input-group-text bg-light">
                                                                <FiLock />
                                                            </span>
                                                            <Form.Control
                                                                type={showPassword ? 'text' : 'password'}
                                                                name="confirmPassword"
                                                                placeholder="Confirm password"
                                                                value={formData.confirmPassword}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                            <Button
                                                                variant="outline-secondary"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                                            </Button>
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-4">
                                                <Form.Check
                                                    type="checkbox"
                                                    label={
                                                        <span>
                                                            I agree to the{' '}
                                                            <Link to="/terms">Terms & Conditions</Link>
                                                            {' '}and{' '}
                                                            <Link to="/privacy">Privacy Policy</Link>
                                                        </span>
                                                    }
                                                    id="terms"
                                                    required
                                                />
                                            </Form.Group>

                                            <Button
                                                type="submit"
                                                className="btn-primary-custom w-100 py-3"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" />
                                                        Creating Account...
                                                    </>
                                                ) : (
                                                    'Create Account'
                                                )}
                                            </Button>
                                        </Form>
                                    </Tab>

                                    {/* Phone Tab */}
                                    <Tab eventKey="phone" title={<span><FiPhone className="me-2" />Phone</span>}>
                                        {!otpSent ? (
                                            <div>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Your Name</Form.Label>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-light">
                                                            <FiUser />
                                                        </span>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter your full name"
                                                            value={userName}
                                                            onChange={(e) => setUserName(e.target.value)}
                                                        />
                                                    </div>
                                                </Form.Group>

                                                <Form.Group className="mb-4">
                                                    <Form.Label>Phone Number</Form.Label>
                                                    <div className="input-group">
                                                        <span className="input-group-text bg-light">+91</span>
                                                        <Form.Control
                                                            type="tel"
                                                            placeholder="Enter 10-digit phone number"
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <Form.Text className="text-muted">
                                                        We'll send you a one-time verification code
                                                    </Form.Text>
                                                </Form.Group>

                                                <Button
                                                    className="btn-primary-custom w-100 py-3"
                                                    onClick={handleSendOTP}
                                                    disabled={loading || phoneNumber.length !== 10 || !userName.trim()}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" />
                                                            Sending OTP...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiSmartphone className="me-2" />
                                                            Send OTP
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        ) : (
                                            <Form onSubmit={handleVerifyOTP}>
                                                <div className="text-center mb-3">
                                                    <FiSmartphone size={40} className="text-primary mb-2" />
                                                    <p className="text-muted mb-0">
                                                        OTP sent to <strong>+91 {phoneNumber}</strong>
                                                    </p>
                                                </div>

                                                <Form.Group className="mb-4">
                                                    <Form.Label>Enter OTP</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter 6-digit OTP"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                        maxLength={6}
                                                        className="text-center fs-4"
                                                        style={{ letterSpacing: '8px' }}
                                                    />
                                                </Form.Group>

                                                <Button
                                                    type="submit"
                                                    className="btn-primary-custom w-100 py-3 mb-3"
                                                    disabled={loading || otp.length !== 6}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" />
                                                            Verifying...
                                                        </>
                                                    ) : (
                                                        'Verify & Create Account'
                                                    )}
                                                </Button>

                                                <Button
                                                    variant="link"
                                                    className="w-100"
                                                    onClick={() => {
                                                        setOtpSent(false);
                                                        setOtp('');
                                                    }}
                                                >
                                                    Change Phone Number
                                                </Button>

                                                <p className="text-center text-muted small mt-3">
                                                    Didn't receive OTP?{' '}
                                                    <Button
                                                        variant="link"
                                                        className="p-0"
                                                        onClick={handleSendOTP}
                                                        disabled={loading}
                                                    >
                                                        Resend
                                                    </Button>
                                                </p>
                                            </Form>
                                        )}
                                    </Tab>
                                </Tabs>

                                {/* reCAPTCHA Container (invisible) */}
                                <div id="recaptcha-container"></div>

                                <div className="text-center mt-4">
                                    <p className="mb-0">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-primary fw-semibold">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RegisterPage;
