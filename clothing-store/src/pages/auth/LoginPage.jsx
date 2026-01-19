// Login Page - User authentication with Email, Google, and Phone
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiSmartphone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [activeTab, setActiveTab] = useState('email');

    const { login, signInWithGoogle, sendOTP, verifyOTP } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    // Email/Password Login
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
            toast.success('Login successful!');
            navigate(from);
        } catch (err) {
            console.error('Login error:', err);
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email');
                    break;
                case 'auth/wrong-password':
                    setError('Invalid password');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email format');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many failed attempts. Please try again later.');
                    break;
                default:
                    setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Google Sign In
    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            await signInWithGoogle();
            toast.success('Welcome! Signed in with Google');
            navigate(from);
        } catch (err) {
            console.error('Google sign in error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign in cancelled');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup blocked. Please allow popups for this site.');
            } else {
                setError('Google sign in failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Send OTP
    const handleSendOTP = async () => {
        setError('');

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
                setError('Failed to send OTP. Please try again.');
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
            await verifyOTP(otp);
            toast.success('Phone verified! Welcome!');
            navigate(from);
        } catch (err) {
            console.error('Verify OTP error:', err);
            if (err.code === 'auth/invalid-verification-code') {
                setError('Invalid OTP. Please try again.');
            } else {
                setError('Verification failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
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
                                <h4 className="mb-2">Welcome Back!</h4>
                                <p className="mb-0 opacity-75">Sign in to continue shopping</p>
                            </div>

                            <div className="auth-body">
                                {error && (
                                    <Alert variant="danger" className="animate-fadeInDown">
                                        {error}
                                    </Alert>
                                )}

                                {/* Google Sign In Button */}
                                <Button
                                    variant="outline-dark"
                                    className="w-100 py-3 mb-4 d-flex align-items-center justify-content-center gap-2"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    <FcGoogle size={24} />
                                    <span>Continue with Google</span>
                                </Button>

                                <div className="divider-text mb-4">
                                    <span>or sign in with</span>
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
                                        <Form onSubmit={handleEmailLogin}>
                                            <Form.Group className="mb-4">
                                                <Form.Label>Email Address</Form.Label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <FiMail />
                                                    </span>
                                                    <Form.Control
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-4">
                                                <div className="d-flex justify-content-between">
                                                    <Form.Label>Password</Form.Label>
                                                    <Link to="/forgot-password" className="text-decoration-none small">
                                                        Forgot Password?
                                                    </Link>
                                                </div>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <FiLock />
                                                    </span>
                                                    <Form.Control
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Enter your password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
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

                                            <Form.Group className="mb-4">
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Remember me"
                                                    id="remember"
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
                                                        Signing in...
                                                    </>
                                                ) : (
                                                    'Sign In'
                                                )}
                                            </Button>
                                        </Form>
                                    </Tab>

                                    {/* Phone Tab */}
                                    <Tab eventKey="phone" title={<span><FiPhone className="me-2" />Phone</span>}>
                                        {!otpSent ? (
                                            <div>
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
                                                    disabled={loading || phoneNumber.length !== 10}
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
                                                        className="text-center fs-4 letter-spacing-2"
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
                                                        'Verify OTP'
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
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-primary fw-semibold">
                                            Create Account
                                        </Link>
                                    </p>
                                </div>

                                {/* Demo Credentials */}
                                <div className="mt-4 p-3 bg-light rounded text-center">
                                    <small className="text-muted">
                                        <strong>Demo Admin:</strong> admin@samysilks.com / admin123<br />
                                        <strong>Demo User:</strong> user@test.com / user123
                                    </small>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginPage;
