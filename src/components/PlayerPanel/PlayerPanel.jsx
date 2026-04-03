// src/components/PlayerPanel/PlayerPanel.jsx
import React, { useState, useEffect } from 'react';
import './PlayerPanel.css';

function PlayerPanel({ id, isAlive, onToggle }) {
  // Format ID to 3 digits e.g. 008, 045
  const formattedId = id.toString().padStart(3, '0');
  
  // Img state: 0 = jpg, 1 = png, 2 = pravatar placeholder
  const [imgState, setImgState] = useState(0);

  // Reset if ID changes dynamically
  useEffect(() => {
    setImgState(0);
  }, [id]);

  let currentSrc = '';
  if (imgState === 0) {
    currentSrc = `/players/${formattedId}.jpg`;
  } else if (imgState === 1) {
    currentSrc = `/players/${formattedId}.png`;
  } else {
    const avatarId = (id % 70) + 1;
    currentSrc = `https://i.pravatar.cc/300?img=${avatarId}`;
  }

  const handleError = () => {
    if (imgState < 2) {
      setImgState(prev => prev + 1);
    }
  };

  return (
    <div 
      className={`player-panel ${isAlive ? 'alive' : 'eliminated'}`} 
      onClick={() => onToggle(id)}
    >
      <div className="panel-inner">
        <img 
          src={currentSrc} 
          alt={`Player ${formattedId}`} 
          className="player-photo" 
          onError={handleError}
        />
        {isAlive && (
          <div className="player-number">{formattedId}</div>
        )}
      </div>
    </div>
  );
}

export default PlayerPanel;
