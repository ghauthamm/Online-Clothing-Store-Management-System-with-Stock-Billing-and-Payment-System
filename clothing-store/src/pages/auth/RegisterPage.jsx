// Register Page - User registration
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
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
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
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
                    setError('Registration failed. Please try again.');
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

                                <Form onSubmit={handleSubmit}>
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
