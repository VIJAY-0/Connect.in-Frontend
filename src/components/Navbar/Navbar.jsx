// src/components/Navbar/Navbar.jsx
import { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CreatePost from '../Post/CreatePost';
import './Navbar.css';
import { API_BASE_URL } from '../../a_VARIABLES/const';


const Navbar = () => {
  const { user } = useAuth();
  const { token } = useAuth();
  const { logout } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(0);  
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    const fetchPendingRequests = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}api/friends/requests/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setPendingRequests(data.length);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    fetchPendingRequests();
    // You could add an interval to periodically check for new requests
    const interval = setInterval(fetchPendingRequests, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
}, [token]);



  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className='navbar-logo'>

            <Link to="/" className="navbar-logo-container">
            <img  className='navbar-logo' src="Connections/1.png"
             alt="" />
              connect.in
            </Link>
          </div>

          <div className="navbar-actions">
          <Link to="/search" className="nav-link">
            Search Users
          </Link>
            <button 
              onClick={() => setShowCreatePost(true)}
              className="create-post-button"
            >
              <i className="fas fa-plus-square"></i>
              Create Post
            </button>

            <Link to="/friends/requests" className="nav-item friend-requests-link">
                        <i className="fas fa-user-friends"></i>
                        {pendingRequests > 0 && (
                            <span className="requests-badge">{pendingRequests}</span>
                        )}
                    </Link>

            <div className="dropdown">
                        <Link to={`/${user.username}`} className="profile-link">
                          Profile
                        </Link>
                        {/* <img 
                            src={user?.profile_picture || '/default-avatar.png'} 
                            alt="..." 
                            className="profile-pic"
                        /> */}
                        <div className="dropdown-content">
                            <Link to="/friends">Friends</Link>
                            <button onClick={logout}>Logout</button>
                        </div>
            </div>
          </div>
        
        </div>
      </nav>

      {showCreatePost && (
        <CreatePost 
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            // Optionally refresh the feed or handle the new post
            setShowCreatePost(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;