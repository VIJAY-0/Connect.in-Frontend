// src/components/Friends/FriendsList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../a_VARIABLES/const';

import './Friends.css';

const FriendsList = () => {
    const { token } = useAuth();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}api/friends/list/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setFriends(data);
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="friends-list">
            <h2>My Friends</h2>
            {friends.length === 0 ? (
                <p>You haven't added any friends yet</p>
            ) : (
                <div className="friends-grid">
                    {
                        console.log(friends)
                    }
                    {friends.map(friend => (
                        <Link 
                            to={`/profile/${friend.username}`} 
                            key={friend.id} 
                            className="friend-card"
                        >
                            <img 
                                src={friend.profile_picture || '/default-avatar.png'} 
                                alt={friend.username}
                                className="profile-pic"
                            />
                            <div className="friend-info">
                                <h3>{friend.username}</h3>
                                <p>{friend.email}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendsList;