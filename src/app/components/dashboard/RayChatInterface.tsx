import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { RayMessageRenderer, RayResponseData } from './chat/RayMessageRenderer';
import { AddFundsModal } from './chat/AddFundsModal';
import { PaymentLinkPrefill, parsePaymentLinkIntent } from './chat/PaymentLinkWidget';
import { PaymentLinkModal } from './chat/PaymentLinkModal';
import { SourceRect } from './chat/PaymentLinkMiniCard';
import { CaptureSettingsModal } from './chat/CaptureSettingsModal';
import { KYCOTPModal } from './chat/KYCOTPModal';
import { UPIVerificationModal } from './chat/UPIVerificationModal';
import { KYCReviewModal } from './chat/KYCReviewModal';
import { SuccessAnimation } from './SuccessAnimation';
import { FloatingImageUpload } from './FloatingImageUpload';
import { BusinessCategoryLoadingState } from './BusinessCategoryLoadingState';
import { ArrowDown, ArrowUp, Mic, Plus, Sparkles } from 'lucide-react';
import { RayInputBox } from './RayInputBox';
import { useDemo } from '@/context/DemoContext';
import { useDemoScript } from './useDemoScript';
import { motion, AnimatePresence } from 'motion/react';
import { useMagicColor } from '@/context/MagicColorContext';
import { detectFlowType, FlowType } from '@/data/demoConfig';

// EXPERIMENTAL: Roll-up animation for user messages
// Set to true to enable user messages scrolling to top before Ray responds
// Set to false to restore default behavior (messages appear at bottom)
const ENABLE_ROLL_UP_ANIMATION = true;

// EXPERIMENTAL: Pin user messages to top
// Set to true to display messages in reverse order (newest at top)
// When enabled, user's latest message appears at top, followed by Ray's response below
// Set to false to restore default behavior (oldest at top, newest at bottom)
const ENABLE_PIN_TO_TOP = false;

// EXPERIMENTAL: Smart scroll on Ray thinking
// When Ray enters thinking state, scroll so the user's latest message is at the TOP of the viewport
// This gives maximum room for Ray's response to appear below
// Set to false to disable this behavior
const ENABLE_SMART_SCROLL_ON_THINKING = true;

// EXPERIMENTAL: Varun Elegant Scroll (Reversible)
// When enabled, Varun's flow uses a custom scroll pattern:
// 1. User message appears
// 2. Smooth scroll positions user message at top of viewport
// 3. THEN Ray's thinking animation plays
// 4. THEN Ray's response renders
// Set to false to use the default scroll behavior for Varun
const VARUN_ELEGANT_SCROLL = true;

// --- Context Aware Data Generator ---
const generateArjunData = (): RayResponseData => {
  const today = new Date();
  const formatDate = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Generate dynamic dates relative to now
  const d1 = new Date(today); // Today
  const d2 = new Date(today); d2.setDate(today.getDate() - 1); // Yesterday
  const d3 = new Date(today); d3.setDate(today.getDate() - 2); 
  const d4 = new Date(today); d4.setDate(today.getDate() - 3);

  // Random realistic RRNs
  const rrn = () => Math.floor(100000000000 + Math.random() * 900000000000).toString();

  return {
    id: 'ai-response-1',
    sender: 'ai',
    artifact: {
      type: 'investigation_report',
      data: {
        headline: "Your settlements are paused due to a negative balance of ₹46,000.",
        subtext: "This happened because your refunds this week exceeded your payments:",
        stats: [
          { label: "Payments received", value: "₹7.6 Lakhs" },
          { label: "Refunds processed", value: "₹8.0 Lakhs" },
          { label: "Current difference", value: "-₹46,000" }
        ],
        table: {
          rows: [
            { id: '1', amount: '₹1,85,000', status: 'Processed', date: `${formatDate(d1)}, ${formatTime(d1)}`, rrn: rrn(), email: 'priya.mehta@email.com' },
            { id: '2', amount: '₹1,20,000', status: 'Processed', date: `${formatDate(d2)}, ${formatTime(d2)}`, rrn: rrn(), email: 'rahul.trading@email.com' },
            { id: '3', amount: '₹95,000', status: 'Processed', date: `${formatDate(d3)}, 11:08 AM`, rrn: rrn(), email: 'supplier.ops@email.com' },
            { id: '4', amount: '₹88,000', status: 'Processing', date: `${formatDate(d4)}, 6:45 PM`, rrn: rrn(), email: 'ankita.shah@email.com' },
            { id: '5', amount: '₹75,000', status: 'Processed', date: `${formatDate(d4)}, 3:30 PM`, rrn: rrn(), email: 'orders@business.com' },
          ]
        },
        resolution: {
          title: "How to unlock your money immediately:",
          content: "You have ₹1.26 Lakhs in settlements waiting. Add ₹46,000 to your Razorpay account now to clear the negative balance, and your full ₹1.26 Lakhs will be transferred to your bank by the next business day."
        },
        suggestions: [
          "Add funds worth ₹46,000",
          "How can I avoid this negative balance in the future?",
          "Tell me how Refund Credits can keep my settlements running smoothly."
        ]
      }
    }
  };
};

interface RayChatInterfaceProps {
  initialQuery?: string;
  isSplit?: boolean;
  isEntering?: boolean; // True when transitioning from landing → chat
  onGoHome?: () => void; // Navigate back to landing page
  skipInitialUserMessage?: boolean; // Skip showing user query, go directly to Ray's response
}

