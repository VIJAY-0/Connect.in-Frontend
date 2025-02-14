import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';
import { API_BASE_URL } from '../../a_VARIABLES/const';
import PostCard from './../Post/PostCard';
import MediaGrid from '../MediaGrid/MediaGrid';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import WallPopup from './WallPopup/WallPopup';
import WallsCarousel from './WallCarousel/WallsCarousel';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [walls, setWalls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isWallPopupOpen, setIsWallPopupOpen] = useState(false);
  // const [newWallData, setNewWallData] = useState({ name: '', thumbnail: null, images: [] });
  const [editData, setEditData] = useState({
    bio: '',
    profile_picture: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}api/profile/${currentUser.username}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.user);
      setPosts(data.posts);
      setWalls(data.walls || []);
      setEditData({ bio: data.user.bio });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWallClick = (wallId) => {
    navigate(`/wall/${wallId}`);
  };

  const handleCreateWall = async (data) => {
    console.log("onclick happened")
    console.log(data)
  try {
      console.log(data)
      // setNewWallData(data)
      // console.log(newWallData)
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
      data.images.forEach((image, index) => formData.append(`images[${index}]`, image));

      console.log(formData)
      const response = await fetch(`${API_BASE_URL}api/createwall/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to create wall');
      }

      setIsWallPopupOpen(false);
      fetchProfile();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profile) return <div className="profile-error">Profile not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          <img 
            src={profile.profile_picture || '/default-avatar.png'} 
            alt={`${profile.username}'s profile`} 
          />
        </div>
        
        <div className="profile-info">
          <div className="profile-actions">
            <h2>{profile.username}</h2>
            {currentUser.username === username ? (
              <button 
                className="edit-profile-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                Edit Profile
              </button>
            ) : (
              <button 
                className="follow-btn"
                onClick={handleFollow}
              >
                {profile.is_following ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          <div className="profile-stats">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{profile.followers_count}</strong> followers</span>
            <span><strong>{profile.following_count}</strong> following</span>
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="edit-profile-form">
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Bio"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditData({ 
                  ...editData, 
                  profile_picture: e.target.files[0] 
                })}
              />
              <div className="edit-profile-buttons">
                <button type="submit">Save Changes</button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-bio">
              <p>{profile.bio}</p>
            </div>
          )}
        </div>
      </div>

      <button className="add-wall-btn" onClick={() => setIsWallPopupOpen(true)}>Add New Wall</button>
      {isWallPopupOpen && <WallPopup onClose={() => setIsWallPopupOpen(false)} onCreate={handleCreateWall}/>}
      

      <WallsCarousel walls ={walls}/>

      <div className="profile-posts">
        <MediaGrid posts={posts} />
      </div>
    </div>
  );
};

export default Profile;
