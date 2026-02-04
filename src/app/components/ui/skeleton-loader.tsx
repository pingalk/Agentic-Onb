import React from 'react';
import clsx from 'clsx';

export type SkeletonVariant = 'edge-light' | 'conic-sweep' | 'prismatic' | 'spotlight' | 'orbit';

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  loading?: boolean;
  duration?: number;
  intensity?: number;
  glowBlur?: number;
  trailLength?: number;
  lightCount?: number;
  children: React.ReactNode;
  className?: string;
}

// Edge Light Animation - Traveling highlight along card border
const EdgeLightAnimation = ({
  duration = 3,
  intensity = 0.7,
  trailLength = 50,
  glowBlur = 4,
  lightCount = 1
}: {
  duration?: number;
  intensity?: number;
  trailLength?: number;
  glowBlur?: number;
  lightCount?: number;
}) => {
  const gapLength = 600 - trailLength;
  const lights = Array.from({ length: lightCount }, (_, i) => i);

  return (
    <>
      {/* Subtle base border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: `1px solid rgba(16, 185, 129, ${0.08 * intensity})`,
        }}
      />

      {/* Primary traveling lights */}
      <svg
        className="absolute -inset-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="edgeLightGradientMain" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor={`rgba(16, 185, 129, ${0.15 * intensity})`} />
            <stop offset="40%" stopColor={`rgba(52, 211, 153, ${0.6 * intensity})`} />
            <stop offset="50%" stopColor={`rgba(110, 231, 183, ${0.9 * intensity})`} />
            <stop offset="60%" stopColor={`rgba(52, 211, 153, ${0.6 * intensity})`} />
            <stop offset="80%" stopColor={`rgba(16, 185, 129, ${0.15 * intensity})`} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="edgeGlowSubtle" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={glowBlur * 0.5} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {lights.map((i) => (
          <rect
            key={i}
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            rx="16"
            ry="16"
            fill="none"
            stroke="url(#edgeLightGradientMain)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#edgeGlowSubtle)"
            style={{
              strokeDasharray: `${trailLength} ${gapLength}`,
              animation: `edgeLightTravel ${duration}s ease-in-out infinite`,
              animationDelay: `${(i * duration) / lightCount}s`,
            }}
          />
        ))}
      </svg>

      {/* Soft outer glow */}
      <svg
        className="absolute -inset-[2px] w-[calc(100%+4px)] h-[calc(100%+4px)] pointer-events-none"
        style={{ overflow: 'visible', opacity: 0.4 * intensity }}
      >
        {lights.map((i) => (
          <rect
            key={i}
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="17"
            ry="17"
            fill="none"
            stroke={`rgba(110, 231, 183, ${0.5 * intensity})`}
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${trailLength * 0.8} ${gapLength * 1.05}`,
              animation: `edgeLightTravel ${duration}s ease-in-out infinite`,
              animationDelay: `${(i * duration) / lightCount}s`,
              filter: `blur(${glowBlur}px)`,
            }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes edgeLightTravel {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -480; }
        }
      `}</style>
    </>
  );
};

// Conic Sweep Animation - Full rotating gradient sweep
const ConicSweepAnimation = ({
  duration = 3,
  intensity = 0.7,
  glowBlur = 4
}: {
  duration?: number;
  intensity?: number;
  glowBlur?: number;
}) => {
  return (
    <>
      {/* Main sweep */}
      <div
        className="absolute -inset-[1px] pointer-events-none rounded-2xl"
        style={{
          background: 'conic-gradient(from var(--conic-angle), #059669, #10b981, #34d399, #6ee7b7, #059669)',
          animation: `conicRotate ${duration * 0.4}s linear infinite`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '2.5px',
          borderRadius: '16px',
          opacity: intensity,
        }}
      />

      {/* Outer glow */}
      <div
        className="absolute -inset-[3px] pointer-events-none rounded-2xl"
        style={{
          background: 'conic-gradient(from var(--conic-angle), #059669, #10b981, #34d399, #6ee7b7, #059669)',
          animation: `conicRotate ${duration * 0.4}s linear infinite`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '5px',
          borderRadius: '18px',
          filter: `blur(${glowBlur}px)`,
          opacity: 0.6 * intensity,
        }}
      />

      <style>{`
        @property --conic-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes conicRotate {
          0% { --conic-angle: 0deg; }
          100% { --conic-angle: 360deg; }
        }
      `}</style>
    </>
  );
};

// Prismatic Animation - Rainbow gradient flow
const PrismaticAnimation = ({
  duration = 3,
  intensity = 0.7,
  glowBlur = 4
}: {
  duration?: number;
  intensity?: number;
  glowBlur?: number;
}) => {
  return (
    <>
      {/* Main prismatic */}
      <div
        className="absolute -inset-[1px] pointer-events-none rounded-2xl"
        style={{
          background: 'linear-gradient(90deg, #f87171, #fbbf24, #38bdf8, #f472b6, #60a5fa, #a78bfa, #f87171)',
          backgroundSize: '200% 100%',
          animation: `prismaticFlow ${duration * 0.5}s linear infinite`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '2.5px',
          borderRadius: '16px',
          opacity: intensity,
        }}
      />

      {/* Subtle outer glow */}
      <div
        className="absolute -inset-[4px] pointer-events-none rounded-2xl"
        style={{
          background: 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd, #ff6b6b)',
          backgroundSize: '300% 100%',
          animation: `prismaticFlow ${duration * 1.3}s linear infinite`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '4px',
          borderRadius: '18px',
          filter: `blur(${glowBlur * 1.5}px)`,
          opacity: 0.3 * intensity,
        }}
      />

      <style>{`
        @keyframes prismaticFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 400% 50%; }
        }
      `}</style>
    </>
  );
};

// Spotlight Animation - Focus beam rotating around border
const SpotlightAnimation = ({
  duration = 3,
  intensity = 0.7,
  glowBlur = 4,
  lightCount = 1
}: {
  duration?: number;
  intensity?: number;
  glowBlur?: number;
  lightCount?: number;
}) => {
  // Generate conic gradient with multiple spotlights evenly distributed
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
        stops.push(`rgba(255,255,255,${intensity}) ${spotMid1}%`);
        stops.push(`rgba(110,231,183,${intensity}) ${spotMid2}%`);
        stops.push(`rgba(52,211,153,${intensity}) ${spotEnd}%`);
      }
    }
    stops.push('transparent 100%');
    return `conic-gradient(from var(--spotlight-angle), ${stops.join(', ')})`;
  };

  return (
    <>
      {/* Bright spotlight on stroke */}
      <div
        className="absolute -inset-[1px] pointer-events-none rounded-2xl"
        style={{
          background: generateSpotlightGradient(false),
          animation: `spotlightRotate ${duration * 0.33}s linear infinite`,
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
          animation: `spotlightRotate ${duration * 0.33}s linear infinite`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '7px',
          borderRadius: '20px',
          filter: `blur(${glowBlur * 1.5}px)`,
        }}
      />

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
    </>
  );
};

