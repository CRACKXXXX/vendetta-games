// src/components/PlayerPanel/PlayerPanel.jsx
import React, { useState, useEffect } from 'react';
import './PlayerPanel.css';

// Extensiones soportadas, en orden de prioridad (respetar mayúsculas/minúsculas exactas)
const SUPPORTED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

function PlayerPanel({ id, isAlive, onToggle }) {
  // Formatear ID a 3 dígitos ej. 008, 045
  const formattedId = id.toString().padStart(3, '0');
  
  // Estado del fallback de imagen:
  // 0..N: prueba extensiones locales en orden (png, jpg, jpeg, webp)
  // N+1: avatar placeholder externo
  const [imgState, setImgState] = useState(0);

  // Reiniciar si cambia el ID
  useEffect(() => {
    setImgState(0);
  }, [id]);

  let currentSrc = '';
  if (imgState < SUPPORTED_EXTENSIONS.length) {
    // Ruta absoluta desde la raíz — Vite copia public/ tal cual a dist/
    const ext = SUPPORTED_EXTENSIONS[imgState];
    currentSrc = `/players/${formattedId}.${ext}`;
  } else {
    // Último recurso: avatar externo
    const avatarId = (id % 70) + 1;
    currentSrc = `https://i.pravatar.cc/300?img=${avatarId}`;
  }

  const handleError = () => {
    // Avanzar al siguiente formato disponible
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
          alt={`Jugador ${formattedId}`} 
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
