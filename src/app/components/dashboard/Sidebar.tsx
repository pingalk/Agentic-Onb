import React, { useState } from 'react';
import { 
  Home, 
  ArrowRightLeft, 
  Landmark, 
  FileText, 
  Link, 
  Zap, 
  LayoutTemplate, 
  Receipt, 
  Percent, 
  GitFork, 
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from '../../../imports/svg-5qcs5fs5ti';

export interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick, collapsed }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex items-center relative cursor-pointer select-none h-[40px] rounded-md hover:bg-slate-100 transition-colors",
        collapsed ? "justify-center px-0" : "pl-[12px] pr-[4px]"
      )}
    >
      {/* Active Background Pill */}
      {active && (
        <motion.div
          layoutId="active-pill"
          className={cn(
            "absolute bg-blue-50 z-0",
             collapsed ? "inset-0 rounded-lg mx-2 my-1" : "inset-0 rounded-[4px]"
          )}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
        />
      )}

      {/* Icon */}
      <div className={cn(
        "relative z-10 flex items-center justify-center shrink-0 w-[16px] h-[16px]",
        collapsed && "w-full"
      )}>
        <Icon 
          size={16} 
          className={cn(
            "transition-colors duration-200",
            active ? "text-blue-600" : "text-slate-600 group-hover:text-slate-900"
          )} 
        />
      </div>

      {/* Text Label */}
      <div className="relative z-10 overflow-hidden flex-1">
        <motion.span
          initial={false}
          animate={{ 
            opacity: collapsed ? 0 : 1,
            filter: collapsed ? "blur(4px)" : "blur(0px)",
            x: collapsed ? -10 : 0
          }}
          transition={{
             type: "spring",
             stiffness: 400, 
             damping: 30
          }}
          className={cn(
            "whitespace-nowrap ml-[8px] text-[14px] font-medium block origin-left",
            active ? "text-blue-600" : "text-slate-600 group-hover:text-slate-900"
          )}
        >
          {label}
        </motion.span>
      </div>

      {/* Active Dot Indicator */}
      {active && (
        <motion.div
            initial={false}
            animate={{ scale: collapsed ? 0 : 1 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
            }}
            className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-600 z-10"
        />
      )}
    </div>
  );
};

