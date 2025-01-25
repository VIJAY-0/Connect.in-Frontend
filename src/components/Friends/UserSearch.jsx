// src/components/Friends/UserSearch.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../a_VARIABLES/const';

import './Friends.css';

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleSearch = async (e) => {
    e.preventDefault();
    // if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      //TODO token form useAuth
      const token = localStorage.getItem('token');
      // console.log("used Token For search :",token)
      const response = await fetch(
        `${API_BASE_URL}api/friends/search/?q=${encodeURIComponent(searchQuery)}`,
        {
          method:'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Search response ',response); // Debug log

      const data = await response.json();

      console.log(data)
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search users');
      }

      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const sendFriendRequest = async (userId) => {

    try {
      const token =localStorage.getItem('token')
      const response = await fetch(
        `${API_BASE_URL}api/friends/request/send/${userId}/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Search response status:', response.status); // Debug log

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send friend request');
      }

      // Update UI to show request sent
      setSearchResults(results => 
        results.map(user => 
          user.id === userId 
            ? { ...user, requestSent: true }
            : user
        )
      );
    } catch (err) {
      console.log(err)
      setError(err.message);
    }
  };

  return (
    <div className="user-search">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="search-input"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="search-results">
        {searchResults.map(user => (
          <div key={user.id} className="user-card">
            <img 
              src={user.profile_picture || '/default-avatar.png'} 
              alt={user.username} 
              className="user-avatar"
            />
            <div className="user-info">
              <h3>{user.username}</h3>
              <p>{user.email}</p>
            </div>

            <button
              onClick={() => sendFriendRequest(user.id)}
              disabled={user.requestSent || user.is_following || user.friend_request_sent}
              className="friend-request-btn"
            >
              {console.log(user)}
              { user.is_following ?'Friend Already' : (user.friend_request_sent ? 'Request Sent' : 'Add Friend')}
            </button>
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;