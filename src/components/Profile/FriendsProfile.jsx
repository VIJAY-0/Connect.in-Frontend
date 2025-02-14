// src/components/Profile/FriendProfile.jsx
import { useState, useEffect } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';
import { API_BASE_URL } from '../../a_VARIABLES/const';

import Comments from '../Post/Comments';
import PostActions from '../Post/PostActions';
import PostCard from '../Post/PostCard';

import Wall from './../Wall/Wall'
import MediaGrid from '../MediaGrid/MediaGrid';


const FriendProfile = () => {
    const { username } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [walls, setWalls] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [username]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}api/profile/${username}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            
            if (response.ok) {
                setProfile(data);
                setWalls(data.walls)
                console.log(data)
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleWallClick = (wallId) => {
        navigate(`/wall/${wallId}`);
      };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!profile) return <div>Profile not found</div>;

    return (
        
        <div className="profile-container">
            {console.log(profile)}
            <div className="profile-header">
                <img 
                    src={profile.user.profile_picture || '/default-avatar.png'} 
                    alt={profile.username}
                    className="profile-pic"
                />
                <div className="profile-info">
                    <h2>{profile.user.username}</h2>
                    <p>{profile.email}</p>
                    <p className="bio">{profile.bio}</p>
                </div>
            </div>
            
            <div className="profile-stats">
                <div className="stat">
                    <span className="count">{profile.posts_count}</span>
                    <span className="label">Posts</span>
                </div>
                <div className="stat">
                    <span className="count">{profile.followers_count}</span>
                    <span className="label">Followers</span>
                </div>
                <div className="stat">
                    <span className="count">{profile.following_count}</span>
                    <span className="label">Following</span>
                </div>
            </div>



    <div className="walls-container">
    <h2 className="walls-heading">Walls</h2>
    <div id="walls" className="walls-carousel">
      {walls.map((wall) => (
        <div key={wall.id} className="wall-item" onClick={() => handleWallClick(wall.id)}>
          <img src={wall.thumbnails || "/default-wall.png"} alt={wall.name} />
          <p>{wall.name}</p>
        </div>
      ))}
    </div>
  </div>

      {/* <div className="profile-posts">
        <MediaGrid posts={posts} />
      </div> */}

        </div>
    );
};

export default FriendProfile;















