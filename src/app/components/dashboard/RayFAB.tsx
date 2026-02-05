import React, { useState } from 'react';
import { motion } from 'motion/react';
import Ray from '../../../imports/Ray';

interface RayFABProps {
  onClick: () => void;
}

export const RayFAB: React.FC<RayFABProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-8 right-8 z-30 flex items-center gap-[8px] px-[12px] py-[10px] rounded-[8px] overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(128deg, rgb(3, 62, 62) 5%, rgba(3, 62, 62, 0.95) 50%)',
        boxShadow: '0px 0px 4px 2px rgba(3,62,62,0.25), -1px -1px 24px 2px rgba(3,62,62,0.26)',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          border: '2px solid transparent',
          background: isHovered
            ? 'linear-gradient(90deg, #00ff7f, #48d08c, #00ff7f) border-box'
            : 'linear-gradient(90deg, rgba(0,255,127,0.4), rgba(72,208,140,0.4)) border-box',
          mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
        animate={{
          backgroundPosition: isHovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: 'linear',
        }}
      />

      {/* Inner glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          boxShadow: isHovered
            ? 'inset 0px 0px 8px 0px #48d08c'
            : 'inset 0px 0px 4px 0px rgba(72,208,140,0.5)',
          transition: 'box-shadow 0.3s ease',
        }}
      />

      {/* Ray Icon */}
      <div className="relative shrink-0 size-[16px]">
        <Ray />
      </div>

      {/* Text */}
      <span
        className="relative shrink-0 text-[14px] font-medium text-white"
        style={{ fontFamily: "'TASA Orbiter Display', sans-serif" }}
      >
        Ask Ray
      </span>
    </motion.button>
  );
};
