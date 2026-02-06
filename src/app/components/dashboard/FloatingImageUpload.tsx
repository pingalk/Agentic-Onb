import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'motion/react';
import { ImageIcon, Upload } from 'lucide-react';

interface FloatingImageUploadProps {
  imageSrc: string;
  onDrop: () => void;
  isVisible: boolean;
}

export const FloatingImageUpload: React.FC<FloatingImageUploadProps> = ({
  imageSrc,
  onDrop,
  isVisible
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hasDropped, setHasDropped] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged more than 50px in any direction, consider it a drop
    const dragDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    if (dragDistance > 50) {
      setHasDropped(true);
      // Delay the callback to allow drop animation to play
      setTimeout(() => {
        onDrop();
      }, 400);
    } else {
      setIsDragging(false);
    }
  };

  if (!isVisible || hasDropped) return null;

  return (
    <>
      {/* Full screen constraints container */}
      <div
        ref={constraintsRef}
        className="fixed inset-0 z-[100] pointer-events-none"
      />

      {/* Full screen scrim - appears when dragging */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[101] bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            {/* Upload affordance */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-dashed border-white/50">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <span className="text-white text-lg font-medium">Drop anywhere to upload</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating image card */}
      <motion.div
        drag
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        initial={{
          opacity: 0,
          scale: 0.8,
          x: 0,
          y: 0
        }}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          boxShadow: isDragging
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
            : '0 10px 40px -10px rgba(0, 0, 0, 0.2)'
        }}
        whileHover={{ scale: 1.02 }}
        whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25
        }}
        className="fixed bottom-24 right-6 z-[102] w-[200px] cursor-grab active:cursor-grabbing pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        {/* Card container with macOS-style appearance */}
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200/50">
          {/* Title bar - macOS style */}
          <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200/50">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-[11px] text-gray-500 font-medium ml-1 truncate flex-1">
              Screenshot
            </span>
            <ImageIcon className="w-3 h-3 text-gray-400" />
          </div>

          {/* Image preview */}
          <div className="relative aspect-[4/3] bg-gray-50">
            <img
              src={imageSrc}
              alt="Screenshot to upload"
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>

          {/* Drag hint */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 text-center">
              Drag to upload
            </p>
          </div>
        </div>

        {/* Floating indicator dots */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="w-1 h-1 rounded-full bg-gray-400" />
          <div className="w-1 h-1 rounded-full bg-gray-300" />
        </motion.div>
      </motion.div>
    </>
  );
};
