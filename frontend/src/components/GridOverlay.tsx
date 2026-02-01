
import { useEffect, useState } from "react";

export const GridOverlay = () => {
  const [scanlinePosition, setScanlinePosition] = useState(0);
  const [pulseOpacity, setPulseOpacity] = useState(0.7);
  
  useEffect(() => {
    // Scanline movement effect
    const scanlineInterval = setInterval(() => {
      setScanlinePosition(prev => (prev + 1) % 100);
    }, 50);
    
    // Pulse effect for the grid
    const pulseInterval = setInterval(() => {
      setPulseOpacity(prev => prev === 0.7 ? 0.9 : 0.7);
    }, 2000);
    
    return () => {
      clearInterval(scanlineInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-[#0EA5E9]/5" />
      
      {/* Grid pattern with pulse effect */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]" 
        style={{ 
          backgroundSize: '20px 20px',
          opacity: pulseOpacity,
          transition: 'opacity 1s ease-in-out'
        }} 
      />
      
      {/* Radial glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15)_0%,transparent_40%),radial-gradient(circle_at_80%_70%,rgba(30,174,219,0.15)_0%,transparent_40%)]" />
      
      {/* Moving scanline effect */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/70 to-transparent" 
          style={{ top: `${scanlinePosition}%` }} 
        />
      </div>
      
      {/* Second scanline (slower, different direction) */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-[#0EA5E9]/70 to-transparent" 
          style={{ left: `${(scanlinePosition + 50) % 100}%` }} 
        />
      </div>
      
      {/* Center vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.3)_0%,transparent_80%)]" />
      
      {/* Occasional "data packets" moving across the grid - animated dots */}
      <div className="absolute h-2 w-2 rounded-full bg-cyan-400/70 blur-[1px]" 
           style={{ 
             top: `${Math.sin(scanlinePosition * 0.1) * 30 + 50}%`, 
             left: `${scanlinePosition}%`,
             boxShadow: '0 0 8px rgba(30,174,219,0.8), 0 0 12px rgba(30,174,219,0.5)'
           }} 
      />
    </div>
  );
};
