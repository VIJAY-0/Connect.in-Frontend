import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './WallsCarousel.css'



const WallsCarousel = ({ walls }) => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const scrollContainer = carouselRef.current;
    let scrollAmount = 0;

    const scrollStep = () => {
      if (scrollContainer) {
        scrollAmount += 1; // Adjust speed
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0; // Reset scroll
        }
        scrollContainer.scrollLeft = scrollAmount;
      }
    };

    const interval = setInterval(scrollStep, 50);
    return () => clearInterval(interval);
  }, []);

  const handleWallClick = (wallId) => {
    navigate(`/wall/${wallId}`);
  };


  return (
    <div className="walls-container">
      <h2 className="walls-heading">Walls</h2>
      <div ref={carouselRef} className="walls-carousel">
        {walls.concat(walls).map((wall, index) => (
          <div key={index} className="wall-item" onClick={() => handleWallClick(wall.id)}>
            <img src={wall.thumbnails || "/default-wall.png"} alt={wall.name} />
            <p>{wall.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallsCarousel;
