import { useState, useEffect } from 'react';
import { Dashboard } from './components/dashboard/Dashboard';
import { Presentation } from './components/presentation/Presentation';
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

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Presentation mode
  if (hash === '#presentation') {
    return <Presentation />;
  }

  return (
    <Dashboard initialConfig={initialViewConfig} />
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