// Profile Page - User profile management
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs, ListGroup, Modal } from 'react-bootstrap';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getUserById, updateUserProfile, addUserAddress, updateUserAddress, deleteUserAddress } from '../../services/userService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { currentUser, updateUserProfile: updateAuthProfile } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: 'Tamil Nadu',
        pincode: ''
    });

    useEffect(() => {
        loadUserData();
    }, [currentUser]);

    const loadUserData = async () => {
        try {
            const data = await getUserById(currentUser.uid);
            setUserData(data);
            setFormData({
                name: data?.name || '',
                phone: data?.phone || ''
            });
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            await updateUserProfile(currentUser.uid, formData);
            setUserData({ ...userData, ...formData });
            setEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Error updating profile');
        }
    };

    const handleAddAddress = async () => {
        if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.pincode) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            if (editingAddress) {
                await updateUserAddress(currentUser.uid, editingAddress.id, addressForm);
                toast.success('Address updated');
            } else {
                await addUserAddress(currentUser.uid, addressForm);
                toast.success('Address added');
            }
            loadUserData();
            closeAddressModal();
        } catch (error) {
            toast.error('Error saving address');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await deleteUserAddress(currentUser.uid, addressId);
                loadUserData();
                toast.success('Address deleted');
            } catch (error) {
                toast.error('Error deleting address');
            }
        }
    };

    const openEditAddress = (address) => {
        setEditingAddress(address);
        setAddressForm(address);
        setShowAddressModal(true);
    };

    const closeAddressModal = () => {
        setShowAddressModal(false);
        setEditingAddress(null);
        setAddressForm({
            name: '',
            phone: '',
            street: '',
            city: '',
            state: 'Tamil Nadu',
            pincode: ''
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page py-5">
            <Container>
                <div className="section-header mb-4">
                    <h1 className="section-title">My Profile</h1>
                    <p className="section-subtitle">Manage your account settings and addresses</p>
                </div>

                <Tabs defaultActiveKey="profile" className="mb-4">
                    {/* Profile Tab */}
                    <Tab eventKey="profile" title="Profile Details">
                        <Card className="shadow-sm">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="mb-0">Personal Information</h5>
                                    {!editing ? (
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => setEditing(true)}
                                        >
                                            <FiEdit2 className="me-1" /> Edit
                                        </Button>
                                    ) : (
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => setEditing(false)}
                                            >
                                                <FiX className="me-1" /> Cancel
                                            </Button>
                                            <Button
                                                className="btn-primary-custom"
                                                size="sm"
                                                onClick={handleProfileUpdate}
                                            >
                                                <FiSave className="me-1" /> Save
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Row>
                                    <Col md={6}>
                                        <div className="mb-4">
                                            <label className="form-label text-muted small">
                                                <FiUser className="me-1" /> Full Name
                                            </label>
                                            {editing ? (
                                                <Form.Control
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            ) : (
                                                <p className="mb-0 fw-semibold">{userData?.name || 'Not set'}</p>
                                            )}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-4">
                                            <label className="form-label text-muted small">
                                                <FiMail className="me-1" /> Email Address
                                            </label>
                                            <p className="mb-0 fw-semibold">{currentUser?.email}</p>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-4">
                                            <label className="form-label text-muted small">
                                                <FiPhone className="me-1" /> Phone Number
                                            </label>
                                            {editing ? (
                                                <Form.Control
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    maxLength={10}
                                                />
                                            ) : (
                                                <p className="mb-0 fw-semibold">{userData?.phone || 'Not set'}</p>
                                            )}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-4">
                                            <label className="form-label text-muted small">Member Since</label>
                                            <p className="mb-0 fw-semibold">
                                                {userData?.createdAt
                                                    ? new Date(userData.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })
                                                    : 'N/A'
                                                }
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Tab>

                    {/* Addresses Tab */}
                    <Tab eventKey="addresses" title="Addresses">
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    <FiMapPin className="me-2" /> Saved Addresses
                                </h5>
                                <Button
                                    className="btn-primary-custom"
                                    size="sm"
                                    onClick={() => setShowAddressModal(true)}
                                >
                                    <FiPlus className="me-1" /> Add New Address
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {(!userData?.address || userData.address.length === 0) ? (
                                    <div className="text-center py-5">
                                        <FiMapPin size={50} className="text-muted mb-3" />
                                        <p className="text-muted">No saved addresses</p>
                                        <Button
                                            className="btn-primary-custom"
                                            onClick={() => setShowAddressModal(true)}
                                        >
                                            Add Address
                                        </Button>
                                    </div>
                                ) : (
                                    <Row>
                                        {userData.address.map((address, index) => (
                                            <Col md={6} key={address.id || index} className="mb-3">
                                                <Card className="h-100">
                                                    <Card.Body>
                                                        <div className="d-flex justify-content-between">
                                                            <h6 className="mb-1">{address.name}</h6>
                                                            <div className="d-flex gap-2">
                                                                <FiEdit2
                                                                    className="text-primary cursor-pointer"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => openEditAddress(address)}
                                                                />
                                                                <FiTrash2
                                                                    className="text-danger cursor-pointer"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => handleDeleteAddress(address.id)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="text-muted small mb-1">{address.phone}</p>
                                                        <p className="small mb-0">
                                                            {address.street}, {address.city}, {address.state} - {address.pincode}
                                                        </p>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>
                    </Tab>

                    {/* Security Tab */}
                    <Tab eventKey="security" title="Security">
                        <Card className="shadow-sm">
                            <Card.Body className="p-4">
                                <h5 className="mb-4">Security Settings</h5>
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                                        <div>
                                            <h6 className="mb-1">Change Password</h6>
                                            <small className="text-muted">Update your account password</small>
                                        </div>
                                        <Button variant="outline-primary" size="sm">Change</Button>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                                        <div>
                                            <h6 className="mb-1">Two-Factor Authentication</h6>
                                            <small className="text-muted">Add extra security to your account</small>
                                        </div>
                                        <Button variant="outline-secondary" size="sm">Enable</Button>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center py-3">
                                        <div>
                                            <h6 className="mb-1 text-danger">Delete Account</h6>
                                            <small className="text-muted">Permanently delete your account</small>
                                        </div>
                                        <Button variant="outline-danger" size="sm">Delete</Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Tab>
                </Tabs>

                {/* Add/Edit Address Modal */}
                <Modal show={showAddressModal} onHide={closeAddressModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingAddress ? 'Edit Address' : 'Add New Address'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={addressForm.name}
                                            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                            placeholder="Enter full name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            value={addressForm.phone}
                                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                            placeholder="Enter phone number"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Street Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={addressForm.street}
                                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                    placeholder="House No, Building, Street, Area"
                                />
                            </Form.Group>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                            placeholder="City"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={addressForm.state}
                                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>PIN Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={addressForm.pincode}
                                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                            placeholder="PIN Code"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeAddressModal}>
                            Cancel
                        </Button>
                        <Button className="btn-primary-custom" onClick={handleAddAddress}>
                            {editingAddress ? 'Update' : 'Save'} Address
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default ProfilePage;