// Orbit Animation - Glowing orb circling the border
const OrbitAnimation = ({
  duration = 3,
  intensity = 0.7,
  glowBlur = 4
}: {
  duration?: number;
  intensity?: number;
  glowBlur?: number;
}) => {
  return (
    <>
      {/* Orbiting point on stroke */}
      <div
        className="absolute -inset-[1px] pointer-events-none rounded-2xl"
        style={{
          background: `conic-gradient(from var(--orbit-angle), transparent 0%, transparent 90%, rgba(16,185,129,${intensity}) 94%, rgba(110,231,183,${intensity}) 96%, rgba(52,211,153,${intensity}) 97%, rgba(16,185,129,${intensity}) 98%, transparent 100%)`,
          animation: `orbitRotate ${duration * 0.4}s linear infinite`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '2.5px',
          borderRadius: '16px',
        }}
      />

      {/* Intense glow halo */}
      <div
        className="absolute -inset-[6px] pointer-events-none rounded-2xl"
        style={{
          background: `conic-gradient(from var(--orbit-angle), transparent 0%, transparent 88%, rgba(110, 231, 183, ${0.8 * intensity}) 93%, rgba(52, 211, 153, ${intensity}) 96%, rgba(16, 185, 129, ${0.9 * intensity}) 98%, transparent 100%)`,
          animation: `orbitRotate ${duration * 0.4}s linear infinite`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '8px',
          borderRadius: '22px',
          filter: `blur(${glowBlur * 2}px)`,
        }}
      />

      <style>{`
        @property --orbit-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes orbitRotate {
          0% { --orbit-angle: 0deg; }
          100% { --orbit-angle: 360deg; }
        }
      `}</style>
    </>
  );
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'spotlight',
  loading = true,
  duration = 3,
  intensity = 0.7,
  glowBlur = 4,
  trailLength = 50,
  lightCount = 2,
  children,
  className
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  const renderAnimation = () => {
    switch (variant) {
      case 'edge-light':
        return (
          <EdgeLightAnimation
            duration={duration}
            intensity={intensity}
            trailLength={trailLength}
            glowBlur={glowBlur}
            lightCount={lightCount}
          />
        );
      case 'conic-sweep':
        return (
          <ConicSweepAnimation
            duration={duration}
            intensity={intensity}
            glowBlur={glowBlur}
          />
        );
      case 'prismatic':
        return (
          <PrismaticAnimation
            duration={duration}
            intensity={intensity}
            glowBlur={glowBlur}
          />
        );
      case 'spotlight':
        return (
          <SpotlightAnimation
            duration={duration}
            intensity={intensity}
            glowBlur={glowBlur}
            lightCount={lightCount}
          />
        );
      case 'orbit':
        return (
          <OrbitAnimation
            duration={duration}
            intensity={intensity}
            glowBlur={glowBlur}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={clsx('relative', className)}>
      {renderAnimation()}
      {children}
    </div>
  );
};

export default SkeletonLoader;
