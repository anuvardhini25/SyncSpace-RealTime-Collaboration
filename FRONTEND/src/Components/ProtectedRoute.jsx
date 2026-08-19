import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIGuide from './AIGuide';
import CommandPalette from './CommandPalette';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [guideOpen, setGuideOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading SyncSpace...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children}
      <AIGuide open={guideOpen} onOpenChange={setGuideOpen} />
      <CommandPalette onOpenGuide={() => setGuideOpen(true)} />
    </>
  );
}