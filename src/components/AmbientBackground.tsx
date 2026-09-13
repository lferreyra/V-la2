import React, { useEffect, useState } from 'react';

export const AmbientBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      id="ambient-framer-background"
    >
      {/* Subtle Technical Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Floating Aurora Orb 1: Vibrant Cyan (#00CCF2) */}
      <div
        className="absolute rounded-full blur-[140px] opacity-20 mix-blend-screen transition-transform duration-700 ease-out"
        style={{
          width: '540px',
          height: '540px',
          background: 'radial-gradient(circle, #00CCF2 0%, rgba(0, 204, 242, 0) 70%)',
          top: '-60px',
          right: '5%',
          transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 20}px)`,
        }}
      />

      {/* Floating Aurora Orb 2: Warm Amber & Fire Orange (#F27D16 - #F25116) */}
      <div
        className="absolute rounded-full blur-[160px] opacity-15 mix-blend-screen transition-transform duration-1000 ease-out"
        style={{
          width: '620px',
          height: '620px',
          background: 'radial-gradient(circle, #F27D16 0%, rgba(242, 81, 22, 0.4) 40%, rgba(242, 125, 22, 0) 70%)',
          top: '30%',
          left: '-10%',
          transform: `translate(${mousePosition.x * -35}px, ${mousePosition.y * -25}px)`,
        }}
      />

      {/* Floating Aurora Orb 3: Race Crimson (#F21616) */}
      <div
        className="absolute rounded-full blur-[180px] opacity-10 mix-blend-screen transition-transform duration-1000 ease-out"
        style={{
          width: '480px',
          height: '480px',
          background: 'radial-gradient(circle, #F21616 0%, rgba(242, 22, 22, 0) 70%)',
          bottom: '5%',
          right: '25%',
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 25}px)`,
        }}
      />
    </div>
  );
};
