// Admin Users Page - User management
import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FiSearch, FiUsers, FiShield } from 'react-icons/fi';
import { getAllUsers, updateUserRole } from '../../services/userService';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = [...users];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(u =>
                u.name?.toLowerCase().includes(term) ||
                u.email?.toLowerCase().includes(term) ||
                u.phone?.includes(term)
            );
        }

        if (roleFilter) {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        setFilteredUsers(filtered);
    };

    const handleRoleChange = async (userId, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            try {
                await updateUserRole(userId, newRole);
                toast.success('User role updated');
                loadUsers();
            } catch (error) {
                toast.error('Error updating role');
            }
        }
    };

    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'user').length;

    return (
        <>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">Manage Users</h5>
                    <p className="text-muted mb-0">{users.length} users total</p>
                </div>
            </div>

            {/* Stats */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Body className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-primary bg-opacity-10 rounded">
                                <FiUsers size={30} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="mb-0">{userCount}</h3>
                                <p className="text-muted mb-0">Regular Users</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Body className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-warning bg-opacity-10 rounded">
                                <FiShield size={30} className="text-warning" />
                            </div>
                            <div>
                                <h3 className="mb-0">{adminCount}</h3>
                                <p className="text-muted mb-0">Admins</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={6} className="mb-3 mb-md-0">
                            <InputGroup>
                                <InputGroup.Text><FiSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Search by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            <Form.Select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                <option value="user">Users</option>
                                <option value="admin">Admins</option>
                            </Form.Select>
                        </Col>
                        <Col md={3} className="text-end">
                            <span className="text-muted">
                                Showing {filteredUsers.length} of {users.length}
                            </span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Users Table */}
            <Card className="shadow-sm">
                <div className="table-responsive">
                    <Table className="data-table mb-0">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Phone</th>
                                <th>Joined</th>
                                <th>Role</th>
                                <th>Addresses</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-5">
                                        <FiUsers size={40} className="text-muted mb-2" />
                                        <p className="text-muted mb-0">No users found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: '45px',
                                                        height: '45px',
                                                        background: 'var(--primary-gradient)',
                                                        color: '#fff',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="mb-0 fw-semibold">{user.name || 'N/A'}</p>
                                                    <small className="text-muted">{user.email}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.phone || 'N/A'}</td>
                                        <td>
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })
                                                : 'N/A'
                                            }
                                        </td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={user.role || 'user'}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                style={{ width: 'auto' }}
                                                className={user.role === 'admin' ? 'text-warning' : ''}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Badge bg="light" text="dark">
                                                {user.address?.length || 0} saved
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card>
        </>
    );
};

export default AdminUsers;
