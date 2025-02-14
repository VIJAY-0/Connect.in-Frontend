// MediaGrid.js
import React, { useState , useCallback,useMemo } from 'react';
import Modal from './Modal';
import PostDetail from './PostDetails/PostDetails';
import './MediaGrid.css';
const MediaGrid = ({ posts }) => {
    const [selectedPost, setSelectedPost] = useState(null);
  
    const handlePostClick = useCallback((post) => {
      setSelectedPost(post);
    }, []);
  
    const handleCloseModal = useCallback(() => {
      setSelectedPost(null);
    }, []);



    const postSizes = useMemo(() => {
      const pattern = [
          'post-small',
          'post-small',
          'post-large',
          'post-small',
          'post-small',
          'post-horizontal',
          'post-medium',
          'post-vertical',
          'post-horizontal',
          'post-small',
      ];
  
      return posts.map((_, index) => pattern[index % pattern.length]);
  }, [posts]); 

  
    return (
        <>
            <div className="media-grid">
                {posts.map((post , index) => (
                    <Post 
                        key={post.id}
                        post={post}
                        sizeClass={postSizes[index]}
                        onClick={handlePostClick}
                    />
                ))}
            </div>

            <Modal 
                isOpen={selectedPost !== null}
                onClose={handleCloseModal}
            >
                {selectedPost && <PostDetail post={selectedPost} />}
            </Modal>
        </>
    );
};

// Utility function for stable random number generation
const seededRandom = (seed) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
};


// Post.js
const Post = ({ post,sizeClass, onClick }) => {
    const isLarge = Math.random() > 0.7;
  
    return (
      <div 
        className={`post-item ${sizeClass}`}
        onClick={() => onClick(post)}
      >
        <div className="post-content">
          <img src={post.image_url} alt={post.title} />
          <div className="overlay">
            <h3>{post.caption}</h3>
            <p>{post.caption}</p>
          </div>
        </div>
      </div>
    );
  };

  
export default MediaGrid;