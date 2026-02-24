import React, { useState, useEffect, useRef } from 'react';
import { StoreProvider } from './StoreContext';
import { FormProvider } from './FormStore';
import { RayLayout } from './RayLayout';
import clsx from "clsx";
import { Menu, ChevronDown, Sparkles, Check, LayoutTemplate, ArrowUpRight, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { RayInputBox } from './RayInputBox';
import { RaySidebar } from './RaySidebar';
import Ray from "../../../imports/Ray";
import imgHeroCardBg from "figma:asset/f9e01682c64370f508a272cdc70ec2928a2e3147.png";
import Variant2Landing from '../Variant2Landing';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useDemo } from '../../../context/DemoContext';
import { LANDING_CONFIG } from '../../../data/demoConfig';
import { useMagicColor } from '../../../context/MagicColorContext';
import svgPathsChips from "../../../imports/svg-xvon3romwc";
import svgPathsInput from "../../../imports/svg-h0tl9nb0vi";
import svgPathsCards from "../../../imports/svg-9ik4xuwq12";
import svgPathsStats from "../../../imports/svg-h6d9ul042g";
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { SparkRipplesBackground } from './SparkRipplesBackground';
import { AvatarMenu } from '../AvatarMenu';
import { SuggestionChipsPanel } from './SuggestionChipsPanel';
import { HomeCards } from './HomeCards';
import { FloatingImageUpload } from './FloatingImageUpload';

// --- Helper Components ---

function ChipIconContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}

function SuggestionChip({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#f8fafc] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[rgba(48,94,255,0.09)] transition-colors border border-transparent hover:border-blue-100"
    >
      <div className="content-stretch flex gap-[7px] items-center overflow-clip p-[12px] relative rounded-[inherit]">
        <ChipIconContainer>{icon}</ChipIconContainer>
        <p className="font-sans font-medium leading-[24px] not-italic relative shrink-0 text-[#40566d] text-[16px] text-nowrap">{label}</p>
      </div>
    </div>
  );
}

// --- Contextual Prompts Panel ---
// Bullet-point alerts that appear below input instead of cards
import { ContextPrompt } from '../../../data/demoConfig';

interface ContextualPromptsPanelProps {
  prompts: ContextPrompt[];
  onPromptClick?: (text: string) => void;
}

