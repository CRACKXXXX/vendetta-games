// src/components/VendettaGames/VendettaGames.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import PlayerPanel from '../PlayerPanel/PlayerPanel';
import './VendettaGames.css';

function VendettaGames() {
  const [players, setPlayers] = useState(() => {
    const initial = {};
    for (let i = 0; i <= 59; i++) initial[i] = true;
    return initial;
  });

  const [colCount, setColCount] = useState(11);
  const canvasRef = useRef(null);
  const outerCanvasRef = useRef(null);

  const toggleStatus = (id) => {
    setPlayers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ═══ Live alive count ═══
  const aliveCount = useMemo(() => {
    return Object.values(players).filter(Boolean).length;
  }, [players]);

  // ═══ Responsive column count ═══
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1600) setColCount(11);
      else if (w >= 1200) setColCount(10);
      else if (w >= 900) setColCount(8);
      else if (w >= 650) setColCount(7);
      else if (w >= 450) setColCount(6);
      else setColCount(5);
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);

  // ═══ INNER GOLDEN FLOW — Canvas inside screen-frame ═══
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    const particles = [];
    const NUM = 20;
    for (let i = 0; i < NUM; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 600),
        angle: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.75,
        radius: 1.5 + Math.random() * 3,
        turnRate: (Math.random() - 0.5) * 0.04,
        brightness: 0.35 + Math.random() * 0.65,
        trail: [],
        trailLen: 14 + Math.floor(Math.random() * 12),
      });
    }

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.trailLen) p.trail.shift();
        p.angle += p.turnRate + (Math.random() - 0.5) * 0.018;
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        if (p.x < -30) p.x += canvas.width + 60;
        if (p.x > canvas.width + 30) p.x -= canvas.width + 60;
        if (p.y < -30) p.y += canvas.height + 60;
        if (p.y > canvas.height + 30) p.y -= canvas.height + 60;
        if (Math.random() < 0.012) {
          p.turnRate = (Math.random() - 0.5) * 0.055;
          p.speed = 0.2 + Math.random() * 0.85;
        }
        const tLen = p.trail.length;
        for (let j = 0; j < tLen; j++) {
          const t = p.trail[j];
          const progress = j / tLen;
          ctx.globalAlpha = progress * 0.22 * p.brightness;
          ctx.fillStyle = '#d4af37';
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.radius * (0.3 + progress * 0.7), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        const glowR = p.radius * 5;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        g.addColorStop(0, `rgba(255, 248, 210, ${0.55 * p.brightness})`);
        g.addColorStop(0.15, `rgba(245, 225, 140, ${0.3 * p.brightness})`);
        g.addColorStop(0.45, `rgba(212, 175, 55, ${0.1 * p.brightness})`);
        g.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  // ═══ OUTER GOLDEN LINES — Animated lines on the dark background ═══
  useEffect(() => {
    const canvas = outerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const lines = [];
    const NUM_LINES = 35;
    for (let i = 0; i < NUM_LINES; i++) {
      lines.push({
        x: Math.random() * (canvas.width || 1920),
        y: Math.random() * (canvas.height || 1080),
        angle: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.5,
        length: 5 + Math.random() * 15,
        width: 0.4 + Math.random() * 0.8,
        brightness: 0.2 + Math.random() * 0.6,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.03,
      });
    }

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';

      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];

        // Move
        l.x += Math.cos(l.angle) * l.speed;
        l.y += Math.sin(l.angle) * l.speed;

        // Wrap
        if (l.x < -25) l.x += canvas.width + 50;
        if (l.x > canvas.width + 25) l.x -= canvas.width + 50;
        if (l.y < -25) l.y += canvas.height + 50;
        if (l.y > canvas.height + 25) l.y -= canvas.height + 50;

        // Gentle turns
        if (Math.random() < 0.006) {
          l.angle += (Math.random() - 0.5) * 0.6;
        }

        // Pulsing brightness
        l.pulse += l.pulseSpeed;
        const pulseBright = 0.5 + 0.5 * Math.sin(l.pulse);

        // Draw golden line with glow
        const endX = l.x + Math.cos(l.angle) * l.length;
        const endY = l.y + Math.sin(l.angle) * l.length;
        const alpha = l.brightness * pulseBright * 0.5;

        // Glow layer (wider, softer)
        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha * 0.3})`;
        ctx.lineWidth = l.width + 3;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Core line (brighter, thinner)
        ctx.strokeStyle = `rgba(245, 230, 163, ${alpha})`;
        ctx.lineWidth = l.width;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  // ═══ Build alternating rows ═══
  const rows = useMemo(() => {
    const result = [];
    let idx = 0;
    let isOffset = false;
    while (idx < 60) {
      const count = Math.min(isOffset ? colCount - 1 : colCount, 60 - idx);
      result.push({ start: idx, count, offset: isOffset });
      idx += count;
      isOffset = !isOffset;
    }
    if (result.length >= 2 && result[result.length - 1].count <= 1) {
      const last = result[result.length - 1];
      const prev = result[result.length - 2];
      if (prev.count > 2) {
        prev.count -= 1;
        last.start -= 1;
        last.count += 1;
      }
    }
    return result;
  }, [colCount]);

  return (
    <div className="vendetta-main">
      <canvas ref={outerCanvasRef} className="outer-golden-lines" />
      <h1 className="vendetta-title">VENDETTA GAMES</h1>

      {/* ─── Alive counter — between title and frame ─── */}
      <div className="alive-counter">
        <span className="counter-icon">◈</span>
        <span className="counter-label">VIVOS</span>
        <span className="counter-value">{String(aliveCount).padStart(2, '0')}</span>
        <span className="counter-slash">/</span>
        <span className="counter-total">60</span>
      </div>

      <div className="screen-frame">
        <div className="screen-vignette"></div>
        <canvas ref={canvasRef} className="golden-flow-canvas" />
        <div className="wall-container">
          {rows.map((row, rowIdx) => (
            <div key={`${colCount}-${rowIdx}`} className={`diamond-row ${row.offset ? 'offset' : ''}`}>
              {Array.from({ length: row.count }).map((_, i) => {
                const pid = row.start + i;
                return (
                  <PlayerPanel key={pid} id={pid} isAlive={players[pid]} onToggle={toggleStatus} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VendettaGames;
