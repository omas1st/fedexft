import React, { useState } from 'react';
import axios from 'axios';
import TrackingResult from './TrackingResult';

const TrackingForm = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!trackingNumber.trim()) {
            setError('Please enter a tracking number');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/tracking/${trackingNumber}`
            );
            setTrackingData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Tracking number not found');
            setTrackingData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tracking-container">
            <h1 className="tracking-title">Track Your Package</h1>
            
            <form onSubmit={handleSubmit} className="tracking-form">
                <input
                    type="text"
                    className="tracking-input"
                    placeholder="Enter tracking number (e.g., 123456....)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                />
                <button type="submit" className="tracking-btn" disabled={loading}>
                    {loading ? 'Tracking...' : 'Track'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}
            
            {trackingData && <TrackingResult data={trackingData} />}
        </div>
    );
};

export default TrackingForm;