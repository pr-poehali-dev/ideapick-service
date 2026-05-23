import { useState } from 'react';
import Landing from './Landing';
import Platform from './Platform';

const Index = () => {
  const [view, setView] = useState<'landing' | 'platform'>('landing');

  return view === 'landing'
    ? <Landing onEnterApp={() => setView('platform')} />
    : <Platform onBack={() => setView('landing')} />;
};

export default Index;
