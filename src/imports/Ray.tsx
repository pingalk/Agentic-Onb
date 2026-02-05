import React, { useEffect, useState } from "react";
import clsx from "clsx";

export default function Ray({ trigger = 0, static: isStatic = false }: { trigger?: number; static?: boolean }) {
  const [isWaving, setIsWaving] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Skip wave animation if static mode
    if (isStatic) return;

    // Trigger wave on load (trigger=0) or when trigger changes
    // Adding a small delay for the initial load to make it visible
    const initialDelay = trigger === 0 ? 500 : 0;

    const startTimer = setTimeout(() => {
        setIsWaving(true);
    }, initialDelay);

    // Automatically reset after the animation duration (e.g. 600ms)
    // The total duration includes the initial delay for the first run
    const resetTimer = setTimeout(() => {
        setIsWaving(false);
    }, initialDelay + 600);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(resetTimer);
    };
  }, [trigger, isStatic]);

  return (
    <div
      className="relative size-full overflow-visible"
      data-name="ray"
      onMouseEnter={() => !isStatic && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* CSS keyframes for hover wave animation */}
      <style>{`
        @keyframes rayWave {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-12deg); }
          40% { transform: rotate(10deg); }
          60% { transform: rotate(-8deg); }
          80% { transform: rotate(6deg); }
        }
      `}</style>
      <svg
        className="block size-full overflow-visible"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
        style={{
          transformOrigin: 'center center',
          animation: isHovering ? 'rayWave 0.6s ease-in-out' : 'none'
        }}
      >
        <g id="ray">
          {/* Top Left */}
          <path d="M4 4H13L16 16L4 13V4Z" fill="var(--magic-primary, #009E5C)" />

          {/* Top Right - Animated */}
          <g
            className={clsx(
              "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-[16px_16px]",
              isWaving && "rotate-[10deg] scale-125"
            )}
          >
            <path d="M19 4H28V13L16 16L19 4Z" fill="var(--magic-primary, #009E5C)" />
          </g>

          {/* Bottom Right */}
          <path d="M28 19V28H19L16 16L28 19Z" fill="var(--magic-primary, #009E5C)" />

          {/* Bottom Left */}
          <path d="M13 28H4V19L16 16L13 28Z" fill="var(--magic-primary, #009E5C)" />
        </g>
      </svg>
    </div>
  );
}