import { useState } from 'react';
import Landing from './Landing';
import Platform from './Platform';
import Auth from './Auth';

type View = 'landing' | 'auth' | 'platform';

const Index = () => {
  const [view, setView] = useState<View>('landing');

  if (view === 'landing') return <Landing onEnterApp={() => setView('auth')} />;
  if (view === 'auth') return <Auth onAuth={() => setView('platform')} onBack={() => setView('landing')} />;
  return <Platform onBack={() => setView('landing')} />;
};

export default Index;
