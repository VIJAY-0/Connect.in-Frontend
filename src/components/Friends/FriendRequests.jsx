// src/components/Friends/FriendRequests.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Friends.css';
import { API_BASE_URL } from '../../a_VARIABLES/const';


const FriendRequests = () => {
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}api/friends/requests/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setRequests(data);
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRequest = async (requestId, action) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/friends/request/handle/${requestId}/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action })
                }
            );
            
            if (response.ok) {
                // Remove the handled request from the list
                setRequests(requests.filter(req => req.id !== requestId));
            } else {
                const data = await response.json();
                throw new Error(data.error);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="friend-requests">
            <h2>Friend Requests</h2>
            {requests.length === 0 ? (
                <p>No pending friend requests</p>
            ) : (
                <div className="requests-list">
                    {requests.map(request => (
                        <div key={request.id} className="request-card">
                            <img 
                                src={request.sender.profile_picture || '/default-avatar.png'} 
                                alt={request.sender.username}
                                className="profile-pic"
                            />
                            <div className="request-info">
                                <h3>{request.sender.username}</h3>
                                <p>{request.sender.email}</p>
                            </div>
                            <div className="request-actions">
                                <button 
                                    onClick={() => handleRequest(request.id, 'accept')}
                                    className="accept-btn"
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={() => handleRequest(request.id, 'reject')}
                                    className="reject-btn"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendRequests;