import React, { useState, useEffect } from 'react';
import { SmartTable, MessageFooter, SuggestionStack } from './RayComponents';
import Ray from '@/imports/Ray';
import Copy from '@/imports/Copy';
import { PaymentLinkMiniCard, SourceRect } from './PaymentLinkMiniCard';
import { AddFundsMiniCard } from './AddFundsMiniCard';
import { CaptureSettingsMiniCard } from './CaptureSettingsMiniCard';
import { BusinessCategoryCard } from './BusinessCategoryCard';
import { BankVerificationCard } from './BankVerificationCard';
import { BankAccountCard } from './BankAccountCard';
import { FundsAddedCard } from './artifacts/FundsAddedCard';
import { FundsAddedHeader, FundsAddedBody, SettlementCard, RayInsightCard } from './artifacts/FundsAddedComponents';
import { ConfigurableSettlementCard, SettlementStatusTable, FeeCalculatorCard } from './artifacts/SettlementComponents';
import { WhatsAppChatPreview, WHATSAPP_CHAT_SCENARIOS } from './WhatsAppChatPreview';
import { Download, ExternalLink, ThumbsUp, ThumbsDown, Share2, Copy as CopyIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { PerplexityStreamText } from './PerplexityStreamingTypography';
import { ChainOfThought } from '../ChainOfThought';
import { KYCLoadingState } from '../KYCLoadingState';
import { BusinessCategoryLoadingState } from '../BusinessCategoryLoadingState';
import { useStreamSequencer } from '../useStreamSequencer';
import { SmartHighlight, SmartHighlightWithBold } from './SmartHighlight';
import { StreamingBulletList } from './StreamingBulletList';
import { AnimatedLoadingCard } from './AnimatedLoadingCard';
import { useTimingSettingsOptional } from '@/context/TimingSettingsContext';
import { SparkRipplesBackground } from '../SparkRipplesBackground';
import { KYCDetailsModal } from './KYCDetailsModal';

// --- Elegant Tooltip Component ---
const Tooltip = ({ children, text, position = 'top' }: { children: React.ReactNode; text: string; position?: 'top' | 'bottom' | 'left' | 'right' }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={clsx(
              'absolute z-[9999] pointer-events-none whitespace-nowrap',
              'px-3 py-1.5 text-xs font-medium text-white',
              'bg-slate-900 rounded-lg shadow-lg',
              positionClasses[position]
            )}
          >
            {text}
            {/* Arrow */}
            <div 
              className={clsx(
                'absolute w-2 h-2 bg-slate-900 rotate-45',
                position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
                position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
                position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2',
                position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Relative Timestamp Component ---
const RelativeTimestamp = ({ timestamp }: { timestamp?: Date }) => {
  const [, forceUpdate] = React.useState(0);

  // Update every minute to keep the relative time fresh
  React.useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const time = timestamp || now;
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let relativeText: string;
  if (diffMins < 1) {
    relativeText = 'Just now';
  } else if (diffMins < 60) {
    relativeText = `${diffMins}m ago`;
  } else if (diffHours < 24) {
    relativeText = `${diffHours}h ago`;
  } else if (diffDays < 7) {
    relativeText = `${diffDays}d ago`;
  } else {
    relativeText = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const exactTime = time.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <Tooltip text={exactTime} position="bottom">
      <span className="text-[12px] text-[#768ea7] font-normal cursor-default select-none">
        {relativeText}
      </span>
    </Tooltip>
  );
};

// Flexible content block types
export type ContentBlock = 
  | { type: 'text'; content: string }
  | { type: 'table'; headers: string[]; rows: any[] }
  | { type: 'card'; title: string; value: string; trend?: string }; // Future proofing

export interface RayResponseData {
  id: string;
  sender: 'user' | 'ai';
  headline?: string;     // Optional Top Headline
  subtext?: string;      // Optional subtext below headline
  blocks?: ContentBlock[]; // Flexible array of content
  suggestions?: string[];
  isThinking?: boolean;
  kycLoading?: boolean; // When true, shows KYC-specific loading steps
  isBusinessCategoryLoading?: boolean; // When true, shows business category identification loading steps
  skipAutoScroll?: boolean; // When true, global scroll effects will skip this message
  resolution?: { title: string; content: string };
  artifact?: {
    type: 'investigation_report';
    data: {
      headline: string;
      subtext: string;
      stats: Array<{ label: string; value: string }>;
      table: {
        rows: Array<{
          id: string;
          amount: string;
          status: string;
          date: string;
          rrn: string;
          email: string;
        }>;
      };
      resolution: {
        title: string;
        content: string;
      };
      buttons?: Array<{ label: string; variant: 'primary' | 'secondary' }>;
      suggestions: string[];
    };
  } | {
    type: 'funds_added_card';
  } | {
    type: 'followup_question';
    data: {
      headline: string;
      question: string;
      buttons: Array<{ label: string; variant: 'primary' | 'secondary' }>;
    };
  } | {
    type: 'simple_text';
    data: {
      headline?: string;
      body: string;
      suggestions?: string[];
      button?: { label: string; variant?: 'primary' | 'secondary' };
    };
  } | {
    type: 'bullet_list_with_buttons';
    data: {
      bullets: Array<{ bold: string; text: string }>;
      buttons: Array<{ label: string; variant: 'primary' | 'secondary' }>;
    };
  } | {
    type: 'setting_updated_with_bullets';
    data: {
      headline: string;
      body: string;
      bullets: Array<{ text: string }>;
      buttons: Array<{ label: string; variant: 'primary' | 'secondary' }>;
    };
  } | {
    type: 'payment_links_created';
    data: {
      headline: string;
      body: string;
      table: {
        rows: Array<{
          id: string;
          linkUrl: string;
          amount: string;
          status: string;
          createdOn: string;
          expiry: string;
        }>;
      };
      followup: {
        title: string;
        body: string;
        buttons: Array<{ label: string; variant: 'primary' | 'secondary' }>;
      };
    };
  } | {
    type: 'maya_transactions_report';
    data: {
      headline: string;
      subtext: string;
      table: {
        rows: Array<{
          id: string;
          amount: string;
          status: string;
          method: string;
          date: string;
          rrn: string;
        }>;
      };
      insight: {
        text: string;
      };
      suggestions: string[];
    };
  } | {
    type: 'maya_diagnosis';
    data: {
      headline: string;
      subtext: string;
      resolution: {
        title: string;
        content: string;
      };
      suggestions: string[];
    };
  } | {
    type: 'maya_draft_message';
    data: {
      headline: string;
      subtext: string;
      draftMessage: string;
      suggestions: string[];
    };
  } | {
    type: 'support_ticket_status';
    data: {
      headline: string;
      subtext: string;
      ticket: {
        id: string;
        status: string;
        issue: string;
        raised: string;
        createdOn?: string;
        eta?: string;
        isOverdue?: boolean;
        isEscalated?: boolean;
      };
      explanation: {
        title: string;
        content: string;
      };
      buttons: Array<{ label: string; variant: 'primary' | 'secondary' }>;
      suggestions: string[];
    };
  } | {
    type: 'ticket_escalated';
    data: {
      headline: string;
      subtext: string;
      ticket: {
        id: string;
        status: string;
        newStatus: string;
        nextUpdate: string;
      };
      whatNext: {
        title: string;
        items: Array<{ bold: string; text: string }>;
      };
      suggestions: string[];
    };
  } | {
    type: 'refund_status_report';
    data: {
      headline: string;
      subtext: string;
      transaction: {
        id: string;
        amount: string;
        status: string;
        refundDate: string;
        rrn: string;
        customer: {
          name: string;
          email: string;
        };
      };
      nextSteps: {
        title: string;
        content: string;
      };
      suggestions: string[];
    };
  } | {
    type: 'settlement_upcoming';
    data: {
      headline: string;
      subtext: string;
      settlement: {
        amount: string;
        scheduledFor: string;
        status: 'Scheduled' | 'Processing' | 'Completed';
        cycle: string;
      };
      insight?: {
        text: string;
      };
      suggestions: string[];
    };
  } | {
    type: 'settlement_explanation_with_offer';
    data: {
      headline: string;
      subtext: string;
      table: {
        rows: Array<{ status: string; amount: string }>;
      };
      instantEligible: {
        amount: string;
        message: string;
      };
      buttons: Array<{ label: string; variant: 'primary' | 'secondary' }>;
    };
  } | {
    type: 'instant_settlement_confirmed';
    data: {
      headline: string;
      subtext: string;
      settlement: {
        amount: string;
        scheduledFor: string;
        status: 'Scheduled' | 'Processing' | 'Completed';
        type: 'regular' | 'instant';
      };
      suggestions: string[];
    };
  } | {
    type: 'early_settlements_enabled';
    data: {
      headline: string;
      subtext: string;
      features: string[];
      suggestions: string[];
    };
  } | {
    type: 'settlement_explanation';
    data: {
      headline: string;
      subtext: string;
      table: {
        rows: Array<{ status: string; amount: string }>;
      };
      suggestions: string[];
    };
  } | {
    type: 'instant_settlement_offer';
    data: {
      headline: string;
      subtext: string;
      eligibility: {
        amount: string;
        available: boolean;
      };
      suggestions: string[];
    };
  } | {
    type: 'instant_settlement_charges';
    data: {
      headline: string;
      subtext: string;
      fee: {
        percentage: string;
        amount: string;
        settlementAmount: string;
      };
      promptText: string;
      buttons: Array<{ label: string; variant: 'primary' | 'secondary' }>;
    };
  } | {
    type: 'instant_settlement_enabled';
    data: {
      headline: string;
      subtext: string;
      settlement: {
        amount: string;
        scheduledFor: string;
        status: 'Scheduled' | 'Processing' | 'Completed';
        type: 'regular' | 'instant';
      };
      promptText: string;
      buttons: Array<{ label: string; variant: 'primary' | 'secondary' }>;
      suggestions: string[];
    };
  } | {
    type: 'payment_link_form_card';
    data: {
      formId: string;
      status: 'draft' | 'completed';
      prefill: {
        amount: string;
        purpose: string;
        email?: string;
      };
    };
  } | {
    type: 'kyc_business_details';
    data: {
      headline: string;
      subtext: string;
      businessName: string;
      verificationBadge: string;
      documents: Array<{ name: string; type: string }>;
      suggestions?: string[];
    };
  } | {
    type: 'business_category_card';
    data: {
      category: string;
      subCategory: string;
      isConfirmed?: boolean;
    };
  } | {
    type: 'bank_verification_card';
    data: {
      isVerified?: boolean;
    };
  } | {
    type: 'bank_account_card';
    data: {
      bankName?: string;
      accountNumber?: string;
      ifscCode?: string;
      accountName?: string;
      isConfirmed?: boolean;
    };
  };
}

// --- Animation Primitives ---
const containerVar = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVar = { hidden: { opacity: 0, y: 5, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0)' } };

// --- Copyable Text Component (for links, IDs, emails, RRNs) ---
const CopyableText = ({
  text,
  className = "",
  isLink = false
}: {
  text: string;
  className?: string;
  isLink?: boolean;
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="inline-flex items-center gap-[6px] group/copyable">
      <span className={clsx(
        className,
        isLink && "text-[#2563EB] underline decoration-blue-300 underline-offset-2 hover:text-blue-700 cursor-pointer"
      )}>
        {text}
      </span>
      <Tooltip text={copied ? "Copied!" : "Copy"} position="top">
        <button
          onClick={handleCopy}
          className="size-[16px] shrink-0 opacity-0 group-hover/copyable:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover/copyable:translate-x-0 hover:scale-110"
        >
          <Copy />
        </button>
      </Tooltip>
    </div>
  );
};

// --- Markdown Bold Parser for Static Text ---
const parseMarkdownBold = (content: string): React.ReactNode[] => {
  if (!content) return [];
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={i} className="font-medium text-[#192839]">{part.slice(2, -2)}</span>;
    }
    return <span key={i}>{part}</span>;
  }).filter(node => {
    const text = typeof node === 'string' ? node : (node as React.ReactElement).props.children;
    return text && text.length > 0;
  });
};

// --- Investigation Report Component ---
const InvestigationReportArtifact = ({ data, onRowClick, onSuggestionClick, isLast, highlightedSuggestionIndex = null, onStreamComplete }: any) => {
  const timing = useTimingSettingsOptional();
  const [subtextStarted, setSubtextStarted] = useState(false);
  const [statsStarted, setStatsStarted] = useState(false);
  const [tableStarted, setTableStarted] = useState(false);
  const [narrativeComplete, setNarrativeComplete] = useState(false);
  const [allStreamingComplete, setAllStreamingComplete] = useState(false);

  const { phase, onNarrativeComplete, onDataAssetComplete, onInsightComplete, onFooterComplete } = useStreamSequencer({
    hasDataAsset: !!data.table,
    hasInsight: !!data.resolution,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: timing.thinkingDuration,
    onStreamComplete
  });

  // Start subtext after cognitive pause following headline
  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), timing.cognitiveDelay);
  }, [timing.cognitiveDelay]);

  // Start stats after subtext completes (with brief pause)
  const handleSubtextComplete = React.useCallback(() => {
    if (data.stats && data.stats.length > 0) {
      setTimeout(() => setStatsStarted(true), timing.sequentialDelay);
    } else {
      setTimeout(() => {
        setTableStarted(true);
        setNarrativeComplete(true);
      }, timing.sequentialDelay);
    }
    onNarrativeComplete();
  }, [onNarrativeComplete, data.stats, timing.sequentialDelay]);

  // Start table after stats complete (with brief pause)
  const handleStatsComplete = React.useCallback(() => {
    setTimeout(() => {
      setTableStarted(true);
      setNarrativeComplete(true);
    }, timing.sequentialDelay);
  }, [timing.sequentialDelay]);

  // Set allStreamingComplete after ALL phases are done (phase >= 5 = suggestions phase)
  React.useEffect(() => {
    if (phase >= 5 && narrativeComplete && !allStreamingComplete) {
      // Phase 5 means all content has appeared, add small buffer for final animations
      const timer = setTimeout(() => {
        setAllStreamingComplete(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [phase, narrativeComplete, allStreamingComplete]);

  // Determine ChainOfThought mode - only complete when phase >= 5 AND all streaming is done
  const chainOfThoughtMode = (phase >= 5 && allStreamingComplete) ? 'complete' : 'streaming';

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      {/* Primary Content Section - gap-[16px] between subsections */}
      <div className="flex flex-col gap-[16px]">
        {/* Header + Subtext + Stats Group - gap-[4px] internally */}
            <div className="flex flex-col gap-[4px] px-[0px] py-[4px]">
              {/* 1. Header: Bold Text (streamed) */}
              <motion.div variants={itemVar}>
                <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
                  <PerplexityStreamText
                    content={data.headline}
                    speed={timing.textStreamSpeed + 7}
                    style={timing.streamingStyle}
                    glowIntensity={timing.streamingGlowIntensity}
                    trailLength={timing.streamingTrailLength}
                    onComplete={handleHeadlineComplete}
                    inheritStyles
                  />
                </h3>
              </motion.div>

              {/* 2. Subtext with inline bold (streamed after cognitive pause) */}
              {subtextStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
                >
                  <PerplexityStreamText
                    content={data.subtext}
                    speed={timing.textStreamSpeed}
                    style={timing.streamingStyle}
                    glowIntensity={timing.streamingGlowIntensity}
                    trailLength={timing.streamingTrailLength}
                    onComplete={handleSubtextComplete}
                  />
                </motion.div>
              )}

              {/* 3. Stats List - waits for subtext to complete */}
              {statsStarted && data.stats && (
                <StreamingBulletList
                  items={data.stats}
                  type="stats"
                  speed={timing.textStreamSpeed}
                  boldSpeed={timing.textStreamSpeed + 4}
                  style={timing.streamingStyle}
                  className="pl-[28px] ml-0"
                  onComplete={handleStatsComplete}
                />
              )}
            </div>

            {/* 4. Table Section - waits for stats to complete */}
            {tableStarted && data.table && (
              <motion.div
                className="pl-0 py-[12px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                onAnimationComplete={onDataAssetComplete}
              >
                <AnimatedLoadingCard isLoading={phase < 2} loadingHeight={48} borderRadius="12px">
                  <div>
                    <h4 className="text-[18px] font-bold text-slate-900 mb-3">Your recent refunds:</h4>
                    <div className="w-full rounded-[12px] border border-[#E4E7EC] relative group/table overflow-hidden">
                        {/* Table Header */}
                        <div className="flex h-[48px] text-[14px] font-medium text-[#192839] bg-[rgba(108,132,157,0.06)] px-[16px] border-b border-[rgba(108,132,157,0.18)]">
                          <div className="w-[100px] shrink-0 flex items-center pl-[20px]">Amount</div>
                          <div className="w-[90px] shrink-0 flex items-center">Status</div>
                          <div className="w-[160px] shrink-0 flex items-center">Issued On</div>
                          <div className="w-[130px] shrink-0 flex items-center">Bank RRN</div>
                          <div className="min-w-[160px] flex-1 flex items-center">Customer Email</div>
                        </div>
                        {/* Table Rows */}
                        <div className="bg-white">
                          {data.table.rows.map((row: any, rowIndex: number) => (
                            <div
                              key={row.id}
                              className="relative flex h-[56px] items-center px-[16px] border-b border-[#E4E7EC] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group/row cursor-pointer"
                              onClick={() => onRowClick?.(row)}
                            >
                              <div className="w-[100px] shrink-0 font-medium text-[#1D2939] text-[14px] pl-[20px]">{row.amount}</div>
                              <div className="w-[90px] shrink-0">
                                <span className="inline-flex items-center h-[20px] px-[8px] bg-[rgba(18,145,208,0.09)] text-[#0f78ad] text-[12px] font-medium leading-[18px] rounded-[1000px]">
                                  {row.status}
                                </span>
                              </div>
                              <div className="w-[160px] shrink-0 text-[#5D6B82] text-[14px] font-normal">{row.date}</div>
                              <div className="w-[130px] shrink-0 text-[#5D6B82] font-mono text-[14px] font-normal">
                                <CopyableText text={row.rrn} className="text-[#5D6B82]" />
                              </div>
                              <div className="min-w-[160px] flex-1 text-[14px] font-normal truncate">
                                <CopyableText text={row.email} className="text-[#5D6B82] underline decoration-slate-300 underline-offset-2" />
                              </div>
                            </div>
                          ))}
                        </div>

                      {/* Table-level hover actions - bottom right */}
                      <div className="absolute bottom-0 right-0 flex items-center gap-2 bg-white shadow-lg border border-slate-200 rounded-md p-1.5 opacity-0 group-hover/table:opacity-100 transition-opacity z-10 m-[8px]">
                        <Tooltip text="Copy table data" position="top">
                          <button className="p-1.5 hover:bg-slate-50 rounded text-slate-500 hover:text-slate-700 transition-colors">
                            <CopyIcon size={16} />
                          </button>
                        </Tooltip>
                        <Tooltip text="Download table" position="top">
                          <button className="p-1.5 hover:bg-slate-50 rounded text-slate-500 hover:text-slate-700 transition-colors">
                            <Download size={16} />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </AnimatedLoadingCard>
              </motion.div>
            )}

            {/* 5. Resolution (Phase 3+) */}
            {phase >= 3 && data.resolution && (
              <motion.div
                initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                onAnimationComplete={onInsightComplete}
                className="flex flex-col gap-[4px]"
              >
                <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
                  {data.resolution.title}
                </h3>
                <p className="text-[16px] leading-[26px] text-[#40566d] tracking-[0.16px] whitespace-pre-line">
                  <SmartHighlightWithBold text={data.resolution.content} />
                </p>
              </motion.div>
            )}

            {/* 5b. Action Buttons (Phase 3+) - if buttons exist */}
            {phase >= 3 && data.buttons && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex gap-3 mt-2"
              >
                {data.buttons.map((button: { label: string; variant: 'primary' | 'secondary' }, i: number) => (
                  <button
                    key={i}
                    onClick={() => onSuggestionClick?.(button.label)}
                    className={clsx(
                      'px-4 py-2 rounded-lg font-medium text-[14px] transition-all duration-200',
                      button.variant === 'primary'
                        ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-sm'
                        : 'bg-[#f1f5fa] text-[#40566d] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
                    )}
                  >
                    {button.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* 6. Footer Actions Strip - Only visible after ALL streaming is complete */}
          {phase >= 4 && allStreamingComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              onAnimationComplete={onFooterComplete}
              className="flex items-center justify-between w-full"
            >
              <div className="flex gap-[8px] items-center">
                <Tooltip text="Good response" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
                <Tooltip text="Bad response" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
                <Tooltip text="Copy to clipboard" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <div className="size-[16px]">
                      <Copy />
                    </div>
                  </button>
                </Tooltip>
                <Tooltip text="Share" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
              </div>
              <RelativeTimestamp />
            </motion.div>
          )}

        {/* 7. Divider - Only after ALL streaming is complete and if it's the last message */}
        {phase >= 5 && allStreamingComplete && isLast && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-[0.5px] bg-[#CBD5E2] origin-left"
          />
        )}

        {/* 8. ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
        {isLast && (
          <ChainOfThought
            mode={chainOfThoughtMode}
            suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
            onSuggestionClick={onSuggestionClick}
            highlightedSuggestionIndex={highlightedSuggestionIndex}
          />
        )}
    </motion.div>
  );
};

// --- Payment Link Form Card Artifact Component ---
const PaymentLinkFormCardArtifact = ({
  data,
  onMiniCardClick,
  onMiniCardAnimationComplete,
  animatingCardId,
  isLast,
  onSuggestionClick,
  highlightedSuggestionIndex,
  onStreamComplete
}: {
  data: any;
  onMiniCardClick?: (formId: string, sourceRect?: SourceRect) => void;
  onMiniCardAnimationComplete?: (formId: string) => void;
  animatingCardId?: string | null;
  isLast: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  highlightedSuggestionIndex?: number | null;
  onStreamComplete?: () => void;
}) => {
  const timing = useTimingSettingsOptional();
  const [subtextStarted, setSubtextStarted] = useState(false);
  const [cardStarted, setCardStarted] = useState(false);
  const [allStreamingComplete, setAllStreamingComplete] = useState(false);

  const { phase, onNarrativeComplete, onDataAssetComplete, onFooterComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: false,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: data.headline ? 1500 : 0, // Brief spotlight before streaming if there's content
    onStreamComplete
  });

  // Start subtext after cognitive pause following headline
  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), timing.cognitiveDelay);
  }, [timing.cognitiveDelay]);

  // Start card after subtext completes
  const handleSubtextComplete = React.useCallback(() => {
    setTimeout(() => {
      setCardStarted(true);
      setAllStreamingComplete(true);
    }, timing.sequentialDelay);
    onNarrativeComplete();
  }, [onNarrativeComplete, timing.sequentialDelay]);

  // If no headline, show card immediately
  React.useEffect(() => {
    if (!data.headline) {
      setCardStarted(true);
      setAllStreamingComplete(true);
    }
  }, [data.headline]);

  const chainOfThoughtMode = (phase >= 5 && allStreamingComplete) ? 'complete' : 'streaming';

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      {/* Primary Content Section - shows after spotlight animation (phase >= 1) */}
      {phase >= 1 && (
      <div className="flex flex-col gap-[16px]">
        {/* Headline + Subtext */}
        {data.headline && (
          <div className="flex flex-col gap-[4px] px-[0px] py-[4px]">
            {/* Headline (streamed) */}
            <motion.div variants={itemVar}>
              <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
                <PerplexityStreamText
                  content={data.headline}
                  speed={timing.textStreamSpeed + 7}
                  style={timing.streamingStyle}
                  glowIntensity={timing.streamingGlowIntensity}
                  trailLength={timing.streamingTrailLength}
                  onComplete={handleHeadlineComplete}
                  inheritStyles
                />
              </h3>
            </motion.div>

            {/* Subtext (streamed after cognitive pause) */}
            {subtextStarted && data.subtext && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
              >
                <PerplexityStreamText
                  content={data.subtext}
                  speed={timing.textStreamSpeed}
                  style={timing.streamingStyle}
                  glowIntensity={timing.streamingGlowIntensity}
                  trailLength={timing.streamingTrailLength}
                  onComplete={handleSubtextComplete}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* Mini Card - appears after text streaming or immediately if no text */}
        {cardStarted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onAnimationComplete={() => {
              onDataAssetComplete();
              // Notify parent when mini card animation is complete (for auto-open modal)
              if (!data.isLoading) {
                onMiniCardAnimationComplete?.(data.formId);
              }
            }}
          >
            <PaymentLinkMiniCard
              formData={data.prefill}
              status={data.status}
              onClick={(sourceRect) => onMiniCardClick?.(data.formId, sourceRect)}
              isLoading={data.isLoading}
              linkUrl={data.linkUrl}
              isAnimatingToModal={animatingCardId === data.formId}
              formId={data.formId}
            />
          </motion.div>
        )}
      </div>
      )}

      {/* Footer Actions Strip - Only visible after ALL streaming is complete */}
      {phase >= 4 && allStreamingComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onAnimationComplete={onFooterComplete}
          className="flex items-center justify-between w-full"
        >
          <div className="flex gap-[8px] items-center">
            <Tooltip text="Good response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Bad response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Copy to clipboard" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <div className="size-[16px]">
                  <Copy />
                </div>
              </button>
            </Tooltip>
            <Tooltip text="Share" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
          </div>
          <RelativeTimestamp />
        </motion.div>
      )}

      {/* Divider - Only after ALL streaming is complete and if it's the last message */}
      {phase >= 5 && allStreamingComplete && isLast && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-[0.5px] bg-[#CBD5E2] origin-left"
        />
      )}

      {/* ChainOfThought with suggestions */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Followup Question Artifact Component ---
const FollowupQuestionArtifact = ({
  data,
  isLast,
  onButtonClick
}: {
  data: { headline: string; question: string; buttons: Array<{ label: string; variant: 'primary' | 'secondary' }> };
  isLast: boolean;
  onButtonClick?: (label: string) => void;
}) => {
  const [questionStarted, setQuestionStarted] = useState(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,   // buttons count as data asset
    hasInsight: false,
    hasSuggestions: false,
    thinkingDuration: 0   // No thinking animation for followup questions
  });

  // Start question text after 1.3s cognitive pause following headline
  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setQuestionStarted(true), 1300);
  }, []);

  return (
    <motion.div
      className="flex flex-col gap-[16px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      {/* Phase 1: Headline (streamed) */}
      <motion.div variants={itemVar} className="flex gap-[6px] items-center">
        <div className="shrink-0 size-[20px] rounded-[3.33px] flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--magic-primary, #2563EB)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
          <PerplexityStreamText
            content={data.headline}
            speed={15}
            style="glow"
            onComplete={handleHeadlineComplete}
            inheritStyles
          />
        </h3>
      </motion.div>

      {/* Question text (streamed after 1.3s pause) */}
      {questionStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
        >
          <PerplexityStreamText
            content={data.question}
            speed={10}
            style="glow"
            onComplete={onNarrativeComplete}
          />
        </motion.div>
      )}

      {/* Phase 2+: Action Buttons */}
      {phase >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-3"
        >
          {data.buttons.map((button, i) => (
            <button
              key={i}
              onClick={() => onButtonClick?.(button.label)}
              className={clsx(
                'px-4 py-2 rounded-lg font-medium text-[14px] transition-all duration-200',
                button.variant === 'primary'
                  ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-sm'
                  : 'bg-[#f1f5fa] text-[#40566d] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
              )}
            >
              {button.label}
            </button>
          ))}
        </motion.div>
      )}

    </motion.div>
  );
};

// --- Simple Text Artifact Component ---
const SimpleTextArtifact = ({
  data,
  isLast,
  onSuggestionClick,
  highlightedSuggestionIndex = null
}: {
  data: { headline?: string; body: string; suggestions?: string[]; button?: { label: string; variant?: 'primary' | 'secondary' } };
  isLast: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  highlightedSuggestionIndex?: number | null;
}) => {
  const [bodyStarted, setBodyStarted] = useState(false);
  const [bodyComplete, setBodyComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: !!data.button,
    hasInsight: false,
    hasSuggestions: !!data.suggestions?.length,
    thinkingDuration: 2000  // 2 seconds for simple text
  });

  // ChainOfThought mode based on phase
  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  // Start body after 1.3s cognitive pause following headline (or immediately if no headline)
  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setBodyStarted(true), 1300);
  }, []);

  // If no headline, start body immediately when phase 1 begins
  useEffect(() => {
    if (phase >= 1 && !data.headline) {
      setBodyStarted(true);
    }
  }, [phase, data.headline]);

  const handleBodyComplete = React.useCallback(() => {
    setBodyComplete(true);
    onNarrativeComplete();
  }, [onNarrativeComplete]);

  // Show button after narrative completes (phase 2)
  useEffect(() => {
    if (phase >= 2 && data.button) {
      setShowButton(true);
    }
  }, [phase, data.button]);

  return (
    <motion.div
      className="flex flex-col gap-3 w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      {/* Headline (optional, streamed) */}
      {data.headline && (
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>
      )}

      {/* Body text (streamed after 1.3s pause if headline exists, otherwise immediately) */}
      {bodyStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
        >
          <PerplexityStreamText
            content={data.body}
            speed={10}
            style="glow"
            onComplete={handleBodyComplete}
          />
        </motion.div>
      )}

      {/* Action Button (appears after body completes) */}
      {showButton && data.button && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2"
        >
          <button
            onClick={() => onSuggestionClick?.(data.button!.label)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium text-[14px] transition-all duration-200',
              data.button.variant === 'secondary'
                ? 'bg-[#f1f5fa] text-[#40566d] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
                : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-sm'
            )}
          >
            {data.button.label}
          </button>
        </motion.div>
      )}


      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Bullet List with Buttons Artifact Component ---
