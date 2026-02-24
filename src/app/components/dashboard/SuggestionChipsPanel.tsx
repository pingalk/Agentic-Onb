import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

interface Prompt {
  text: string;
  enabled: boolean; // Whether this specific prompt has a working flow
}

interface Category {
  id: string;
  label: string;
  prompts: Prompt[];
}

const CATEGORIES: Category[] = [
  {
    id: 'recovery',
    label: 'Recovery',
    prompts: [
      { text: 'Customer claims double charge — check their payments', enabled: true },
      { text: 'Show me failed payments from last week', enabled: false },
      { text: 'Retry all failed recurring payments', enabled: false },
    ],
  },
  {
    id: 'settlements',
    label: 'Settlements',
    prompts: [
      { text: 'When is my next settlement?', enabled: true },
      { text: 'Why was my settlement delayed?', enabled: false },
      { text: 'Show settlement history for this month', enabled: false },
    ],
  },
  {
    id: 'manage',
    label: 'Manage',
    prompts: [
      { text: 'Enable AMEX cards on checkout', enabled: false },
      { text: 'Update my billing label name', enabled: false },
      { text: 'Add a new team member', enabled: false },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    prompts: [
      { text: 'Why are my success rates down?', enabled: false },
      { text: 'Compare this week vs last week', enabled: false },
      { text: 'Which payment method converts best?', enabled: false },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    prompts: [
      { text: 'Why is my account on hold?', enabled: false },
      { text: 'How do I enable international payments?', enabled: false },
      { text: 'Contact support team', enabled: false },
    ],
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
    if (activeCategory === category.id) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category.id);
    }
  };

  const handlePromptClick = (prompt: Prompt) => {
    if (!prompt.enabled) return; // Only allow clicking on enabled prompts
    onPromptSelect(prompt.text);
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
              "h-7 px-3 py-1 rounded-lg font-['Inter',sans-serif] text-[14px] font-normal tracking-[-0.182px] leading-5 transition-all duration-200 cursor-pointer",
              activeCategory === category.id
                ? 'bg-[#292f32] text-white border border-transparent'
                : 'bg-white text-[#292f32] border border-[rgba(67,75,81,0.18)] hover:border-[rgba(67,75,81,0.28)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
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
                    key={prompt.text}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    onClick={() => handlePromptClick(prompt)}
                    className={clsx(
                      `text-left px-4 py-3 font-['Inter',sans-serif] text-[14px] tracking-[-0.182px] transition-colors duration-150`,
                      idx < activePrompts.length - 1 && 'border-b border-[#f0f0f0]',
                      prompt.enabled
                        ? 'text-[#292f32] hover:bg-black/[0.04] cursor-pointer'
                        : 'text-[#9CA3AF] cursor-default'
                    )}
                    disabled={!prompt.enabled}
                  >
                    {prompt.text}
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
