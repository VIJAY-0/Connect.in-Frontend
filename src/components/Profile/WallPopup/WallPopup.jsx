import { useState } from 'react';
import './WallPopup.css';

const WallPopup = ({ onClose, onCreate }) => {
  const [wallData, setWallData] = useState({ name: '', thumbnail: null, images: [] });

  const handleFileChange = (e, field) => {
    if (field === 'thumbnail') {
      setWallData({ ...wallData, thumbnail: e.target.files[0] });
    } else {
      setWallData({ ...wallData, images: [...e.target.files] });
    }
  };

  return (
    <div className="wall-popup-overlay">
      <div className="wall-popup-container">
        <h3>Create New Wall</h3>
        <input 
          type="text" 
          placeholder="Wall Name" 
          onChange={(e) => {setWallData({ ...wallData, name: e.target.value }) ; console.log(wallData)}} 
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleFileChange(e, 'thumbnail')} 
        />
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={(e) => handleFileChange(e, 'images')} 
        />
        <div className="wall-popup-buttons">
          <button onClick={() => {
            console.log(wallData);
            onCreate(wallData)
            }}>Create Wall</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default WallPopup;