const BulletListWithButtonsArtifact = ({
  data,
  isLast,
  onButtonClick
}: {
  data: { bullets: Array<{ bold: string; text: string }>; buttons: Array<{ label: string; variant: 'primary' | 'secondary' }> };
  isLast: boolean;
  onButtonClick?: (label: string) => void;
}) => {
  const [showButtons, setShowButtons] = useState(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,   // buttons count as data asset
    hasInsight: false,
    hasSuggestions: false,
    thinkingDuration: 1500   // Brief thinking for follow-up responses
  });

  // Show buttons after narrative completes
  useEffect(() => {
    if (phase >= 2) {
      setShowButtons(true);
    }
  }, [phase]);

  return (
    <>
      {/* Phase 0: Thinking */}
      {phase === 0 && <ChainOfThought mode="waiting" />}

      {/* Phase 1+: Content */}
      {phase >= 1 && (
        <motion.div
          className="flex flex-col gap-[16px] w-full mt-2"
          initial="hidden"
          animate="visible"
          variants={containerVar}
        >
          {/* Bullet Points (streaming character-by-character) */}
          <StreamingBulletList
            items={data.bullets}
            type="bullets"
            speed={10}
            boldSpeed={15}
            style="glow"
            onComplete={onNarrativeComplete}
          />

          {/* Action Buttons */}
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-3 mt-2"
            >
              {data.buttons.map((button, i) => (
                <button
                  key={i}
                  onClick={() => onButtonClick?.(button.label)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium text-[14px] transition-all duration-200',
                    button.variant === 'primary'
                      ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-sm'
                      : 'bg-[#f1f5fa] text-[#40566d] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
                  )}
                >
                  {button.label}
                </button>
              ))}
            </motion.div>
          )}

        </motion.div>
      )}
    </>
  );
};

// --- Setting Updated with Bullets Artifact Component ---
const SettingUpdatedWithBulletsArtifact = ({
  data,
  isLast,
  onButtonClick
}: {
  data: {
    headline: string;
    body: string;
    bullets: Array<{ text: string }>;
    buttons: Array<{ label: string; variant: 'primary' | 'secondary' }>;
  };
  isLast: boolean;
  onButtonClick?: (label: string) => void;
}) => {
  const [bodyStarted, setBodyStarted] = useState(false);
  const [showBullets, setShowBullets] = useState(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,   // buttons count as data asset
    hasInsight: false,
    hasSuggestions: false,
    thinkingDuration: 1500
  });

  // Start body after 1s cognitive pause following headline
  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setBodyStarted(true), 1000);
  }, []);

  // Show bullets after body completes
  const handleBodyComplete = React.useCallback(() => {
    setShowBullets(true);
    onNarrativeComplete();
  }, [onNarrativeComplete]);

  return (
    <>
      {/* Phase 0: Thinking */}
      {phase === 0 && <ChainOfThought mode="waiting" />}

      {/* Phase 1+: Content */}
      {phase >= 1 && (
        <motion.div
          className="flex flex-col gap-[16px] w-full mt-2"
          initial="hidden"
          animate="visible"
          variants={containerVar}
        >
          {/* Headline (streamed) */}
          <motion.div variants={itemVar}>
            <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
              <PerplexityStreamText
                content={data.headline}
                speed={15}
                onComplete={handleHeadlineComplete}
                inheritStyles
              />
            </h3>
          </motion.div>

          {/* Body text (streamed after pause) */}
          {bodyStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
            >
              <PerplexityStreamText
                content={data.body}
                speed={10}
                style="glow"
                onComplete={handleBodyComplete}
              />
            </motion.div>
          )}

          {/* Bullet Points */}
          {/* Bullet Points (streaming character-by-character) */}
          {showBullets && (
            <StreamingBulletList
              items={data.bullets}
              type="bullets"
              speed={10}
              boldSpeed={15}
              style="glow"
            />
          )}

          {/* Action Buttons (Phase 2+) */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-3 mt-2 pl-[24px]"
            >
              {data.buttons.map((button, i) => (
                <button
                  key={i}
                  onClick={() => onButtonClick?.(button.label)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium text-[14px] transition-all duration-200',
                    button.variant === 'primary'
                      ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-sm'
                      : 'bg-[#f1f5fa] text-[#40566d] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
                  )}
                >
                  {button.label}
                </button>
              ))}
            </motion.div>
          )}

        </motion.div>
      )}
    </>
  );
};

// --- Payment Links Created Artifact Component ---
const PaymentLinksCreatedArtifact = ({
  data,
  isLast,
  onButtonClick,
  onRowClick
}: {
  data: {
    headline: string;
    body: string;
    table: { rows: Array<{ id: string; linkUrl: string; amount: string; status: string; createdOn: string; expiry: string }> };
    followup: { title: string; body: string; buttons: Array<{ label: string; variant: 'primary' | 'secondary' }> };
  };
  isLast: boolean;
  onButtonClick?: (label: string) => void;
  onRowClick?: (rowData: any) => void;
}) => {
  const [bodyStarted, setBodyStarted] = useState(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,   // table counts as data asset
    hasInsight: true,     // followup counts as insight
    hasSuggestions: false,
    thinkingDuration: 1500
  });

  // Start body after 1s cognitive pause following headline
  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setBodyStarted(true), 1000);
  }, []);

  return (
    <>
      {/* Phase 0: Thinking */}
      {phase === 0 && <ChainOfThought mode="waiting" />}

      {/* Phase 1+: Content */}
      {phase >= 1 && (
        <motion.div
          className="flex flex-col gap-[24px] w-full mt-2"
          initial="hidden"
          animate="visible"
          variants={containerVar}
        >
          {/* Primary Content Section */}
          <div className="flex flex-col gap-[16px]">
            {/* Header + Body Group */}
            <div className="flex flex-col gap-[4px] px-[0px] py-[4px]">
              {/* 1. Header: Bold Text (streamed) */}
              <motion.div variants={itemVar}>
                <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
                  <PerplexityStreamText
                    content={data.headline}
                    speed={15}
                    style="glow"
                    onComplete={handleHeadlineComplete}
                    inheritStyles
                  />
                </h3>
              </motion.div>

              {/* 2. Body text (streamed after pause) */}
              {bodyStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
                >
                  <PerplexityStreamText
                    content={data.body}
                    speed={10}
                    onComplete={onNarrativeComplete}
                  />
                </motion.div>
              )}
            </div>

            {/* 3. Payment Links Table (Phase 2+) */}
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="pl-0 py-[12px]"
              >
                <AnimatedLoadingCard isLoading={phase < 2} loadingHeight={48} borderRadius="12px">
                <div className="w-full rounded-[12px] overflow-hidden border border-[#E4E7EC] relative group/table">
                  {/* Table Header */}
                  <div className="flex h-[48px] text-[14px] font-medium text-[#192839] bg-[rgba(108,132,157,0.06)] px-[16px] border-b border-[rgba(108,132,157,0.18)]">
                    <div className="w-[260px] flex items-center pl-[20px]">Payment Link</div>
                    <div className="w-[120px] flex items-center">Amount</div>
                    <div className="w-[80px] flex items-center">Status</div>
                    <div className="w-[180px] flex items-center">Created On</div>
                    <div className="flex-1 flex items-center">Expiry</div>
                  </div>
                  {/* Table Rows with staggered animation */}
                  <div className="bg-white">
                    {data.table.rows.map((row, rowIndex) => (
                      <motion.div
                        key={row.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rowIndex * 0.1, duration: 0.3 }}
                        className="relative flex h-[56px] items-center px-[16px] border-b border-[#E4E7EC] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group/row cursor-pointer"
                        onClick={() => onRowClick?.({ ...row, type: 'payment', amount: row.amount, status: 'Active', date: row.createdOn })}
                      >
                        <div className="w-[260px] text-[14px] font-normal pl-[20px]">
                          <CopyableText text={row.linkUrl} isLink />
                        </div>
                        <div className="w-[120px] font-medium text-[#1D2939] text-[14px]">{row.amount}</div>
                        <div className="w-[80px]">
                          <span className="inline-flex items-center h-[20px] px-[8px] bg-[rgba(16,185,129,0.1)] text-[#059669] text-[12px] font-medium leading-[18px] rounded-[1000px]">
                            {row.status}
                          </span>
                        </div>
                        <div className="w-[180px] text-[#5D6B82] text-[14px] font-normal">{row.createdOn}</div>
                        <div className="flex-1 text-[#5D6B82] text-[14px] font-normal">{row.expiry}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Table-level hover actions - bottom right */}
                  <div className="absolute bottom-0 right-0 flex items-center gap-2 bg-white shadow-lg border border-slate-200 rounded-md p-1.5 opacity-0 group-hover/table:opacity-100 transition-opacity z-10 m-[8px]">
                    <Tooltip text="Copy table data" position="top">
                      <button className="p-1.5 hover:bg-slate-50 rounded text-slate-500 hover:text-slate-700 transition-colors">
                        <CopyIcon size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip text="Download table" position="top">
                      <button className="p-1.5 hover:bg-slate-50 rounded text-slate-500 hover:text-slate-700 transition-colors">
                        <Download size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                </AnimatedLoadingCard>
              </motion.div>
            )}

            {/* 4. Followup Section (Phase 3+) */}
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col gap-[12px] mt-2"
              >
                <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
                  {data.followup.title}
                </h3>
                <p className="text-[16px] leading-[26px] text-[#40566d] tracking-[0.16px]">
                  <SmartHighlightWithBold text={data.followup.body} />
                </p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex gap-3 mt-2"
                >
                  {data.followup.buttons.map((button, i) => (
                    <button
                      key={i}
                      onClick={() => onButtonClick?.(button.label)}
                      className={clsx(
                        'px-4 py-2 rounded-lg font-medium text-[14px] transition-all duration-200',
                        button.variant === 'primary'
                          ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-sm'
                          : 'bg-[#f1f5fa] text-[#40566d] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
                      )}
                    >
                      {button.label}
                    </button>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions Strip (Phase 4+) - Only visible for last message */}
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex gap-[8px] items-center">
                <Tooltip text="Good response" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
                <Tooltip text="Bad response" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
                <Tooltip text="Copy to clipboard" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <div className="size-[16px]">
                      <Copy />
                    </div>
                  </button>
                </Tooltip>
                <Tooltip text="Share" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
              </div>
              <RelativeTimestamp />
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
};

// --- Maya Transactions Report Artifact Component ---
const MayaTransactionsReportArtifact = ({ data, onRowClick, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: !!data.table,
    hasInsight: !!data.insight,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 5000  // 5 seconds for primary response
  });

  // Start subtext after 1.3s cognitive pause following headline
  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 1300);
  }, []);

  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-[rgba(234,179,8,0.1)]', text: 'text-[#ca8a04]' };
      case 'captured':
        return { bg: 'bg-[rgba(22,163,74,0.1)]', text: 'text-[#16a34a]' };
      case 'failed':
        return { bg: 'bg-[rgba(220,38,38,0.1)]', text: 'text-[#dc2626]' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-600' };
    }
  };

  // Determine ChainOfThought mode based on phase
  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      {/* Primary Content Section */}
      <div className="flex flex-col gap-[16px]">
        {/* Header + Subtext Group */}
        <div className="flex flex-col gap-[4px] px-[0px] py-[4px]">
              {/* 1. Header: Bold Text (streamed) */}
              <motion.div variants={itemVar}>
                <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
                  <PerplexityStreamText
                    content={data.headline}
                    speed={15}
                    style="glow"
                    onComplete={handleHeadlineComplete}
                    inheritStyles
                  />
                </h3>
              </motion.div>

              {/* 2. Subtext with inline bold (streamed after 1.3s pause) */}
              {subtextStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
                >
                  <PerplexityStreamText
                    content={data.subtext}
                    speed={10}
                    style="glow"
                    onComplete={onNarrativeComplete}
                  />
                </motion.div>
              )}
            </div>

            {/* 3. Table Section (Phase 2+) */}
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="pl-0 py-[12px]"
              >
                <AnimatedLoadingCard isLoading={phase < 2} loadingHeight={48} borderRadius="12px">
                <div className="w-full rounded-[12px] border border-[#E4E7EC] relative group/table overflow-hidden">
                    {/* Table Header */}
                    <div className="flex h-[48px] text-[14px] font-medium text-[#192839] bg-[rgba(108,132,157,0.06)] px-[16px] border-b border-[rgba(108,132,157,0.18)]">
                      <div className="w-[120px] shrink-0 flex items-center pl-[20px]">Amount</div>
                      <div className="w-[90px] shrink-0 flex items-center">Status</div>
                      <div className="w-[120px] shrink-0 flex items-center">Payment Method</div>
                      <div className="w-[180px] shrink-0 flex items-center">Created On</div>
                      <div className="min-w-[130px] flex-1 flex items-center">Bank RRN</div>
                    </div>
                    {/* Table Rows with staggered animation */}
                    <div className="bg-white">
                      {data.table.rows.map((row: any, rowIndex: number) => {
                        const statusStyle = getStatusStyle(row.status);
                        return (
                          <motion.div
                            key={row.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: rowIndex * 0.1, duration: 0.3 }}
                            className="relative flex h-[56px] items-center px-[16px] border-b border-[#E4E7EC] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group/row cursor-pointer"
                            onClick={() => onRowClick?.({ ...row, email: 'arvind@gmail.com' })}
                          >
                            <div className="w-[120px] shrink-0 font-medium text-[#1D2939] text-[14px] pl-[20px]">{row.amount}</div>
                            <div className="w-[90px] shrink-0">
                              <span className={clsx(
                                "inline-flex items-center h-[20px] px-[8px] text-[12px] font-medium leading-[18px] rounded-[1000px]",
                                statusStyle.bg, statusStyle.text
                              )}>
                                {row.status}
                              </span>
                            </div>
                            <div className="w-[120px] shrink-0 text-[#5D6B82] text-[14px] font-normal">{row.method}</div>
                            <div className="w-[180px] shrink-0 text-[#5D6B82] text-[14px] font-normal">{row.date}</div>
                            <div className="min-w-[130px] flex-1 text-[14px] font-normal">
                              <CopyableText text={row.rrn} className="text-[#5D6B82] font-mono" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                  {/* Table-level hover actions - bottom right */}
                  <div className="absolute bottom-0 right-0 flex items-center gap-2 bg-white shadow-lg border border-slate-200 rounded-md p-1.5 opacity-0 group-hover/table:opacity-100 transition-opacity z-10 m-[8px]">
                    <Tooltip text="Copy table data" position="top">
                      <button className="p-1.5 hover:bg-slate-50 rounded text-slate-500 hover:text-slate-700 transition-colors">
                        <CopyIcon size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip text="Download table" position="top">
                      <button className="p-1.5 hover:bg-slate-50 rounded text-slate-500 hover:text-slate-700 transition-colors">
                        <Download size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                </AnimatedLoadingCard>
              </motion.div>
            )}

            {/* 4. Ray Insight Card (Phase 3+) */}
            {phase >= 3 && data.insight && (
              <motion.div
                initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative bg-white rounded-[12px] border border-[#dee1e3] overflow-hidden shadow-[0px_6px_32px_4px_rgba(175,182,187,0.06)]"
              >
                {/* Top gradient */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#f8fafb] to-transparent pointer-events-none z-[1]" />

                {/* Embedded SparkRipples animation on right end - plays once */}
                <div className="absolute right-[-500px] top-1/2 -translate-y-1/2 w-[1500px] h-[1500px] pointer-events-none opacity-70">
                  <SparkRipplesBackground
                    loop={true}
                    playbackRate={0.4}
                    scale={1}
                    opacity={1}
                  />
                </div>

                {/* Blue glow on right side (fallback/overlay) */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none"
                  style={{
                    background: 'linear-gradient(270deg, rgba(37, 99, 235, 0.06) 0%, transparent 100%)',
                  }}
                />

                {/* Content */}
                <div className="relative p-[16px] flex flex-col gap-[4px] z-[2]">
                  <span className="text-[14px] font-semibold text-[#192839]">Ray Insight</span>
                  <p className="text-[14px] leading-[22px] text-[#40566d]">
                    <SmartHighlightWithBold text={data.insight.text} />
                  </p>
                </div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#f8fafb] to-transparent pointer-events-none z-[1]" />

                {/* Inner shadow overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_#dee1e3,inset_0px_-1.5px_0px_1px_white] z-[3]" />
              </motion.div>
            )}
          </div>

          {/* 5. Footer Actions Strip (Phase 4+) - Only visible for last message */}
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex gap-[8px] items-center">
                <Tooltip text="Good response" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
                <Tooltip text="Bad response" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
                <Tooltip text="Copy to clipboard" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <div className="size-[16px]">
                      <Copy />
                    </div>
                  </button>
                </Tooltip>
                <Tooltip text="Share" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
              </div>
              <RelativeTimestamp />
            </motion.div>
          )}

        {/* 6. Divider (Phase 5+) - Only if it's the last message */}
        {phase >= 5 && isLast && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-[0.5px] bg-[#CBD5E2] origin-left"
          />
        )}

        {/* 7. ChainOfThought - Always at bottom */}
        {isLast && (
          <ChainOfThought
            mode={chainOfThoughtMode}
            suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
            onSuggestionClick={onSuggestionClick}
            highlightedSuggestionIndex={highlightedSuggestionIndex}
          />
        )}
    </motion.div>
  );
};

// --- Maya Diagnosis Artifact Component ---
const MayaDiagnosisArtifact = ({ data, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: false,
    hasInsight: !!data.resolution,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 4000
  });

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 1300);
  }, []);

  // Determine ChainOfThought mode based on phase
  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Header + Subtext */}
        <div className="flex flex-col gap-[4px] px-[0px] py-[4px]">
          <motion.div variants={itemVar}>
            <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
              <PerplexityStreamText
                content={data.headline}
                speed={15}
                onComplete={handleHeadlineComplete}
                inheritStyles
              />
            </h3>
          </motion.div>

              {subtextStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
                >
                  <PerplexityStreamText
                    content={data.subtext}
                    speed={10}
                    style="glow"
                    onComplete={onNarrativeComplete}
                  />
                </motion.div>
              )}
            </div>

            {/* Resolution (Phase 3+) */}
            {phase >= 3 && data.resolution && (
              <motion.div
                initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col gap-[4px]"
              >
                <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
                  {data.resolution.title}
                </h3>
                <p className="text-[16px] leading-[26px] text-[#40566d] tracking-[0.16px]">
                  <SmartHighlightWithBold text={data.resolution.content} />
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer Actions (Phase 4+) */}
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex gap-[8px] items-center">
                <Tooltip text="Good response" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
                <Tooltip text="Bad response" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
                <Tooltip text="Copy to clipboard" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <div className="size-[16px]"><Copy /></div>
                  </button>
                </Tooltip>
                <Tooltip text="Share" position="bottom">
                  <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                    <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
                  </button>
                </Tooltip>
              </div>
              <RelativeTimestamp />
            </motion.div>
          )}

        {/* Divider */}
        {phase >= 5 && isLast && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="w-full h-[0.5px] bg-[#CBD5E2] origin-left"
          />
        )}

        {/* ChainOfThought - Always at bottom */}
        {isLast && (
          <ChainOfThought
            mode={chainOfThoughtMode}
            suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
            onSuggestionClick={onSuggestionClick}
            highlightedSuggestionIndex={highlightedSuggestionIndex}
          />
        )}
    </motion.div>
  );
};

// --- Maya Draft Message Artifact Component ---
const MayaDraftMessageArtifact = ({ data, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const [copied, setCopied] = useState(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,  // draft message box
    hasInsight: false,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  // ChainOfThought mode based on phase
  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(data.draftMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Header + Subtext */}
        <div className="flex flex-col gap-[4px]">
          <motion.div variants={itemVar}>
            <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
              <PerplexityStreamText
                content={data.headline}
                speed={15}
                style="glow"
                onComplete={handleHeadlineComplete}
                inheritStyles
              />
            </h3>
          </motion.div>

          {subtextStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
            >
              <PerplexityStreamText
                content={data.subtext}
                speed={10}
                style="glow"
                onComplete={onNarrativeComplete}
              />
            </motion.div>
          )}
        </div>

        {/* Draft Message Box (Phase 2+) */}
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative group"
          >
            <div className="p-[20px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px]">
              <pre className="text-[14px] leading-[22px] text-[#40566d] whitespace-pre-wrap font-sans">
                {data.draftMessage}
              </pre>
            </div>
            {/* Copy button on hover */}
            <button
              onClick={handleCopyDraft}
              className="absolute top-3 right-3 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 shadow-sm flex items-center gap-1.5"
            >
              <CopyIcon size={12} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer Actions (Phase 4+) */}
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between w-full"
        >
          <div className="flex gap-[8px] items-center">
            <Tooltip text="Good response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Bad response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Copy to clipboard" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <div className="size-[16px]"><Copy /></div>
              </button>
            </Tooltip>
            <Tooltip text="Share" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
          </div>
          <RelativeTimestamp />
        </motion.div>
      )}

      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Sam's Support Ticket Status Artifact ---