const ContextualPromptsPanel = ({ prompts, onPromptClick }: ContextualPromptsPanelProps) => {
  const getStatusColor = (status: ContextPrompt['status']) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="mt-4 px-2 pb-4 flex flex-col gap-1">
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg transition-all hover:bg-gray-50 group"
          onClick={() => onPromptClick?.(prompt.text)}
        >
          <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(prompt.status)}`} />
          <span className="text-[15px] text-[#192839] leading-[22px] flex-1">{prompt.text}</span>
          {prompt.cta && (
            <span className="text-[13px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {prompt.cta}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

// --- EXPERIMENTAL: Hover Affordance Component ---
// Reusable "Review with Ray" / "Fix with Ray" affordance
interface HoverAffordanceProps {
  isVisible: boolean;
  onClick?: () => void;
  label?: string;
  variant?: 'light' | 'dark'; // light = white text, dark = blue text
}

const HoverAffordance = ({ isVisible, onClick, label = "Review with Ray", variant = 'light' }: HoverAffordanceProps) => {
  const textColor = variant === 'light' ? 'text-white/90' : 'text-[#2563EB]';
  const bgColor = variant === 'light' ? 'bg-white/20' : 'bg-[#2563EB]/10';
  const strokeColor = variant === 'light' ? 'white' : '#2563EB';

  return (
    <motion.div
      className="flex items-center gap-[6px] overflow-hidden cursor-pointer"
      onClick={onClick}
      initial={false}
      animate={{
        height: isVisible ? 24 : 0,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        height: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.2, delay: isVisible ? 0.05 : 0 },
      }}
    >
      <motion.div
        className={`size-[18px] rounded-full ${bgColor} flex items-center justify-center backdrop-blur-sm`}
        initial={false}
        animate={{ scale: isVisible ? 1 : 0.6, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </motion.div>
      <motion.span
        className={`text-[14px] font-medium ${textColor} whitespace-nowrap`}
        initial={false}
        animate={{ x: isVisible ? 0 : -10, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.25, delay: isVisible ? 0.08 : 0, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

// --- EXPERIMENTAL: Briefing Item with Hover Affordance ---
// This component adds a "Review with Ray" hover interaction
// To revert: Replace BriefingItem usage with original static JSX
interface BriefingItemProps {
  index: number;
  children: React.ReactNode;
  isHovered: boolean;
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
  onReviewClick?: () => void;
  actionLabel?: string;
}

const BriefingItem = ({ index, children, isHovered, hoveredIndex, onHover, onReviewClick, actionLabel = "Review with Ray" }: BriefingItemProps) => {
  const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;

  return (
    <motion.div
      className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      animate={{
        opacity: isOtherHovered ? 0.4 : 1,
        filter: isOtherHovered ? 'blur(1px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Main content row */}
      <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
        <div className="content-stretch flex items-center pt-[4px] relative shrink-0">
          <div className="bg-white content-stretch flex flex-col items-center justify-center overflow-clip px-[6px] relative rounded-[80px] shrink-0 size-[16px]">
            <p className="font-['Inter',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#2980e1] text-[10px]">{index}</p>
          </div>
        </div>
        <p className="font-['TASA_Orbiter_Display',sans-serif] font-normal leading-[24px] not-italic text-[#fdfdfd] text-[18px] tracking-[-0.234px] flex-1">
          {children}
        </p>
      </div>

      {/* Affordance - appears on hover */}
      <div className="pl-[26px]">
        <HoverAffordance isVisible={isHovered} onClick={onReviewClick} label={actionLabel} variant="light" />
      </div>
    </motion.div>
  );
};

// --- Main Components ---

interface RayDashboardProps {
  onNavigate: (view: 'home' | 'transactions') => void;
  initialQuery?: string;
  autoSubmit?: boolean;
  onLogout?: () => void;
  onSceneChange?: (sceneId: string) => void;
}

export const RayDashboard: React.FC<RayDashboardProps> = (props) => {
  return (
    <StoreProvider>
      <FormProvider>
        <RayDashboardContent {...props} />
      </FormProvider>
    </StoreProvider>
  );
};

const RayDashboardContent: React.FC<RayDashboardProps> = ({ onNavigate, initialQuery, onLogout, onSceneChange }) => {
  const { setIsInChatView, setIsOnRayLandingPage, bgHue, bgIntensity } = useDemo();

  const [view, setView] = useState<'landing' | 'chat'>('landing');

  // Sync view state with context for DemoControls visibility
  React.useEffect(() => {
    setIsInChatView(view === 'chat');
    setIsOnRayLandingPage(view === 'landing');

    // Cleanup: reset when unmounting
    return () => {
      setIsOnRayLandingPage(false);
    };
  }, [view, setIsInChatView, setIsOnRayLandingPage]);

  const [prompt, setPrompt] = useState(initialQuery || '');
  const [waveTrigger, setWaveTrigger] = useState(0);
  const [lastQuery, setLastQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [landingVariant, setLandingVariant] = useState<'v1' | 'v2' | 'default'>('default'); // default=no animation, cycling placeholder; v1=story mode; v2=alt

  // Magic color theme for AI elements (blue vs green) - from global context
  const { magicColor, setMagicColor, config: currentMagicColor } = useMagicColor();

  // Transition state for Magic Move animation (landing → chat)
  // 'spotlightHold' = spotlight stays visible for 1s before movement starts
  const [viewTransition, setViewTransition] = useState<'idle' | 'spotlightHold' | 'exiting' | 'entering'>('idle');
  const [transitionText, setTransitionText] = useState(''); // Captured text for bubble animation
  const inputRef = React.useRef<HTMLDivElement>(null); // Ref to capture input position
  const [inputStartRect, setInputStartRect] = useState<{ top: number; left: number; width: number; height: number; targetY: number } | null>(null);

  // Scroll position for parallax effect on SparkRipples background
  const [scrollY, setScrollY] = useState(0);
  const landingScrollRef = React.useRef<HTMLDivElement>(null);

  // Presentation mode: track which scenes have been triggered
  const sceneTriggeredRef = React.useRef<Record<string, boolean>>({});

  // Cycling placeholder suggestions for 'empty' variant
  const placeholderSuggestions = [
    "Show me today's transactions",
    "What's my payment success rate?",
    "Analyze my revenue this week",
    "Help me create a payment link",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (landingVariant !== 'default') return;
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholderSuggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [landingVariant, placeholderSuggestions.length]);

  // Entry animation phases (0=hidden, 1=ray, 2=greeting, 3=tagline, 4=input-spotlight, 5=spotlight-end, 6=input-content, 7=cards)
  const [animPhase, setAnimPhase] = useState(0);
  const animationRanRef = React.useRef(false);

  useEffect(() => {
    if (view !== 'landing') return;
    // Only run animation once per landing page visit
    if (animationRanRef.current) return;
    animationRanRef.current = true;

    // For 'default' variant, run animation with deliberate pacing
    if (landingVariant === 'default') {
      const t1 = setTimeout(() => setAnimPhase(1), 400);      // Ray appears
      const t2 = setTimeout(() => setAnimPhase(2), 800);      // Greeting starts streaming
      const t3 = setTimeout(() => setAnimPhase(3), 1200);     // Tagline starts streaming
      const t4 = setTimeout(() => setAnimPhase(4), 4600);     // Input spotlight border starts
      const t5 = setTimeout(() => setAnimPhase(5), 5600);     // Spotlight ends
      const t6 = setTimeout(() => setAnimPhase(6), 5700);     // Input content fades in
      const t7 = setTimeout(() => setAnimPhase(7), 6500);     // Cards appear
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); };
    }

    // Story mode animation sequence
    const t1 = setTimeout(() => setAnimPhase(1), 400);      // Ray appears
    const t2 = setTimeout(() => setAnimPhase(2), 2000);     // Greeting
    const t3 = setTimeout(() => setAnimPhase(3), 3200);     // Tagline
    const t4 = setTimeout(() => setAnimPhase(4), 4400);     // Input spotlight border
    const t5 = setTimeout(() => setAnimPhase(5), 5400);     // Spotlight ends
    const t6 = setTimeout(() => setAnimPhase(6), 5500);     // Input content fades in
    const t7 = setTimeout(() => setAnimPhase(7), 6300);     // Cards appear
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); };
  }, [view, landingVariant]);

  // Presentation mode: scene1 triggered on landing page load
  useEffect(() => {
    if (view === 'landing' && onSceneChange && !sceneTriggeredRef.current.scene1) {
      sceneTriggeredRef.current.scene1 = true;
      onSceneChange('scene1');
    }
  }, [view, onSceneChange]);

  // Presentation mode: scene2 triggered when scrolling down on landing
  useEffect(() => {
    if (view === 'landing' && scrollY > 200 && onSceneChange && !sceneTriggeredRef.current.scene2) {
      sceneTriggeredRef.current.scene2 = true;
      onSceneChange('scene2');
    }
  }, [view, scrollY, onSceneChange]);

  // EXPERIMENTAL: Track which briefing item is hovered (null = none)
  const [hoveredBriefingItem, setHoveredBriefingItem] = useState<number | null>(null);

  // EXPERIMENTAL: Briefing review prompts based on item index
  const getBriefingReviewPrompt = (index: number): string => {
    if (index === 1) {
      return "Give me a summary of today's refunds and disputes";
    }
    if (index === 2) {
      return "Tell me more about payment timeouts and how to reduce them";
    }
    if (index === 3) {
      return "Break down my payment methods - Cards vs UPI performance";
    }
    return "";
  };

  // EXPERIMENTAL: Handle "Review with Ray" click - just populate input
  const handleBriefingReviewClick = (index: number) => {
    const reviewPrompt = getBriefingReviewPrompt(index);
    setPrompt(reviewPrompt);
    setHoveredBriefingItem(null);
  };

  // EXPERIMENTAL: Prompts for other cards
  const getCardReviewPrompt = (cardType: string): string => {
    if (cardType === 'stats') {
      return "Show me a breakdown of today's payment volume";
    }
    if (cardType === 'settlement') {
      return "When is my next settlement and what's included?";
    }
    if (cardType === 'success') {
      return "How can I improve my payment success rate?";
    }
    return "";
  };

  // EXPERIMENTAL: Handle card review click
  const handleCardReviewClick = (cardType: string) => {
    const reviewPrompt = getCardReviewPrompt(cardType);
    setPrompt(reviewPrompt);
    setHoveredCard(null);
  };

  // EXPERIMENTAL: Track which card is hovered
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // State for image attachment (kept for future use)
  const [shyamAttachment, setShyamAttachment] = useState<{ filename: string; fileType: string; thumbnailUrl?: string } | null>(null);
  const [showFloatingImage, setShowFloatingImage] = useState(false);

  const handleSend = () => {
    // Allow sending if there's text OR an attachment
    if (!prompt.trim() && !shyamAttachment) return;

    // Presentation mode: scene3 triggered when question submitted
    if (onSceneChange && !sceneTriggeredRef.current.scene3) {
      sceneTriggeredRef.current.scene3 = true;
      onSceneChange('scene3');
    }

    // Capture text for transition animation
    setTransitionText(prompt);
    setLastQuery(prompt);

    // Capture input position for magic move animation
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      // Calculate how far down to move: viewport height - current top - input height - bottom padding (8px to match chat input)
      const targetY = window.innerHeight - rect.top - rect.height - 8;
      setInputStartRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        targetY,
      });
    }

    // Hold spotlight for 1s before starting movement
    setViewTransition('spotlightHold');

    // After 1s spotlight hold, start the movement
    setTimeout(() => {
      setViewTransition('exiting');

      // After exit animation completes, switch view
      // Extended to 700ms for smoother handoff with compact input
      setTimeout(() => {
        setPrompt('');
        setView('chat');
        setViewTransition('entering');
        setIsSidebarCollapsed(true);

        // Presentation mode: scene4 triggered when streaming/AI thinking starts
        if (onSceneChange && !sceneTriggeredRef.current.scene4) {
          sceneTriggeredRef.current.scene4 = true;
          onSceneChange('scene4');
        }

        // Reset transition state after enter animation
        setTimeout(() => {
          setViewTransition('idle');
          setTransitionText('');

          // Presentation mode: scene5 triggered when response is complete (after a delay for demo)
          setTimeout(() => {
            if (onSceneChange && !sceneTriggeredRef.current.scene5) {
              sceneTriggeredRef.current.scene5 = true;
              onSceneChange('scene5');
            }
          }, 3000); // 3s after chat settles - simulates response completion
        }, 600);
      }, 700); // 700ms exit animation - gives hero time to fade smoothly
    }, 1000); // 1s spotlight hold
  };

  // Handle floating image drop - adds attachment to input
  const handleFloatingImageDrop = () => {
    setShowFloatingImage(false);
    setShyamAttachment({ filename: 'Whatsapp Image', fileType: 'PNG', thumbnailUrl: '/screenshot-failed-payment.png' });
  };

  const handleHomeClick = () => {
    setView('landing');
    setPrompt('');
    onNavigate('home');
  };

  // Dynamic Styles - using neutral/positive theme by default (no persona-specific theming)
  const isNegative = false;
  const isNeutral = false;
  const isVarun = false;
  const greetingColor = 'text-[#094c85]';

  return (
    <div
      className="relative w-full h-full overflow-hidden flex font-sans transition-colors duration-500"
      style={{
        background: 'transparent',
        '--magic-primary': currentMagicColor.primary,
        '--magic-gradient': currentMagicColor.gradient,
        '--magic-gradient-light': currentMagicColor.gradientLight,
        '--magic-streaming': currentMagicColor.streamingColor,
        '--magic-bubble': currentMagicColor.bubbleColor,
      } as React.CSSProperties}
    >
      <RaySidebar 
        currentView={view === 'landing' ? 'new-chat' : 'chat'}
        onChangeView={(v) => {
            if (v === 'new-chat') {
                handleHomeClick();
                setIsSidebarCollapsed(false);
            } else if (v.startsWith('thread-')) {
                setView('chat');
                setIsSidebarCollapsed(true);
            }
            setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className={clsx(
        "flex-1 relative flex flex-col h-full transition-all duration-300",
        isSidebarCollapsed ? "md:ml-[72px]" : "md:ml-64"
      )}>
        {/* Top Nav */}
        <div className="h-14 border-b border-slate-100/50 flex items-center px-4 md:px-6 justify-between z-20">
            <div className="flex items-center gap-3 md:gap-6">
                <button 
                    className="md:hidden p-1 text-slate-500 hover:bg-slate-100 rounded"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <Menu size={20} />
                </button>

                <div 
                  className="bg-[#EFF6FF] flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer shadow-[inset_0px_-1px_0px_0px_white]"
                  onClick={handleHomeClick}
                >
                    <div className="w-[18px] h-[18px]"><Ray /></div>
                    <span className="text-sm font-medium text-slate-900">Ray AI</span>
                </div>
                
                <div className="hidden md:flex gap-6 text-sm text-slate-500 font-medium items-center">
                    <span className="hover:text-slate-900 cursor-pointer">Neobanking</span>
                    <span className="hover:text-slate-900 cursor-pointer">Payroll</span>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <span className="hover:text-slate-900 cursor-pointer flex items-center gap-1 select-none">
                              More <ChevronDown size={14} />
                            </span>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className="min-w-[160px] bg-white rounded-lg p-1 shadow-lg border border-slate-100 z-[100]" sideOffset={5} align="end">
                                <DropdownMenu.Item className="text-sm text-slate-700 rounded flex items-center px-2 py-1.5 hover:bg-slate-50 cursor-pointer" onSelect={() => setLandingVariant('default')}>
                                     {landingVariant === 'default' && <Check size={14} className="mr-2 text-blue-600" />} Default (No Animation)
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="text-sm text-slate-700 rounded flex items-center px-2 py-1.5 hover:bg-slate-50 cursor-pointer" onSelect={() => setLandingVariant('v1')}>
                                     {landingVariant === 'v1' && <Check size={14} className="mr-2 text-blue-600" />} Story Mode
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="text-sm text-slate-700 rounded flex items-center px-2 py-1.5 hover:bg-slate-50 cursor-pointer" onSelect={() => setLandingVariant('v2')}>
                                     {landingVariant === 'v2' && <Check size={14} className="mr-2 text-blue-600" />} Variant 2
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <AvatarMenu />
            </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 relative overflow-hidden dashboard-bg transition-[background] duration-700">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
               {/* Spark Ripples WebGL Background - delayed 0.5s, fades out during transition */}
               {view === 'landing' && (
                  <motion.div
                     initial={{ opacity: 1 }}
                     animate={{ opacity: viewTransition === 'exiting' ? 0 : 1 }}
                     transition={{ duration: 0.3 }}
                  >
                     {/* Base background */}
                     <div className="absolute inset-0 bg-[#f8f8f8]" />
                     <motion.div
                        className="absolute inset-0"
                        style={{
                          transform: `translateY(${-150 - scrollY * 0.5}px) scale(2)`,
                          filter: `hue-rotate(${bgHue}deg)`
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                     >
                        <SparkRipplesBackground opacity={bgIntensity / 100} loop={false} playbackRate={0.5} />
                     </motion.div>
                     <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                     {/* Bottom fade: transparent at top, fades to match gradient */}
                     <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(241,247,237,0.6) 25%, rgba(241,247,237,0.95) 40%, #F1F7ED 50%)' }} />
                  </motion.div>
               )}
               {/* Fallback gradient for non-landing views */}
               {view !== 'landing' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1200px] h-[400px] md:h-[800px] opacity-30">
                     <div className={`absolute inset-0 bg-gradient-to-tr ${isNegative ? 'from-red-100 via-transparent to-orange-100' : 'from-blue-100 via-transparent to-green-100'} blur-3xl rounded-full mix-blend-multiply transition-colors duration-1000`} />
                  </div>
               )}
            </div>

            {/* Gradient Overlay - sits above animation, below content - uses soft-light blend to tint animation */}
            <div
              className="absolute inset-0 pointer-events-none z-[1] mix-blend-soft-light"
              style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F7ED 100%)' }}
            />

            {view === 'landing' ? (
                landingVariant === 'v2' ? (
                    <Variant2Landing 
                        prompt={prompt}
                        setPrompt={setPrompt}
                        onSend={handleSend}
                        onChipClick={(label) => {
                             setLastQuery(label);
                             setView('chat');
                             setIsSidebarCollapsed(true);
                        }}
                    />
                ) : (
                <div
                    ref={landingScrollRef}
                    onScroll={(e) => setScrollY((e.target as HTMLDivElement).scrollTop)}
                    className="relative z-10 h-full overflow-y-auto flex flex-col items-center p-4 md:p-8 px-4 md:px-[32px] pt-[15vh] md:pt-[20vh] pb-[100px] scrollbar-hide"
                >
                     {/* Greeting Section - Stacked Layout */}
                     <motion.div
                        className="flex flex-col items-center gap-4 mb-8 group cursor-default text-center"
                        animate={{
                            opacity: viewTransition === 'exiting' ? 0 : 1,
                            filter: viewTransition === 'exiting' ? 'blur(8px)' : 'blur(0px)',
                            y: viewTransition === 'exiting' ? -20 : 0,
                        }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                     >
                        {/* Ray Logo - Centered, Blue, Static with Entry Spin (overshoot settle) */}
                        <motion.div
                            className="relative shrink-0 size-[48px]"
                            style={{ '--fill-0': currentMagicColor.primary } as React.CSSProperties}
                            initial={{ opacity: 0, rotate: -90, scale: 0.3 }}
                            animate={{
                                opacity: animPhase >= 1 ? 1 : 0,
                                rotate: animPhase >= 1 ? 0 : -90,
                                scale: animPhase >= 1 ? 1 : 0.3
                            }}
                            transition={{
                                opacity: { duration: 0.5 },
                                rotate: {
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 10,
                                    duration: 1.5
                                },
                                scale: {
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 12,
                                    duration: 1.2
                                }
                            }}
                        >
                            <Ray static />
                        </motion.div>
                        {/* Small Greeting - staggered characters in default mode */}
                        <p className={`font-sans font-normal text-[16px] md:text-[18px] leading-[24px] tracking-[-0.2px] transition-colors duration-300 ${greetingColor}`}>
                            {landingVariant === 'default' ? (
                                // Staggered character animation for default mode - starts after Ray appears
                                LANDING_CONFIG.greeting.split('').map((char: string, i: number) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block"
                                        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        transition={{
                                            duration: 0.2,
                                            delay: 0.8 + i * 0.04,
                                            ease: [0.25, 0.1, 0.25, 1]
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                ))
                            ) : (
                                <motion.span
                                    initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                                    animate={{
                                        opacity: animPhase >= 2 ? 1 : 0,
                                        y: animPhase >= 2 ? 0 : 8,
                                        filter: animPhase >= 2 ? 'blur(0px)' : 'blur(8px)'
                                    }}
                                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                                >
                                    {LANDING_CONFIG.greeting}
                                </motion.span>
                            )}
                        </p>
                        {/* Tagline - Large Text with magic color - staggered characters in default mode */}
                        <h1 className="font-sans font-normal text-[28px] md:text-[40px] leading-[36px] md:leading-[48px] tracking-[-0.5px] text-[#2563EB]">
                            {landingVariant === 'default' ? (
                                // Staggered character animation for default mode - starts after greeting finishes
                                "What can I do for you today?".split('').map((char, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block"
                                        style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        transition={{
                                            duration: 0.2,
                                            delay: 2.0 + i * 0.03,
                                            ease: [0.25, 0.1, 0.25, 1]
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                ))
                            ) : (
                                <motion.span
                                    initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                                    animate={{
                                        opacity: animPhase >= 3 ? 1 : 0,
                                        y: animPhase >= 3 ? 0 : 8,
                                        filter: animPhase >= 3 ? 'blur(0px)' : 'blur(8px)'
                                    }}
                                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                                >
                                    What can I do for you today?
                                </motion.span>
                            )}
                        </h1>
                     </motion.div>

                     {/* Input Box with Spotlight Animation - moves to bottom and fades out during transition */}
                     <motion.div
                        ref={inputRef}
                        className={`max-w-2xl mb-6 ${viewTransition === 'exiting' ? 'fixed z-50 left-1/2 -translate-x-1/2' : 'relative w-full'}`}
                        style={viewTransition === 'exiting' && inputStartRect ? {
                            top: inputStartRect.top,
                            width: inputStartRect.width,
                        } : {}}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{
                            opacity: viewTransition === 'exiting' ? 0 : (animPhase >= 4 ? 1 : 0),
                            scale: viewTransition === 'exiting' ? 0.96 : 1,
                            y: viewTransition === 'exiting' && inputStartRect ? inputStartRect.targetY : 0,
                        }}
                        transition={{
                            opacity: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
                            scale: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
                            y: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
                        }}
                     >
                        {/* Spotlight BORDER overlay for input - matches RayInputBox rounded-[20px] */}
                        <motion.div
                            className="absolute inset-0 rounded-[20px] pointer-events-none z-10 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: (animPhase >= 4 && animPhase < 5) || viewTransition === 'spotlightHold' ? 1 : 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {/* Horizontal linear gradient - sweeps left to right across top/bottom edges */}
                            <div
                                className="absolute inset-0 rounded-[20px]"
                                style={{
                                    background: `linear-gradient(90deg, rgba(203,213,225,0.5) 0%, rgba(203,213,225,0.5) 40%, ${currentMagicColor.gradient} 50%, rgba(203,213,225,0.5) 60%, rgba(203,213,225,0.5) 100%)`,
                                    backgroundSize: '200% 100%',
                                    animation: (animPhase >= 4 && animPhase < 5) || viewTransition === 'spotlightHold' ? 'spotlightSweep 1s ease-out forwards' : 'none',
                                }}
                            />
                            {/* Inner fill to create border effect - white for clean look */}
                            <div className="absolute inset-[2px] rounded-[18px] bg-white" />
                        </motion.div>

                        {/* Input content - only visible after spotlight ends */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: animPhase >= 6 ? 1 : 0 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <RayInputBox
                                value={prompt}
                                onChange={setPrompt}
                                onSend={handleSend}
                                variant="hero"
                                placeholder={landingVariant === 'default' ? placeholderSuggestions[placeholderIndex] : ""}
                                animatePlaceholder={landingVariant === 'default'}
                                showShadow={animPhase >= 6}
                                autoFocus
                                attachmentChip={shyamAttachment}
                                onRemoveAttachment={() => setShyamAttachment(null)}
                            />
                        </motion.div>
                     </motion.div>

                     {/* Suggestion Chips Panel - appears after animation completes, fades out on transition */}
                     {animPhase >= 7 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: viewTransition === 'exiting' ? 0 : 1,
                                y: viewTransition === 'exiting' ? -10 : 0
                            }}
                            transition={{ duration: viewTransition === 'exiting' ? 0.2 : 0.4, delay: viewTransition === 'exiting' ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
                            className="mt-0"
                        >
                            <SuggestionChipsPanel onPromptSelect={setPrompt} />
                        </motion.div>
                     )}

                     <div className="w-full max-w-2xl relative flex flex-col gap-[32px] items-center">

                        {/* Suggestion Categories - Commented out per request
                        <div className="content-stretch flex gap-[13px] items-center relative shrink-0 flex-wrap justify-center">
                            <div
                                onClick={() => setPrompt("Show me recent transactions")}
                                className="h-[32px] relative rounded-[12px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ backgroundImage: "linear-gradient(189.448deg, rgba(255, 255, 255, 0) 10.211%, rgba(255, 255, 255, 0.8) 41.559%), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)" }}
                            >
                                <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[16px] py-[8px] relative rounded-[inherit]">
                                    <div className="relative shrink-0 size-[16px]">
                                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                            <g><path clipRule="evenodd" d={svgPathsChips.p9de6b00} fill="#40566D" fillRule="evenodd" /></g>
                                        </svg>
                                    </div>
                                    <p className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#40566d] text-[14px] tracking-[-0.182px]">Recent transactions</p>
                                </div>
                                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_15px_2px_rgba(255,255,255,0.6)]" />
                                <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                            </div>
                            <div
                                onClick={() => setPrompt("Summarize my dashboard")}
                                className="h-[32px] relative rounded-[12px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ backgroundImage: "linear-gradient(193.721deg, rgba(255, 255, 255, 0) 10.211%, rgba(255, 255, 255, 0.8) 41.559%), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)" }}
                            >
                                <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[16px] py-[8px] relative rounded-[inherit]">
                                    <div className="relative shrink-0 size-[16px]">
                                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                            <g>
                                                <path d={svgPathsChips.p3a34d00} fill="#40566D" />
                                                <path clipRule="evenodd" d={svgPathsChips.p1727b600} fill="#40566D" fillRule="evenodd" />
                                            </g>
                                        </svg>
                                    </div>
                                    <p className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#40566d] text-[14px] tracking-[-0.182px]">Summarize</p>
                                </div>
                                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_15px_2px_rgba(255,255,255,0.6)]" />
                                <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                            </div>
                            <div
                                onClick={() => setPrompt("Analyze my payment volume")}
                                className="h-[32px] relative rounded-[12px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ backgroundImage: "linear-gradient(196.433deg, rgba(255, 255, 255, 0) 10.211%, rgba(255, 255, 255, 0.8) 41.559%), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)" }}
                            >
                                <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[16px] py-[8px] relative rounded-[inherit]">
                                    <div className="relative shrink-0 size-[16px]">
                                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                            <g><path d={svgPathsChips.p2368a080} fill="#40566D" /></g>
                                        </svg>
                                    </div>
                                    <p className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#40566d] text-[14px] tracking-[-0.182px]">Analyze</p>
                                </div>
                                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_15px_2px_rgba(255,255,255,0.6)]" />
                                <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                            </div>
                            <div
                                onClick={() => setPrompt("Why are payments failing?")}
                                className="h-[32px] relative rounded-[12px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ backgroundImage: "linear-gradient(192.443deg, rgba(255, 255, 255, 0) 10.211%, rgba(255, 255, 255, 0.8) 41.559%), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)" }}
                            >
                                <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[16px] py-[8px] relative rounded-[inherit]">
                                    <div className="relative shrink-0 size-[16px]">
                                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                            <g><path d={svgPathsChips.p3072b700} fill="#40566D" /></g>
                                        </svg>
                                    </div>
                                    <p className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#40566d] text-[14px] tracking-[-0.182px]">Troubleshoot</p>
                                </div>
                                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_15px_2px_rgba(255,255,255,0.6)]" />
                                <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                            </div>
                            <div
                                onClick={() => setPrompt("What can Ray do?")}
                                className="h-[32px] relative rounded-[12px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ backgroundImage: "linear-gradient(196.908deg, rgba(255, 255, 255, 0) 10.211%, rgba(255, 255, 255, 0.8) 41.559%), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)" }}
                            >
                                <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[12px] pr-[16px] py-[8px] relative rounded-[inherit]">
                                    <div className="relative shrink-0 size-[16px]">
                                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                            <g><path d={svgPathsChips.pe4107c0} fill="#40566D" /></g>
                                        </svg>
                                    </div>
                                    <p className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#40566d] text-[14px] tracking-[-0.182px]">Ray 101</p>
                                </div>
                                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_15px_2px_rgba(255,255,255,0.6)]" />
                                <div aria-hidden="true" className="absolute border border-[rgba(108,132,157,0.18)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                            </div>
                        </div>
                        */}
                     </div>

                     {/* Dynamic Cards Grid - fades out during transition */}
                     {(
                     <motion.div
                        className="w-full max-w-full md:max-w-[850px] mt-[80px]"
                        animate={{
                            opacity: viewTransition === 'exiting' ? 0 : 1,
                            y: viewTransition === 'exiting' ? 40 : 0,
                            filter: viewTransition === 'exiting' ? 'blur(4px)' : 'blur(0px)',
                        }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                     >
                        <HomeCards animPhase={animPhase} onPromptSelect={setPrompt} />
                     </motion.div>
                     )}

                     {/* OLD CARDS GRID - REPLACED BY HomeCards */}
                     {false && <div className="OLD_REMOVED_hidden">
                        {/* Responsive Grid Layout with Equal Spacing */}
                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-3 md:gap-4 auto-rows-min">
                        
                        {/* 1. TODAY'S BRIEFING CARD (Left) - Blue gradient background - Spans 2 rows on desktop */}
                        <motion.div
                          className="bg-white h-auto md:h-[390px] md:row-span-2 overflow-clip rounded-[10px] w-full relative"
                          initial={{ opacity: 0, y: 26 }}
                          animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                          transition={{
                            duration: 0.8,
                            delay: 0,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                        >
                          {/* Blue gradient background with layers */}
                          <div className="absolute inset-0">
                            {/* Background gradients */}
                            <div className="absolute flex inset-[36.11%_-12.5%_-10.95%_-23.57%] items-center justify-center">
                              <div className="flex-none h-[291.883px] rotate-[180deg] scale-y-[-100%] w-[381.001px]">
                                <div className="relative size-full">
                                  <div className="absolute inset-[-17.4%_-13.33%]">
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 482.574 393.456">
                                      <g filter="url(#filter0_f_briefing_bg1)">
                                        <path d={svgPathsCards.p31a56d00} fill="#82C1FA" />
                                      </g>
                                      <defs>
                                        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="393.456" id="filter0_f_briefing_bg1" width="482.574" x="0" y="0">
                                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                                          <feGaussianBlur result="effect1_foregroundBlur_briefing_bg1" stdDeviation="25.3933" />
                                        </filter>
                                      </defs>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="absolute flex inset-[49.27%_-12.5%_-24.11%_-23.57%] items-center justify-center">
                              <div className="flex-none h-[291.883px] rotate-[180deg] scale-y-[-100%] w-[381.001px]">
                                <div className="relative size-full">
                                  <div className="absolute inset-[-17.4%_-13.33%]">
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 482.574 393.456">
                                      <g filter="url(#filter0_f_briefing_bg2)">
                                        <path d={svgPathsCards.p31a56d00} fill="white" />
                                      </g>
                                      <defs>
                                        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="393.456" id="filter0_f_briefing_bg2" width="482.574" x="0" y="0">
                                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                                          <feGaussianBlur result="effect1_foregroundBlur_briefing_bg2" stdDeviation="25.3933" />
                                        </filter>
                                      </defs>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="absolute flex inset-[-27.93px_-165.06px_-489.73px_-550px] items-center justify-center">
                              <div className="flex-none h-[753.167px] rotate-[167.19deg] scale-y-[-100%] skew-x-[2.47deg] w-[816.812px]">
                                <div className="relative size-full">
                                  <div className="absolute inset-[-11.15%_-10.28%]">
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 984.812 921.167">
                                      <g filter="url(#filter0_f_briefing_main)">
                                        <path d={svgPathsCards.p3c22a940} fill="url(#paint0_linear_briefing_main)" />
                                      </g>
                                      <defs>
                                        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="921.167" id="filter0_f_briefing_main" width="984.812" x="0" y="0">
                                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                                          <feGaussianBlur result="effect1_foregroundBlur_briefing_main" stdDeviation="42" />
                                        </filter>
                                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_briefing_main" x1="492.406" x2="416.78" y1="84" y2="395.564">
                                          <stop stopColor="#1291D0" />
                                          <stop offset="1" stopColor="#4D7FFF" />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Icon */}
                          <div className="absolute left-[19px] size-[18px] top-[30px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                              <path d={svgPathsCards.p32c28e80} fill="#FDFDFD" />
                            </svg>
                          </div>
                          
                          {/* Title */}
                          <p className="absolute font-['Inter',sans-serif] font-normal leading-[26px] left-[47px] not-italic text-[14px] text-white top-[28px] tracking-[-0.28px]">TODAY'S BRIEFING</p>
                          
                          {/* Content List - Dynamic based on persona */}
                          {/* EXPERIMENTAL: Using BriefingItem with hover affordance */}
                          <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[19px] top-[79px] right-[16px]">
                            {/* Item 1 */}
                            <BriefingItem
                              index={1}
                              isHovered={hoveredBriefingItem === 1}
                              hoveredIndex={hoveredBriefingItem}
                              onHover={setHoveredBriefingItem}
                              onReviewClick={() => handleBriefingReviewClick(1)}
                              actionLabel={isNegative || (isNeutral && !isVarun) ? "Fix with Ray" : "Review with Ray"}
                            >
                              {isNegative
                                ? <>Your refund volume for last 3 days was unusually high</>
                                : isVarun
                                  ? <>Payment volumes are on huge surge</>
                                  : isNeutral
                                    ? <>Your refund volumes are unusually high</>
                                    : <>No refunds or disputes so far today</>
                              }
                            </BriefingItem>

                            {/* Item 2 */}
                            <BriefingItem
                              index={2}
                              isHovered={hoveredBriefingItem === 2}
                              hoveredIndex={hoveredBriefingItem}
                              onHover={setHoveredBriefingItem}
                              onReviewClick={() => handleBriefingReviewClick(2)}
                              actionLabel="Fix with Ray"
                            >
                              Payment timeouts are the most common failure reason (2%)
                            </BriefingItem>

                            {/* Item 3 */}
                            <BriefingItem
                              index={3}
                              isHovered={hoveredBriefingItem === 3}
                              hoveredIndex={hoveredBriefingItem}
                              onHover={setHoveredBriefingItem}
                              onReviewClick={() => handleBriefingReviewClick(3)}
                              actionLabel="Review with Ray"
                            >
                              Cards & UPI payments account for 96% of this week's payment volume (₹7.1 lakh)
                            </BriefingItem>
                          </div>
                        </motion.div>
                        
                        {/* Right Column - Nested Grid for 3 Cards */}
                        <div className="grid grid-cols-1 md:grid-rows-[auto_auto] gap-4 w-full">
                        
                        {/* 2. ACCOUNT BALANCE / PAYMENT VOLUME CARD (Top Right) - Dynamic color based on theme */}
                        <motion.div
                          className={clsx(
                            "bg-white border border-solid overflow-clip rounded-[10px] h-[201px] w-full relative cursor-pointer",
                            isNegative ? "border-[#fee4e2]" : (isNeutral && !isVarun) ? "border-[#fed7aa]" : "border-[#d1fae5]"
                          )}
                          initial={{ opacity: 0, y: 26 }}
                          animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.15,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          onMouseEnter={() => setHoveredCard('stats')}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          {/* Gradient SVG shapes in background - dynamic color */}
                          <div className="absolute inset-[calc(24.4%-1px)_calc(-39.84%-1px)_calc(-54.56%-1px)_calc(57.66%-1px)]">
                            <div className="absolute inset-[-21.21%_-12.12%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 520.69 341.067">
                                <g filter="url(#filter0_f_stats_bg1)">
                                  <path d={svgPathsStats.pd204a80} fill={isNegative ? "#FA8282" : (isNeutral && !isVarun) ? "#FDBA74" : "#6EE7B7"} />
                                </g>
                                <defs>
                                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="341.067" id="filter0_f_stats_bg1" width="520.691" x="0" y="0">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                                    <feGaussianBlur result="effect1_foregroundBlur_stats_bg1" stdDeviation="25.3933" />
                                  </filter>
                                </defs>
                              </svg>
                            </div>
                          </div>
                          <div className="absolute inset-[calc(77.11%-1px)_calc(30.75%-1px)_calc(-107.27%-1px)_calc(-12.93%-1px)]">
                            <div className="absolute inset-[-21.21%_-12.12%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 520.69 341.067">
                                <g filter="url(#filter0_f_stats_bg2)">
                                  <path d={svgPathsStats.pd204a80} fill={isNegative ? "#FA8282" : (isNeutral && !isVarun) ? "#FDBA74" : "#6EE7B7"} />
                                </g>
                                <defs>
                                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="341.067" id="filter0_f_stats_bg2" width="520.691" x="0" y="0">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                                    <feGaussianBlur result="effect1_foregroundBlur_stats_bg2" stdDeviation="25.3933" />
                                  </filter>
                                </defs>
                              </svg>
                            </div>
                          </div>

                          {/* Main Content - Dynamic based on theme */}
                          <div className="absolute bottom-[21px] content-stretch flex flex-col gap-[8px] items-start left-[19px] w-[313px]">
                            {isNegative ? (
                              <>
                                {/* Arjun: Available Balance Row */}
                                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                                  <p className="font-['Inter',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#768ea7] text-[12px] tracking-[0.24px]">AVAILABLE BALANCE</p>
                                  <div className="content-stretch flex items-end justify-end relative shrink-0">
                                    <div className="content-stretch flex items-baseline relative shrink-0">
                                      <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0">
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">₹</span>
                                        <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium leading-[26px] not-italic text-[#192839] text-[20px]">-46,000</span>
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">.00</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Arjun: Payments Collected Row */}
                                <div className="content-stretch flex items-end justify-between relative shrink-0 w-full">
                                  <p className="font-['Inter',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#768ea7] text-[12px] tracking-[0.24px]">PAYMENTS COLLECTED</p>
                                  <div className="content-stretch flex items-end justify-end relative shrink-0">
                                    <div className="content-stretch flex items-baseline relative shrink-0">
                                      <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0">
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">₹</span>
                                        <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium leading-[26px] not-italic text-[#192839] text-[20px]">1,20,000</span>
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">.00</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : isVarun ? (
                              <>
                                {/* Varun: Payments Collected Row */}
                                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                                  <p className="font-['Inter',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#768ea7] text-[12px] tracking-[0.24px]">PAYMENTS COLLECTED</p>
                                  <div className="content-stretch flex items-end justify-end relative shrink-0">
                                    <div className="content-stretch flex items-baseline relative shrink-0">
                                      <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0">
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">₹</span>
                                        <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium leading-[26px] not-italic text-[#192839] text-[20px]">10,40,000</span>
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">.00</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Varun: Available Balance Row */}
                                <div className="content-stretch flex items-end justify-between relative shrink-0 w-full">
                                  <p className="font-['Inter',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#768ea7] text-[12px] tracking-[0.24px]">AVAILABLE BALANCE</p>
                                  <div className="content-stretch flex items-end justify-end relative shrink-0">
                                    <div className="content-stretch flex items-baseline relative shrink-0">
                                      <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0">
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">₹</span>
                                        <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium leading-[26px] not-italic text-[#192839] text-[20px]">13,40,000</span>
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">.00</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                {/* Maya/Sarah: Payments Collected Row */}
                                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                                  <p className="font-['Inter',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#768ea7] text-[12px] tracking-[0.24px]">PAYMENTS COLLECTED</p>
                                  <div className="content-stretch flex items-end justify-end relative shrink-0">
                                    <div className="content-stretch flex items-baseline relative shrink-0">
                                      <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0">
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">₹</span>
                                        <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium leading-[26px] not-italic text-[#192839] text-[20px]">1,13,000</span>
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">.00</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Maya/Sarah: Available Balance Row */}
                                <div className="content-stretch flex items-end justify-between relative shrink-0 w-full">
                                  <p className="font-['Inter',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#768ea7] text-[12px] tracking-[0.24px]">AVAILABLE BALANCE</p>
                                  <div className="content-stretch flex items-end justify-end relative shrink-0">
                                    <div className="content-stretch flex items-baseline relative shrink-0">
                                      <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0">
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">₹</span>
                                        <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium leading-[26px] not-italic text-[#192839] text-[20px]">1,00,000</span>
                                        <span className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic text-[#192839] text-[14px] opacity-64">.00</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Title at top - Dynamic based on theme */}
                          <p className="absolute font-['TASA_Orbiter_Display',sans-serif] leading-[28px] left-[19px] not-italic text-[20px] top-[17px] tracking-[-0.26px]">
                            {isNegative ? (
                              <>
                                <span className="text-black">Your account balance </span>
                                <span className="font-['TASA_Orbiter_Display',sans-serif] font-bold text-[#d92d20]">is negative</span>
                              </>
                            ) : isVarun ? (
                              <>
                                <span className="text-black">Payment volumes are on </span>
                                <span className="font-['TASA_Orbiter_Display',sans-serif] font-bold text-[#00a251]">huge surge</span>
                              </>
                            ) : isNeutral ? (
                              <>
                                <span className="text-black">Payment volumes </span>
                                <span className="font-['TASA_Orbiter_Display',sans-serif] font-bold text-[#ea580c]">low</span>
                                <span className="text-black"> than usual today</span>
                              </>
                            ) : (
                              <>
                                <span className="text-black">Payment volumes </span>
                                <span className="font-['TASA_Orbiter_Display',sans-serif] font-bold text-[#00a251]">higher</span>
                                <span className="text-black"> than usual today</span>
                              </>
                            )}
                          </p>

                          {/* EXPERIMENTAL: Hover affordance - below headline */}
                          <div className="absolute top-[48px] left-[19px]">
                            <HoverAffordance
                              isVisible={hoveredCard === 'stats'}
                              onClick={() => handleCardReviewClick('stats')}
                              label={isNegative ? "Fix with Ray" : isNeutral ? "Fix with Ray" : "Review with Ray"}
                              variant="dark"
                            />
                          </div>
                        </motion.div>

                        {/* Bottom Row - Success Rate and Settlement Cards side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        
                        {/* 3. SUCCESS RATE CARD (Bottom Left) */}
                        <motion.div
                          className="bg-[#fcfcfc] border border-[rgba(0,0,0,0.1)] border-solid not-italic overflow-clip rounded-[12px] h-[183px] w-full relative cursor-pointer"
                          initial={{ opacity: 0, y: 26 }}
                          animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.3,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          onMouseEnter={() => setHoveredCard('success')}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          {/* Title at top */}
                          <p className="absolute font-['TASA_Orbiter_Display',sans-serif] leading-[28px] left-[12px] text-[#40566d] text-[20px] top-[15px] tracking-[-0.26px]">
                            Your payment success rate is <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium text-[#00a251]">healthy</span>
                          </p>

                          {/* Label */}
                          <p className="absolute font-['Inter',sans-serif] font-medium leading-[16px] left-[12px] text-[#768ea7] text-[12px] top-[111px] tracking-[0.24px]">SUCCESS RATE</p>

                          {/* Large percentage value */}
                          <div className="absolute flex flex-col font-['TASA_Orbiter_Display',sans-serif] font-medium justify-end leading-[0] left-[75px] text-[#192839] text-[32px] text-right top-[169px] translate-x-[-100%] translate-y-[-100%]">
                            <p className="leading-[38px]">98%</p>
                          </div>

                          {/* EXPERIMENTAL: Hover affordance - below headline */}
                          <div className="absolute top-[48px] left-[12px]">
                            <HoverAffordance
                              isVisible={hoveredCard === 'success'}
                              onClick={() => handleCardReviewClick('success')}
                              label="Review with Ray"
                              variant="dark"
                            />
                          </div>
                        </motion.div>

                        {/* 4. SETTLEMENT CARD (Bottom Right) - Dynamic color based on theme */}
                        <motion.div
                          className="bg-[#fcfcfc] border border-[rgba(0,0,0,0.1)] border-solid h-[183px] overflow-clip rounded-[12px] w-full relative cursor-pointer"
                          initial={{ opacity: 0, y: 26 }}
                          animate={animPhase >= 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.45,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          onMouseEnter={() => setHoveredCard('settlement')}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          {/* Ellipse gradient at bottom - dynamic color */}
                          <div className="absolute h-[98px] left-[-27px] top-[173px] w-[275px]">
                            <div className="absolute inset-[-61.22%_-21.82%]">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 395 218">
                                <g filter="url(#filter0_f_settlement_glow)" opacity="0.97">
                                  <ellipse cx="197.5" cy="109" fill={isNegative ? "#D92D20" : "#10B981"} rx="137.5" ry="49" />
                                </g>
                                <defs>
                                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="218" id="filter0_f_settlement_glow" width="395" x="0" y="0">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                                    <feGaussianBlur result="effect1_foregroundBlur_settlement_glow" stdDeviation="30" />
                                  </filter>
                                </defs>
                              </svg>
                            </div>
                          </div>

                          {/* Title - Dynamic based on theme */}
                          <p className="absolute font-['TASA_Orbiter_Display',sans-serif] leading-[28px] left-[13px] not-italic text-[20px] top-[15px] tracking-[-0.26px]">
                            <span className="text-[#40566d]">Your settlements are </span>
                            {isNegative ? (
                              <span className="font-['TASA_Orbiter_Display',sans-serif] font-bold text-[#d92d20]">paused</span>
                            ) : (
                              <span className="font-['TASA_Orbiter_Display',sans-serif] font-bold text-[#00a251]">on track</span>
                            )}
                          </p>

                          {/* Amount */}
                          <div className="absolute content-stretch flex items-end justify-end left-[15px] top-[131px]">
                            <div className="content-stretch flex items-baseline relative shrink-0">
                              <div className="content-stretch flex gap-[2px] items-baseline relative shrink-0">
                                <span className="font-['Inter',sans-serif] font-medium leading-[26px] not-italic text-[#192839] text-[20px] opacity-64">₹</span>
                                <span className="font-['TASA_Orbiter_Display',sans-serif] font-medium leading-[38px] not-italic text-[#192839] text-[32px]">{isVarun ? "3.1L" : "1.26L"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Label */}
                          <p className="absolute font-['Inter',sans-serif] font-medium leading-[16px] left-[15px] not-italic text-[#768ea7] text-[10px] top-[111px] tracking-[0.3px]">NEXT SETTLEMENT</p>

                          {/* EXPERIMENTAL: Hover affordance - below headline */}
                          <div className="absolute top-[48px] left-[13px]">
                            <HoverAffordance
                              isVisible={hoveredCard === 'settlement'}
                              onClick={() => handleCardReviewClick('settlement')}
                              label={isNegative ? "Fix with Ray" : "Review with Ray"}
                              variant="dark"
                            />
                          </div>
                        </motion.div>

                        </div>
                        </div>

                     </div>
                     </div>}
                </div>
                )
            ) : (
                <RayLayout initialQuery={lastQuery} isEntering={viewTransition === 'entering'} onGoHome={handleHomeClick} />
            )}

        </div>
      </div>

      {/* Floating Image Upload (Shyam flow on landing page) */}
      <FloatingImageUpload
        imageSrc="/screenshot-failed-payment.png"
        isVisible={showFloatingImage && view === 'landing'}
        onDrop={handleFloatingImageDrop}
      />
    </div>
  );
};