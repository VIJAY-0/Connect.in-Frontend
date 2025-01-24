// src/components/Post/Comments.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Comments.css';
import { API_BASE_URL } from '../../a_VARIABLES/const';


const Comments = ({ comments, postId, onCommentLike }) => {
    const { token } = useAuth();
    const [visibleComments, setVisibleComments] = useState(3);

    const handleLikeComment = async (commentId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}comments/${commentId}/like/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            const data = await response.json();
            if (response.ok && onCommentLike) {
                onCommentLike(data.comment);
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    return (
        <div className="comments-section">
            {comments.length > 3 && visibleComments < comments.length && (
                <button 
                    className="view-more-btn"
                    onClick={() => setVisibleComments(prev => prev + 3)}
                >
                    View more comments
                </button>
            )}

            {comments.slice(0, visibleComments).map(comment => (
                <div key={comment.id} className="comment">
                    <div className="comment-content">
                        <span className="username">{comment.user.username}</span>
                        <span className="text">{comment.text}</span>
                    </div>
                    <div className="comment-actions">
                        <button 
                            onClick={() => handleLikeComment(comment.id)}
                            className={`like-button ${comment.is_liked ? 'liked' : ''}`}
                        >
                            <i className={`fas fa-heart ${comment.is_liked ? 'liked' : ''}`}></i>
                        </button>
                        <span className="likes-count">
                            {comment.likes_count}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Comments;