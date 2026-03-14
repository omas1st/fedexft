import React from 'react';

const TrackingResult = ({ data }) => {
    const getStatusClass = (status) => {
        return `status-badge status-${status}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <div className="tracking-result">
            <div className="result-header">
                <h2>Tracking #{data.trackingNumber}</h2>
                <div className={getStatusClass(data.currentStage)}>
                    {data.currentStage.replace('_', ' ').toUpperCase()}
                </div>
            </div>

            <div className="result-details">
                <div className="detail-row">
                    <span className="detail-label">Recipient:</span>
                    <span className="detail-value">{data.recipientName}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Destination:</span>
                    <span className="detail-value">{data.destination}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Origin:</span>
                    <span className="detail-value">{data.origin}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Package:</span>
                    <span className="detail-value">
                        {data.packageDescription} ({data.packageWeight} kg)
                    </span>
                </div>
                {data.estimatedDelivery && (
                    <div className="detail-row">
                        <span className="detail-label">Est. Delivery:</span>
                        <span className="detail-value">
                            {formatDate(data.estimatedDelivery)}
                        </span>
                    </div>
                )}
                {data.signature && (
                    <div className="detail-row">
                        <span className="detail-label">Signature:</span>
                        <span className="detail-value">
                            <img 
                                src={data.signature} 
                                alt="Signature" 
                                style={{ maxHeight: '50px' }}
                            />
                        </span>
                    </div>
                )}

                <div className="timeline">
                    <h3>Tracking History</h3>
                    {data.stages.map((stage, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-time">
                                {formatDate(stage.timestamp)}
                            </div>
                            <div className="timeline-content">
                                <h4>{stage.stage.replace('_', ' ').toUpperCase()}</h4>
                                <p>{stage.location}</p>
                                {stage.description && <p>{stage.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrackingResult;