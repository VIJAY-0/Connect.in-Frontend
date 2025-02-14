import { useContext, useEffect, useState } from "react";
// import axios from "axios";
import MediaGrid from "./../MediaGrid/MediaGrid";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../a_VARIABLES/const";
import { useAuth } from "../../context/AuthContext";
import './Wall.css'
import { useGlobalContext } from "../../context/GlobalContextProvider";

const Wall = () => {
 const{wallId} = useParams()
 const { token } = useAuth();
  const {showCreatePost, setShowCreatePost} = useGlobalContext();
  const {wall, setWall} = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}api/wall/${wallId}/posts/`,
            {
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            }
        );
        const data = await response.json()
        setWall(data);
      } catch (err) {
        setError("Failed to fetch wall data");
      } finally {
        setLoading(false);
      }
    };

    fetchWallData();
  }, [wallId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  const toogleSetShowCreate = async () => {
    setShowCreatePost(!showCreatePost); // ✅ Move state update inside this event handler
  };

  return (
    <div className="wall-container">
      <div className="wall-header">
        <h2>{wall.wall}</h2>
      </div>
      <div className="thumbnails">
        {wall.thumbnails?.map((thumb, index) => (
          <img key={index} src={thumb} alt="Thumbnail" className="thumbnail" />
        ))}
      </div>
      <div className="wall-content">
        <h3>Posts ({wall.posts_count})</h3>
        <button className="add-post-button" onClick={toogleSetShowCreate}>Add Post</button>
      </div>
        <MediaGrid posts={wall.posts} />
    </div>
  );
};

export default Wall;
