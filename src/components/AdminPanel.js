import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('create');
    const [trackingList, setTrackingList] = useState([]);
    const [selectedTracking, setSelectedTracking] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        trackingNumber: '',
        recipientName: '',
        recipientAddress: '',
        recipientPhone: '',
        packageDescription: '',
        packageWeight: '',
        origin: '',
        destination: '',
        estimatedDelivery: ''
    });

    const [stageData, setStageData] = useState({
        stage: 'pending',
        location: '',
        description: ''
    });

    // Memoize showMessage to prevent unnecessary re-renders
    const showMessage = useCallback((type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, []);

    // Memoize fetchTrackingList to include in useEffect dependencies
    const fetchTrackingList = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/tracking`,
                { headers: { 'x-auth-token': token } }
            );
            setTrackingList(response.data);
        } catch (error) {
            showMessage('error', 'Failed to fetch tracking list');
        }
    }, [showMessage]);

    useEffect(() => {
        fetchTrackingList();
    }, [fetchTrackingList]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleStageChange = (e) => {
        setStageData({
            ...stageData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/tracking`,
                formData,
                { headers: { 'x-auth-token': token } }
            );
            
            showMessage('success', 'Tracking entry created successfully');
            setFormData({
                trackingNumber: '',
                recipientName: '',
                recipientAddress: '',
                recipientPhone: '',
                packageDescription: '',
                packageWeight: '',
                origin: '',
                destination: '',
                estimatedDelivery: ''
            });
            fetchTrackingList();
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Creation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleStageUpdate = async (e) => {
        e.preventDefault();
        if (!selectedTracking) return;
        
        setLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/tracking/${selectedTracking.trackingNumber}/stage`,
                stageData,
                { headers: { 'x-auth-token': token } }
            );
            
            showMessage('success', 'Stage updated successfully');
            setSelectedTracking(null);
            setStageData({ stage: 'pending', location: '', description: '' });
            fetchTrackingList();
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (trackingNumber) => {
        if (!window.confirm('Are you sure you want to delete this tracking entry?')) {
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/tracking/${trackingNumber}`,
                { headers: { 'x-auth-token': token } }
            );
            
            showMessage('success', 'Tracking entry deleted successfully');
            fetchTrackingList();
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Deletion failed');
        } finally {
            setLoading(false);
        }
    };

    const openStageUpdate = (tracking) => {
        setSelectedTracking(tracking);
        setStageData({
            stage: tracking.currentStage,
            location: tracking.destination,
            description: ''
        });
    };

    return (
        <div className="admin-container">
            <h1 className="tracking-title">Admin Panel</h1>
            
            {message.text && (
                <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
                    {message.text}
                </div>
            )}

            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    Create New
                </button>
                <button
                    className={`admin-tab ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    View All
                </button>
                {selectedTracking && (
                    <button
                        className={`admin-tab ${activeTab === 'update' ? 'active' : ''}`}
                        onClick={() => setActiveTab('update')}
                    >
                        Update Stage
                    </button>
                )}
            </div>

            {activeTab === 'create' && (
                <form onSubmit={handleCreateSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Tracking Number *</label>
                        <input
                            type="text"
                            name="trackingNumber"
                            value={formData.trackingNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Recipient Name *</label>
                        <input
                            type="text"
                            name="recipientName"
                            value={formData.recipientName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Recipient Address *</label>
                        <textarea
                            name="recipientAddress"
                            value={formData.recipientAddress}
                            onChange={handleInputChange}
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Recipient Phone *</label>
                        <input
                            type="tel"
                            name="recipientPhone"
                            value={formData.recipientPhone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Package Description *</label>
                        <textarea
                            name="packageDescription"
                            value={formData.packageDescription}
                            onChange={handleInputChange}
                            rows="2"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Package Weight (kg) *</label>
                        <input
                            type="number"
                            name="packageWeight"
                            value={formData.packageWeight}
                            onChange={handleInputChange}
                            step="0.1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Origin *</label>
                        <input
                            type="text"
                            name="origin"
                            value={formData.origin}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Destination *</label>
                        <input
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Estimated Delivery Date</label>
                        <input
                            type="date"
                            name="estimatedDelivery"
                            value={formData.estimatedDelivery}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Tracking Entry'}
                    </button>
                </form>
            )}

            {activeTab === 'list' && (
                <div className="tracking-list">
                    <table className="tracking-table">
                        <thead>
                            <tr>
                                <th>Tracking #</th>
                                <th>Recipient</th>
                                <th>Destination</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trackingList.map((tracking) => (
                                <tr key={tracking._id}>
                                    <td>{tracking.trackingNumber}</td>
                                    <td>{tracking.recipientName}</td>
                                    <td>{tracking.destination}</td>
                                    <td>
                                        <span className={`status-badge status-${tracking.currentStage}`}>
                                            {tracking.currentStage.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => openStageUpdate(tracking)}
                                            className="action-btn edit-btn"
                                        >
                                            Update Stage
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tracking.trackingNumber)}
                                            className="action-btn delete-btn"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'update' && selectedTracking && (
                <form onSubmit={handleStageUpdate} className="admin-form">
                    <h2>Update Stage for {selectedTracking.trackingNumber}</h2>
                    
                    <div className="form-group">
                        <label>Current Status</label>
                        <select
                            name="stage"
                            value={stageData.stage}
                            onChange={handleStageChange}
                            required
                        >
                            <option value="pending">Pending</option>
                            <option value="picked_up">Picked Up</option>
                            <option value="in_transit">In Transit</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="exception">Exception</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={stageData.location}
                            onChange={handleStageChange}
                            placeholder="Current location"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={stageData.description}
                            onChange={handleStageChange}
                            rows="3"
                            placeholder="Additional details about this stage"
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Stage'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default AdminPanel;