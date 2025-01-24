// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import UserSearch from './components/Friends/UserSearch';
import FriendsList from './components/Friends/FriendsList';
import FriendRequests from './components/Friends/FriendRequests';
import FriendProfile from './components/Profile/FriendsProfile';


function App() {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <Register />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/search" 
            element={user ? <UserSearch /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={user ? <div>Home Feed</div> : <Navigate to="/login" />} 
          />

           <Route 
            path="/friends/requests" 
            element={user ? <FriendRequests /> : <Navigate to="/login" />} 
          />

           <Route 
            path="/friends" 
            element={user ? <FriendsList /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/profile/:username" 
            element={user ? <FriendProfile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/:username" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;