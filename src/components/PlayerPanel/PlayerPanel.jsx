// src/components/PlayerPanel/PlayerPanel.jsx
import React from 'react';
import './PlayerPanel.css';

function PlayerPanel({ id, isAlive, onToggle }) {
  // Format ID to 3 digits e.g. 008, 045
  const formattedId = id.toString().padStart(3, '0');
  
  // Use Pravatar for distinct placeholder faces. Note: ID 0 isn't valid for Pravatar, so we add 1.
  const avatarId = (id % 70) + 1;
  const imageUrl = `https://i.pravatar.cc/300?img=${avatarId}`;

  return (
    <div 
      className={`player-panel ${isAlive ? 'alive' : 'eliminated'}`} 
      onClick={() => onToggle(id)}
    >
      <div className="panel-inner">
        <img src={imageUrl} alt={`Player ${formattedId}`} className="player-photo" />
        <div className="ambient-tint"></div>
        <div className="player-number">{formattedId}</div>
      </div>
    </div>
  );
}

export default PlayerPanel;
