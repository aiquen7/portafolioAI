import React from 'react';

interface Props {
  particleCount?: number;
}

const AnimatedBackground: React.FC<Props> = ({ particleCount = 8 }) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true" role="presentation">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-6"></div>

      {/* Responsive gradient orbs */}
      <div className="absolute -top-8 -left-6 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-100/60 to-blue-200/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-10 -right-6 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-50/40 to-blue-100/20 rounded-full blur-3xl animate-pulse-slower" />

      {/* Minimal floating particles (controlled count) */}
      <div className="particles-container">
        {Array.from({ length: particleCount }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${12 + Math.random() * 12}s`,
            }}
          />
        ))}
      </div>

      {/* Soft overlay to keep contrast on top of content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none" />
    </div>
  );
};

export default AnimatedBackground;