export interface SectionHeaderProps {
    label: string;
    collapsed: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ label, collapsed }) => {
    return (
        <div className="h-[20px] relative flex items-end pl-[12px] pr-[4px]">
            {/* Divider Line */}
             <motion.div 
                initial={false}
                animate={{ opacity: collapsed ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-0 h-[1px] bg-slate-200 bottom-2"
            />
            
            {/* Text Header */}
            <motion.div
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1, filter: collapsed ? "blur(4px)" : "blur(0px)" }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-end pl-[12px]"
            >
                <span className="text-[10px] font-medium text-[#768ea7] uppercase leading-[14px] whitespace-nowrap overflow-hidden">
                    {label}
                </span>
            </motion.div>
        </div>
    );
};

export const RazorpayLogo = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <motion.div
      className="relative overflow-hidden h-6"
      initial={false}
      animate={{ width: isCollapsed ? 24 : 148 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="absolute left-0 top-0 flex items-center h-full w-[148px]">
         {/* Icon - Fixed Anchor */}
         <div className="shrink-0 w-6 h-6 z-20">
            <svg className="block w-full h-full" fill="none" viewBox="0 0 24 24">
               <path d={svgPaths.p11aadc00} fill="#3395FF" />
               <path d={svgPaths.p2f9fae00} fill="#0C2651" />
            </svg>
         </div>

         {/* Text - Animated Reveal */}
         <motion.div
            className="ml-2 h-6 w-[122px] shrink-0"
            animate={{
                x: isCollapsed ? -20 : 0,
                opacity: isCollapsed ? 0 : 1
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
         >
             <svg className="block w-full h-full" fill="none" viewBox="0 0 122 24">
                <path d={svgPaths.p2159db00} fill="#0C2651" />
             </svg>
         </motion.div>
      </div>
    </motion.div>
  );
};


interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isCollapsed, onToggleCollapse }) => {
  // const [isCollapsed, setIsCollapsed] = useState(false); // Removed internal state

  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "4.5rem" }
  };

  return (
    <motion.div 
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{
            type: "spring",
            stiffness: 400,
            damping: 30
        }}
        className="h-screen bg-slate-50 border-r border-slate-200 flex flex-col sticky top-0 overflow-hidden z-30"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-0 relative z-20 h-[68px] pl-[24px]">
        <div 
            className="cursor-pointer"
            onClick={() => onChangeView('home')}
        >
            <RazorpayLogo isCollapsed={isCollapsed} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-[8px] px-[8px] flex flex-col gap-[20px] scrollbar-hide">
        <div className="flex flex-col gap-[2px]">
          <SidebarItem 
            icon={Home} 
            label="Home" 
            active={currentView === 'home'} 
            onClick={() => onChangeView('home')}
            collapsed={isCollapsed}
          />
          <SidebarItem 
            icon={ArrowRightLeft} 
            label="Transactions" 
            active={currentView === 'transactions' || currentView === 'transaction-details'} 
            onClick={() => onChangeView('transactions')}
            collapsed={isCollapsed}
          />
          <SidebarItem icon={Landmark} label="Settlements" collapsed={isCollapsed} />
          <SidebarItem icon={FileText} label="Reports" collapsed={isCollapsed} />
        </div>

        <div className="flex flex-col gap-[2px]">
          <SectionHeader label="Recently Used" collapsed={isCollapsed} />
          <div className="flex flex-col gap-[2px]">
            <SidebarItem icon={Link} label="Payment Links" collapsed={isCollapsed} />
            <SidebarItem icon={Zap} label="Magic Checkout" collapsed={isCollapsed} />
            <SidebarItem icon={LayoutTemplate} label="Payment Pages" collapsed={isCollapsed} />
          </div>
        </div>

        <div className="flex flex-col gap-[2px]">
          <SectionHeader label="Recommended for you" collapsed={isCollapsed} />
          <div className="flex flex-col gap-[2px]">
            <SidebarItem icon={Receipt} label="Invoices" collapsed={isCollapsed} />
            <SidebarItem icon={Percent} label="Affordability" collapsed={isCollapsed} />
            <SidebarItem icon={GitFork} label="Route" collapsed={isCollapsed} />
          </div>
        </div>
      </div>

      <div className="pb-[16px] pt-[12px] px-[12px] border-t border-slate-200 flex flex-col gap-[4px] relative z-20 bg-slate-50">
         {/* Toggle Button */}
         <button 
            onClick={onToggleCollapse}
            className={cn(
                "flex items-center justify-center p-2 rounded-md hover:bg-slate-200 text-slate-500 transition-colors",
                isCollapsed ? "self-center" : "self-end"
            )}
         >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
         </button>

        <div className={cn("flex items-center gap-2 text-slate-600 text-sm font-medium w-full hover:bg-slate-100 p-2 rounded-md transition-all duration-200 cursor-pointer", isCollapsed && "justify-center gap-0")}>
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4 shrink-0">
             <div className="bg-slate-500 rounded-[1px]"></div>
             <div className="bg-slate-500 rounded-[1px]"></div>
             <div className="bg-slate-500 rounded-[1px]"></div>
             <div className="bg-slate-500 rounded-[1px]"></div>
          </div>
          
           <motion.div
             initial={false}
             animate={{ 
                width: isCollapsed ? 0 : "auto", 
                opacity: isCollapsed ? 0 : 1,
                marginLeft: isCollapsed ? 0 : 8
             }}
             className="overflow-hidden flex items-center flex-1"
           >
                <span className="whitespace-nowrap">Other Products</span>
                <ChevronDown size={16} className="ml-auto shrink-0" />
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
