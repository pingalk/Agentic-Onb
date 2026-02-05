import { useState, useEffect } from 'react';
import { Dashboard } from './components/dashboard/Dashboard';
import { Login } from './components/auth/Login';
import { Presentation } from './components/presentation/Presentation';
import { DemoProvider } from '../context/DemoContext';
import { TimingSettingsProvider } from '../context/TimingSettingsContext';
import { MagicColorProvider } from '../context/MagicColorContext';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Skip login, go directly to Ray AI
  const [hash, setHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');
  const [initialViewConfig, setInitialViewConfig] = useState<{
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

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Presentation mode
  if (hash === '#presentation') {
    return <Presentation />;
  }

  if (!isAuthenticated) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        currentConfig={initialViewConfig}
        onConfigChange={setInitialViewConfig}
      />
    );
  }

  return (
    <Dashboard initialConfig={initialViewConfig} onLogout={handleLogout} />
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