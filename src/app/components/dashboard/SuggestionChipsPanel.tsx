import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

interface Category {
  id: string;
  label: string;
  prompts: string[];
}

const CATEGORIES: Category[] = [
  {
    id: 'recovery',
    label: 'Recovery',
    prompts: [
      'Why did the last transaction for [email] fail?',
      'Create a payment link for the last failed order.',
      'Check the live status of Refund #R9921.',
      'Draft a message explaining the refund delay.',
    ],
  },
  {
    id: 'settlements',
    label: 'Settlements',
    prompts: [
      'Am I eligible for Instant Settlement today?',
      'When will yesterday\'s settlement hit my account?',
      'Show me the deductions for the last settlement.',
      'Enable \'Same-Day Settlements\' for my account.',
    ],
  },
  {
    id: 'manage',
    label: 'Manage',
    prompts: [
      'Enable AMEX cards on my checkout page.',
      'Update the business name on my billing label.',
      'Add [email] as a Finance user.',
      'Disable \'Cash on Delivery\' for orders above ₹5,000.',
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    prompts: [
      'Why are my success rates down right now?',
      'Is there a downtime with UPI?',
      'Show me the top failure reason for today.',
      'Compare my sales volume this week vs. last week.',
    ],
  },
  {
    id: 'support',
    label: 'Support',
    prompts: [
      'Why has my account been put on hold?',
      'Analyze transaction #T8821 for fraud.',
      'What is the status of my KYC verification?',
      'Escalate my support ticket #5521.',
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

  const handleChipClick = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };

  const handlePromptClick = (prompt: string) => {
    onPromptSelect(prompt);
    setActiveCategory(null);
  };

  const activePrompts = CATEGORIES.find((c) => c.id === activeCategory)?.prompts || [];

  return (
    <div className="w-full max-w-2xl">
      {/* Chips Row */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleChipClick(category.id)}
            className={clsx(
              "h-7 px-3 py-1 rounded-lg font-['Inter',sans-serif] text-[14px] font-normal tracking-[-0.182px] leading-5 transition-all duration-200",
              activeCategory === category.id
                ? 'bg-white text-[#292f32] border border-[rgba(67,75,81,0.36)] shadow-[0_2px_4px_rgba(0,0,0,0.06)]'
                : 'bg-white text-[#292f32] border border-[rgba(67,75,81,0.18)] hover:border-[rgba(67,75,81,0.28)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Expandable Panel */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4">
              {/* Tab Chips Inside Panel */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={clsx(
                      "h-7 px-3 py-1 rounded-lg font-['Inter',sans-serif] text-[14px] font-normal tracking-[-0.182px] leading-5 transition-all duration-150",
                      activeCategory === category.id
                        ? 'bg-[#292f32] text-white border border-transparent'
                        : 'bg-white text-[#292f32] border border-[rgba(67,75,81,0.18)] hover:border-[rgba(67,75,81,0.28)]'
                    )}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Prompts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activePrompts.map((prompt, idx) => (
                  <motion.button
                    key={prompt}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left px-4 py-3 rounded-lg bg-[#f8f8f8] hover:bg-[#f0f0f0] font-['Inter',sans-serif] text-[14px] text-[#292f32] tracking-[-0.182px] transition-colors duration-150"
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
