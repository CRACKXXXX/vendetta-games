// src/components/PlayerPanel/PlayerPanel.jsx
import React, { useState, useEffect } from 'react';
import './PlayerPanel.css';

function PlayerPanel({ id, isAlive, photoUrl, onToggle }) {
  // Format ID to 3 digits e.g. 008, 045
  const formattedId = id.toString().padStart(3, '0');
  
  // Img state handles fallback chain:
  // 0: Cloud URL (if exists) or Local JPG
  // 1: Local PNG
  // 2: Placeholder Avatar
  const [imgState, setImgState] = useState(0);

  // Reset if ID changes dynamically
  useEffect(() => {
    setImgState(0);
  }, [id, photoUrl]);

  let currentSrc = '';
  if (imgState === 0) {
    currentSrc = photoUrl || `/players/${formattedId}.jpg`;
  } else if (imgState === 1) {
    // If photoUrl failed, try local JPG. If local JPG failed, try local PNG.
    currentSrc = photoUrl ? `/players/${formattedId}.jpg` : `/players/${formattedId}.png`;
  } else if (imgState === 2 && photoUrl) {
    // If we have photoUrl and already failed twice (Cloud + Local JPG), try local PNG
    currentSrc = `/players/${formattedId}.png`;
  } else {
    const avatarId = (id % 70) + 1;
    currentSrc = `https://i.pravatar.cc/300?img=${avatarId}`;
  }

  const handleError = () => {
    // Prevent infinite loops and advance the fallback state
    setImgState(prev => prev + 1);
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
