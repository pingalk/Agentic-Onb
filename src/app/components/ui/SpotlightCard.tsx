interface SpotlightCardProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

const SpotlightCard = ({ children, isLoading = true, className = '' }: SpotlightCardProps) => {
  // Configuration
  const speed = 5;           // seconds per rotation
  const intensity = 0.7;     // 0-1 brightness
  const glowBlur = 4;        // pixels
  const lightCount = 2;      // number of spotlights

  // Generate conic gradient with evenly distributed spotlights
  const generateSpotlightGradient = (isGlow: boolean) => {
    const spotlightSize = 14 / lightCount;
    const segmentSize = 100 / lightCount;
    const stops: string[] = [];

    for (let i = 0; i < lightCount; i++) {
      const start = i * segmentSize;
      const spotStart = start + segmentSize - spotlightSize - 2;
      const spotMid1 = start + segmentSize - spotlightSize + 4;
      const spotMid2 = start + segmentSize - 6;
      const spotEnd = start + segmentSize - 2;

      if (isGlow) {
        stops.push(`transparent ${spotStart}%`);
        stops.push(`rgba(110, 231, 183, ${0.9 * intensity}) ${spotMid1}%`);
        stops.push(`rgba(52, 211, 153, ${0.8 * intensity}) ${spotMid2}%`);
        stops.push(`transparent ${spotEnd}%`);
      } else {
        stops.push(`transparent ${spotStart}%`);
        stops.push(`rgba(255, 255, 255, ${intensity}) ${spotMid1}%`);
        stops.push(`rgba(110, 231, 183, ${intensity}) ${spotMid2}%`);
        stops.push(`rgba(52, 211, 153, ${intensity}) ${spotEnd}%`);
      }
    }
    stops.push('transparent 100%');
    return `conic-gradient(from var(--spotlight-angle), ${stops.join(', ')})`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Card content */}
      <div className="relative bg-white rounded-2xl p-6 z-10">
        {children}
      </div>

      {/* Spotlight animation (only when loading) */}
      {isLoading && (
        <>
          {/* Main spotlight stroke */}
          <div
            className="absolute -inset-[1px] pointer-events-none rounded-2xl"
            style={{
              background: generateSpotlightGradient(false),
              animation: `spotlightRotate ${speed * 0.33}s linear infinite`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '2.5px',
              borderRadius: '16px',
            }}
          />

          {/* Glow halo */}
          <div
            className="absolute -inset-[5px] pointer-events-none rounded-2xl"
            style={{
              background: generateSpotlightGradient(true),
              animation: `spotlightRotate ${speed * 0.33}s linear infinite`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '7px',
              borderRadius: '20px',
              filter: `blur(${glowBlur * 1.5}px)`,
            }}
          />
        </>
      )}

      {/* Required CSS */}
      <style>{`
        @property --spotlight-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes spotlightRotate {
          0% { --spotlight-angle: 0deg; }
          100% { --spotlight-angle: 360deg; }
        }
      `}</style>
    </div>
  );
};

export default SpotlightCard;
