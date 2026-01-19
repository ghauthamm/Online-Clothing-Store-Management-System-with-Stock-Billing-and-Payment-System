// Setup Page - One-time database seeding
import React, { useState } from 'react';
import { Container, Card, Button, Alert, ListGroup } from 'react-bootstrap';
import { FiDatabase, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { seedDatabase, DEMO_ADMIN, DEMO_USER } from '../utils/seedData';
import { useNavigate } from 'react-router-dom';

const SetupPage = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();

    const handleSeed = async () => {
        setLoading(true);
        setStatus(null);
        setLogs([]);

        // Capture console logs
        const originalLog = console.log;
        const originalError = console.error;

        console.log = (...args) => {
            originalLog(...args);
            setLogs(prev => [...prev, { type: 'success', message: args.join(' ') }]);
        };

        console.error = (...args) => {
            originalError(...args);
            setLogs(prev => [...prev, { type: 'error', message: args.join(' ') }]);
        };

        try {
            await seedDatabase();
            setStatus('success');
        } catch (error) {
            setStatus('error');
            setLogs(prev => [...prev, { type: 'error', message: error.message }]);
        } finally {
            console.log = originalLog;
            console.error = originalError;
            setLoading(false);
        }
    };

    return (
        <div className="py-5" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Container>
                <Card className="shadow-lg mx-auto" style={{ maxWidth: '600px' }}>
                    <Card.Header className="bg-white py-4 text-center">
                        <FiDatabase size={40} className="text-primary mb-3" />
                        <h3>Database Setup</h3>
                        <p className="text-muted mb-0">Initialize your application with demo data</p>
                    </Card.Header>
                    <Card.Body className="p-4">
                        {status === 'success' && (
                            <Alert variant="success" className="mb-4">
                                <FiCheck className="me-2" />
                                Database seeded successfully! You can now login with the demo credentials.
                            </Alert>
                        )}

                        {status === 'error' && (
                            <Alert variant="danger" className="mb-4">
                                <FiX className="me-2" />
                                Some errors occurred during seeding. Check the logs below.
                            </Alert>
                        )}

                        <div className="mb-4">
                            <h6 className="mb-3">This will create:</h6>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Admin Account:</strong><br />
                                    <small className="text-muted">
                                        Email: {DEMO_ADMIN.email}<br />
                                        Password: {DEMO_ADMIN.password}
                                    </small>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>User Account:</strong><br />
                                    <small className="text-muted">
                                        Email: {DEMO_USER.email}<br />
                                        Password: {DEMO_USER.password}
                                    </small>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Sample Products:</strong><br />
                                    <small className="text-muted">8 products across categories</small>
                                </ListGroup.Item>
                            </ListGroup>
                        </div>

                        <Button
                            className="btn-primary-custom w-100 mb-3"
                            onClick={handleSeed}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="me-2 spin" />
                                    Seeding Database...
                                </>
                            ) : (
                                <>
                                    <FiDatabase className="me-2" />
                                    Seed Database
                                </>
                            )}
                        </Button>

                        {status === 'success' && (
                            <Button
                                variant="outline-primary"
                                className="w-100"
                                onClick={() => navigate('/login')}
                            >
                                Go to Login
                            </Button>
                        )}

                        {logs.length > 0 && (
                            <div className="mt-4">
                                <h6>Logs:</h6>
                                <div
                                    className="bg-dark text-light p-3 rounded"
                                    style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.85rem' }}
                                >
                                    {logs.map((log, index) => (
                                        <div key={index} className={log.type === 'error' ? 'text-danger' : 'text-success'}>
                                            {log.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default SetupPage;
