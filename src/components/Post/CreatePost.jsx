// src/components/Post/CreatePost.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CreatePost.css';
import { API_BASE_URL } from '../../a_VARIABLES/const';
import { useGlobalContext } from '../../context/GlobalContextProvider';

const CreatePost = ({ onClose, onPostCreated }) => {
  const { user } = useAuth();
  const { wall } = useGlobalContext();

  // Updated states to handle multiple images
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Handle multiple image changes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate selected files
    const validImages = [];
    const validPreviews = [];
    const unsupportedFiles = [];

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        validImages.push(file);
        validPreviews.push(URL.createObjectURL(file));
      } else {
        unsupportedFiles.push(file.name);
      }
    });

    if (unsupportedFiles.length > 0) {
      setError(`Unsupported file types: ${unsupportedFiles.join(', ')}`);
    } else {
      setError('');
    }

    // Update state with valid images
    setImages((prevImages) => [...prevImages, ...validImages]);
    setPreviews((prevPreviews) => [...prevPreviews, ...validPreviews]);
  };

  // Remove a selected image
  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image); // Ensure backend expects 'images'
      console.log(image)
    });
    formData.append('caption', caption);
    formData.append('wall', wall.wall_id);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      console.log('Token being used:', token); // Debug log

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}api/posts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, let the browser set it with the boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        console.log('Erroor')
        console.log(data.error)
        throw new Error(data.detail || 'Failed to create post');
      }

      const data = await response.json();
      if (onPostCreated) {
        onPostCreated(data);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-modal">
      <div className="create-post-content">
        <div className="create-post-header">
          <h2>Create New Post</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          {previews.length === 0 ? (
            <div className="upload-section">
              <svg
                aria-label="Icon to represent media such as images or videos"
                className="upload-icon"
                viewBox="0 0 97.6 77.3"
                height="77"
                width="96"
              >
                {/* SVG paths */}
                <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path>
                <path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path>
              </svg>
              <p>Drag photos and videos here</p>
              <button
                type="button"
                className="select-button"
                onClick={() => fileInputRef.current.click()}
              >
                Select from computer
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="preview-section">
              <div className="previews-grid">
                {previews.map((preview, index) => (
                  <div key={index} className="image-preview-container">
                    <img src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="caption-input"
              />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            {previews.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setImages([]);
                    setPreviews([]);
                    setCaption('');
                    setError('');
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="share-button"
                >
                  {loading ? 'Sharing...' : 'Share'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;