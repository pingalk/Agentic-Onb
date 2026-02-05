import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { KeyUpdates } from './KeyUpdates';
import { Overview } from './Overview';
import { Insights } from './Insights';
import { ProductPromos } from './ProductPromos';
import { TransactionsList } from './TransactionsList';
import { TransactionsListVariantB } from './TransactionsListVariantB';
import { RayDashboard } from './RayDashboard';
import { TransactionDetails } from './TransactionDetails';
import { RaySidePanel } from './RaySidePanel';
import { RayLayoutToggle } from './RayLayoutToggle';
import { VariantSwitcher } from './VariantSwitcher';
import { RayFAB } from './RayFAB';
import Link from '../../../imports/Link-51-1889';
import Ray from '../../../imports/Ray';
import { Toaster } from "@/app/components/ui/sonner";
import { useDemo } from '@/context/DemoContext';
import { SparkRipples } from '../SparkRipples';

export interface DashboardProps {
    initialConfig?: {
        view: string;
        variants: { home: string; transactions: string };
    };
    onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ initialConfig, onLogout }) => {
  const { currentPersonaId } = useDemo();
  const [currentView, setCurrentView] = useState(initialConfig?.view || 'home');
  const [variants, setVariants] = useState<{home: string; transactions: string}>(initialConfig?.variants || {
    home: 'B',
    transactions: 'A'
  });
  const [headerVariant, setHeaderVariant] = useState<'central' | 'contextual'>('contextual');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isRaySidePanelOpen, setIsRaySidePanelOpen] = useState(false);
  const [rayLayoutMode, setRayLayoutMode] = useState<'floating' | 'native'>('floating');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [rayEntryPoint, setRayEntryPoint] = useState<'header' | 'floating'>('header');

  // Auto-collapse sidebar when Ray is in native mode on transactions pages
  useEffect(() => {
    if ((currentView === 'transactions' || currentView === 'transaction-details') && isRaySidePanelOpen && rayLayoutMode === 'native') {
      setIsSidebarCollapsed(true);
    }
  }, [currentView, isRaySidePanelOpen, rayLayoutMode]);

  // Render SparkRipples for the spark persona (POC) - must be after all hooks
  if (currentPersonaId === 'spark') {
    return <SparkRipples />;
  }

  const handleVariantChange = (view: 'home' | 'transactions', variant: string) => {
    setVariants(prev => ({ ...prev, [view]: variant }));
  };

  const handleHeaderVariantChange = (variant: 'central' | 'contextual') => {
    setHeaderVariant(variant);
  };

  const handleViewTransactionDetails = (id: string) => {
    setSelectedTransactionId(id);
    setCurrentView('transaction-details');
  };

  const handleNavigateToRayAI = () => {
    setCurrentView('home');
    setVariants(prev => ({ ...prev, home: 'B' }));
  };

  const handleToggleRaySidePanel = () => {
    setIsRaySidePanelOpen(prev => !prev);
  };

  const handleNavigateToPayments = () => {
    setCurrentView('home');
    setVariants(prev => ({ ...prev, home: 'A' }));
  };

  const handleNavigateToDoubleDebit = () => {
    setCurrentView('home');
    setVariants(prev => ({ ...prev, home: 'DOUBLE_DEBIT' }));
  };

  const isRayActive = currentView === 'home' && (variants.home === 'B' || variants.home === 'B_DEEP_LINK' || variants.home === 'DOUBLE_DEBIT');
  const isPaymentsDashboard = currentView === 'home' && variants.home === 'A';
  const showRayToggle = currentView === 'transactions' || currentView === 'transaction-details' || isPaymentsDashboard;

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        if (variants.home === 'B' || variants.home === 'B_DEEP_LINK' || variants.home === 'DOUBLE_DEBIT') { 
          let initialQuery = undefined;
          let autoSubmit = false;
          
          if (variants.home === 'B_DEEP_LINK') {
            initialQuery = "Show recent transactions from arvind@gmail.com";
          } else if (variants.home === 'DOUBLE_DEBIT') {
            initialQuery = "Show recent transactions from arvind@gmail.com";
            autoSubmit = false; // User manually presses Enter on landing page
          }
          
          return <RayDashboard onNavigate={setCurrentView} onNavigateToPayments={handleNavigateToPayments} initialQuery={initialQuery} autoSubmit={autoSubmit} onLogout={onLogout} />; 
        }
        return (
          <div className="max-w-6xl mx-auto w-full">
            <HeroSection />
            <KeyUpdates />
            <Overview />
            <Insights />
            <ProductPromos />
            
            <div className="h-12 flex items-center justify-center gap-4 text-xs text-slate-400 mt-8">
               <span>© Razorpay 2024</span>
               <span>Privacy</span>
               <span>Terms</span>
            </div>
          </div>
        );
      case 'transactions':
        if (variants.transactions === 'B') {
          return <TransactionsListVariantB onViewDetails={handleViewTransactionDetails} />;
        }
        return <TransactionsList onViewDetails={handleViewTransactionDetails} isRayOpen={isRaySidePanelOpen} />;
      case 'transaction-details':
        return (
            <TransactionDetails 
                id={selectedTransactionId || ''} 
                onBack={() => setCurrentView('transactions')}
                hideTimeline={isRaySidePanelOpen && rayLayoutMode === 'native'}
            />
        );
      default:
        return <div>Page not found</div>;
    }
  };

  const handleSidebarChangeView = (view: string) => {
    if (view === 'home') {
      setVariants(prev => ({ ...prev, home: 'A' }));
    }
    setCurrentView(view);
  };

  const getTransactionStatus = (id: string | null) => {
    if (!id) return undefined;
    // Hardcoded check based on prototype data in TransactionsList
    if (id === 'pay_LKJdsm453') return 'Failed';
    if (id === 'pay_LGadms271') return 'Authorised';
    return 'Captured';
  };

  return (
    <div className="flex h-screen bg-white font-sans relative">
      <Toaster position="top-left" duration={5000} style={{ top: '80px', left: '20px' }} />
      {!isRayActive && (
        <Sidebar 
          currentView={currentView} 
          onChangeView={handleSidebarChangeView} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />
      )}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {!isRayActive && (
            <Header 
                onNavigateToRayAI={handleNavigateToRayAI} 
                variant={headerVariant} 
                onToggleRaySidePanel={handleToggleRaySidePanel}
                showRayEntryPoint={rayEntryPoint === 'header'}
                onNavigateToDoubleDebit={handleNavigateToDoubleDebit}
                onLogout={onLogout}
            />
        )}
        <div className="flex flex-1 overflow-hidden relative">
          <main className={`flex-1 h-full max-w-full min-w-0 ${isRayActive ? 'p-0 overflow-hidden' : 'p-8 bg-[#F8FAFC] overflow-y-auto overflow-x-hidden flex flex-col gap-8'}`}>
            {currentView === 'transaction-details' && (
              <div className="inline-block cursor-pointer" onClick={() => setCurrentView('transactions')}>
                <Link />
              </div>
            )}
            {renderContent()}
          </main>
          
          {/* Ray Side Panel - rendered once here to preserve state, style adapts to mode */}
          <RaySidePanel 
             isOpen={isRaySidePanelOpen} 
             onClose={() => setIsRaySidePanelOpen(false)} 
             mode={rayLayoutMode}
             onModeChange={setRayLayoutMode}
             currentView={currentView}
             transactionStatus={getTransactionStatus(selectedTransactionId)}
          />
        </div>
        
        {/* Ray FAB Button - Always visible on relevant pages */}
        {showRayToggle && !isRaySidePanelOpen && (
          <RayFAB onClick={handleToggleRaySidePanel} />
        )}

        {/* Layout Toggle - Only shown when Ray side panel is open */}
        {showRayToggle && isRaySidePanelOpen && (
          <RayLayoutToggle mode={rayLayoutMode} onChange={setRayLayoutMode} />
        )}
      </div>
    </div>
  );
};