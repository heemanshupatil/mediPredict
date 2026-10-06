import React, { useState, useEffect } from 'react';

export default function HeartbeatLoader({ 
  fullScreen = false, 
  message = 'Loading Medical Intelligence...', 
  subMessage = 'Synchronizing statistical models & vitals',
  size = 'normal',
  duration = 4000
}) {
  const isSmall = size === 'small';
  const [bpm, setBpm] = useState(74);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Dynamic BPM variation
    const bpmInterval = setInterval(() => {
      setBpm(prev => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const next = prev + delta;
        return Math.min(84, Math.max(68, next));
      });
    }, 600);

    // Smooth progress fill over duration
    const stepMs = 50;
    const increment = (stepMs / duration) * 100;
    const progressInterval = setInterval(() => {
      setProgress(old => {
        if (old >= 100) return 100;
        return Math.min(100, old + increment);
      });
    }, stepMs);

    return () => {
      clearInterval(bpmInterval);
      clearInterval(progressInterval);
    };
  }, [duration]);

  const content = (
    <div className={`heartbeat-loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      {/* Concentric Pulse Rings */}
      <div className="heartbeat-pulse-wrapper">
        <div className="pulse-ring ring-1" />
        <div className="pulse-ring ring-2" />
        <div className="pulse-ring ring-3" />
        
        {/* Glowing Central Heart */}
        <div className="heart-icon-wrapper">
          <svg 
            className="beating-heart-svg" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            width={isSmall ? "36" : "60"} 
            height={isSmall ? "36" : "60"}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>

      {/* Animated ECG Pulse Wave Line */}
      <div className="ecg-track">
        <svg viewBox="0 0 300 60" className="ecg-svg" preserveAspectRatio="none">
          {/* Background guide line */}
          <path 
            d="M 0 30 L 70 30 L 85 30 L 95 12 L 105 48 L 115 5 L 125 45 L 135 30 L 150 30 L 220 30 L 235 30 L 245 12 L 255 48 L 265 5 L 275 45 L 285 30 L 300 30" 
            fill="none" 
            stroke="rgba(13, 148, 136, 0.2)" 
            strokeWidth="2" 
          />
          {/* Active moving laser pulse line */}
          <path 
            d="M 0 30 L 70 30 L 85 30 L 95 12 L 105 48 L 115 5 L 125 45 L 135 30 L 150 30 L 220 30 L 235 30 L 245 12 L 255 48 L 265 5 L 275 45 L 285 30 L 300 30" 
            fill="none" 
            stroke="url(#ecgGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            className="ecg-pulse-line" 
          />
          <defs>
            <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#2dd4bf" stopOpacity="1" />
              <stop offset="85%" stopColor="#ef4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Vitals & Status Text */}
      <div className="heartbeat-text-wrapper">
        <div className="heartbeat-badge">
          <span className="live-dot"></span>
          <span>VITALS ACTIVE • {bpm} BPM • {Math.round(progress)}%</span>
        </div>
        <div className="heartbeat-title">{message}</div>
        {subMessage && <div className="heartbeat-subtitle">{subMessage}</div>}

        {/* 4-second subtle medical progress track */}
        <div style={{
          width: '260px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          overflow: 'hidden',
          marginTop: '1rem'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #0d9488, #0ea5e9, #ef4444)',
            borderRadius: '999px',
            transition: 'width 0.1s linear',
            boxShadow: '0 0 10px rgba(14, 165, 233, 0.6)'
          }} />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="heartbeat-fullscreen-overlay">
        {content}
      </div>
    );
  }

  return content;
}
