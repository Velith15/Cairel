import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';
import { AuthScreen } from './components/AuthScreen';

function App() {
  const { session, isLoading, userEmail, signOut } = useAuth();
  const [activeId, setActiveId] = useState('overview');

  // Show nothing while checking for an existing session to avoid flash of auth screen
  if (isLoading) {
    return null;
  }

  // Auth screen paused for previewing dashboard & settings directly
  const isAuthBypassed = true;

  if (!isAuthBypassed && !session) {
    return <AuthScreen />;
  }

  return (
    <>
      <Sidebar
        activeId={activeId}
        setActiveId={setActiveId}
        userEmail={userEmail}
        onSignOut={signOut}
      />
      <Workspace activeId={activeId} setActiveId={setActiveId} />
    </>
  );
}

export default App;
