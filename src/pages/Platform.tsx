import { useState } from 'react';
import Icon from '@/components/ui/icon';
import IdeaGenerator from '@/components/platform/IdeaGenerator';
import IdeaBoard from '@/components/platform/IdeaBoard';
import IdeaAnalysis from '@/components/platform/IdeaAnalysis';
import IdeaCompare from '@/components/platform/IdeaCompare';
import IdeaDecision from '@/components/platform/IdeaDecision';

export type Idea = {
  id: string;
  title: string;
  description: string;
  category: string;
  score: number;
  status: 'new' | 'analyzing' | 'ready' | 'rejected' | 'approved';
  createdAt: string;
  tags: string[];
  analysis?: {
    market: number;
    audience: number;
    competition: number;
    risk: number;
    effort: number;
    novelty: number;
  };
  decision?: string;
};

const SAMPLE_IDEAS: Idea[] = [
  {
    id: '1',
    title: 'SaaS для фрилансеров',
    description: 'Платформа для управления проектами, клиентами и финансами для фрилансеров',
    category: 'SaaS',
    score: 87,
    status: 'approved',
    createdAt: '2025-05-10',
    tags: ['SaaS', 'B2C', 'Фриланс'],
    analysis: { market: 85, audience: 90, competition: 70, risk: 65, effort: 75, novelty: 60 },
    decision: 'Делаем',
  },
  {
    id: '2',
    title: 'Агрегатор подкастов',
    description: 'Умный агрегатор с персонализацией и транскрибацией подкастов',
    category: 'Медиа',
    score: 54,
    status: 'analyzing',
    createdAt: '2025-05-15',
    tags: ['Медиа', 'B2C', 'AI'],
    analysis: { market: 55, audience: 60, competition: 30, risk: 50, effort: 45, novelty: 65 },
  },
  {
    id: '3',
    title: 'Маркетплейс шаблонов',
    description: 'Площадка для продажи шаблонов Notion, Figma, кода и других ресурсов',
    category: 'Маркетплейс',
    score: 72,
    status: 'ready',
    createdAt: '2025-05-18',
    tags: ['Маркетплейс', 'B2C', 'Шаблоны'],
    analysis: { market: 70, audience: 75, competition: 55, risk: 70, effort: 80, novelty: 55 },
  },
  {
    id: '4',
    title: 'AI-ревьюер кода',
    description: 'Инструмент для автоматического ревью pull-request\'ов с помощью ИИ',
    category: 'Dev Tools',
    score: 34,
    status: 'rejected',
    createdAt: '2025-05-20',
    tags: ['Dev Tools', 'AI', 'B2B'],
    analysis: { market: 40, audience: 35, competition: 20, risk: 30, effort: 25, novelty: 45 },
  },
  {
    id: '5',
    title: 'Планировщик питания',
    description: 'Приложение для планирования рациона с учётом КБЖУ и предпочтений',
    category: 'Здоровье',
    score: 61,
    status: 'new',
    createdAt: '2025-05-22',
    tags: ['Health', 'B2C', 'Питание'],
  },
];

const navItems = [
  { id: 'board', icon: 'LayoutGrid', label: 'Мои идеи' },
  { id: 'generate', icon: 'Sparkles', label: 'Генератор' },
  { id: 'analysis', icon: 'BarChart3', label: 'Анализ' },
  { id: 'compare', icon: 'GitCompare', label: 'Сравнение' },
  { id: 'decision', icon: 'Target', label: 'Решение' },
];

interface PlatformProps {
  onBack: () => void;
}

export default function Platform({ onBack }: PlatformProps) {
  const [activeTab, setActiveTab] = useState('board');
  const [ideas, setIdeas] = useState<Idea[]>(SAMPLE_IDEAS);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId) || null;

  const addIdea = (idea: Idea) => {
    setIdeas(prev => [idea, ...prev]);
    setSelectedIdeaId(idea.id);
    setActiveTab('board');
  };

  const updateIdea = (updated: Idea) => {
    setIdeas(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
    if (selectedIdeaId === id) setSelectedIdeaId(null);
  };

  const openAnalysis = (id: string) => {
    setSelectedIdeaId(id);
    setActiveTab('analysis');
  };

  const openDecision = (id: string) => {
    setSelectedIdeaId(id);
    setActiveTab('decision');
  };

  const totalIdeas = ideas.length;
  const approvedCount = ideas.filter(i => i.status === 'approved').length;
  const analyzingCount = ideas.filter(i => i.status === 'analyzing' || i.status === 'ready').length;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-DEFAULT to-gold-dark flex items-center justify-center">
              <span className="text-sm font-bold text-[#0f1117]">I</span>
            </div>
            <span className="font-cormorant text-xl font-semibold">Ideapick</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Stats mini */}
        <div className="px-4 py-4 border-b border-border">
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: totalIdeas, label: 'Всего' },
              { val: analyzingCount, label: 'В работе' },
              { val: approvedCount, label: 'Одобрено' },
            ].map((s, i) => (
              <div key={i} className="text-center py-2 rounded-xl bg-secondary">
                <div className="font-cormorant text-lg font-semibold text-gold-light">{s.val}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`sidebar-link w-full text-left ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Back to landing */}
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={onBack}
            className="sidebar-link w-full text-left text-muted-foreground"
          >
            <Icon name="ArrowLeft" size={16} />
            <span>На главную</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="Menu" size={20} />
            </button>
            <div>
              <h1 className="font-cormorant text-xl font-semibold leading-tight">
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {activeTab === 'board' && 'Все ваши идеи в одном месте'}
                {activeTab === 'generate' && 'Сгенерируйте новую идею'}
                {activeTab === 'analysis' && 'Детальный анализ идеи'}
                {activeTab === 'compare' && 'Сравнение нескольких идей'}
                {activeTab === 'decision' && 'Финальное решение'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('generate')}
            className="btn-gold px-4 py-2 rounded-xl text-sm flex items-center gap-2"
          >
            <Icon name="Plus" size={14} />
            <span className="hidden sm:inline">Новая идея</span>
          </button>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 mesh-bg">
          {activeTab === 'board' && (
            <IdeaBoard
              ideas={ideas}
              selectedIdeaId={selectedIdeaId}
              onSelect={setSelectedIdeaId}
              onDelete={deleteIdea}
              onAnalyze={openAnalysis}
              onDecide={openDecision}
              onUpdate={updateIdea}
            />
          )}
          {activeTab === 'generate' && (
            <IdeaGenerator onAdd={addIdea} />
          )}
          {activeTab === 'analysis' && (
            <IdeaAnalysis
              ideas={ideas}
              selectedIdea={selectedIdea}
              onSelectIdea={setSelectedIdeaId}
              onUpdate={updateIdea}
            />
          )}
          {activeTab === 'compare' && (
            <IdeaCompare ideas={ideas} />
          )}
          {activeTab === 'decision' && (
            <IdeaDecision
              ideas={ideas}
              selectedIdea={selectedIdea}
              onSelectIdea={setSelectedIdeaId}
              onUpdate={updateIdea}
            />
          )}
        </main>
      </div>
    </div>
  );
}
