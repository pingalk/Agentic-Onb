import { useState, useEffect } from 'react';
import { Dashboard } from './components/dashboard/Dashboard';
import { Presentation } from './components/presentation/Presentation';
import { KYCLandingPage } from './components/dashboard/KYCLandingPage';
import { DemoProvider } from '../context/DemoContext';
import { TimingSettingsProvider } from '../context/TimingSettingsContext';
import { MagicColorProvider } from '../context/MagicColorContext';

function AppContent() {
  const [hash, setHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');
  const [initialViewConfig] = useState<{
    view: string;
    variants: { home: string; transactions: string };
  }>({
    view: 'home',
    variants: { home: 'B', transactions: 'A' }
  });

  // KYC state
  const [showKYCLanding, setShowKYCLanding] = useState(false);
  const [kycPhoneData, setKycPhoneData] = useState<{ phone: string; otp: string; pan: string } | null>(null);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash;
      setHash(newHash);

      // Show KYC landing page when #kyc is accessed
      if (newHash === '#kyc' || newHash === '#onboarding') {
        setShowKYCLanding(true);
        setKycPhoneData(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Check initial hash
    if (hash === '#kyc' || hash === '#onboarding') {
      setShowKYCLanding(true);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [hash]);

  // Handle phone verification completion (phoneNumber is actually PAN number from KYCLandingPage)
  const handleKYCPhoneSubmit = (panNumber: string, otp: string) => {
    setKycPhoneData({ phone: '2828', otp, pan: panNumber });
    setShowKYCLanding(false);
  };

  // Presentation mode
  if (hash === '#presentation') {
    return <Presentation />;
  }

  // KYC Landing Page (phone entry before Ray chat)
  if (showKYCLanding) {
    return <KYCLandingPage onPhoneSubmit={handleKYCPhoneSubmit} />;
  }

  // KYC Chat Mode (after phone verification)
  const kycInitialQuery = kycPhoneData ? "Start KYC onboarding" : undefined;

  return (
    <Dashboard
      initialConfig={initialViewConfig}
      kycMode={!!kycPhoneData}
      initialQuery={kycInitialQuery}
      kycPhoneData={kycPhoneData}
    />
  );
}

function App() {
  return (
    <DemoProvider>
      <TimingSettingsProvider>
        <MagicColorProvider>
          <AppContent />
        </MagicColorProvider>
      </TimingSettingsProvider>
    </DemoProvider>
  );
}

export default App;