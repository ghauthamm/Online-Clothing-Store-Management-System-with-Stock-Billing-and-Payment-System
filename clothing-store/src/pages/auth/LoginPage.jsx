// Login Page - User authentication
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const handleSubmit = async (e) => {
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

                                <Form onSubmit={handleSubmit}>
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
