// src/components/VendettaGames/VendettaGames.jsx
import React, { useState, useEffect, useRef } from 'react';
import PlayerPanel from '../PlayerPanel/PlayerPanel';
import './VendettaGames.css';

function VendettaGames() {
  const [players, setPlayers] = useState(() => {
    const initial = {};
    for (let i = 0; i <= 60; i++) { // From 000 to 060 = 61 players
      initial[i] = true; 
    }
    return initial;
  });

  const wallRef = useRef(null);
  const [scale, setScale] = useState(1);

  const toggleStatus = (id) => {
    setPlayers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Adjust scale so the entire diamond grid fits perfectly on screen
  useEffect(() => {
    const updateScale = () => {
      if (wallRef.current) {
         const screenW = window.innerWidth;
         const screenH = window.innerHeight;
         
         // The CSS grid is 1400px wide and high.
         // By rotating it -45deg, its bounding box width and height becomes approx: size * sqrt(2)
         const gridPhysicalSize = 1400;
         const gridVisualWidth = gridPhysicalSize * 1.414; 
         // For height we also account for the rotateX(25deg) perspective foreshortening
         const gridVisualHeight = gridPhysicalSize * 1.414 * Math.cos(25 * (Math.PI / 180)); 

         const scaleW = screenW / gridVisualWidth;
         const scaleH = screenH / gridVisualHeight;
         
         // 0.95 acts as a 5% margin so it doesn't touch the absolute edges
         setScale(Math.min(scaleW, scaleH) * 0.95);
      }
    };

    window.addEventListener('resize', updateScale);
    updateScale(); // Initial call
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="vendetta-main">
      <h1 className="vendetta-title">VENDETTA GAMES</h1>
      
      <div className="wall-viewport" style={{ transform: `scale(${scale})` }}>
        <div className="wall-container" ref={wallRef}>
          {Array.from({ length: 61 }).map((_, i) => (
            <PlayerPanel 
              key={i} 
              id={i} 
              isAlive={players[i]} 
              onToggle={toggleStatus} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VendettaGames;
