// src/components/Post/PostActions.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './PostActions.css';
import { API_BASE_URL } from '../../a_VARIABLES/const';


const PostActions = ({ post, onLikeUpdate, onCommentAdd }) => {
    const { token } = useAuth();
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}api/posts/${post.id}/like/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            const data = await response.json();
            if (response.ok && onLikeUpdate) {
                onLikeUpdate(data.post);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}api/posts/${post.id}/comment/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: comment })
                }
            );
            
            const data = await response.json();
            if (response.ok && onCommentAdd) {
                onCommentAdd(data);
                setComment('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-actions">
            <div className="action-buttons">
                <button 
                    onClick={handleLike}
                    className={`like-button ${post.is_liked ? 'liked' : ''}`}
                >
                    <i className={`fas fa-heart ${post.is_liked ? 'liked' : ''}`}></i>
                </button>
                <button className="comment-button">
                    <i className="fas fa-comment"></i>
                </button>
            </div>
            
            <div className="likes-count">
                {post.likes_count} likes
            </div>

            <form onSubmit={handleComment} className="comment-form">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    disabled={!comment.trim() || loading}
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default PostActions;