export const RayChatInterface = ({ initialQuery, isSplit, isEntering, onGoHome, skipInitialUserMessage }: RayChatInterfaceProps) => {
  const demoContext = useDemo();
  const { config: currentMagicColor } = useMagicColor();
  const { arjunScript, sarahScript, mayaScript, samScript, shyamScript, kiaraScript, varunScript, kycScript, briefingReviewResponses, showcaseCards } = useDemoScript();

  // Track which flow is active (query-based routing)
  const [activeFlow, setActiveFlow] = useState<FlowType>(null);
  const [messages, setMessages] = useState<RayResponseData[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [showScrollButton, setShowScrollButton] = useState(false);
  const prevMessageCountRef = useRef(0);

  // Widget States
  const [showAddFundsWidget, setShowAddFundsWidget] = useState(false);
  const [widgetAmount, setWidgetAmount] = useState('');

  // Payment Link Modal States
  const [isPaymentLinkModalOpen, setIsPaymentLinkModalOpen] = useState(false);
  const [paymentLinkPrefill, setPaymentLinkPrefill] = useState<PaymentLinkPrefill | null>(null);
  const [activeFormCardId, setActiveFormCardId] = useState<string | null>(null);
  const [paymentLinkSourceRect, setPaymentLinkSourceRect] = useState<SourceRect | null>(null);

  // Capture Settings Modal States
  const [isCaptureSettingsModalOpen, setIsCaptureSettingsModalOpen] = useState(false);
  const [activeCaptureCardId, setActiveCaptureCardId] = useState<string | null>(null);

  // KYC OTP Modal States
  const [isKYCOTPModalOpen, setIsKYCOTPModalOpen] = useState(false);
  const [kycPhoneNumber, setKycPhoneNumber] = useState('2828');

  // UPI Verification Modal States
  const [isUPIModalOpen, setIsUPIModalOpen] = useState(false);

  // KYC Review Modal States
  const [isKYCReviewModalOpen, setIsKYCReviewModalOpen] = useState(false);
  const [isKYCModalTransitioning, setIsKYCModalTransitioning] = useState(false);

  // Success Animation State
  const [isSuccessAnimationOpen, setIsSuccessAnimationOpen] = useState(false);

  // Input Box States
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Sarah Flow State
  const [sarahFlowStep, setSarahFlowStep] = useState(0);

  // Maya Flow State
  const [mayaFlowStep, setMayaFlowStep] = useState(0);

  // Sam Flow State
  const [samFlowStep, setSamFlowStep] = useState(0);

  // Shyam Flow State
  const [shyamFlowStep, setShyamFlowStep] = useState(0);
  const [showFloatingImage, setShowFloatingImage] = useState(false);

  // Kiara Flow State
  const [kiaraFlowStep, setKiaraFlowStep] = useState(0);

  // Varun Flow State
  const [varunFlowStep, setVarunFlowStep] = useState(0);

  // KYC Onboarding Flow State
  const [kycFlowStep, setKycFlowStep] = useState(0);
  const [kycBusinessModel, setKycBusinessModel] = useState<string | undefined>(undefined);
  const [kycBankAccount, setKycBankAccount] = useState<string | undefined>(undefined);

  // KYC Details Panel State
  const [isKYCPanelSettled, setIsKYCPanelSettled] = useState(false);

  // Briefing Review Flow State
  const [briefingReviewHandled, setBriefingReviewHandled] = useState(false);

  // Streaming state - shows stop button while Ray is responding
  const [isStreaming, setIsStreaming] = useState(false);

  // Post-streaming glow state - shows SparkRipples behind input for 3-4s after streaming completes
  const [showPostStreamingGlow, setShowPostStreamingGlow] = useState(false);
  const wasStreamingRef = useRef(false);

  // Input ref for focus checking
  const inputRef = useRef<HTMLInputElement>(null);

  // Highlighted suggestion index for keyboard shortcut hover preview
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] = useState<number | null>(null);

  // Refs to prevent double execution in React StrictMode
  const demoFlowStartedRef = useRef(false);
  const sarahCaptureCardShownRef = useRef(false);

  // Rauno-inspired easing function: ease-out-expo for snappy, fluid feel
  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  // Custom smooth scroll with JavaScript animation for fluid, Rauno-inspired motion
  const smoothScrollTo = (container: HTMLElement, targetScrollTop: number, duration: number, onComplete?: () => void) => {
    const startScrollTop = container.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      container.scrollTop = startScrollTop + (distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        if (onComplete) {
          onComplete();
        }
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Helper function to scroll a message element to the top of the viewport
  // Used by VARUN_ELEGANT_SCROLL for smooth, sequenced scroll behavior
  // Uses custom JS animation for fluid, Rauno-inspired motion
  const scrollMessageToTop = (messageId: string, callback?: () => void) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const userMessageEl = messageRefs.current.get(messageId);
        const container = scrollContainerRef.current;
        if (userMessageEl && container) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = userMessageEl.getBoundingClientRect();
          const topOffset = 24;
          const targetScrollTop = Math.max(0, container.scrollTop + (elementRect.top - containerRect.top) - topOffset);

          // Use custom smooth scroll with 500ms duration for fluid feel
          smoothScrollTo(container, targetScrollTop, 500, callback);
        } else if (callback) {
          callback();
        }
      }, 50);
    });
  };


  // Detect when streaming ends and trigger post-streaming glow
  useEffect(() => {
    if (wasStreamingRef.current && !isStreaming) {
      // Streaming just ended, show glow behind input for 3.5s
      setShowPostStreamingGlow(true);
      const timer = setTimeout(() => {
        setShowPostStreamingGlow(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
    wasStreamingRef.current = isStreaming;
  }, [isStreaming]);

  // Trigger website question when KYC panel settles
  const kycWebsiteQuestionShownRef = useRef(false);
  useEffect(() => {
    if (isKYCPanelSettled && activeFlow === 'kyc_onboarding' && kycFlowStep === 3 && !kycWebsiteQuestionShownRef.current) {
      kycWebsiteQuestionShownRef.current = true;
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 'kyc-ai-4',
          sender: 'ai' as const,
          ...kycScript.kyc_step_4
        }]);
        setKycFlowStep(4);
      }, 800);
    }
  }, [isKYCPanelSettled, activeFlow, kycFlowStep]);

  // EXPERIMENTAL: Pin-to-top / Roll-up animation - scroll to show newest content
  useEffect(() => {
    if (!ENABLE_ROLL_UP_ANIMATION && !ENABLE_PIN_TO_TOP && !ENABLE_SMART_SCROLL_ON_THINKING) return;

    // Check if a new message was added
    if (messages.length > prevMessageCountRef.current) {
      const latestMessage = messages[messages.length - 1];

      // Skip auto-scroll if message has skipAutoScroll flag (used by Varun elegant scroll)
      if (latestMessage?.skipAutoScroll) {
        prevMessageCountRef.current = messages.length;
        return;
      }

      if (ENABLE_PIN_TO_TOP) {
        // In pin-to-top mode, always scroll to top to show newest content
        // (newest messages appear at top with flex-col-reverse)
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100);
      } else if (ENABLE_SMART_SCROLL_ON_THINKING && latestMessage?.sender === 'user') {
        // Smart scroll: When user sends a message, scroll it to the top of the viewport
        // This gives maximum room for Ray's response to appear below
        if (scrollContainerRef.current) {
          // Use requestAnimationFrame to ensure DOM is fully rendered
          requestAnimationFrame(() => {
            setTimeout(() => {
              const userMessageEl = messageRefs.current.get(latestMessage.id);
              const container = scrollContainerRef.current;
              if (userMessageEl && container) {
                // Calculate the element's position relative to the scroll container
                const containerRect = container.getBoundingClientRect();
                const elementRect = userMessageEl.getBoundingClientRect();

                // Calculate scroll position to put element near the top of container
                // Subtract a small offset (24px) for breathing room at the top
                const topOffset = 24;
                const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - topOffset;

                // Use smooth scroll with custom easing
                smoothScrollTo(container, Math.max(0, scrollTop), 600);
              }
            }, 100); // Reduced delay - scroll immediately when user message appears
          });
        }
      } else if (ENABLE_ROLL_UP_ANIMATION && latestMessage?.sender === 'user') {
        // Legacy roll-up: only scroll to top for user messages
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  // Keyboard shortcut listener for suggestions (1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only activate when input is not focused and no modifier keys
      if (isInputFocused || e.metaKey || e.ctrlKey || e.altKey) return;

      // Check for 1, 2, or 3 keys
      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= 3) {
        // Get suggestions from the last AI message
        const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai');
        if (!lastAiMessage) return;

        // Try to find suggestions in different artifact structures
        let suggestions: string[] = [];
        if (lastAiMessage.suggestions) {
          suggestions = lastAiMessage.suggestions;
        } else if (lastAiMessage.artifact?.data?.suggestions) {
          suggestions = lastAiMessage.artifact.data.suggestions;
        }

        // Get the corresponding suggestion (1-indexed)
        const suggestionIndex = keyNum - 1;
        if (suggestions[suggestionIndex]) {
          e.preventDefault();

          // Immediately populate the input box
          setInputValue(suggestions[suggestionIndex]);
          setIsInputFocused(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 50);

          // In parallel, show highlight on the suggestion for 260ms
          setHighlightedSuggestionIndex(suggestionIndex);
          setTimeout(() => {
            setHighlightedSuggestionIndex(null);
          }, 260);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInputFocused, messages]);

  // Query-based routing: Detect flow type from initialQuery and trigger appropriate flow
  useEffect(() => {
    if (messages.length === 0 && initialQuery && !demoFlowStartedRef.current) {
      const flowType = detectFlowType(initialQuery);
      if (flowType) {
        demoFlowStartedRef.current = true;
        setActiveFlow(flowType);

        // Use setTimeout to ensure state updates have propagated
        setTimeout(() => {
          // Route to appropriate flow based on detected type
          switch (flowType) {
            case 'kyc_onboarding':
              // Show OTP verification step (step 1)
              startKYCFlow(initialQuery, false);
              break;
            case 'settlement':
              startSettlementFlow(initialQuery);
              break;
            case 'double_debit':
              startDoubleDebitFlow(initialQuery);
              break;
            case 'refund':
              startRefundFlow(initialQuery);
              break;
            case 'support':
              startSupportFlow(initialQuery);
              break;
            case 'failed_payment':
              startFailedPaymentFlow(initialQuery);
              break;
            default:
              // Generic query - show simple response
              break;
          }
        }, 100);
      }
    }
  }, [initialQuery, messages.length]);

  // Settlement flow (formerly Varun)
  const startSettlementFlow = (query: string) => {
    const userText = query || "What is my upcoming settlement?";
    const userMessageId = 'settlement-u1';

    setTimeout(() => {
      setMessages([{
        id: userMessageId,
        sender: 'user',
        blocks: [{ type: 'text', content: userText }],
        skipAutoScroll: true
      }]);
      setVarunFlowStep(1);

      setTimeout(() => {
        scrollMessageToTop(userMessageId, () => {
          setIsStreaming(true);
          const thinkingMsg: RayResponseData = {
            id: 'settlement-ai-1',
            sender: 'ai',
            isThinking: true,
            skipAutoScroll: true
          };
          setMessages(prev => [...prev, thinkingMsg]);

          setTimeout(() => {
            setMessages(prev => prev.map(msg =>
              msg.id === 'settlement-ai-1' ? {
                ...varunScript.varun_step_1,
                id: 'settlement-ai-1',
                sender: 'ai' as const
              } : msg
            ));
            setTimeout(() => setIsStreaming(false), 3000);
          }, 15000);
        });
      }, 100);
    }, 600);
  };

  // Double debit flow (formerly Maya)
  const startDoubleDebitFlow = (query: string) => {
    const userText = query || "Show me recent payments from arvind@gmail.com";

    setTimeout(() => {
      setMessages([{
        id: 'double-debit-u1',
        sender: 'user',
        blocks: [{ type: 'text', content: userText }]
      }]);
      setMayaFlowStep(1);

      setTimeout(() => {
        setIsStreaming(true);
        const thinkingMsg: RayResponseData = {
          id: 'double-debit-ai-1',
          sender: 'ai',
          isThinking: true
        };
        setMessages(prev => [...prev, thinkingMsg]);

        setTimeout(() => {
          setMessages(prev => prev.map(msg =>
            msg.id === 'double-debit-ai-1' ? {
              ...mayaScript.maya_step_1,
              id: 'double-debit-ai-1',
              sender: 'ai' as const
            } : msg
          ));
          setTimeout(() => setIsStreaming(false), 3000);
        }, 15000);
      }, 600);
    }, 600);
  };

  // KYC Onboarding flow
  const startKYCFlow = (query: string, skipPhone: boolean = false) => {
    const userText = query || "Start KYC onboarding";

    setTimeout(() => {
      // If skipInitialUserMessage is true, don't show user query
      if (!skipInitialUserMessage) {
        setMessages([{
          id: 'kyc-u1',
          sender: 'user',
          blocks: [{ type: 'text', content: userText }]
        }]);
      }

      // If phone verification was already done on landing page, skip to documents step
      if (skipPhone) {
        setKycFlowStep(3);
        setActiveFlow('kyc_onboarding');

        setTimeout(() => {
          setMessages(prev => skipInitialUserMessage ? [{
            ...kycScript.kyc_step_3,
            id: 'kyc-ai-3',
            sender: 'ai' as const
          }] : [...prev, {
            ...kycScript.kyc_step_3,
            id: 'kyc-ai-3',
            sender: 'ai' as const
          }]);
        }, skipInitialUserMessage ? 300 : 800);
      } else {
        setKycFlowStep(1);
        setActiveFlow('kyc_onboarding');

        setTimeout(() => {
          setMessages(prev => skipInitialUserMessage ? [{
            ...kycScript.kyc_step_1,
            id: 'kyc-ai-1',
            sender: 'ai' as const
          }] : [...prev, {
            ...kycScript.kyc_step_1,
            id: 'kyc-ai-1',
            sender: 'ai' as const
          }]);
        }, skipInitialUserMessage ? 300 : 800);
      }
    }, skipInitialUserMessage ? 100 : 600);
  };

  // Refund flow (formerly Sarah)
  const startRefundFlow = (query: string) => {
    const userText = query || "My customer called and said payment was refunded. I didn't initiate this.";

    setTimeout(() => {
      setMessages([{
        id: 'refund-u1',
        sender: 'user',
        blocks: [{ type: 'text', content: userText }]
      }]);
      setSarahFlowStep(1);

      setTimeout(() => {
        setIsStreaming(true);
        const thinkingMsg: RayResponseData = {
          id: 'refund-ai-1',
          sender: 'ai',
          isThinking: true
        };
        setMessages(prev => [...prev, thinkingMsg]);

        setTimeout(() => {
          setMessages(prev => prev.map(msg =>
            msg.id === 'refund-ai-1' ? {
              ...sarahScript.sarah_step_1,
              id: 'refund-ai-1',
              sender: 'ai' as const
            } : msg
          ));
          setSarahFlowStep(1);
        }, 15000);
      }, 600);
    }, 600);
  };

  // Support flow (formerly Sam)
  const startSupportFlow = (query: string) => {
    const userText = query || "What's the status of my last ticket";

    setTimeout(() => {
      setMessages([{
        id: 'support-u1',
        sender: 'user',
        blocks: [{ type: 'text', content: userText }]
      }]);
      setSamFlowStep(1);

      setTimeout(() => {
        setIsStreaming(true);
        const thinkingMsg: RayResponseData = {
          id: 'support-ai-1',
          sender: 'ai',
          isThinking: true
        };
        setMessages(prev => [...prev, thinkingMsg]);

        setTimeout(() => {
          setMessages(prev => prev.map(msg =>
            msg.id === 'support-ai-1' ? {
              ...samScript.sam_step_1,
              id: 'support-ai-1',
              sender: 'ai' as const
            } : msg
          ));
          setTimeout(() => setIsStreaming(false), 3000);
        }, 15000);
      }, 600);
    }, 600);
  };

  // Failed payment flow (formerly Shyam) - image-based
  const startFailedPaymentFlow = (query: string) => {
    setShowFloatingImage(true);
  };


  // Handle floating image drop - adds image to chat and starts Shyam flow
  const handleFloatingImageDrop = useCallback(() => {
    setShowFloatingImage(false);

    const userText = initialQuery || '';
    const blocks: { type: string; content: string }[] = [];

    // Add text block if user typed something
    if (userText.trim()) {
      blocks.push({ type: 'text', content: userText });
    }
    // Add image attachment
    blocks.push({ type: 'image', content: '/screenshot-failed-payment.png' });

    setMessages([{
        id: 'shyam-u1',
        sender: 'user',
        blocks
    }]);
    setShyamFlowStep(1);

    // Step 2: Show Thinking State
    setTimeout(() => {
        setIsStreaming(true);
        const thinkingMsg: RayResponseData = {
            id: 'shyam-ai-1',
            sender: 'ai',
            isThinking: true
        };
        setMessages(prev => [...prev, thinkingMsg]);

        // Step 3: Replace with Failed Payment Diagnosis after delay
        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === 'shyam-ai-1' ? {
                    ...shyamScript.shyam_step_1,
                    id: 'shyam-ai-1',
                    sender: 'ai' as const
                } : msg
            ));
            setTimeout(() => setIsStreaming(false), 3000);
        }, 15000); // 15s thinking time
    }, 600);
  }, [initialQuery, shyamScript]);


  // Triggers for briefing review queries (from "Review with Ray" click)
  useEffect(() => {
    if (!initialQuery || briefingReviewHandled || messages.length > 0) return;

    // Check if this is a briefing review query
    const isBriefingReview =
      initialQuery.includes("refunds and disputes") ||
      initialQuery.includes("refund volume") ||
      initialQuery.includes("refund volumes") ||
      initialQuery.includes("payment timeouts") ||
      initialQuery.includes("payment methods") ||
      initialQuery.includes("Cards vs UPI");

    if (!isBriefingReview) return;

    setBriefingReviewHandled(true);

    // Determine which response to show based on query
    let response: any;
    if (initialQuery.includes("summary") || initialQuery.includes("so far today")) {
      response = briefingReviewResponses.refunds_summary;
    } else if (initialQuery.includes("refund volume") || initialQuery.includes("refund volumes")) {
      response = briefingReviewResponses.refunds_summary;
    } else if (initialQuery.includes("payment timeouts")) {
      response = briefingReviewResponses.payment_timeouts;
    } else if (initialQuery.includes("payment methods") || initialQuery.includes("Cards vs UPI")) {
      response = briefingReviewResponses.payment_methods;
    }

    if (!response) return;

    // Step 1: Show user message
    setTimeout(() => {
      setMessages([{
        id: 'briefing-u1',
        sender: 'user',
        blocks: [{ type: 'text', content: initialQuery }]
      }]);

      // Step 2: Show thinking state
      setTimeout(() => {
        const thinkingMsg: RayResponseData = {
          id: 'briefing-ai-1',
          sender: 'ai',
          isThinking: true
        };
        setMessages(prev => [...prev, thinkingMsg]);

        // Step 3: Replace with response
        setTimeout(() => {
          setMessages(prev => prev.map(msg =>
            msg.id === 'briefing-ai-1' ? {
              ...response,
              id: 'briefing-ai-1',
              sender: 'ai' as const
            } : msg
          ));
        }, 15000); // 15s thinking time
      }, 600);
    }, 400);
  }, [initialQuery, briefingReviewHandled, messages.length, briefingReviewResponses]);

  // Gemini-style scroll: NO auto-scroll during AI streaming
  // User message is already scrolled to top by the smart scroll effect above
  // We intentionally don't scroll during AI response to enable easy reading
  const prevAiScrollLengthRef = useRef(0);
  useEffect(() => {
    prevAiScrollLengthRef.current = messages.length;
  }, [messages.length]);

  // Handle Scroll to toggle button visibility
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Show button if we are not at the bottom (with 50px buffer)
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShowScrollButton(!isAtBottom);
  };

  // Scroll to next response logic
  const scrollToNext = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const currentBottom = container.scrollTop + container.clientHeight;
    
    // Find the first message that ends below the current viewport
    const nextMessage = messages.find(msg => {
      const el = messageRefs.current.get(msg.id);
      if (!el) return false;
      // 5px buffer
      return el.offsetTop + el.offsetHeight > currentBottom + 5; 
    });

    if (nextMessage) {
      const el = messageRefs.current.get(nextMessage.id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      // Fallback: just scroll to very bottom
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  // Check scroll button visibility when messages change (e.g. new message arrives but is offscreen)
  useEffect(() => {
    handleScroll();
  }, [messages]);

  // Check for "Add Funds" or "Payment Link" in input
  useEffect(() => {
    const lowerInput = inputValue.toLowerCase();

    if (lowerInput.includes('add funds')) {
      setShowAddFundsWidget(true);
    }

    // Check for payment link intent
    if (lowerInput.includes('payment link') || lowerInput.includes('create link')) {
      const prefill = parsePaymentLinkIntent(inputValue);
      if (prefill) {
        setPaymentLinkPrefill(prefill);
        setIsPaymentLinkModalOpen(true);
      }
    }
  }, [inputValue]);

  // Handler for when refund flow's investigation report finishes streaming (formerly Sarah)
  const handleSarahStreamComplete = useCallback(() => {
    if (activeFlow !== 'refund' || sarahCaptureCardShownRef.current) return;
    sarahCaptureCardShownRef.current = true;

    // Show capture card after a brief delay for visual breathing room
    setTimeout(() => {
      const captureCardId = `capture-card-${Date.now()}`;
      setActiveCaptureCardId(captureCardId);
      setMessages(prev => [...prev, {
        id: captureCardId,
        sender: 'ai' as const,
        headline: "Let's update your payment capture settings",
        subtext: "I've prepared a quick setup to change how you capture payments. Review the settings and confirm when ready.",
        artifact: {
          type: 'capture_settings_form_card' as const,
          data: {
            formId: captureCardId,
            status: 'draft' as const,
            currentSetting: 'manual',
            isLoading: false
          }
        }
      }]);
      setIsStreaming(false);
    }, 500);
  }, [activeFlow]);

  const handleSuggestionClick = (suggestion: string) => {
    // Handle "That's all for now" - navigate back to home
    if (suggestion.toLowerCase().includes("that's all")) {
      onGoHome?.();
      return;
    }

    // Handle KYC OTP verification
    if (suggestion === 'verify_otp' || suggestion.toLowerCase().includes('verify with an otp')) {
      setIsKYCOTPModalOpen(true);
      return;
    }

    // Handle KYC flow progression
    if (activeFlow === 'kyc_onboarding') {
      // Handle website URL submission
      if (suggestion.startsWith('website:')) {
        const websiteUrl = suggestion.replace('website:', '');
        setMessages(prev => [...prev, {
          id: `kyc-u-website`,
          sender: 'user' as const,
          blocks: [{ type: 'text', content: websiteUrl }]
        }]);

        // Show business category loading state
        setTimeout(() => {
          const loadingId = 'kyc-business-loading';
          setMessages(prev => [...prev, {
            id: loadingId,
            sender: 'ai' as const,
            isBusinessCategoryLoading: true
          }]);

          // After loading completes (8 seconds = 4 steps * 2 seconds), show business category card
          setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== loadingId));
            setMessages(prev => [...prev, {
              id: `kyc-business-category`,
              sender: 'ai' as const,
              artifact: {
                type: 'business_category_card' as const,
                data: {
                  category: 'E Commerce',
                  subCategory: 'Fashion Retailer'
                }
              }
            }]);
            setKycFlowStep(4.5); // Intermediate step for category confirmation
          }, 8500); // 8 seconds for steps + 500ms buffer
        }, 600);
        return;
      }

      // Handle category confirmation
      if (suggestion === 'confirm_category') {
        setMessages(prev => [...prev, {
          id: `kyc-u-confirm`,
          sender: 'user' as const,
          blocks: [{ type: 'text', content: 'Confirm' }]
        }]);

        // Update business model in KYC panel
        setKycBusinessModel('E-commerce, Fashion');

        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `kyc-ai-5`,
            sender: 'ai' as const,
            ...kycScript.kyc_step_5
          }]);
          setKycFlowStep(5);
        }, 800);
        return;
      }

      // Handle bank verification via UPI
      if (suggestion === 'verify_bank_upi') {
        setIsUPIModalOpen(true);
        return;
      }

      // Handle review details
      if (suggestion === 'Review details') {
        setIsKYCReviewModalOpen(true);
        return;
      }

      // Handle category change
      if (suggestion === 'change_category') {
        setMessages(prev => [...prev, {
          id: `kyc-u-change`,
          sender: 'user' as const,
          blocks: [{ type: 'text', content: 'Change' }]
        }]);

        // TODO: Show category selection UI
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `kyc-ai-change-response`,
            sender: 'ai' as const,
            artifact: {
              type: 'simple_text',
              data: {
                headline: "Let's update your business category",
                body: "What type of business do you run?",
                suggestions: []
              }
            }
          }]);
        }, 600);
        return;
      }

      // Handle skip website
      if (suggestion === 'skip_website') {
        setMessages(prev => [...prev, {
          id: `kyc-u-skip-website`,
          sender: 'user' as const,
          blocks: [{ type: 'text', content: 'Skip for now' }]
        }]);
        // TODO: Alternative flow without website
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `kyc-ai-4-no-website`,
            sender: 'ai' as const,
            ...kycScript.kyc_step_4_no_website
          }]);
          setKycFlowStep(4.5); // Alternative path
        }, 800);
        return;
      }
    }

    // Handle Arjun's Add Funds suggestion
    if (suggestion.toLowerCase().includes('add funds')) {
      // Extract amount: "Add funds worth ₹46,000"
      const match = suggestion.match(/₹([0-9,]+)/);
      const amount = match ? match[1].replace(/,/g, '') : ''; // 46000

      setWidgetAmount(amount); // This will pass '46000' which widget formats as needed
      setShowAddFundsWidget(true);
      return;
    }

    // Handle refund flow transitions (formerly Sarah)
    if (activeFlow === 'refund') {
      // Handle "Yes" button click
      if (suggestion === 'Yes') {
        if (sarahFlowStep === 2) {
          // Transition from step 2 to step 3 (payment links created)
          handleSarahFlowAdvance("Yes", sarahScript.sarah_step_3, 3);
        } else if (sarahFlowStep === 3) {
          // Transition from step 3 to step 4 (notifications enabled)
          handleSarahFlowAdvance("Yes", sarahScript.sarah_step_4, 4);
        }
        return;
      }

      // Handle "Not now" button click
      if (suggestion === 'Not now') {
        // Show dismissal message and end flow
        setMessages(prev => [...prev, {
          id: `sarah-u-${Date.now()}`,
          sender: 'user',
          blocks: [{ type: 'text', content: 'Not now' }]
        }]);

        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `sarah-ai-dismiss-${Date.now()}`,
            sender: 'ai',
            artifact: {
              type: 'simple_text',
              data: {
                headline: "No problem!",
                body: "I'll be here whenever you need help. Feel free to ask me anything about your payments or account settings.",
                suggestions: []
              }
            }
          }]);
        }, 600);
        return;
      }

      // Handle suggestion clicks that trigger auto-capture flow
      if (sarahFlowStep === 1 && (
        suggestion.toLowerCase().includes('auto-capture') ||
        suggestion.toLowerCase().includes('change payment')
      )) {
        handleSarahFlowAdvance(suggestion, sarahScript.sarah_step_2, 2);
        return;
      }
    }

    // Handle double debit flow transitions (formerly Maya)
    if (activeFlow === 'double_debit') {
      // Step 1 → Step 2: "He claims double debit"
      if (mayaFlowStep === 1 && suggestion.toLowerCase().includes('double debit')) {
        handleMayaFlowAdvance(suggestion, mayaScript.maya_step_2, 2);
        return;
      }

      // Step 2 → Step 3: "Draft explanation for Arvind"
      if (mayaFlowStep === 2 && suggestion.toLowerCase().includes('draft')) {
        handleMayaFlowAdvance(suggestion, mayaScript.maya_step_3, 3);
        return;
      }

      // Step 3: Handle draft message actions
      if (mayaFlowStep === 3) {
        if (suggestion.toLowerCase().includes('copy')) {
          // Copy the draft message to clipboard
          const draftMessage = mayaScript.maya_step_3.artifact.data.draftMessage;
          navigator.clipboard.writeText(draftMessage);
          return;
        }
      }
    }

    // Handle support flow transitions (formerly Sam)
    if (activeFlow === 'support') {
      // Handle "Escalate" button click
      if (samFlowStep === 1 && suggestion === 'Escalate') {
        handleSamFlowAdvance("Escalate", samScript.sam_step_2, 2);
        return;
      }

      // Handle suggestion clicks that trigger escalation
      if (samFlowStep === 1 && suggestion.toLowerCase().includes('escalate')) {
        handleSamFlowAdvance(suggestion, samScript.sam_step_2, 2);
        return;
      }
    }

    // Handle failed payment flow transitions (formerly Shyam)
    if (activeFlow === 'failed_payment') {
      // Handle "create payment link" suggestion
      if (shyamFlowStep === 1 && suggestion.toLowerCase().includes('payment link')) {
        // First record the user's message in the chat stream
        setMessages(prev => [...prev, {
          id: `shyam-u-${Date.now()}`,
          sender: 'user',
          blocks: [{ type: 'text', content: suggestion }]
        }]);

        // Show Ray's thinking animation
        setTimeout(() => {
          setIsStreaming(true);
          const thinkingId = `shyam-thinking-${Date.now()}`;
          setMessages(prev => [...prev, {
            id: thinkingId,
            sender: 'ai',
            isThinking: true
          }]);

          // After 15 seconds (ChainOfThought duration), remove thinking and show mini-card with skeleton
          setTimeout(() => {
            const formCardId = `form-card-${Date.now()}`;
            setActiveFormCardId(formCardId);

            // Set prefill data
            const prefillData: PaymentLinkPrefill = {
              amount: '15000',
              purpose: 'Payment retry for failed transaction',
              email: 'rahul@gmail.com'
            };
            setPaymentLinkPrefill(prefillData);

            // Remove thinking, add mini-card artifact
            // The artifact handles its own streaming phases (headline → subtext → card)
            // Modal opens automatically via onMiniCardAnimationComplete callback
            setMessages(prev => {
              const filtered = prev.filter(m => m.id !== thinkingId);
              return [...filtered, {
                id: formCardId,
                sender: 'ai' as const,
                artifact: {
                  type: 'payment_link_form_card' as const,
                  data: {
                    formId: formCardId,
                    status: 'draft' as const,
                    prefill: prefillData,
                    isLoading: false, // Let artifact handle reveal via streaming phases
                    headline: "I'll create a payment link for Rahul",
                    subtext: "Based on the failed transaction, I've pre-filled the details. You can review and adjust before sending.",
                    suggestions: ['Send this link via WhatsApp', 'Send this link via Email', 'View all payment links']
                  }
                }
              }];
            });

            setIsStreaming(false);
          }, 15000);
        }, 300);
        return;
      }
    }

    // Handle settlement flow transitions (formerly Varun)
    if (activeFlow === 'settlement') {
      // Step 1 → Step 2: "But I have 3L more in my account"
      if (varunFlowStep === 1 && (
        suggestion.toLowerCase().includes('3l more') ||
        suggestion.toLowerCase().includes('more in my account') ||
        suggestion.toLowerCase().includes('when will that be settled')
      )) {
        handleVarunFlowAdvance(suggestion, varunScript.varun_step_2, 2);
        return;
      }

      // Step 2 → Step 3: "Instantly settle" button click
      if (varunFlowStep === 2 && (
        suggestion.toLowerCase().includes('instantly settle')
      )) {
        handleVarunFlowAdvance(suggestion, varunScript.varun_step_3, 3);
        return;
      }

      // Step 3 → Step 4: "Settle now" button click
      if (varunFlowStep === 3 && (
        suggestion.toLowerCase().includes('settle now')
      )) {
        handleVarunFlowAdvance(suggestion, varunScript.varun_step_4, 4);
        return;
      }

      // Step 3 → Cancel: User cancels instant settlement
      if (varunFlowStep === 3 && suggestion.toLowerCase() === 'cancel') {
        // Just dismiss, don't advance
        return;
      }

      // Step 4 → Step 5: "Enable Early Settlements"
      if (varunFlowStep === 4 && (
        suggestion.toLowerCase().includes('early settlements') ||
        suggestion.toLowerCase().includes('enable early')
      )) {
        handleVarunFlowAdvance(suggestion, varunScript.varun_step_5, 5);
        return;
      }

      // Handle "No" button click at step 4
      if (varunFlowStep === 4 && suggestion === 'No') {
        setMessages(prev => [...prev, {
          id: `varun-u-${Date.now()}`,
          sender: 'user',
          blocks: [{ type: 'text', content: 'No' }]
        }]);

        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `varun-ai-dismiss-${Date.now()}`,
            sender: 'ai',
            artifact: {
              type: 'simple_text',
              data: {
                headline: "No problem!",
                body: "Your regular T+2 settlements will continue as scheduled. You can enable Instant Settlements anytime from Settings → Settlements.",
                suggestions: ["View settlement schedule", "Learn more about Instant Settlements"]
              }
            }
          }]);
        }, 600);
        return;
      }
    }
  };

  // Helper function to advance Sarah's flow
  const handleSarahFlowAdvance = (userMessage: string, nextStep: any, nextFlowStep: number) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: `sarah-u-${Date.now()}`,
      sender: 'user',
      blocks: [{ type: 'text', content: userMessage }]
    }]);

    // Show thinking state
    setTimeout(() => {
      setIsStreaming(true);
      const thinkingId = `sarah-ai-thinking-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: thinkingId,
        sender: 'ai',
        isThinking: true
      }]);

      // Replace with next step response
      setTimeout(() => {
        setMessages(prev => {
          const withoutThinking = prev.filter(m => !m.isThinking);
          return [...withoutThinking, {
            ...nextStep,
            id: `sarah-ai-${Date.now()}`,
            sender: 'ai' as const
          }];
        });
        setSarahFlowStep(nextFlowStep);
        setTimeout(() => setIsStreaming(false), 3000);
      }, 1500);
    }, 600);
  };

  // Helper function to generate contextual responses for questions asked during payment link flow
  const getContextualResponse = (question: string): string => {
    const q = question.toLowerCase();
    const followUp = '\n\nWould you like to continue creating your payment link?';

    if (q.includes('expire') || q.includes('expiry') || q.includes('valid')) {
      return 'Payment links can be set to expire after a specific date, or you can choose "No Expiry" to keep them active indefinitely. The customer can pay anytime before the expiry date.' + followUp;
    }
    if (q.includes('partial') || q.includes('part payment')) {
      return 'Enabling partial payments allows your customer to pay a portion of the total amount. This is useful for installment-based collections or when customers want flexibility in payment.' + followUp;
    }
    if (q.includes('notify') || q.includes('email') || q.includes('sms')) {
      return 'You can automatically notify your customer via Email or SMS when the payment link is created. They\'ll receive the link directly and can pay with one click.' + followUp;
    }
    if (q.includes('fee') || q.includes('charge') || q.includes('cost')) {
      return 'Standard payment link transactions have a fee of 2% per transaction. There are no additional charges for creating or sharing payment links.' + followUp;
    }
    if (q.includes('refund')) {
      return 'Yes, payments collected via payment links can be refunded. You can initiate a full or partial refund from your Razorpay dashboard within 180 days of the transaction.' + followUp;
    }

    return 'Great question! Payment links are a simple way to collect payments without any coding. Just create a link, share it with your customer, and they can pay using any method they prefer.' + followUp;
  };

  // Helper function to generate contextual responses for questions asked during add funds flow
  const getAddFundsContextualResponse = (question: string): string => {
    const q = question.toLowerCase();
    const followUp = '\n\nWould you like to continue adding funds?';

    if (q.includes('upi') || q.includes('how')) {
      return 'Adding funds via UPI is instant and secure. Once you confirm, a UPI payment request will be generated. You can complete it using any UPI app like Google Pay, PhonePe, or Paytm.' + followUp;
    }
    if (q.includes('fee') || q.includes('charge') || q.includes('cost')) {
      return 'There are no additional fees for adding funds via UPI. The full amount you add will be credited to your Razorpay balance.' + followUp;
    }
    if (q.includes('time') || q.includes('long') || q.includes('instant')) {
      return 'UPI transfers are instant! Once you complete the payment in your UPI app, the funds will be credited to your Razorpay balance within seconds.' + followUp;
    }
    if (q.includes('limit') || q.includes('maximum') || q.includes('minimum')) {
      return 'You can add anywhere from ₹1 to ₹1,00,000 per transaction via UPI. For larger amounts, you may need to do multiple transactions or use NEFT/RTGS.' + followUp;
    }
    if (q.includes('safe') || q.includes('secure')) {
      return 'Absolutely! UPI is one of the most secure payment methods. All transactions are encrypted and protected by your UPI PIN. Razorpay is also PCI-DSS compliant.' + followUp;
    }

    return 'Adding funds to your Razorpay balance helps ensure smooth settlements and instant refunds for your customers. You can add any amount via UPI instantly.' + followUp;
  };

  // Handle input submission
  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;

    const text = inputValue.toLowerCase();
    const userQuestion = inputValue;

    // KYC Flow: Handle website URL input at step 4
    if (activeFlow === 'kyc_onboarding' && kycFlowStep === 4) {
      // Check if input looks like a URL or skip command
      if (text.includes('skip') || text.includes('later')) {
        handleSuggestionClick('skip_website');
        setInputValue('');
        return;
      } else if (text.includes('.com') || text.includes('.in') || text.includes('.co') || text.includes('http')) {
        // Treat as website URL
        handleSuggestionClick(`website:${userQuestion}`);
        setInputValue('');
        return;
      }
    }

    // Query-based routing: Detect flow type from input and trigger appropriate flow
    const detectedFlow = detectFlowType(text);
    if (detectedFlow && activeFlow !== detectedFlow && messages.length === 0) {
      setInputValue('');
      setActiveFlow(detectedFlow);
      demoFlowStartedRef.current = false;

      // Trigger the flow
      switch (detectedFlow) {
        case 'settlement':
          startSettlementFlow(userQuestion);
          break;
        case 'double_debit':
          startDoubleDebitFlow(userQuestion);
          break;
        case 'refund':
          startRefundFlow(userQuestion);
          break;
        case 'support':
          startSupportFlow(userQuestion);
          break;
        case 'failed_payment':
          startFailedPaymentFlow(userQuestion);
          break;
      }
      return;
    }

    // Handle question while payment link modal is open
    if (isPaymentLinkModalOpen) {
      // Capture prefill data before closing modal - use field-level fallbacks
      const savedPrefill = {
        amount: paymentLinkPrefill?.amount || '15000',
        purpose: paymentLinkPrefill?.purpose || 'Payment retry for failed transaction',
        email: paymentLinkPrefill?.email || 'rahul@gmail.com'
      };

      setInputValue('');
      setIsPaymentLinkModalOpen(false);

      // Add user's question to chat
      setMessages(prev => [...prev, {
        id: `user-q-${Date.now()}`,
        sender: 'user',
        blocks: [{ type: 'text', content: userQuestion }]
      }]);

      // Show thinking state
      setTimeout(() => {
        setIsStreaming(true);
        const thinkingId = `ai-thinking-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: thinkingId,
          sender: 'ai',
          isThinking: true
        }]);

        // Show combined response with text + mini card (single message)
        setTimeout(() => {
          const continueCardId = `continue-card-${Date.now()}`;
          setActiveFormCardId(continueCardId);
          setMessages(prev => {
            const withoutThinking = prev.filter(m => !m.isThinking);
            return [...withoutThinking, {
              id: continueCardId,
              sender: 'ai' as const,
              artifact: {
                type: 'payment_link_form_card' as const,
                data: {
                  formId: continueCardId,
                  headline: 'Happy to help!',
                  subtext: getContextualResponse(userQuestion),
                  status: 'draft' as const,
                  prefill: savedPrefill,
                  isLoading: false,
                  suggestions: [
                    'What happens after payment?',
                    'Can I track this payment?',
                    'Send payment reminder'
                  ]
                }
              }
            }];
          });
          setIsStreaming(false);
        }, 1500);
      }, 300);

      return;
    }

    // Handle question while Add Funds widget is open
    if (showAddFundsWidget) {
      // Capture widget data before closing
      const savedAddFundsData = {
        amount: widgetAmount || '46000',
        purpose: ''
      };

      setInputValue('');
      setShowAddFundsWidget(false);

      // Add user's question to chat
      setMessages(prev => [...prev, {
        id: `user-q-${Date.now()}`,
        sender: 'user',
        blocks: [{ type: 'text', content: userQuestion }]
      }]);

      // Show thinking state
      setTimeout(() => {
        setIsStreaming(true);
        const thinkingId = `ai-thinking-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: thinkingId,
          sender: 'ai',
          isThinking: true
        }]);

        // Show response after delay
        setTimeout(() => {
          setMessages(prev => {
            const withoutThinking = prev.filter(m => !m.isThinking);
            return [...withoutThinking, {
              id: `ai-response-${Date.now()}`,
              sender: 'ai' as const,
              artifact: {
                type: 'simple_text',
                data: {
                  headline: 'Happy to help!',
                  body: getAddFundsContextualResponse(userQuestion),
                }
              }
            }];
          });
          setIsStreaming(false);

          // Show settlement card to continue after response has fully streamed (7s delay)
          setTimeout(() => {
            const continueCardId = `continue-add-funds-${Date.now()}`;
            setMessages(prev => [...prev, {
              id: continueCardId,
              sender: 'ai' as const,
              artifact: {
                type: 'settlement_card' as const,
                data: {
                  amount: savedAddFundsData.amount ? new Intl.NumberFormat('en-IN').format(parseInt(savedAddFundsData.amount)) : '46,000',
                  date: 'Will deposit tomorrow 10:00 AM',
                  step: 1
                }
              }
            }]);
          }, 7000);
        }, 1500);
      }, 300);

      return;
    }

    // Handle question while Capture Settings modal is open
    if (isCaptureSettingsModalOpen) {
      setInputValue('');
      setIsCaptureSettingsModalOpen(false);

      // Add user's question to chat
      setMessages(prev => [...prev, {
        id: `user-q-${Date.now()}`,
        sender: 'user',
        blocks: [{ type: 'text', content: userQuestion }]
      }]);

      // Show thinking state
      setTimeout(() => {
        setIsStreaming(true);
        const thinkingId = `ai-thinking-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: thinkingId,
          sender: 'ai',
          isThinking: true
        }]);

        // Show response after delay
        setTimeout(() => {
          const followUp = '\n\nWould you like to continue with the capture settings?';
          let response = 'Auto-capture automatically captures authorized payments, so you never miss a sale. Manual capture gives you more control but requires action within the capture window.' + followUp;

          const q = userQuestion.toLowerCase();
          if (q.includes('auto')) {
            response = 'Auto-capture is the recommended setting for most businesses. It automatically captures payments as soon as they are authorized, ensuring you never miss a sale due to uncaptured payments.' + followUp;
          } else if (q.includes('manual')) {
            response = 'Manual capture gives you control over when payments are captured. This is useful if you need to verify orders before capturing payment, but be careful - uncaptured payments are automatically refunded after the capture window.' + followUp;
          } else if (q.includes('window') || q.includes('time')) {
            response = 'The capture window determines how long you have to capture a manually authorized payment. If not captured within this time, the payment is automatically refunded to the customer.' + followUp;
          }

          setMessages(prev => {
            const withoutThinking = prev.filter(m => !m.isThinking);
            return [...withoutThinking, {
              id: `ai-response-${Date.now()}`,
              sender: 'ai' as const,
              artifact: {
                type: 'simple_text',
                data: {
                  headline: 'Happy to help!',
                  body: response,
                }
              }
            }];
          });
          setIsStreaming(false);

          // Show mini card to continue after response has fully streamed
          setTimeout(() => {
            const continueCardId = `capture-card-${Date.now()}`;
            setActiveCaptureCardId(continueCardId);
            setMessages(prev => [...prev, {
              id: continueCardId,
              sender: 'ai' as const,
              headline: "Ready to continue with your capture settings?",
              subtext: "Click the card below to open the settings and make your changes.",
              artifact: {
                type: 'capture_settings_form_card' as const,
                data: {
                  formId: continueCardId,
                  status: 'draft' as const,
                  currentSetting: 'manual',
                  isLoading: false
                }
              }
            }]);
          }, 7000);
        }, 1500);
      }, 300);

      return;
    }

    // Double debit flow: Handle "double debit" input
    if (activeFlow === 'double_debit' && mayaFlowStep === 1 && text.includes('double debit')) {
      setInputValue('');
      handleMayaFlowAdvance(inputValue, mayaScript.maya_step_2, 2);
      return;
    }

    // Double debit flow: Handle "draft" input
    if (activeFlow === 'double_debit' && mayaFlowStep === 2 && text.includes('draft')) {
      setInputValue('');
      handleMayaFlowAdvance(inputValue, mayaScript.maya_step_3, 3);
      return;
    }

    // Settlement flow: Handle "3L more" input (But I have 3L more in my account)
    if (activeFlow === 'settlement' && varunFlowStep === 1 && (text.includes('3l') || text.includes('more in my account'))) {
      setInputValue('');
      handleVarunFlowAdvance(inputValue, varunScript.varun_step_2, 2);
      return;
    }

    // Settlement flow: Handle "instantly" input (Instantly settle)
    if (activeFlow === 'settlement' && varunFlowStep === 2 && text.includes('instantly')) {
      setInputValue('');
      handleVarunFlowAdvance(inputValue, varunScript.varun_step_3, 3);
      return;
    }

    // Settlement flow: Handle "settle now" input
    if (activeFlow === 'settlement' && varunFlowStep === 3 && text.includes('settle now')) {
      setInputValue('');
      handleVarunFlowAdvance(inputValue, varunScript.varun_step_4, 4);
      return;
    }

    // Settlement flow: Handle "early settlements" input
    if (activeFlow === 'settlement' && varunFlowStep === 4 && text.includes('early')) {
      setInputValue('');
      handleVarunFlowAdvance(inputValue, varunScript.varun_step_5, 5);
      return;
    }

    // Default: Just echo back the input as user message (for demo purposes)
    setInputValue('');
  };

  // Helper function to advance Maya's flow
  const handleMayaFlowAdvance = (userMessage: string, nextStep: any, nextFlowStep: number) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: `maya-u-${Date.now()}`,
      sender: 'user',
      blocks: [{ type: 'text', content: userMessage }]
    }]);

    // Show thinking state
    setTimeout(() => {
      setIsStreaming(true);
      const thinkingId = `maya-ai-thinking-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: thinkingId,
        sender: 'ai',
        isThinking: true
      }]);

      // Replace with next step response
      setTimeout(() => {
        setMessages(prev => {
          const withoutThinking = prev.filter(m => !m.isThinking);
          return [...withoutThinking, {
            ...nextStep,
            id: `maya-ai-${Date.now()}`,
            sender: 'ai' as const
          }];
        });
        setMayaFlowStep(nextFlowStep);
        setTimeout(() => setIsStreaming(false), 3000);
      }, 1500);
    }, 600);
  };

  // Helper function to advance Sam's flow
  const handleSamFlowAdvance = (userMessage: string, nextStep: any, nextFlowStep: number) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: `sam-u-${Date.now()}`,
      sender: 'user',
      blocks: [{ type: 'text', content: userMessage }]
    }]);

    // Show thinking state
    setTimeout(() => {
      setIsStreaming(true);
      const thinkingId = `sam-ai-thinking-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: thinkingId,
        sender: 'ai',
        isThinking: true
      }]);

      // Replace with next step response
      setTimeout(() => {
        setMessages(prev => {
          const withoutThinking = prev.filter(m => !m.isThinking);
          return [...withoutThinking, {
            ...nextStep,
            id: `sam-ai-${Date.now()}`,
            sender: 'ai' as const
          }];
        });
        setSamFlowStep(nextFlowStep);
        // Keep streaming for a bit while content animates, then stop
        setTimeout(() => setIsStreaming(false), 3000);
      }, 1500);
    }, 600);
  };

  // Helper function to advance Varun's flow
  const handleVarunFlowAdvance = (userMessage: string, nextStep: any, nextFlowStep: number) => {
    const userMessageId = `varun-u-${Date.now()}`;

    if (VARUN_ELEGANT_SCROLL) {
      // ELEGANT SCROLL PATTERN:
      // 1. Add user message (with skipAutoScroll to prevent global scroll effects)
      // 2. Manually scroll user message to top of viewport
      // 3. Wait for scroll to complete
      // 4. THEN show Ray's thinking animation
      // 5. THEN render Ray's response

      // Step 1: Add user message with skipAutoScroll flag
      setMessages(prev => [...prev, {
        id: userMessageId,
        sender: 'user',
        blocks: [{ type: 'text', content: userMessage }],
        skipAutoScroll: true
      }]);

      // Step 2: Wait for DOM update, then scroll user message to top
      setTimeout(() => {
        scrollMessageToTop(userMessageId, () => {
          // Step 3: After scroll completes, show thinking state
          setIsStreaming(true);
          const thinkingId = `varun-ai-thinking-${Date.now()}`;
          setMessages(prev => [...prev, {
            id: thinkingId,
            sender: 'ai',
            isThinking: true,
            skipAutoScroll: true
          }]);

          // Step 4: Replace with next step response
          setTimeout(() => {
            setMessages(prev => {
              const withoutThinking = prev.filter(m => !m.isThinking);
              return [...withoutThinking, {
                ...nextStep,
                id: `varun-ai-${Date.now()}`,
                sender: 'ai' as const
              }];
            });
            setVarunFlowStep(nextFlowStep);
            setTimeout(() => setIsStreaming(false), 3000);
          }, 1500);
        });
      }, 100);
    } else {
      // DEFAULT SCROLL PATTERN (legacy behavior)
      setMessages(prev => [...prev, {
        id: userMessageId,
        sender: 'user',
        blocks: [{ type: 'text', content: userMessage }]
      }]);

      setTimeout(() => {
        setIsStreaming(true);
        const thinkingId = `varun-ai-thinking-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: thinkingId,
          sender: 'ai',
          isThinking: true
        }]);

        setTimeout(() => {
          setMessages(prev => {
            const withoutThinking = prev.filter(m => !m.isThinking);
            return [...withoutThinking, {
              ...nextStep,
              id: `varun-ai-${Date.now()}`,
              sender: 'ai' as const
            }];
          });
          setVarunFlowStep(nextFlowStep);
          setTimeout(() => setIsStreaming(false), 3000);
        }, 1500);
      }, 600);
    }
  };

  return (
    <div className="flex h-full relative font-sans overflow-hidden">

      {/* Main Chat Container - shifts left when KYC panel is settled */}
      <motion.div
        className="flex flex-col h-full relative w-full"
        initial={isEntering ? { opacity: 0 } : false}
        animate={{
          x: isKYCPanelSettled ? -200.5 : 0,
          opacity: 1
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25,
          opacity: { duration: 0.5, ease: 'easeInOut' }
        }}
      >
        {/* 1. Scrollable Chat Area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={`flex-1 overflow-y-auto px-3 md:px-6 pt-4 md:pt-6 pb-[80vh] scrollbar-hide ${ENABLE_PIN_TO_TOP ? 'flex flex-col' : ''}`}
        >
           <div className={`flex gap-6 md:gap-10 mx-auto transition-all duration-300 w-full max-w-full md:max-w-2xl ${ENABLE_PIN_TO_TOP ? 'flex-col-reverse mt-auto' : 'flex-col'}`}>
              {messages.map((msg, index) => {
                 // When pin-to-top is enabled, "isLast" should be the most recent message (highest index)
                 // which will appear at the TOP of the reversed layout
                 const isLastMessage = index === messages.length - 1;

                 return (
                   <motion.div
                     key={msg.id}
                     ref={el => { if (el) messageRefs.current.set(msg.id, el) }}
                     className="w-full"
                     // EXPERIMENTAL: Roll-up animation for user messages
                     initial={ENABLE_ROLL_UP_ANIMATION && msg.sender === 'user' ? { opacity: 0, y: ENABLE_PIN_TO_TOP ? -200 : 200 } : { opacity: 1, y: 0 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={ENABLE_ROLL_UP_ANIMATION && msg.sender === 'user' ? {
                       type: "spring",
                       stiffness: 100,
                       damping: 20,
                       mass: 1,
                       delay: 0.05
                     } : { duration: 0 }}
                   >
                      <RayMessageRenderer
                        data={msg}
                        isLast={isLastMessage}
                        onSuggestionClick={handleSuggestionClick}
                        highlightedSuggestionIndex={highlightedSuggestionIndex}
                        animatingCardId={isPaymentLinkModalOpen ? activeFormCardId : null}
                        personaId={activeFlow || 'default'}
                        kycBusinessModel={kycBusinessModel}
                        kycBankAccount={kycBankAccount}
                        onKYCPanelSettled={() => setIsKYCPanelSettled(true)}
                        onKYCPanelClosed={() => {
                          setIsKYCPanelSettled(false);
                          kycWebsiteQuestionShownRef.current = false;
                        }}
                        onMiniCardClick={(formId, sourceRect) => {
                          // Check which type of card was clicked
                          if (formId.includes('add-funds')) {
                            setActiveFormCardId(formId);
                            setShowAddFundsWidget(true);
                          } else if (formId.includes('capture-card')) {
                            setActiveCaptureCardId(formId);
                            setIsCaptureSettingsModalOpen(true);
                          } else {
                            setActiveFormCardId(formId);
                            setPaymentLinkSourceRect(sourceRect || null);
                            setIsPaymentLinkModalOpen(true);
                          }
                        }}
                        onMiniCardAnimationComplete={(formId) => {
                          // Auto-open modal when mini card animation completes (for failed payment flow)
                          if (activeFlow === 'failed_payment' && shyamFlowStep === 1 && formId === activeFormCardId) {
                            const miniCardElement = document.querySelector(`[data-form-id="${formId}"]`);
                            if (miniCardElement) {
                              const rect = miniCardElement.getBoundingClientRect();
                              setPaymentLinkSourceRect({
                                top: rect.top,
                                left: rect.left,
                                width: rect.width,
                                height: rect.height
                              });
                            }
                            setIsPaymentLinkModalOpen(true);
                            setShyamFlowStep(2);
                          }
                        }}
                        onStreamComplete={msg.id === 'refund-ai-1' ? handleSarahStreamComplete : undefined}
                      />
                   </motion.div>
                 );
              })}
           </div>
        </div>

      {/* Floating Scroll Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToNext}
            className="absolute bottom-[72px] left-1/2 -translate-x-1/2 z-[68] size-9 bg-white border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.06)] rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors"
          >
            <ArrowDown size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Pinned Glass Input (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0">

         {/* Floating Image Upload (Shyam flow) */}
         <FloatingImageUpload
           imageSrc="/screenshot-failed-payment.png"
           isVisible={showFloatingImage}
           onDrop={handleFloatingImageDrop}
         />

         {/* Add Funds Modal */}
         <AddFundsModal
           isOpen={showAddFundsWidget}
           initialAmount={widgetAmount}
           onClose={() => setShowAddFundsWidget(false)}
           onComplete={(amt, purpose) => {
             console.log("Adding funds:", amt, purpose);
             setShowAddFundsWidget(false);
             setInputValue(''); // Clear input

             // 1. User Message
             setMessages(prev => [...prev, {
                id: `u-${Date.now()}`,
                sender: 'user',
                blocks: [{ type: 'text', content: `Add ₹${amt} for ${purpose}` }]
             }]);

             // 2. Thinking State
             setTimeout(() => {
                 setMessages(prev => [...prev, {
                    id: `ai-think-${Date.now()}`,
                    sender: 'ai',
                    isThinking: true
                 }]);

                 // 3. Success Response
                 setTimeout(() => {
                     const stepData = arjunScript.arjun_step_3;
                     setMessages(prev => {
                        // Remove thinking
                        const withoutThinking = prev.filter(m => !m.isThinking);

                        return [...withoutThinking, {
                            id: `ai-${Date.now()}`,
                            sender: 'ai',
                            headline: stepData.headline,
                            artifact: stepData.artifact,
                            blocks: [
                                { type: 'text', content: stepData.subtext }
                            ],
                            resolution: stepData.resolution
                        }];
                     });
                 }, 1500);
             }, 600);
           }}
         />

         {/* Payment Link Modal - Opens with scrim, chat input stays above */}
         <PaymentLinkModal
           isOpen={isPaymentLinkModalOpen}
           sourceRect={paymentLinkSourceRect}
           onMorphComplete={() => {}}
           onClose={() => {
             setIsPaymentLinkModalOpen(false);
             setPaymentLinkSourceRect(null);
           }}
           onComplete={(result) => {
             setIsPaymentLinkModalOpen(false);
             setPaymentLinkPrefill(null);
             setPaymentLinkSourceRect(null);
             setInputValue('');

             // Update mini-card status to completed with linkUrl if it exists
             if (activeFormCardId) {
               setMessages(prev => prev.map(msg =>
                 msg.id === activeFormCardId && msg.artifact?.type === 'payment_link_form_card'
                   ? {
                       ...msg,
                       artifact: {
                         ...msg.artifact,
                         data: {
                           ...msg.artifact.data,
                           status: 'completed' as const,
                           linkUrl: result.linkUrl
                         }
                       }
                     }
                   : msg
               ));
             }

             // For failed payment flow, show a simple follow-up message
             if (activeFlow === 'failed_payment') {
               setTimeout(() => {
                 setMessages(prev => [...prev, {
                   id: `ai-${Date.now()}`,
                   sender: 'ai' as const,
                   artifact: {
                     type: 'simple_text',
                     data: {
                       headline: 'Your payment link is ready!',
                       body: 'I\'ve created the payment link above. You can copy it and share with Rahul to collect the payment.',
                       suggestions: ['Send this link via WhatsApp', 'Send this link via Email', 'View all payment links']
                     }
                   }
                 }]);
               }, 500);
               return;
             }

             // Default response for other personas
             setMessages(prev => [...prev, {
               id: `ai-${Date.now()}`,
               sender: 'ai',
               artifact: {
                 type: 'simple_text',
                 data: {
                   headline: 'Payment link created!',
                   body: `Your payment link for **₹${Number(result.amount).toLocaleString('en-IN')}** (${result.purpose}) is ready:\n\n${result.linkUrl}\n\nShare this link with your customer to collect payment.`,
                   suggestions: ['Create another payment link', 'View all payment links']
                 }
               }
             }]);
           }}
           prefill={paymentLinkPrefill || undefined}
         />

         {/* Capture Settings Modal */}
         <CaptureSettingsModal
           isOpen={isCaptureSettingsModalOpen}
           onClose={() => {
             setIsCaptureSettingsModalOpen(false);
           }}
           onComplete={(setting) => {
             setIsCaptureSettingsModalOpen(false);

             // Update mini-card to completed state
             if (activeCaptureCardId) {
               setMessages(prev => prev.map(msg =>
                 msg.id === activeCaptureCardId && msg.artifact?.type === 'capture_settings_form_card'
                   ? {
                       ...msg,
                       artifact: {
                         ...msg.artifact,
                         data: {
                           ...msg.artifact.data,
                           status: 'completed' as const,
                           currentSetting: setting
                         }
                       }
                     }
                   : msg
               ));
             }

             // For refund flow, show the success message
             if (activeFlow === 'refund' && setting === 'auto') {
               setTimeout(() => {
                 setMessages(prev => [...prev, {
                   ...sarahScript.sarah_step_2,
                   id: `sarah-ai-${Date.now()}`,
                   sender: 'ai' as const
                 }]);
                 setSarahFlowStep(3);
               }, 500);
             }
           }}
         />

         {/* KYC OTP Verification Modal */}
         <KYCOTPModal
           isOpen={isKYCOTPModalOpen}
           onClose={() => {
             setIsKYCOTPModalOpen(false);
           }}
           onVerify={(otp) => {
             setIsKYCOTPModalOpen(false);

             // Show OTP as user message
             setMessages(prev => [...prev, {
               id: `kyc-otp-u-${Date.now()}`,
               sender: 'user',
               blocks: [{ type: 'text', content: otp }]
             }]);

             // Show "OTP verified" message
             setTimeout(() => {
               setMessages(prev => [...prev, {
                 id: `kyc-verified-${Date.now()}`,
                 sender: 'ai',
                 artifact: {
                   type: 'simple_text',
                   data: {
                     headline: "OTP verified",
                     body: "",
                     suggestions: []
                   }
                 }
               }]);

               // Start KYC loading state
               setTimeout(() => {
                 setIsStreaming(true);
                 setMessages(prev => [...prev, {
                   id: `kyc-loading-${Date.now()}`,
                   sender: 'ai',
                   isThinking: true,
                   kycLoading: true // Flag to indicate KYC-specific loading
                 }]);

                 // Simulate KYC verification (10 seconds)
                 setTimeout(() => {
                   setIsStreaming(false);
                   setMessages(prev => prev.filter(m => !m.isThinking));

                   // Show KYC success message with business details card
                   setMessages(prev => [...prev, {
                     id: `kyc-success-${Date.now()}`,
                     sender: 'ai',
                     artifact: {
                       type: 'kyc_business_details',
                       data: {
                         headline: "Great news, we've retrieved your official business details linked to PAN XXXXXXXX.",
                         subtext: "Take a quick look to confirm everything's up to date before we continue.",
                         businessName: "Co-Star Network",
                         verificationBadge: "Verified via CKYC",
                         documents: [
                           { name: "Aadhar Front", type: "document" },
                           { name: "Aadhar back", type: "document" },
                           { name: "Registered address", type: "document" }
                         ],
                         suggestions: []
                       }
                     }
                   }]);
                   setKycFlowStep(3);
                 }, 10000);
               }, 600);
             }, 600);
           }}
           phoneNumber={kycPhoneNumber}
         />

         {/* UPI Verification Modal */}
         <UPIVerificationModal
           isOpen={isUPIModalOpen}
           onClose={() => setIsUPIModalOpen(false)}
           onMockPayment={() => {
             // Send user message
             setMessages(prev => [...prev, {
               id: `kyc-payment-u-${Date.now()}`,
               sender: 'user' as const,
               blocks: [{ type: 'text', content: 'Payment completed via UPI' }]
             }]);
           }}
           onComplete={() => {
             // Update bank account in KYC panel
             setKycBankAccount('2028U32U38Q\nState Bank of India, Sarjapura Branch');

             // Show bank account card
             setMessages(prev => [...prev, {
               id: `kyc-bank-account-${Date.now()}`,
               sender: 'ai',
               artifact: {
                 type: 'bank_account_card',
                 data: {
                   bankName: 'HDFC Bank account',
                   accountNumber: '2383237283283287372HA',
                   ifscCode: 'SBI78236287362326663',
                   accountName: 'Chinnaswamy Muthuswamy Venugopal Iyer'
                 }
               }
             }]);

             // Show final review message after a short delay
             setTimeout(() => {
               setMessages(prev => [...prev, {
                 id: `kyc-final-review-${Date.now()}`,
                 sender: 'ai',
                 artifact: {
                   type: 'simple_text',
                   data: {
                     headline: "Thanks, we have got everything we needed.",
                     body: "Please review your details once before submitting your application.",
                     button: { label: "Review details", variant: "primary" }
                   }
                 }
               }]);
             }, 1000);

             setKycFlowStep(6);
           }}
         />

         {/* KYC Review Modal */}
         <KYCReviewModal
           isOpen={isKYCReviewModalOpen}
           onClose={() => {
             setIsKYCReviewModalOpen(false);
             setIsKYCModalTransitioning(false);
           }}
           businessModel={kycBusinessModel}
           bankAccount={kycBankAccount}
           isTransitioningToPanel={isKYCModalTransitioning}
           onSubmit={() => {
             // Start transition animation to panel
             setIsKYCModalTransitioning(true);

             // Close modal and settle panel after animation completes (500ms)
             setTimeout(() => {
               setIsKYCReviewModalOpen(false);
               setIsKYCModalTransitioning(false);
               setIsKYCPanelSettled(true);

               // Trigger success animation after panel settles
               setTimeout(() => {
                 setIsSuccessAnimationOpen(true);
                 setKycFlowStep(7);
               }, 100);
             }, 500);
           }}
         />

         {/* Success Animation */}
         <SuccessAnimation
           isOpen={isSuccessAnimationOpen}
           onComplete={() => {
             // Animation stays open, no auto-close
           }}
         />

         {/* Top Fade Gradient */}
         <div className="h-16 w-full bg-gradient-to-t from-[#f8f8f8] via-[#f8f8f8]/80 to-transparent pointer-events-none z-30" />

         {/* Bottom fade gradient - chat content fades out towards input */}
         {/* Structure: 120px gradient (0→100 opacity) on top, 120px solid below */}
         <div className="fixed bottom-0 left-0 right-0 h-[240px] pointer-events-none z-[65]">
            {/* Top 120px: transparent to show gradient */}
            <div className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-transparent to-transparent" />
            {/* Bottom 120px: transparent to show gradient */}
            <div className="absolute inset-x-0 bottom-0 h-[120px]" />
         </div>

         {/* Background Video - plays when agent is thinking/streaming - z-0 (bottom layer) */}
         <AnimatePresence>
            {isStreaming && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed bottom-0 left-0 right-0 z-0 pointer-events-none overflow-hidden"
               >
                  <video
                     autoPlay
                     loop
                     muted
                     playsInline
                     className="w-full h-auto relative"
                     style={{ top: '-4px' }}
                     src="/rzrsense.mov"
                  />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Input Container - z-70 (above modal) - using RayInputBox for consistency */}
         {/* Fades in when transitioning from landing page to create seamless illusion */}
         {/* Starts above (y: -12) and settles down to final position, matching hero's downward motion */}
         <motion.div
            className="fixed bottom-[8px] left-0 right-0 z-[70] px-3 md:px-4 pointer-events-none"
            initial={isEntering ? { opacity: 0, y: -8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
         >
            <div className="w-full max-w-2xl mx-auto relative pointer-events-auto">
               <RayInputBox
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleInputSubmit}
                  variant="hero"
                  placeholder="Ask anything..."
                  isStreaming={isStreaming}
                  onStopStreaming={() => setIsStreaming(false)}
                  showShadow
               />
            </div>
         </motion.div>
        </div>
      </motion.div>

      {/* Modal Overlay Input - Only shows when a modal is open, rendered via portal at z-70 */}
      {(isPaymentLinkModalOpen || isCaptureSettingsModalOpen) && createPortal(
        <div className="fixed bottom-[8px] left-0 right-0 z-[70] px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto relative"
          >
            <RayInputBox
              value={inputValue}
              onChange={setInputValue}
              onSend={handleInputSubmit}
              variant="hero"
              placeholder="Ask anything..."
              isStreaming={isStreaming}
              onStopStreaming={() => setIsStreaming(false)}
              showShadow
            />
          </motion.div>
        </div>,
        document.body
      )}

    </div>
  );
};
