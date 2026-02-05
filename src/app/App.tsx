import { useState } from 'react';
import { Dashboard } from './components/dashboard/Dashboard';
import { Login } from './components/auth/Login';
import { DemoProvider } from '../context/DemoContext';
import { TimingSettingsProvider } from '../context/TimingSettingsContext';
import { MagicColorProvider } from '../context/MagicColorContext';
import { DemoControls } from './components/DemoControls';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Skip login, go directly to Ray AI
  const [initialViewConfig, setInitialViewConfig] = useState<{
    view: string;
    variants: { home: string; transactions: string };
  }>({
    view: 'home',
    variants: { home: 'B', transactions: 'A' }
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

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
    <>
      <Dashboard initialConfig={initialViewConfig} onLogout={handleLogout} />
      <DemoControls />
    </>
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