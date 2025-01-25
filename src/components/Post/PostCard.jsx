// src/components/Post/Post.jsx
import { useState } from 'react';
import PostActions from './PostActions';
import Comments from './Comments';
import './PostCard.css';
import { API_BASE_URL } from '../../a_VARIABLES/const';


const PostCard = ({ post: initialPost }) => {
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

    return (
        <div className="post">
            <div className="post-header">
                <img 
                    src={post.user.profile_picture || '/default-avatar.png'} 
                    alt={post.user.username}
                    className="user-avatar"
                />
                <span className="username">{post.user.username}</span>
            </div>

            <div className="post-image">
                <img src={post.image} alt={post.caption} />
            </div>

            {post.caption && (
                <div className="post-caption">
                    <span className="username">{post.user.username}</span>
                    <span className="caption">{post.caption}</span>
                </div>
            )}


            <PostActions 
                post={post}
                onLikeUpdate={handleLikeUpdate}
                onCommentAdd={handleCommentAdd}
            />

            <Comments 
                comments={post.comments}
                postId={post.id}
                onCommentLike={handleCommentLike}
            />
            
        </div>
    );
};

export default PostCard;