// src/components/Navbar/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CreatePost from '../Post/CreatePost';
import { useGlobalContext } from '../../context/GlobalContextProvider';
import './Navbar.css';
import { API_BASE_URL } from '../../a_VARIABLES/const';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(0);
  // const [showCreatePost, setShowCreatePost] = useState(false);
  const {showCreatePost, setShowCreatePost} = useGlobalContext(); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State to track mobile menu

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/friends/requests/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setPendingRequests(data.length);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [token]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/" 
             onClick={() => {
              closeMobileMenu();
            }}
            className="navbar-logo-container">
              <img className="navbar-logo-img" src="Circles/1.jpg" alt="" />
              Circles
            </Link>
          </div>

          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <i className="fas fa-bars"></i>
          </button>

          <div className={`navbar-actions ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/search" className="nav-link" onClick={closeMobileMenu}>
              Search Users
            </Link>

            <Link to=""
              onClick={() => {
                setShowCreatePost(true);
                closeMobileMenu();
              }}
              className="nav-link"
            >
              {/* <i className="fas fa-plus-square"></i> */}
              Create Post
            </Link>

            <Link
              to="/friends/requests"
              // className="nav-item friend-requests-link"
              className="nav-link"
              onClick={closeMobileMenu}
              >
              Friend Requests
              {/* <i className="fas fa-user-friends"></i> */}
              {pendingRequests > 0 && (
                <span className="requests-badge">{pendingRequests}</span>
              )}
            </Link>

            <Link to="/friends" 
              className="nav-link"
            onClick={closeMobileMenu}>
                  Friends
                </Link>

            <Link
                to={`/${user.username}`}
                className="profile-link nav-link"
                onClick={closeMobileMenu}
              >
                Profile
              </Link>

              <Link
                className='nav-link'
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                >
                  Logout
                </Link>

          </div>
        </div>
      </nav>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)

          }
          onPostCreated={() => {
            setShowCreatePost(false);
            // navigate('/newPage');
            window.location.reload();
          }}
        />
      )}
    </>
  );
};

export default Navbar;