import React, { useState } from 'react';
import { 
  Plus, 
  Compass, 
  Clock, 
  Settings, 
  HelpCircle,
  MessageSquare,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import { SidebarItem, SectionHeader, RazorpayLogo } from './Sidebar';

interface RaySidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  className?: string;
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  onLogout?: () => void;
}

export const RaySidebar: React.FC<RaySidebarProps> = ({ 
  currentView, 
  onChangeView, 
  className,
  isOpen,
  onToggle,
  isCollapsed: controlledIsCollapsed,
  onCollapseChange,
  onLogout
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  
  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed;

  React.useEffect(() => {
    // Only run this logic if we have control over the state (via onCollapseChange)
    // or if we are using internal state.
    const hasVisited = localStorage.getItem('ray_sidebar_visited');

    if (!hasVisited) {
      // First time load
      // Ensure it starts expanded
      if (isCollapsed) {
          if (onCollapseChange) onCollapseChange(false);
          else setInternalIsCollapsed(false);
      }

      // Mark as visited
      localStorage.setItem('ray_sidebar_visited', 'true');

      // Auto-collapse after 10 seconds
      const timer = setTimeout(() => {
        if (onCollapseChange) onCollapseChange(true);
        else setInternalIsCollapsed(true);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
        // Second load and after
        // We want it to be collapsed by default.
        // However, we only enforce this ONCE on mount to avoid overriding user interaction later.
        // Since this useEffect runs on mount (dependency array []), it's safe.
        // We only collapse if it's currently expanded (which is the default state from parent).
        if (!isCollapsed) {
             if (onCollapseChange) onCollapseChange(true);
             else setInternalIsCollapsed(true);
        }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleCollapseToggle = () => {
    const newState = !isCollapsed;
    setInternalIsCollapsed(newState);
    onCollapseChange?.(newState);
  };

  const sidebarVariants = {
    expanded: { width: "256px" },
    collapsed: { width: "72px" }
  };

  // Mock recent threads
  const recentThreads = [
    { id: '1', title: 'Failed transactions for...', time: '2m ago' },
    { id: '2', title: 'Analyze Q3 revenue', time: '1h ago' },
    { id: '3', title: 'Customer support tick...', time: '3h ago' },
    { id: '4', title: 'Subscription plans', time: '1d ago' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{
            type: "spring",
            stiffness: 400,
            damping: 30
        }}
        className={cn(
            "fixed top-0 left-0 h-screen bg-slate-50 border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-0 relative z-20 h-[68px] pl-[24px]">
            <div 
                className="cursor-pointer"
                onClick={onLogout}
            >
                <RazorpayLogo isCollapsed={isCollapsed} />
            </div>
            {/* Mobile Close Button */}
            <button 
                onClick={onToggle}
                className="ml-auto mr-4 md:hidden p-1 text-gray-500 hover:bg-gray-200 rounded"
            >
                <X size={20} />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-[8px] px-[8px] flex flex-col gap-[24px] scrollbar-hide">
            
            {/* Section A: Primary Actions */}
            <div className="flex flex-col gap-[2px]">
                <SidebarItem 
                    icon={Plus} 
                    label="New Chat" 
                    active={currentView === 'new-chat' || currentView === 'landing'}
                    onClick={() => onChangeView('new-chat')}
                    collapsed={isCollapsed}
                />
                <SidebarItem 
                    icon={Compass} 
                    label="Discover" 
                    active={currentView === 'discover'}
                    onClick={() => onChangeView('discover')}
                    collapsed={isCollapsed}
                />
            </div>

            {/* Section B: Recent */}
            <div className="flex flex-col gap-[2px]">
                <SectionHeader label="RECENT" collapsed={isCollapsed} />
                <div className={cn("flex flex-col gap-[2px]", isCollapsed && "hidden")}>
                    {recentThreads.map(thread => (
                        <SidebarItem 
                            key={thread.id}
                            icon={Clock} 
                            label={thread.title} 
                            active={currentView === `thread-${thread.id}`}
                            onClick={() => onChangeView(`thread-${thread.id}`)}
                            collapsed={isCollapsed}
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* Section C: Footer */}
        <div className="pb-[16px] pt-[12px] px-[8px] border-t border-slate-200 flex flex-col gap-[2px] relative z-20 bg-slate-50">
            {/* Toggle Button */}
            <button 
                onClick={handleCollapseToggle}
                className={cn(
                    "hidden md:flex items-center justify-center p-2 rounded-md hover:bg-slate-200 text-slate-500 transition-colors mb-2",
                    isCollapsed ? "self-center" : "self-end"
                )}
            >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <SidebarItem 
                icon={Settings} 
                label="Settings" 
                active={currentView === 'settings'}
                onClick={() => onChangeView('settings')}
                collapsed={isCollapsed}
            />
            <SidebarItem 
                icon={HelpCircle} 
                label="Help & Support" 
                active={currentView === 'help'}
                onClick={() => onChangeView('help')}
                collapsed={isCollapsed}
            />
            {onLogout && (
                <SidebarItem 
                    icon={X} 
                    label="Logout" 
                    active={false}
                    onClick={onLogout}
                    collapsed={isCollapsed}
                />
            )}
        </div>
      </motion.div>
    </>
  );
};