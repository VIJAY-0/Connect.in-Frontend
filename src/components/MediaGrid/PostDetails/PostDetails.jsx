// PostDetail.js
import React, { useState } from 'react';
import './PostDetails.css';
import PostActions from '../../Post/PostActions';

const PostDetail = ({ post: initialPost }) => {

  const [post, setPost] = useState(initialPost);
    const handleLikeUpdate = (updatedPost) => {
        setPost(updatedPost);
    };

    const handleCommentAdd = (newComment) => {
        setPost(prev => ({
            ...prev,
            comments: [newComment, ...prev.comments]
        }));
    };

    const handleCommentLike = (updatedComment) => {
        setPost(prev => ({
            ...prev,
            comments: prev.comments.map(comment => 
                comment.id === updatedComment.id ? updatedComment : comment
            )
        }));
    };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === post.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? post.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <h2>{post.caption}</h2>
        <div className="post-meta">
          <span>Posted by {post.user.username}</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="image-gallery">
        <button className="nav-button prev" onClick={prevImage}>❮</button>
        <div className="image-container">
          <img 
            // src={post.images[currentImageIndex]} 
            src={post.image} 
            alt={`${post.title} - ${currentImageIndex + 1}`} 
          />
          <div className="image-counter">
            {currentImageIndex + 1} / {"5"}
          </div>
        </div>
        <button className="nav-button next" onClick={nextImage}>❯</button>
        
        {/* <div className="thumbnail-strip">
          {post.images.map((img, index) => (
            <img 
              key={index}
              src={img}
              alt={`thumbnail ${index + 1}`}
              className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
         */}

      </div>

      <div className="post-content">
        <p>{post.description}</p>
      </div>

      
      <PostActions 
                post={post}
                onLikeUpdate={handleLikeUpdate}
                onCommentAdd={handleCommentAdd}
            />
      
      <div className="remarks-section">
        <h3>Remarks</h3>
        <div className="remarks-list">
          {post.comments.map(remark => (
            <div key={remark.id} className="remark">
              <strong>{remark.user.username}</strong>
              <p>{remark.text}</p>
            </div>
          ))}
        </div>
      </div>

      

    </div>
  );
};

export default PostDetail;