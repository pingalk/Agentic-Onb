import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

interface Category {
  id: string;
  label: string;
  prompts: string[];
  enabled: boolean; // Whether this category has working flows
}

const CATEGORIES: Category[] = [
  {
    id: 'recovery',
    label: 'Recovery',
    prompts: [
      'Customer claims double charge — check their payments',
    ],
    enabled: true,
  },
  {
    id: 'settlements',
    label: 'Settlements',
    prompts: [
      'When is my next settlement?',
    ],
    enabled: true,
  },
  {
    id: 'manage',
    label: 'Manage',
    prompts: [],
    enabled: false,
  },
  {
    id: 'insights',
    label: 'Insights',
    prompts: [],
    enabled: false,
  },
  {
    id: 'support',
    label: 'Support',
    prompts: [],
    enabled: false,
  },
];

interface SuggestionChipsPanelProps {
  onPromptSelect: (prompt: string) => void;
}

export const SuggestionChipsPanel: React.FC<SuggestionChipsPanelProps> = ({
  onPromptSelect,
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleChipClick = (category: Category) => {
    // Only allow clicking on enabled categories
    if (!category.enabled) return;

    if (activeCategory === category.id) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category.id);
    }
  };

  const handlePromptClick = (prompt: string) => {
    onPromptSelect(prompt);
    setActiveCategory(null);
  };

  const activePrompts = CATEGORIES.find((c) => c.id === activeCategory)?.prompts || [];
  const isExpanded = activeCategory !== null;

  return (
    <div className="w-full max-w-2xl relative">
      {/* Chips Row - fixed position, never moves */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleChipClick(category)}
            className={clsx(
              "h-7 px-3 py-1 rounded-lg font-['Inter',sans-serif] text-[14px] font-normal tracking-[-0.182px] leading-5 transition-all duration-200",
              activeCategory === category.id
                ? 'bg-[#292f32] text-white border border-transparent'
                : category.enabled
                  ? 'bg-white text-[#292f32] border border-[rgba(67,75,81,0.18)] hover:border-[rgba(67,75,81,0.28)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer'
                  : 'bg-white text-[#292f32] border border-[rgba(67,75,81,0.18)] cursor-default'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Expandable Panel - appears below chips as overlay (absolute positioned) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-0 right-0 top-full mt-4 z-50"
          >
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2">
              {/* Prompts - Single Column with Dividers */}
              <div className="flex flex-col">
                {activePrompts.map((prompt, idx) => (
                  <motion.button
                    key={prompt}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    onClick={() => handlePromptClick(prompt)}
                    className={`text-left px-4 py-3 hover:bg-[#f8f8f8] font-['Inter',sans-serif] text-[14px] text-[#292f32] tracking-[-0.182px] transition-colors duration-150 ${idx < activePrompts.length - 1 ? 'border-b border-[#f0f0f0]' : ''}`}
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuggestionChipsPanel;