const SupportTicketStatusArtifact = ({ data, onButtonClick, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  // Local state for immediate in-place button change
  const [isLocallyEscalated, setIsLocallyEscalated] = useState(false);
  // Ref to prevent double-calling onNarrativeComplete
  const narrativeCompleteCalledRef = React.useRef(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: !!data.explanation,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  // Handle empty subtext case - trigger narrative complete via useEffect
  React.useEffect(() => {
    if (subtextStarted && !data.subtext && !narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [subtextStarted, data.subtext, onNarrativeComplete]);

  // Handle escalate click - immediately update button in-place AND trigger flow advance
  const handleEscalateClick = () => {
    setIsLocallyEscalated(true);
    onButtonClick?.('Escalate this Ticket');
  };

  // Determine if escalated (from data OR local state for in-place update)
  const isEscalated = data.ticket.isEscalated || isLocallyEscalated;

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Header */}
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={onNarrativeComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Support Ticket Card (Phase 2+) - New Figma Design */}
      {phase >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-[12px] overflow-hidden shadow-[0px_6px_32px_4px_rgba(184,196,214,0.06)] border border-[#e2e8f0] max-w-[531px]"
          style={{ background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 72%, #E3F6FF 100%)' }}
        >
          {/* Inner border effect */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_1px_white,inset_0px_1.5px_0px_1px_white]" />

          <div className="flex flex-col gap-[19px] px-[15px] py-[12px]">
            {/* Header Row */}
            <div className="flex items-center justify-between pt-[8px]">
              <div className="flex gap-[16px] items-center">
                {/* Ticket Icon */}
                <div className="bg-[rgba(108,132,157,0.06)] flex items-center justify-center rounded-[4px] w-[40px] h-[40px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5v2" />
                    <path d="M15 11v2" />
                    <path d="M15 17v2" />
                    <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
                  </svg>
                </div>
                {/* Title & Subtitle */}
                <div className="flex flex-col">
                  <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[18px] leading-[24px] text-[#3a4755]">
                    {data.ticket.issue}
                  </span>
                  <span className="font-['TASA_Orbiter_Display',sans-serif] text-[18px] leading-[24px] text-[#768ea7]">
                    Ticket {data.ticket.id}
                  </span>
                </div>
              </div>
              {/* ETA Badge - Red for overdue (unless escalated), Blue for normal/escalated */}
              <span className={`px-[8px] py-[4px] text-[12px] font-medium rounded-[4px] ${
                data.ticket.isOverdue && !isEscalated
                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                  : 'bg-[#E3F6FF] text-[#0284c7]'
              }`}>
                ETA: {isEscalated ? 'Today' : (data.ticket.eta || 'Jan 31')}
              </span>
            </div>

            {/* Status Rows */}
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#768ea7] leading-[18px]">Status</span>
                <span className={`text-[14px] font-medium leading-[20px] ${
                  isEscalated ? 'text-[#2563EB]' : 'text-[#40566d]'
                }`}>
                  {isEscalated ? 'Escalated' : data.ticket.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#768ea7] leading-[18px]">Created On</span>
                <span className="text-[14px] font-medium text-[#40566d] leading-[20px]">
                  {data.ticket.createdOn || data.ticket.raised}
                </span>
              </div>
            </div>

            {/* Action Buttons - Only show if buttons array has items or we're showing escalate/escalated state */}
            {(data.buttons?.length > 0 || (!data.ticket.isEscalated && !isLocallyEscalated) || isLocallyEscalated) && (
              <div className="flex gap-[12px]">
                <AnimatePresence mode="wait">
                  {isLocallyEscalated ? (
                    // First response after click: Show "Ticket escalated" confirmation
                    <motion.div
                      key="escalated-confirm"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 h-[36px] rounded-[8px] text-white text-[12px] font-medium tracking-[-0.156px] relative overflow-hidden flex items-center justify-center gap-[6px]"
                      style={{ background: 'linear-gradient(-27deg, rgba(7, 51, 128, 0.7) 55%, rgba(71, 147, 253, 0.7) 99%)' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="relative z-10">Ticket escalated</span>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.2),inset_0px_-2px_0px_0px_rgba(255,255,255,0.2)]" />
                    </motion.div>
                  ) : !data.ticket.isEscalated ? (
                    // First response initial: Show "Escalate this Ticket" button
                    <motion.button
                      key="escalate"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={handleEscalateClick}
                      className="flex-1 h-[36px] rounded-[8px] text-white text-[12px] font-medium tracking-[-0.156px] relative overflow-hidden shadow-[0px_1px_1px_0px_rgba(0,0,0,0.06)]"
                      style={{ background: 'linear-gradient(-25deg, #1566F1 55%, #4793FD 99%)' }}
                    >
                      <span className="relative z-10">Escalate this Ticket</span>
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.2),inset_0px_-2px_0px_0px_rgba(255,255,255,0.2)]" />
                    </motion.button>
                  ) : null}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Explanation Section (Phase 3+) */}
      {phase >= 3 && data.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-[8px]"
        >
          <h4 className="text-[16px] font-medium text-[#192839]">{data.explanation.title}</h4>
          <p className="text-[14px] text-[#40566d] leading-[22px]">{data.explanation.content}</p>
        </motion.div>
      )}

      {/* Footer Actions (Phase 4+) */}
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between w-full"
        >
          <div className="flex gap-[8px] items-center">
            <Tooltip text="Good response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Bad response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Copy to clipboard" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <div className="size-[16px]"><Copy /></div>
              </button>
            </Tooltip>
            <Tooltip text="Share" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
          </div>
          <RelativeTimestamp />
        </motion.div>
      )}

      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Sam's Ticket Escalated Artifact ---
const TicketEscalatedArtifact = ({ data, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: true,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Header */}
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {subtextStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={onNarrativeComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Escalated Ticket Card (Phase 2+) */}
      {phase >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-[#e2e8f0] rounded-[12px] overflow-hidden bg-white"
        >
          {/* Card Header */}
          <div className="p-[16px] border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <span className="text-[16px] font-medium text-[#192839]">Ticket {data.ticket.id}</span>
              <span className="px-[8px] py-[2px] bg-[#DCFCE7] text-[#16A34A] text-[12px] font-medium rounded-full uppercase">
                {data.ticket.status}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-[16px] flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-[#768ea7] uppercase tracking-wide">New Status</span>
              <span className="text-[14px] font-medium text-[#DC2626]">{data.ticket.newStatus}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-[#768ea7] uppercase tracking-wide">Next Update</span>
              <span className="text-[14px] text-[#40566d]">{data.ticket.nextUpdate}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* What Happens Next Section (Phase 3+) */}
      {phase >= 3 && data.whatNext && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-[12px]"
        >
          <h4 className="text-[16px] font-medium text-[#192839]">{data.whatNext.title}</h4>
          <ul className="flex flex-col gap-[8px]">
            {data.whatNext.items.map((item: any, i: number) => (
              <li key={i} className="flex gap-[8px] text-[14px] text-[#40566d] leading-[22px]">
                <span className="text-[#768ea7]">•</span>
                <span>
                  <span className="font-medium text-[#192839]">{item.bold}</span> {item.text}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Footer Actions (Phase 4+) */}
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between w-full"
        >
          <div className="flex gap-[8px] items-center">
            <Tooltip text="Good response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Bad response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Copy to clipboard" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <div className="size-[16px]"><Copy /></div>
              </button>
            </Tooltip>
            <Tooltip text="Share" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
          </div>
          <RelativeTimestamp />
        </motion.div>
      )}

      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Shyam's Failed Payment Diagnosis Artifact ---
const FailedPaymentDiagnosisArtifact = ({ data, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const [allStepsComplete, setAllStepsComplete] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);
  const stepsCompleteCount = React.useRef(0);

  const { phase, onNarrativeComplete, onInsightComplete, onFooterComplete } = useStreamSequencer({
    hasDataAsset: false,
    hasInsight: true,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  // Handle subtext complete
  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  // Handle when a resolution step completes streaming
  const totalSteps = data.resolution?.steps?.length || 0;
  const handleStepComplete = React.useCallback(() => {
    stepsCompleteCount.current += 1;
    if (stepsCompleteCount.current >= totalSteps) {
      setAllStepsComplete(true);
      onInsightComplete();
    }
  }, [totalSteps, onInsightComplete]);

  // ChainOfThought mode - only complete when phase >= 5 AND all steps are done
  const chainOfThoughtMode = (phase >= 5 && allStepsComplete) ? 'complete' : 'streaming';

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Header */}
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={handleSubtextComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Resolution Section (Phase 3+) */}
      {phase >= 3 && data.resolution && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-[16px]"
        >
          <h4 className="text-[16px] font-medium text-[#192839]">
            <PerplexityStreamText
              content={data.resolution.title}
              speed={12}
              style="glow"
              inheritStyles
            />
          </h4>
          <div className="flex flex-col gap-[12px]">
            {data.resolution.steps?.map((step: any, i: number) => {
              // Calculate delays so each step streams sequentially
              // Each step takes ~2s (label ~300ms + content ~1500ms + buffer)
              const stepBaseDelay = i * 2500;
              const labelDelay = stepBaseDelay + 300;
              const contentDelay = labelDelay + 400; // Content starts after label

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: stepBaseDelay / 1000 + 0.3 }}
                  className="flex flex-col gap-[4px]"
                >
                  <p className="text-[14px] font-medium text-[#192839]">
                    <PerplexityStreamText
                      content={`${step.label}:`}
                      speed={15}
                      style="glow"
                      delay={labelDelay}
                      inheritStyles
                    />
                  </p>
                  <p className="text-[14px] text-[#40566d] leading-[22px]">
                    <PerplexityStreamText
                      content={step.content}
                      speed={8}
                      style="glow"
                      delay={contentDelay}
                      onComplete={handleStepComplete}
                    />
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Footer Actions (Phase 4+ AND all steps complete) */}
      {phase >= 4 && allStepsComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onAnimationComplete={onFooterComplete}
          className="flex items-center justify-between w-full"
        >
          <div className="flex gap-[8px] items-center">
            <Tooltip text="Good response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Bad response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Copy to clipboard" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <div className="size-[16px]"><Copy /></div>
              </button>
            </Tooltip>
            <Tooltip text="Share" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
          </div>
          <RelativeTimestamp />
        </motion.div>
      )}

      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Shyam's Payment Link Created Artifact ---
const PaymentLinkCreatedArtifact = ({ data, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);
  const [copied, setCopied] = useState(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: false,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  // ChainOfThought mode - thinking during streaming, complete when done
  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  // Handle subtext complete
  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(data.paymentLink.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Header */}
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={handleSubtextComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Payment Link Card (Phase 2+) */}
      {phase >= 2 && data.paymentLink && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-[12px] overflow-hidden shadow-[0px_6px_32px_4px_rgba(184,196,214,0.06)] border border-[#e2e8f0] max-w-[531px]"
          style={{ background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 72%, #E3F6FF 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_1px_white,inset_0px_1.5px_0px_1px_white]" />

          <div className="flex flex-col gap-[19px] px-[15px] py-[12px]">
            {/* Header Row */}
            <div className="flex items-center justify-between pt-[8px]">
              <div className="flex gap-[16px] items-center">
                {/* Link Icon */}
                <div className="bg-[rgba(108,132,157,0.06)] flex items-center justify-center rounded-[4px] w-[40px] h-[40px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                {/* Title & ID */}
                <div className="flex flex-col">
                  <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[18px] leading-[24px] text-[#3a4755]">
                    Payment link
                  </span>
                  <span className="font-['TASA_Orbiter_Display',sans-serif] text-[18px] leading-[24px] text-[#768ea7]">
                    {data.paymentLink.id}
                  </span>
                </div>
              </div>
              {/* Amount */}
              <div className="flex items-baseline">
                <span className="font-['Inter',sans-serif] font-medium text-[24px] text-[#192839]">₹</span>
                <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[32px] text-[#192839]">
                  {data.paymentLink.amount}
                </span>
                <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[24px] text-[#192839]">.00</span>
              </div>
            </div>

            {/* Link URL Bar */}
            <div className="bg-[rgba(108,132,157,0.06)] flex items-center justify-between px-[12px] py-[8px] rounded-[4px]">
              <p className="font-medium text-[16px] text-black">{data.paymentLink.url}</p>
              <button onClick={handleCopyLink} className="shrink-0">
                {copied ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#40566d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>

            {/* Status Rows */}
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#768ea7] leading-[18px]">Status</span>
                <span className="text-[14px] font-medium text-[#40566d] leading-[20px]">{data.paymentLink.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#768ea7] leading-[18px]">Created On</span>
                <span className="text-[14px] font-medium text-[#40566d] leading-[20px]">{data.paymentLink.createdOn}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Actions (Phase 4+) */}
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between w-full"
        >
          <div className="flex gap-[8px] items-center">
            <Tooltip text="Good response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Bad response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Copy to clipboard" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <div className="size-[16px]"><Copy /></div>
              </button>
            </Tooltip>
            <Tooltip text="Share" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
          </div>
          <RelativeTimestamp />
        </motion.div>
      )}

      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Kiara's Refund Status Report Artifact ---
const RefundStatusReportArtifact = ({ data, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: false,
    hasInsight: true,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  // Handle subtext complete
  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Header */}
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={handleSubtextComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Next Steps Section (Phase 3+) */}
      {phase >= 3 && data.nextSteps && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-[8px]"
        >
          <h4 className="text-[16px] font-bold text-[#192839]">{data.nextSteps.title}</h4>
          <p className="text-[16px] text-[#40566d] leading-[26px]">{data.nextSteps.content}</p>
        </motion.div>
      )}

      {/* Footer Actions (Phase 4+) */}
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between w-full"
        >
          <div className="flex gap-[8px] items-center">
            <Tooltip text="Good response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsUp size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Bad response" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <ThumbsDown size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
            <Tooltip text="Copy to clipboard" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <div className="size-[16px]"><Copy /></div>
              </button>
            </Tooltip>
            <Tooltip text="Share" position="bottom">
              <button className="group relative size-[32px] hover:bg-[#e2e8f0] rounded-full flex items-center justify-center transition-colors">
                <Share2 size={16} className="text-[#40566D]" strokeWidth={2} />
              </button>
            </Tooltip>
          </div>
          <RelativeTimestamp />
        </motion.div>
      )}

      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// =============================================================================
// RAY GEN UI CARD DESIGN FRAMEWORK
// =============================================================================

// Severity types for the framework
type SeverityType = 'positive' | 'neutral' | 'warning' | 'critical';

// Severity color mappings
const severityColors: Record<SeverityType, { bg: string; text: string; border: string; badge: string }> = {
  positive: { bg: '#f0fdf4', text: '#166534', border: '#86efac', badge: '#22c55e' },
  neutral: { bg: '#f9fafb', text: '#374151', border: '#e5e7eb', badge: '#6b7280' },
  warning: { bg: '#fffbeb', text: '#92400e', border: '#fcd34d', badge: '#f59e0b' },
  critical: { bg: '#fef2f2', text: '#991b1b', border: '#fca5a5', badge: '#ef4444' }
};

// GenUI Card Component - Following Blade Card Design (max-width 480px)
interface GenUICardProps {
  severity?: SeverityType;
  overline?: string;
  anchor?: { value: string; unit?: string };
  trend?: { direction: 'up' | 'down' | 'neutral'; value?: string; label?: string };
  narrative?: string;
  keyValues?: Array<{ label: string; value: string }>;
  children?: React.ReactNode;
  ctas?: Array<{ label: string; variant: 'primary' | 'secondary'; onClick?: () => void }>;
  className?: string;
}

const GenUICard = ({
  severity = 'neutral',
  overline,
  anchor,
  trend,
  narrative,
  keyValues,
  children,
  ctas,
  className
}: GenUICardProps) => {
  const colors = severityColors[severity];

  return (
    <div
      className={clsx(
        'max-w-[531px] rounded-[8px] border border-[#E4E9F1] overflow-hidden bg-white',
        'shadow-[0px_1px_2px_rgba(18,25,38,0.04)]',
        className
      )}
    >
      {/* Header section */}
      <div className="px-4 pt-4 pb-3">
        {/* Overline - small muted text */}
        {overline && (
          <p className="text-[13px] font-medium text-[#768EA7] mb-1">
            {overline}
          </p>
        )}

        {/* Anchor (large amount) */}
        {anchor && (
          <div className="flex items-baseline gap-0.5">
            <span className="text-[28px] font-semibold text-[#192839] leading-tight tracking-[-0.02em]">
              {anchor.value}
            </span>
            {anchor.unit && (
              <span className="text-[14px] font-medium text-[#40566d] ml-1">{anchor.unit}</span>
            )}
          </div>
        )}

        {/* Trend indicator - matches Figma "↑12% vs last week" */}
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <span className={clsx(
              'text-[13px] font-medium',
              trend.direction === 'up' && 'text-[#1E7C45]',
              trend.direction === 'down' && 'text-[#C72C41]',
              trend.direction === 'neutral' && 'text-[#768EA7]'
            )}>
              {trend.direction === 'up' && '↑'}
              {trend.direction === 'down' && '↓'}
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-[13px] text-[#768EA7]">
                {trend.label}
              </span>
            )}
          </div>
        )}

        {/* Narrative body */}
        {narrative && (
          <p className="text-[13px] text-[#768EA7] leading-[20px] mt-2">
            <SmartHighlightWithBold text={narrative} />
          </p>
        )}
      </div>

      {/* Key-Value Pairs - Info Group style (no dividers) */}
      {keyValues && keyValues.length > 0 && (
        <div className="px-4 pb-4">
          {keyValues.map((kv, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5"
            >
              <span className="text-[13px] text-[#768EA7]">{kv.label}</span>
              <span className="text-[13px] font-semibold text-[#192839]">{kv.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Custom children content */}
      {children}

      {/* CTAs */}
      {ctas && ctas.length > 0 && (
        <div className="px-4 pb-4 flex gap-3">
          {ctas.map((cta, idx) => (
            <button
              key={idx}
              onClick={cta.onClick}
              className={clsx(
                'px-4 py-2 rounded-[4px] font-semibold text-[14px] transition-all duration-200',
                cta.variant === 'primary'
                  ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
                  : 'bg-white text-[#2563EB] hover:bg-[#f1f5fa] border border-[#E4E9F1]'
              )}
            >
              {cta.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// GenUI Milestone Card Component - Layout G (Success/Milestone) - max-width 480px
interface GenUIMilestoneCardProps {
  severity?: SeverityType;
  icon?: 'check' | 'lightning' | 'clock';
  headline: string;
  subtext?: string;
  children?: React.ReactNode;
}

const GenUIMilestoneCard = ({
  severity = 'positive',
  icon = 'check',
  headline,
  subtext,
  children
}: GenUIMilestoneCardProps) => {
  const colors = severityColors[severity];

  const iconSvg = {
    check: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    lightning: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    clock: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    )
  };

  return (
    <div
      className="max-w-[531px] rounded-[8px] border overflow-hidden"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border
      }}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: colors.badge }}
        >
          {iconSvg[icon]}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold" style={{ color: colors.text }}>
            {headline}
          </span>
          {subtext && (
            <p className="text-[13px] leading-[20px]" style={{ color: colors.text, opacity: 0.85 }}>
              <SmartHighlightWithBold text={subtext} />
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

// =============================================================================
// SETTLEMENT ARTIFACTS
// =============================================================================

// --- Settlement Upcoming Artifact (Varun Step 1) ---
const SettlementUpcomingArtifact = ({ data, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: false,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Headline */}
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {/* Subtext */}
        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={handleSubtextComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Settlement Card (Phase 2+) - GenUI Framework */}
      {phase >= 1 && data.settlement && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatedLoadingCard isLoading={phase < 2} loadingHeight={120} borderRadius="12px">
            <GenUICard
              severity="positive"
              overline="Upcoming Settlement"
              anchor={{ value: `₹${data.settlement.amount}` }}
              keyValues={[
                { label: 'Scheduled for', value: data.settlement.scheduledFor },
                { label: 'Settlement cycle', value: data.settlement.cycle || 'T+2' }
              ]}
            />
          </AnimatedLoadingCard>
        </motion.div>
      )}

      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Settlement Explanation Artifact (Varun Step 2) ---
const SettlementExplanationArtifact = ({ data, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: false,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Headline */}
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {/* Subtext */}
        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px] whitespace-pre-line"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={handleSubtextComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Settlement Status Table (Phase 2+) */}
      {phase >= 1 && data.table && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatedLoadingCard isLoading={phase < 2} loadingHeight={48} borderRadius="12px">
            <SettlementStatusTable rows={data.table.rows} />
          </AnimatedLoadingCard>
        </motion.div>
      )}

      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Instant Settlement Offer Artifact (Varun Step 3) ---
const InstantSettlementOfferArtifact = ({ data, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: false,
    hasInsight: false,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Headline */}
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {/* Subtext */}
        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={handleSubtextComplete}
            />
          </motion.div>
        )}

        {/* Instant Settlement Card - Premium styling */}
        {subtextStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-[531px] rounded-xl overflow-hidden border border-[#d1fae5] transition-shadow hover:shadow-md"
            style={{ background: 'linear-gradient(180deg, rgb(255,255,255) 0%, rgb(255,255,255) 72%, rgb(240,253,244) 100%)' }}
          >
            <div className="p-4">
              {/* Label */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#22c55e]/10">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <span className="text-[12px] font-medium text-[#22c55e] tracking-[-0.3px]">Instant Settlements</span>
              </div>

              {/* Headline */}
              <p className="text-[16px] font-medium text-[#050505] mb-3">Get paid instantly</p>

              {/* Checklist */}
              <div className="flex flex-col gap-2">
                {['works even on bank holidays, non-banking hours', 'same day settlements', 'bank transfers in 10s'].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[14px] text-[#7d7d7d]">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Instant Settlement Charges Artifact (Varun Step 4) ---
const InstantSettlementChargesArtifact = ({ data, onSuggestionClick, onButtonClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: false,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  return (
    <>
      {phase === 0 && <ChainOfThought mode="waiting" />}

      {phase >= 1 && (
        <motion.div
          className="flex flex-col gap-[24px] w-full mt-2"
          initial="hidden"
          animate="visible"
          variants={containerVar}
        >
          <div className="flex flex-col gap-[16px]">
            {/* Headline */}
            <motion.div variants={itemVar}>
              <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
                <PerplexityStreamText
                  content={data.headline}
                  speed={15}
                  style="glow"
                  onComplete={handleHeadlineComplete}
                  inheritStyles
                />
              </h3>
            </motion.div>

            {/* Subtext */}
            {subtextStarted && data.subtext && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px] whitespace-pre-line"
              >
                <PerplexityStreamText
                  content={data.subtext}
                  speed={10}
                  style="glow"
                  onComplete={handleSubtextComplete}
                />
              </motion.div>
            )}
          </div>

          {/* Blade Card - Fee Confirmation (max-width 480px) */}
          {phase >= 2 && data.fee && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="max-w-[531px] bg-white border border-[#E4E9F1] rounded-[8px] overflow-hidden shadow-[0px_1px_2px_rgba(18,25,38,0.04)]">
                {/* Header - Overline + Anchor */}
                <div className="px-4 pt-4 pb-3">
                  <p className="text-[13px] font-medium text-[#768EA7] mb-1">Fee Breakdown</p>
                  <p className="text-[28px] font-semibold text-[#1E7C45] leading-tight tracking-[-0.02em]">₹2,99,100</p>
                  <p className="text-[13px] text-[#768EA7] mt-1">You'll receive today</p>
                </div>

                {/* Key-Value Pairs (no dividers) */}
                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-[13px] text-[#768EA7]">Settlement amount</span>
                    <span className="text-[13px] font-semibold text-[#192839]">{data.fee.settlementAmount}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-[13px] text-[#768EA7]">Instant fee ({data.fee.percentage})</span>
                    <span className="text-[13px] font-semibold text-[#C72C41]">-{data.fee.amount}</span>
                  </div>
                </div>

                {/* Prompt + CTAs */}
                {phase >= 3 && (
                  <div className="px-4 pb-4">
                    <p className="text-[13px] text-[#768EA7] mb-3">{data.promptText}</p>
                    <div className="flex gap-3">
                      {data.buttons?.map((button: { label: string; variant: 'primary' | 'secondary' }, i: number) => (
                        <button
                          key={i}
                          onClick={() => onButtonClick?.(button.label)}
                          className={clsx(
                            'px-4 py-2 rounded-[4px] font-semibold text-[14px] transition-all duration-200',
                            button.variant === 'primary'
                              ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
                              : 'bg-white text-[#192839] hover:bg-[#f1f5fa] border border-[#E4E9F1]'
                          )}
                        >
                          {button.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ChainOfThought */}
          {isLast && (
            <ChainOfThought
              mode={chainOfThoughtMode}
              suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
              onSuggestionClick={onSuggestionClick}
              highlightedSuggestionIndex={highlightedSuggestionIndex}
            />
          )}
        </motion.div>
      )}
    </>
  );
};

// --- Instant Settlement Enabled Artifact (Varun Step 5) ---
const InstantSettlementEnabledArtifact = ({ data, onSuggestionClick, onButtonClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: true,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Headline */}
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {/* Subtext */}
        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={handleSubtextComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Settlement Card (Phase 2+) */}
      {phase >= 2 && data.settlement && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ConfigurableSettlementCard
            amount={data.settlement.amount}
            scheduledFor={data.settlement.scheduledFor}
            status={data.settlement.status}
            type={data.settlement.type}
            progressSteps={2}
          />
        </motion.div>
      )}

      {/* Prompt Text + Buttons (Phase 3+) */}
      {phase >= 3 && data.promptText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col gap-[16px]"
        >
          <p className="text-[16px] text-[#192839] font-medium">{data.promptText}</p>
          {data.buttons && (
            <div className="flex gap-3">
              {data.buttons.map((button: { label: string; variant: 'primary' | 'secondary' }, i: number) => (
                <button
                  key={i}
                  onClick={() => onButtonClick?.(button.label)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium text-[14px] transition-all duration-200',
                    button.variant === 'primary'
                      ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-sm'
                      : 'bg-[#f1f5fa] text-[#40566d] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
                  )}
                >
                  {button.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Settlement Explanation With Offer Artifact (Varun Step 2 - New) ---
const SettlementExplanationWithOfferArtifact = ({ data, onButtonClick, isLast, onSuggestionClick, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: false,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 3000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 800);
  }, []);

  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Headline */}
        <motion.div variants={itemVar}>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {/* Subtext */}
        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={handleSubtextComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Combined Card: Blade Card Design (max-width 480px) */}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatedLoadingCard isLoading={phase < 2} loadingHeight={200} borderRadius="8px">
            <div className="max-w-[531px] bg-white border border-[#E4E9F1] rounded-[8px] overflow-hidden shadow-[0px_1px_2px_rgba(18,25,38,0.04)]">
              {/* Header - Overline + Anchor */}
              <div className="px-4 pt-4 pb-3">
                <p className="text-[13px] font-medium text-[#768EA7] mb-1">Settlement Status</p>
                <p className="text-[28px] font-semibold text-[#192839] leading-tight tracking-[-0.02em]">₹6,10,000</p>
                <p className="text-[13px] text-[#768EA7] mt-1">Total pending settlement</p>
              </div>

              {/* Key-Value Pairs - Settlement breakdown (no dividers) */}
              {data.table && (
                <div className="px-4 pb-3">
                  {data.table.rows.map((row: { status: string; amount: string }, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-[13px] text-[#768EA7]">{row.status}</span>
                      <span className="text-[13px] font-semibold text-[#192839]">{row.amount}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Instant Eligible Section - Highlight Strip */}
              {data.instantEligible && (
                <div className="mx-4 mb-3 px-3 py-3 bg-[#f0fdf4] rounded-[6px] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1E7C45] flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1E7C45]">Eligible for Instant Settlement</p>
                      <p className="text-[12px] text-[#1E7C45]/80">{data.instantEligible.message}</p>
                    </div>
                  </div>
                  <span className="text-[16px] font-semibold text-[#1E7C45]">{data.instantEligible.amount}</span>
                </div>
              )}

              {/* CTA Section - Blade Button style */}
              {phase >= 3 && data.buttons && (
                <div className="px-4 pb-4 flex gap-3">
                  {data.buttons.map((button: { label: string; variant: 'primary' | 'secondary' }, i: number) => (
                    <button
                      key={i}
                      onClick={() => onButtonClick?.(button.label)}
                      className={clsx(
                        'px-4 py-2 rounded-[4px] font-semibold text-[14px] transition-all duration-200',
                        button.variant === 'primary'
                          ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
                          : 'bg-white text-[#192839] hover:bg-[#f1f5fa] border border-[#E4E9F1]'
                      )}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedLoadingCard>
        </motion.div>
      )}

      {/* Primary Button moved inside card above */}
      {false && phase >= 4 && data.buttons && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex gap-3"
        >
          {data.buttons.map((button: { label: string; variant: 'primary' | 'secondary' }, i: number) => (
            <button
              key={i}
              onClick={() => onButtonClick?.(button.label)}
              className={clsx(
                'px-5 py-2.5 rounded-lg font-medium text-[14px] transition-all duration-200',
                button.variant === 'primary'
                  ? 'bg-[#22c55e] text-white hover:bg-[#16a34a] shadow-sm'
                  : 'bg-[#f1f5fa] text-[#40566d] hover:bg-[#e2e8f0] border border-[#e2e8f0]'
              )}
            >
              {button.label}
            </button>
          ))}
        </motion.div>
      )}

      {/* ChainOfThought */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Instant Settlement Confirmed Artifact (Varun Step 4 - New) ---
const InstantSettlementConfirmedArtifact = ({ data, onSuggestionClick, isLast, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: false,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 2000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 600);
  }, []);

  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Headline with checkmark */}
        <motion.div variants={itemVar} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {/* Subtext */}
        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={handleSubtextComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Settlement Card (Phase 2+) - GenUI Milestone Card */}
      {phase >= 1 && data.settlement && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatedLoadingCard isLoading={phase < 2} loadingHeight={120} borderRadius="12px">
            <GenUICard
              severity="positive"
              overline="Instant Settlement"
              anchor={{ value: `₹${data.settlement.amount}` }}
              keyValues={[
                { label: 'Settlement time', value: data.settlement.scheduledFor },
                { label: 'Status', value: data.settlement.status }
              ]}
            />
          </AnimatedLoadingCard>
        </motion.div>
      )}

      {/* ChainOfThought */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Early Settlements Enabled Artifact (Varun Step 5 - New) ---
const EarlySettlementsEnabledArtifact = ({ data, isLast, onSuggestionClick, highlightedSuggestionIndex = null }: any) => {
  const [subtextStarted, setSubtextStarted] = useState(false);
  const narrativeCompleteCalledRef = React.useRef(false);

  const { phase, onNarrativeComplete } = useStreamSequencer({
    hasDataAsset: true,
    hasInsight: false,
    hasSuggestions: data.suggestions?.length > 0,
    thinkingDuration: 2000
  });

  const chainOfThoughtMode = phase >= 5 ? 'complete' : 'streaming';

  const handleHeadlineComplete = React.useCallback(() => {
    setTimeout(() => setSubtextStarted(true), 600);
  }, []);

  const handleSubtextComplete = React.useCallback(() => {
    if (!narrativeCompleteCalledRef.current) {
      narrativeCompleteCalledRef.current = true;
      onNarrativeComplete();
    }
  }, [onNarrativeComplete]);

  return (
    <motion.div
      className="flex flex-col gap-[24px] w-full mt-2"
      initial="hidden"
      animate="visible"
      variants={containerVar}
    >
      <div className="flex flex-col gap-[16px]">
        {/* Headline with checkmark */}
        <motion.div variants={itemVar} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-[18px] leading-[24px] font-medium text-[#020202]">
            <PerplexityStreamText
              content={data.headline}
              speed={15}
              style="glow"
              onComplete={handleHeadlineComplete}
              inheritStyles
            />
          </h3>
        </motion.div>

        {/* Subtext */}
        {subtextStarted && data.subtext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] text-[#40566d] leading-[26px] tracking-[0.16px]"
          >
            <PerplexityStreamText
              content={data.subtext}
              speed={10}
              style="glow"
              onComplete={handleSubtextComplete}
            />
          </motion.div>
        )}
      </div>

      {/* Features List (Phase 2+) - Blade Card Design (max-width 480px) */}
      {phase >= 2 && data.features && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="max-w-[531px] bg-white border border-[#E4E9F1] rounded-[8px] overflow-hidden shadow-[0px_1px_2px_rgba(18,25,38,0.04)]">
            {/* Header - Overline + Anchor */}
            <div className="px-4 pt-4 pb-3">
              <p className="text-[13px] font-medium text-[#768EA7] mb-1">Early Settlements</p>
              <p className="text-[28px] font-semibold text-[#1E7C45] leading-tight tracking-[-0.02em]">Enabled</p>
              <p className="text-[13px] text-[#768EA7] mt-1">Get paid the same day</p>
            </div>

            {/* Features as rows (no dividers) */}
            <div className="px-4 pb-4">
              {data.features.map((feature: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 py-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E7C45" strokeWidth="2.5" className="shrink-0">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[13px] text-[#192839]">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ChainOfThought */}
      {isLast && (
        <ChainOfThought
          mode={chainOfThoughtMode}
          suggestions={chainOfThoughtMode === 'complete' ? data.suggestions : undefined}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      )}
    </motion.div>
  );
};

// --- Block Sequencer ---
const BlockSequencer = ({ blocks, onComplete }: { blocks: ContentBlock[], onComplete?: () => void }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const onCompleteCalled = React.useRef(false);

  useEffect(() => {
     // Check if we are done
     if (visibleIndex >= blocks.length) {
       if (onComplete && !onCompleteCalled.current) {
         onCompleteCalled.current = true;
         onComplete();
       }
       return;
     }

     const currentBlock = blocks[visibleIndex];
     if (currentBlock && currentBlock.type !== 'text') {
        const timer = setTimeout(() => {
           setVisibleIndex(prev => prev + 1);
        }, 600); 
        return () => clearTimeout(timer);
     }
  }, [visibleIndex, blocks, onComplete]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {blocks.map((block, idx) => {
        if (idx > visibleIndex) return null;

        return (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
             {block.type === 'text' ? (
                <PerplexityStreamText 
                   content={block.content} 
                   speed={20} // fast typing (20ms/char)
                   onComplete={() => {
                      // Only advance if this is the currently active block
                      if (visibleIndex === idx) setVisibleIndex(prev => prev + 1);
                   }}
                />
             ) : block.type === 'table' ? (
                <SmartTable headers={block.headers} rows={block.rows} />
             ) : null}
          </motion.div>
        )
      })}
    </div>
  )
}

// --- Sequenced Funds Added Message Component ---
const FundsAddedMessage = ({ data, isLast, onSuggestionClick, highlightedSuggestionIndex = null }: { data: RayResponseData, isLast: boolean, onSuggestionClick?: (s: string) => void, highlightedSuggestionIndex?: number | null }) => {
  // Sequence state: headline -> body -> artifact -> done
  const [sequence, setSequence] = useState<'headline' | 'body' | 'artifact' | 'done'>(() => {
    if (data.headline) return 'headline';
    return 'body';
  });

  const handleHeadlineComplete = React.useCallback(() => {
    setSequence('body');
  }, []);

  // For the body text, since we are using a static component that renders immediately,
  // we can use a simple timeout or animation complete callback to trigger the next step.
  // We'll treat it as "appearing" then moving to artifact.
  const handleBodyComplete = React.useCallback(() => {
    setSequence('artifact');
  }, []);

  const handleArtifactComplete = React.useCallback(() => {
    setSequence('done');
  }, []);

  return (
      <div className="flex gap-4 items-start w-full animate-fade-in-up">
        {/* Content Container - No Avatar */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
             
            {/* 1. Headline (Custom Component) */}
            {data.headline && (
                 <div className={sequence === 'headline' || sequence === 'body' || sequence === 'artifact' || sequence === 'done' ? 'block' : 'hidden'}> 
                    <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       onAnimationComplete={handleHeadlineComplete}
                    >
                        <FundsAddedHeader title={data.headline} />
                    </motion.div>
                 </div>
            )}

            {/* 2. Body Text (Custom Component mimicking Frame7 text) */}
            {(sequence === 'body' || sequence === 'artifact' || sequence === 'done') && (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onAnimationComplete={handleBodyComplete}
                 >
                    <FundsAddedBody />
                 </motion.div>
            )}
            
            {/* 3. Artifacts (Card + Insight) */}
            {(sequence === 'artifact' || sequence === 'done') && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    onAnimationComplete={handleArtifactComplete}
                    className="flex flex-col gap-4"
                >
                    <SettlementCard />
                    <RayInsightCard />
                </motion.div>
            )}


            {/* ChainOfThought - Always at bottom, shows thinking during streaming, suggestions when complete */}
            {isLast && (
              <ChainOfThought
                mode={sequence === 'done' ? 'complete' : 'streaming'}
                suggestions={sequence === 'done' ? data.suggestions : undefined}
                onSuggestionClick={onSuggestionClick}
                highlightedSuggestionIndex={highlightedSuggestionIndex}
              />
            )}
        </div>
      </div>
  );
};

// WhatsApp-style chat thumbnail mockup for chat stream (square)
const ScreenshotThumbnail = () => (
  <div className="w-[40px] h-[40px] rounded-[6px] overflow-hidden shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] bg-[#efeae2] relative shrink-0">
    {/* WhatsApp green header bar */}
    <div className="absolute top-0 left-0 right-0 h-[10px] bg-[#008069]" />
    {/* Chat background with message bubbles */}
    <div className="absolute top-[12px] left-[3px] right-[3px] bottom-[3px]">
      {/* Incoming message (white, left) */}
      <div className="absolute top-0 left-0 w-[20px] h-[8px] bg-white rounded-[2px]" />
      {/* Outgoing message (green, right) */}
      <div className="absolute top-[10px] right-0 w-[16px] h-[8px] bg-[#d9fdd3] rounded-[2px]" />
      {/* Another incoming message */}
      <div className="absolute top-[20px] left-0 w-[24px] h-[6px] bg-white rounded-[2px]" />
    </div>
  </div>
);

// Chat Stream Attachment Pill Component
const ChatAttachmentPill = ({ filename, fileType, onClick }: { filename: string; fileType: string; onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-[10px] p-[8px] pr-[12px] bg-[#EAEEFF] rounded-[12px] hover:bg-[#dde3ff] transition-colors cursor-pointer border-none"
    >
      {/* Stylized screenshot thumbnail */}
      <ScreenshotThumbnail />

      {/* File info */}
      <div className="flex flex-col justify-center text-left">
        <span className="font-['Inter',sans-serif] text-[14px] font-medium text-[#192839] leading-[20px]">{filename}</span>
        <span className="font-['Inter',sans-serif] text-[14px] font-medium text-[#768ea7] leading-[20px]">{fileType}</span>
      </div>
    </button>
  );
};

export const RayMessageRenderer = ({ data, onSuggestionClick, onRowClick, isLast = true, highlightedSuggestionIndex = null, onMiniCardClick, onMiniCardAnimationComplete, onStreamComplete, animatingCardId, personaId, kycPanNumber, kycWebsite, kycBusinessName, kycBusinessModel, kycBankAccount, isKYCReviewModalOpen, showFinalVideo, onKYCPanelSettled, onKYCPanelClosed }: { data: RayResponseData; onSuggestionClick?: (suggestion: string) => void; onRowClick?: (rowData: any) => void; isLast?: boolean; highlightedSuggestionIndex?: number | null; onMiniCardClick?: (formId: string, sourceRect?: SourceRect) => void; onMiniCardAnimationComplete?: (formId: string) => void; onStreamComplete?: () => void; animatingCardId?: string | null; personaId?: string; kycPanNumber?: string; kycWebsite?: string; kycBusinessName?: string; kycBusinessModel?: string; kycBankAccount?: string; isKYCReviewModalOpen?: boolean; showFinalVideo?: boolean; onKYCPanelSettled?: () => void; onKYCPanelClosed?: () => void }) => {
  // State for WhatsApp preview modal
  const [isWhatsAppPreviewOpen, setIsWhatsAppPreviewOpen] = useState(false);

  // Get the chat scenario based on persona
  const chatScenario = WHATSAPP_CHAT_SCENARIOS[personaId || 'default'] || WHATSAPP_CHAT_SCENARIOS.default;

  // 1. User Message (Right Aligned) - Show attachment pill first, then text bubble
  if (data.sender === 'user') {
    // Extract image and text blocks
    const imageBlocks = data.blocks?.filter(b => b.type === 'image') || [];
    const textBlocks = data.blocks?.filter(b => b.type === 'text') || [];
    const hasImage = imageBlocks.length > 0;
    const hasText = textBlocks.length > 0 && textBlocks[0].content?.trim();

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-end gap-[8px] ml-auto max-w-[531px]"
        >
          {/* Attachment Pill - shown first */}
          {hasImage && (
            <ChatAttachmentPill
              filename={imageBlocks[0].filename || "Whatsapp Image"}
              fileType={imageBlocks[0].fileType || "PNG"}
              onClick={() => setIsWhatsAppPreviewOpen(true)}
            />
          )}

        {/* Text Bubble - shown below attachment */}
        {hasText && (
          <div className="bg-white border border-[#e5e5e5] text-[#090e13] px-[16px] py-[12px] rounded-[12px] w-fit text-[14px] leading-[20px] tracking-[-0.28px]">
            {textBlocks[0].content}
          </div>
        )}
        </motion.div>

        {/* WhatsApp Chat Preview Modal */}
        {hasImage && (
          <WhatsAppChatPreview
            isOpen={isWhatsAppPreviewOpen}
            onClose={() => setIsWhatsAppPreviewOpen(false)}
            customerName={chatScenario.customerName}
            customerPhone={chatScenario.customerPhone}
            messages={chatScenario.messages}
          />
        )}
      </>
    );
  }

  // 2. Ray Thinking State
  if (data.isThinking) {
    // Show KYC-specific loading state if flagged
    if (data.kycLoading) {
      return <KYCLoadingState />;
    }
    return <ChainOfThought mode="waiting" />;
  }

  // 3. Business Category Loading State
  if (data.isBusinessCategoryLoading) {
    return <BusinessCategoryLoadingState />;
  }

  // 3. Ray AI Message with Investigation Report Artifact
  if (data.artifact?.type === 'investigation_report') {
    return (
      <div className="w-full animate-fade-in-up">
        <InvestigationReportArtifact data={data.artifact.data} onSuggestionClick={onSuggestionClick} onRowClick={onRowClick} isLast={isLast} highlightedSuggestionIndex={highlightedSuggestionIndex} onStreamComplete={onStreamComplete} />
      </div>
    );
  }

  // 4. Ray AI Message with Funds Added Card
  if (data.artifact?.type === 'funds_added_card') {
    return <FundsAddedMessage data={data} isLast={isLast} onSuggestionClick={onSuggestionClick} highlightedSuggestionIndex={highlightedSuggestionIndex} />;
  }

  // 5. Ray AI Message with Followup Question
  if (data.artifact?.type === 'followup_question') {
    return (
      <div className="w-full animate-fade-in-up">
        <FollowupQuestionArtifact
          data={data.artifact.data}
          isLast={isLast}
          onButtonClick={onSuggestionClick}
        />
      </div>
    );
  }

  // 6. Ray AI Message with Simple Text
  if (data.artifact?.type === 'simple_text') {
    return (
      <div className="w-full animate-fade-in-up">
        <SimpleTextArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 7. Ray AI Message with Bullet List and Buttons
  if (data.artifact?.type === 'bullet_list_with_buttons') {
    return (
      <div className="w-full animate-fade-in-up">
        <BulletListWithButtonsArtifact
          data={data.artifact.data}
          isLast={isLast}
          onButtonClick={onSuggestionClick}
        />
      </div>
    );
  }

  // 8. Ray AI Message with Setting Updated + Bullets
  if (data.artifact?.type === 'setting_updated_with_bullets') {
    return (
      <div className="w-full animate-fade-in-up">
        <SettingUpdatedWithBulletsArtifact
          data={data.artifact.data}
          isLast={isLast}
          onButtonClick={onSuggestionClick}
        />
      </div>
    );
  }

  // 8. Ray AI Message with Payment Links Created
  if (data.artifact?.type === 'payment_links_created') {
    return (
      <div className="w-full animate-fade-in-up">
        <PaymentLinksCreatedArtifact
          data={data.artifact.data}
          isLast={isLast}
          onButtonClick={onSuggestionClick}
          onRowClick={onRowClick}
        />
      </div>
    );
  }

  // 9. Maya Transactions Report
  if (data.artifact?.type === 'maya_transactions_report') {
    return (
      <div className="w-full animate-fade-in-up">
        <MayaTransactionsReportArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          onRowClick={onRowClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 10. Maya Diagnosis
  if (data.artifact?.type === 'maya_diagnosis') {
    return (
      <div className="w-full animate-fade-in-up">
        <MayaDiagnosisArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 11. Maya Draft Message
  if (data.artifact?.type === 'maya_draft_message') {
    return (
      <div className="w-full animate-fade-in-up">
        <MayaDraftMessageArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 12. Sam's Support Ticket Status
  if (data.artifact?.type === 'support_ticket_status') {
    return (
      <div className="w-full animate-fade-in-up">
        <SupportTicketStatusArtifact
          data={data.artifact.data}
          isLast={isLast}
          onButtonClick={onSuggestionClick}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 13. Sam's Ticket Escalated
  if (data.artifact?.type === 'ticket_escalated') {
    return (
      <div className="w-full animate-fade-in-up">
        <TicketEscalatedArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 14. Shyam's Failed Payment Diagnosis
  if (data.artifact?.type === 'failed_payment_diagnosis') {
    return (
      <div className="w-full animate-fade-in-up">
        <FailedPaymentDiagnosisArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 15. Shyam's Payment Link Created
  if (data.artifact?.type === 'payment_link_created') {
    return (
      <div className="w-full animate-fade-in-up">
        <PaymentLinkCreatedArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 16. Kiara's Refund Status Report
  if (data.artifact?.type === 'refund_status_report') {
    return (
      <div className="w-full animate-fade-in-up">
        <RefundStatusReportArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 17. Varun's Settlement Upcoming
  if (data.artifact?.type === 'settlement_upcoming') {
    return (
      <div className="w-full animate-fade-in-up">
        <SettlementUpcomingArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 18. Varun's Settlement Explanation
  if (data.artifact?.type === 'settlement_explanation') {
    return (
      <div className="w-full animate-fade-in-up">
        <SettlementExplanationArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 19. Varun's Instant Settlement Offer
  if (data.artifact?.type === 'instant_settlement_offer') {
    return (
      <div className="w-full animate-fade-in-up">
        <InstantSettlementOfferArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 20. Varun's Instant Settlement Charges
  if (data.artifact?.type === 'instant_settlement_charges') {
    return (
      <div className="w-full animate-fade-in-up">
        <InstantSettlementChargesArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          onButtonClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 21. Varun's Instant Settlement Enabled
  if (data.artifact?.type === 'instant_settlement_enabled') {
    return (
      <div className="w-full animate-fade-in-up">
        <InstantSettlementEnabledArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          onButtonClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 21b. Settlement Explanation With Offer (Varun Step 2 - New)
  if (data.artifact?.type === 'settlement_explanation_with_offer') {
    return (
      <div className="w-full animate-fade-in-up">
        <SettlementExplanationWithOfferArtifact
          data={data.artifact.data}
          isLast={isLast}
          onButtonClick={onSuggestionClick}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 21c. Instant Settlement Confirmed (Varun Step 4 - New)
  if (data.artifact?.type === 'instant_settlement_confirmed') {
    return (
      <div className="w-full animate-fade-in-up">
        <InstantSettlementConfirmedArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 21d. Early Settlements Enabled (Varun Step 5 - New)
  if (data.artifact?.type === 'early_settlements_enabled') {
    return (
      <div className="w-full animate-fade-in-up">
        <EarlySettlementsEnabledArtifact
          data={data.artifact.data}
          isLast={isLast}
          onSuggestionClick={onSuggestionClick}
          highlightedSuggestionIndex={highlightedSuggestionIndex}
        />
      </div>
    );
  }

  // 22. Payment Link Form Card (Mini-Card for Modal) - with streaming text, footer, and suggestions
  if (data.artifact?.type === 'payment_link_form_card') {
    const { headline, subtext, suggestions } = data.artifact.data;
    const hasTextContent = headline || subtext;

    return (
      <PaymentLinkFormCardArtifact
        data={data.artifact.data}
        onMiniCardClick={onMiniCardClick}
        onMiniCardAnimationComplete={onMiniCardAnimationComplete}
        animatingCardId={animatingCardId}
        isLast={isLast}
        onSuggestionClick={onSuggestionClick}
        highlightedSuggestionIndex={highlightedSuggestionIndex}
        onStreamComplete={onStreamComplete}
      />
    );
  }

  // 23. Add Funds Form Card (Mini-Card for Widget)
  if (data.artifact?.type === 'add_funds_form_card') {
    const [isStreaming, setIsStreaming] = React.useState(true);
    const [subtextStarted, setSubtextStarted] = React.useState(false);

    return (
      <div className="w-full animate-fade-in-up relative">
        {/* Ray Logo - follows streaming text, then settles at bottom - only on last message */}
        {(data.headline || data.subtext) && (
          <AnimatePresence>
            {isLast && (
              <motion.div
                className="absolute w-6 h-6 shrink-0"
                initial={{ top: '2px', left: '-36px', opacity: 1 }}
                animate={
                  isStreaming
                    ? { top: '2px', left: '-36px', rotate: [0, 90, 90, 180, 180, 270, 270, 360], opacity: 1 }
                    : { top: 'auto', bottom: '0px', left: '-36px', rotate: 0, opacity: 1 }
                }
                exit={{ opacity: 0 }}
                transition={
                  isStreaming
                    ? { rotate: { duration: 2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }, top: { duration: 0.3 }, left: { duration: 0.3 } }
                    : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                }
              >
                <Ray static />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Headline and Subtext with streaming */}
        {(data.headline || data.subtext) && (
          <div className="max-w-[531px] mb-6">
            {/* Text Content */}
            <div className="flex-1">
              {data.headline && (
                <h3 className="text-[18px] font-medium text-[#050505] leading-[26px] tracking-[-0.594px] mb-2">
                  <PerplexityStreamText
                    text={data.headline}
                    onStreamComplete={() => {
                      setTimeout(() => setSubtextStarted(true), 1300);
                    }}
                  />
                </h3>
              )}
              {subtextStarted && data.subtext && (
                <p className="text-[14px] text-[#40566d] leading-[20px] tracking-[-0.182px]">
                  <PerplexityStreamText
                    text={data.subtext}
                    onStreamComplete={() => {
                      setIsStreaming(false);
                      if (onStreamComplete) onStreamComplete();
                    }}
                  />
                </p>
              )}
            </div>
          </div>
        )}

        <AddFundsMiniCard
          formData={data.artifact.data.prefill}
          onClick={() => onMiniCardClick?.(data.artifact.data.formId)}
          isLoading={data.artifact.data.isLoading}
        />
      </div>
    );
  }

  // 23.5. Settlement Card (standalone card in chat)
  if (data.artifact?.type === 'settlement_card') {
    const [isStreaming, setIsStreaming] = React.useState(true);
    const [subtextStarted, setSubtextStarted] = React.useState(false);

    return (
      <div className="w-full animate-fade-in-up relative">
        {/* Ray Logo - follows streaming text, then settles at bottom - only on last message */}
        {(data.headline || data.subtext) && (
          <AnimatePresence>
            {isLast && (
              <motion.div
                className="absolute w-6 h-6 shrink-0"
                initial={{ top: '2px', left: '-36px', opacity: 1 }}
                animate={
                  isStreaming
                    ? { top: '2px', left: '-36px', rotate: [0, 90, 90, 180, 180, 270, 270, 360], opacity: 1 }
                    : { top: 'auto', bottom: '0px', left: '-36px', rotate: 0, opacity: 1 }
                }
                exit={{ opacity: 0 }}
                transition={
                  isStreaming
                    ? { rotate: { duration: 2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }, top: { duration: 0.3 }, left: { duration: 0.3 } }
                    : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                }
              >
                <Ray static />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Headline and Subtext with streaming */}
        {(data.headline || data.subtext) && (
          <div className="max-w-[531px] mb-6">
            {/* Text Content */}
            <div className="flex-1">
              {data.headline && (
                <h3 className="text-[18px] font-medium text-[#050505] leading-[26px] tracking-[-0.594px] mb-2">
                  <PerplexityStreamText
                    text={data.headline}
                    onStreamComplete={() => {
                      setTimeout(() => setSubtextStarted(true), 1300);
                    }}
                  />
                </h3>
              )}
              {subtextStarted && data.subtext && (
                <p className="text-[14px] text-[#40566d] leading-[20px] tracking-[-0.182px]">
                  <PerplexityStreamText
                    text={data.subtext}
                    onStreamComplete={() => {
                      setIsStreaming(false);
                      if (onStreamComplete) onStreamComplete();
                    }}
                  />
                </p>
              )}
            </div>
          </div>
        )}

        <SettlementCard
          amount={data.artifact.data.amount}
          date={data.artifact.data.date}
          step={data.artifact.data.step}
        />
      </div>
    );
  }

  // 24. Capture Settings Form Card (Mini-Card for Modal)
  if (data.artifact?.type === 'capture_settings_form_card') {
    const [isStreaming, setIsStreaming] = React.useState(true);
    const [subtextStarted, setSubtextStarted] = React.useState(false);

    return (
      <div className="w-full animate-fade-in-up relative">
        {/* Ray Logo - follows streaming text, then settles at bottom - only on last message */}
        {(data.headline || data.subtext) && (
          <AnimatePresence>
            {isLast && (
              <motion.div
                className="absolute w-6 h-6 shrink-0"
                initial={{ top: '2px', left: '-36px', opacity: 1 }}
                animate={
                  isStreaming
                    ? { top: '2px', left: '-36px', rotate: [0, 90, 90, 180, 180, 270, 270, 360], opacity: 1 }
                    : { top: 'auto', bottom: '0px', left: '-36px', rotate: 0, opacity: 1 }
                }
                exit={{ opacity: 0 }}
                transition={
                  isStreaming
                    ? { rotate: { duration: 2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }, top: { duration: 0.3 }, left: { duration: 0.3 } }
                    : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                }
              >
                <Ray static />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Headline and Subtext with streaming */}
        {(data.headline || data.subtext) && (
          <div className="max-w-[531px] mb-6">
            {/* Text Content */}
            <div className="flex-1">
              {data.headline && (
                <h3 className="text-[18px] font-medium text-[#050505] leading-[26px] tracking-[-0.594px] mb-2">
                  <PerplexityStreamText
                    text={data.headline}
                    onStreamComplete={() => {
                      setTimeout(() => setSubtextStarted(true), 1300);
                    }}
                  />
                </h3>
              )}
              {subtextStarted && data.subtext && (
                <p className="text-[14px] text-[#40566d] leading-[20px] tracking-[-0.182px]">
                  <PerplexityStreamText
                    text={data.subtext}
                    onStreamComplete={() => {
                      setIsStreaming(false);
                      if (onStreamComplete) onStreamComplete();
                    }}
                  />
                </p>
              )}
            </div>
          </div>
        )}

        <CaptureSettingsMiniCard
          status={data.artifact.data.status}
          currentSetting={data.artifact.data.currentSetting}
          onClick={() => onMiniCardClick?.(data.artifact.data.formId)}
          isLoading={data.artifact.data.isLoading}
        />
      </div>
    );
  }

  // 24.5. KYC OTP Verification Card
  if (data.artifact?.type === 'kyc_otp_card') {
    const { heading, tag, phoneNumber, buttonText, isVerified = false } = data.artifact.data;
    const [isStreaming, setIsStreaming] = React.useState(true);
    const [subtextStarted, setSubtextStarted] = React.useState(false);
    const [showCard, setShowCard] = React.useState(false);

    // Auto-trigger subtext display after mount
    React.useEffect(() => {
      const timer = setTimeout(() => setSubtextStarted(true), 1300);
      return () => clearTimeout(timer);
    }, []);

    // Show card after streaming completes
    React.useEffect(() => {
      if (!isStreaming && !showCard) {
        const timer = setTimeout(() => {
          setShowCard(true);
        }, 500); // Small delay after streaming completes
        return () => clearTimeout(timer);
      }
    }, [isStreaming, showCard]);

    return (
      <div className="w-full animate-fade-in-up relative" style={{ position: 'relative', zIndex: 10 }}>
        {/* Ray Logo - follows streaming text, then settles at bottom - only on last message */}
        {(data.headline || data.subtext) && (
          <AnimatePresence>
            {isLast && (
              <motion.div
                className="absolute w-6 h-6 shrink-0"
                initial={{ top: '2px', left: '-36px', opacity: 1 }}
                animate={
                  isStreaming
                    ? { top: '2px', left: '-36px', rotate: 360, opacity: 1 }
                    : { top: 'auto', bottom: '0px', left: '-36px', rotate: 0, opacity: 1 }
                }
                exit={{ opacity: 0 }}
                transition={
                  isStreaming
                    ? { rotate: { duration: 1.2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }, top: { duration: 0.3 }, left: { duration: 0.3 } }
                    : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                }
              >
                <Ray static />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Headline and Subtext with streaming */}
        {(data.headline || data.subtext) && (
        <div className="mb-4" style={{ visibility: 'visible', display: 'block' }}>
          {/* Text Content - aligns with card below */}
          <div className="flex-1" style={{ visibility: 'visible' }}>
            {data.headline && (
              <h3 className="font-['TASA_Orbiter_Display',sans-serif] text-[18px] font-semibold text-[#020202] leading-[24px] mb-2 [&_*]:font-['TASA_Orbiter_Display',sans-serif]" style={{ visibility: 'visible', display: 'block' }}>
                <PerplexityStreamText
                  content={data.headline}
                  inheritStyles={true}
                  onComplete={() => {
                    setTimeout(() => setSubtextStarted(true), 1300);
                  }}
                />
              </h3>
            )}
            {subtextStarted && data.subtext && (
              <p className="font-['Inter',sans-serif] text-[14px] text-[#40566d] leading-[20px] [&_*]:font-['Inter',sans-serif]" style={{ visibility: 'visible', display: 'block' }}>
                <PerplexityStreamText
                  content={data.subtext}
                  onComplete={() => {
                    setIsStreaming(false);
                    if (onStreamComplete) onStreamComplete();
                  }}
                />
              </p>
            )}
          </div>
        </div>
        )}

        {/* OTP Card - Only shown after streaming completes */}
        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative backdrop-blur-[5.5px] bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] overflow-hidden p-6 max-w-[531px]"
            >
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_1px_white]" />

          <div className="relative space-y-2">
            {/* Heading with tag */}
            <div className="flex items-center gap-2">
              <h4 className="font-['TASA_Orbiter_Deck',sans-serif] font-semibold text-[16px] text-[#020202]">{heading}</h4>
              {tag && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-[#1566f1] to-[#4793fd] text-white text-[10px] font-medium rounded-full uppercase tracking-wide">
                  {tag}
                </span>
              )}
            </div>

            {/* Subtext */}
            <p className="font-sans text-[14px] leading-[20px] text-[rgba(0,0,0,0.56)]">
              We've sent a 6-digit OTP to mobile number ending {phoneNumber}.
            </p>

            {/* Button */}
            <button
              onClick={(e) => {
                // Trigger KYC OTP flow
                if (!isVerified && onSuggestionClick) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onSuggestionClick('verify_otp', rect);
                }
              }}
              disabled={isVerified}
              className="relative h-12 px-6 border rounded-[12px] font-sans font-medium text-[14px] tracking-[-0.112px] transition-all inline-flex items-center justify-center gap-2 overflow-hidden mt-4 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundImage: isVerified
                  ? 'linear-gradient(-23.46deg, rgb(156, 163, 175) 54.842%, rgb(209, 213, 219) 98.573%)'
                  : 'linear-gradient(-23.46deg, rgb(21, 102, 241) 54.842%, rgb(71, 147, 253) 98.573%)',
                borderColor: isVerified ? '#9ca3af' : '#0354e0',
                color: 'white'
              }}
            >
              {/* Glass effect inset shadows */}
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_#0e54cc,inset_0px_0px_0px_0.5px_#1566f1,inset_0px_-2px_0px_0px_rgba(255,255,255,0.18),inset_0px_1.5px_0px_0px_rgba(255,255,255,0.32)]" />
              {isVerified ? 'OTP verified' : buttonText}
            </button>
          </div>
        </motion.div>
          )}
        </AnimatePresence>

        {/* Stacked Suggestions - Only visible for last message */}
        {isLast && data.suggestions && data.suggestions.length > 0 && (
          <div className="mt-4">
            <SuggestionStack items={data.suggestions} />
          </div>
        )}
      </div>
    );
  }

  // 24.6. KYC Business Details Card
  if (data.artifact?.type === 'kyc_business_details') {
    const { headline, subtext, businessName, verificationBadge, documents } = data.artifact.data;
    const [isStreaming, setIsStreaming] = React.useState(true);
    const [subtextStarted, setSubtextStarted] = React.useState(false);
    const [showCard, setShowCard] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Auto-trigger subtext display after mount
    React.useEffect(() => {
      const timer = setTimeout(() => setSubtextStarted(true), 1300);
      return () => clearTimeout(timer);
    }, []);

    // Show card after streaming completes
    React.useEffect(() => {
      if (!isStreaming && !showCard) {
        const timer = setTimeout(() => {
          setShowCard(true);
        }, 500); // Small delay after streaming completes
        return () => clearTimeout(timer);
      }
    }, [isStreaming, showCard]);

    // Auto-open modal when card is shown
    React.useEffect(() => {
      if (showCard && !isModalOpen) {
        const timer = setTimeout(() => {
          setIsModalOpen(true);
        }, 500); // Small delay after card appears
        return () => clearTimeout(timer);
      }
    }, [showCard, isModalOpen]);

    // Close the right panel modal when review modal opens
    React.useEffect(() => {
      if (isKYCReviewModalOpen && isModalOpen) {
        setIsModalOpen(false);
      }
    }, [isKYCReviewModalOpen, isModalOpen]);

    return (
      <div className="w-full animate-fade-in-up relative">
        {/* Ray Logo - follows streaming text, then settles at bottom - only on last message */}
        <AnimatePresence>
          {isLast && (
            <motion.div
              className="absolute w-6 h-6 shrink-0"
              initial={{ top: '2px', left: '-36px', opacity: 1 }}
              animate={
                isStreaming
                  ? { top: '2px', left: '-36px', rotate: 360, opacity: 1 }
                  : { top: 'auto', bottom: '0px', left: '-36px', rotate: 0, opacity: 1 }
              }
              exit={{ opacity: 0 }}
              transition={
                isStreaming
                  ? { rotate: { duration: 1.2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }, top: { duration: 0.3 }, left: { duration: 0.3 } }
                  : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
              }
            >
              <Ray static />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Headline and Subtext with streaming */}
        <div className="mb-6" style={{ visibility: 'visible', display: 'block' }}>
          {/* Text Content */}
          <div className="flex-1" style={{ visibility: 'visible' }}>
            {headline && (
              <h3 className="font-['TASA_Orbiter_Deck',sans-serif] text-[18px] font-semibold text-[#020202] leading-[26px] tracking-[-0.54px] mb-1 [&_*]:font-['TASA_Orbiter_Deck',sans-serif]" style={{ visibility: 'visible', display: 'block' }}>
                <PerplexityStreamText
                  content={headline}
                  inheritStyles={true}
                  onComplete={() => {
                    setTimeout(() => setSubtextStarted(true), 1300);
                  }}
                />
              </h3>
            )}
            {subtextStarted && subtext && (
              <p className="font-['Inter',sans-serif] text-[14px] text-[#40566d] leading-[20px] tracking-[-0.14px] [&_*]:font-['Inter',sans-serif]" style={{ visibility: 'visible', display: 'block' }}>
                <PerplexityStreamText
                  content={subtext}
                  inheritStyles={true}
                  onComplete={() => {
                    setIsStreaming(false);
                    if (onStreamComplete) onStreamComplete();
                  }}
                />
              </p>
            )}
          </div>
        </div>

        {/* Business Details Card - Only shown after streaming completes */}
        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative backdrop-blur-[5.5px] bg-gradient-to-b from-white to-[#f0f0f0] border-[1.5px] border-[rgba(0,0,0,0.1)] rounded-[16px] shadow-[0px_8px_48px_4px_rgba(59,96,181,0.1)] overflow-hidden max-w-[531px]"
            >
          {/* Inset shadow for depth */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_1px_white]" />

          {/* Card Content */}
          <div className="relative p-5">
            {/* Header: Name and Photo */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-['TASA_Orbiter_Deck',sans-serif] font-semibold text-[18px] leading-[24px] text-[#050505] mb-2">
                  {businessName}
                </h4>
                <div className="inline-flex items-center gap-2 bg-[rgba(0,141,71,0.09)] px-3 py-1 rounded-[32px]">
                  <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-[20px] text-[#008d47] tracking-[-0.182px]">
                    {verificationBadge}
                  </span>
                </div>
              </div>
              {/* Placeholder for profile photo */}
              <div className="w-[60px] h-[60px] rounded-[6px] overflow-hidden relative">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop")',
                    filter: 'blur(3px)',
                    transform: 'scale(1.1)'
                  }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-[rgba(0,0,0,0.1)] my-5" />

            {/* Documents Section */}
            <div>
              <p className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[rgba(0,0,0,0.56)] tracking-[-0.182px] mb-4">
                Documents and details retrieved
              </p>

              {/* Document List */}
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {/* File Icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 13H8" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17H8" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 9H9H8" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-black tracking-[-0.182px]">
                      {doc.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
          )}
        </AnimatePresence>

        {/* Stacked Suggestions - Only visible for last message */}
        {isLast && data.artifact.data.suggestions && data.artifact.data.suggestions.length > 0 && (
          <div className="mt-4">
            <SuggestionStack items={data.artifact.data.suggestions} />
          </div>
        )}

        {/* KYC Details Modal - hide when final video is playing */}
        {!showFinalVideo && (
          <KYCDetailsModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              // Reset panel settled state when closing
              onKYCPanelClosed?.();
            }}
            panNumber={kycPanNumber}
            website={kycWebsite}
            businessName={kycBusinessName || businessName}
            businessModel={kycBusinessModel}
            bankAccount={kycBankAccount}
            onSettled={onKYCPanelSettled}
          />
        )}
      </div>
    );
  }

  // 24.7. Business Category Card
  if (data.artifact?.type === 'business_category_card') {
    const { category, subCategory, isConfirmed = false } = data.artifact.data;

    const handleConfirm = () => {
      onSuggestionClick?.('confirm_category');
    };

    const handleChange = () => {
      onSuggestionClick?.('change_category');
    };

    return (
      <div className="w-full max-w-[531px] animate-fade-in-up">
        <BusinessCategoryCard
          category={category}
          subCategory={subCategory}
          onConfirm={handleConfirm}
          onChange={handleChange}
          isConfirmed={isConfirmed}
        />
      </div>
    );
  }

  // 24.8. Bank Verification Card
  if (data.artifact?.type === 'bank_verification_card') {
    const { isVerified = false } = data.artifact.data;

    const handleVerify = (rect?: DOMRect) => {
      onSuggestionClick?.('verify_bank_upi', rect);
    };

    return (
      <div className="w-full max-w-[531px] animate-fade-in-up">
        <BankVerificationCard onVerify={handleVerify} isVerified={isVerified} />
      </div>
    );
  }

  // 24.9. Bank Account Card
  if (data.artifact?.type === 'bank_account_card') {
    const { bankName, accountNumber, ifscCode, accountName, isConfirmed = false } = data.artifact.data;

    const handleChangeAccount = () => {
      onSuggestionClick?.('change_bank_account');
    };

    return (
      <div className="w-full max-w-[531px] animate-fade-in-up">
        <BankAccountCard
          bankName={bankName}
          accountNumber={accountNumber}
          ifscCode={ifscCode}
          accountName={accountName}
          onChangeAccount={handleChangeAccount}
          isConfirmed={isConfirmed}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-start w-full max-w-[531px] animate-fade-in-up">
        {/* Content Container - No Avatar */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">

            {/* Headline */}
            {data.headline && (
                <h3 className="text-[18px] font-bold text-slate-900 leading-snug tracking-tight mb-1">
                    {data.headline}
                </h3>
            )}

            {/* Sequenced Blocks */}
            {data.blocks && <BlockSequencer blocks={data.blocks} />}

            {/* Stacked Suggestions - Only visible for last message */}
            {isLast && data.suggestions && (
                <SuggestionStack items={data.suggestions} />
            )}
        </div>
    </div>
  );
};
