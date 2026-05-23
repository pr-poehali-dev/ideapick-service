import { useState } from 'react';
import { Idea } from '@/pages/Platform';
import Icon from '@/components/ui/icon';

interface Props {
  ideas: Idea[];
  selectedIdeaId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAnalyze: (id: string) => void;
  onDecide: (id: string) => void;
  onUpdate: (idea: Idea) => void;
}

const STATUS_LABELS: Record<Idea['status'], string> = {
  new: 'Новая',
  analyzing: 'Анализ',
  ready: 'Готово',
  rejected: 'Отклонено',
  approved: 'Одобрено',
};

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'new', label: 'Новые' },
  { id: 'analyzing', label: 'Анализ' },
  { id: 'ready', label: 'Готово' },
  { id: 'approved', label: 'Одобрено' },
  { id: 'rejected', label: 'Отклонено' },
];

const SORT_OPTIONS = [
  { id: 'date', label: 'По дате' },
  { id: 'score', label: 'По оценке' },
  { id: 'title', label: 'По названию' },
];

function ScoreBar({ score }: { score: number }) {
  const color = score > 75 ? '#4ADE80' : score > 50 ? '#D4A843' : '#F87171';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span
        className="text-xs font-semibold w-6 text-right"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

export default function IdeaBoard({ ideas, selectedIdeaId, onSelect, onDelete, onAnalyze, onDecide, onUpdate }: Props) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = ideas
    .filter(i => filter === 'all' || i.status === filter)
    .filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'score') return b.score - a.score;
      if (sort === 'title') return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const cycleStatus = (idea: Idea) => {
    const statuses: Idea['status'][] = ['new', 'analyzing', 'ready', 'approved', 'rejected'];
    const idx = statuses.indexOf(idea.status);
    const next = statuses[(idx + 1) % statuses.length];
    onUpdate({ ...idea, status: next });
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск идей..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-DEFAULT transition-colors font-golos"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold-DEFAULT font-golos"
          >
            {SORT_OPTIONS.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
            >
              <Icon name="LayoutGrid" size={14} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
            >
              <Icon name="List" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-xs px-3 py-1.5 rounded-full font-golos font-medium transition-all ${
              filter === f.id
                ? 'bg-[var(--gold-dim)] text-gold-light border border-[rgba(212,168,67,0.3)]'
                : 'bg-card border border-border text-muted-foreground hover:border-gold-DEFAULT hover:text-foreground'
            }`}
          >
            {f.label}
            <span className="ml-1.5 opacity-60">
              {f.id === 'all' ? ideas.length : ideas.filter(i => i.status === f.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Ideas */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="Lightbulb" size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-golos text-2xl font-light mb-2">Идей не найдено</p>
          <p className="text-sm">Попробуйте изменить фильтр или добавьте новую идею</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              selected={selectedIdeaId === idea.id}
              onSelect={() => onSelect(idea.id)}
              onDelete={() => onDelete(idea.id)}
              onAnalyze={() => onAnalyze(idea.id)}
              onDecide={() => onDecide(idea.id)}
              onCycleStatus={() => cycleStatus(idea)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(idea => (
            <IdeaListItem
              key={idea.id}
              idea={idea}
              selected={selectedIdeaId === idea.id}
              onSelect={() => onSelect(idea.id)}
              onDelete={() => onDelete(idea.id)}
              onAnalyze={() => onAnalyze(idea.id)}
              onDecide={() => onDecide(idea.id)}
              onCycleStatus={() => cycleStatus(idea)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CardProps {
  idea: Idea;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onAnalyze: () => void;
  onDecide: () => void;
  onCycleStatus: () => void;
}

function IdeaCard({ idea, selected, onSelect, onDelete, onAnalyze, onDecide, onCycleStatus }: CardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={`relative glass-card rounded-2xl p-5 cursor-pointer transition-all ${
        selected ? 'border-gold-DEFAULT shadow-[0_0_20px_rgba(212,168,67,0.15)]' : ''
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold-DEFAULT" />
      )}

      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full status-${idea.status} font-golos font-medium`}>
          {STATUS_LABELS[idea.status]}
        </span>
        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <Icon name="MoreHorizontal" size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 z-20 bg-card border border-border rounded-xl shadow-xl overflow-hidden w-36">
              <button onClick={e => { e.stopPropagation(); onAnalyze(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center gap-2 font-golos text-foreground">
                <Icon name="BarChart3" size={13} /> Анализ
              </button>
              <button onClick={e => { e.stopPropagation(); onDecide(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center gap-2 font-golos text-foreground">
                <Icon name="Target" size={13} /> Решение
              </button>
              <button onClick={e => { e.stopPropagation(); onCycleStatus(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center gap-2 font-golos text-foreground">
                <Icon name="RefreshCw" size={13} /> Статус
              </button>
              <div className="border-t border-border" />
              <button onClick={e => { e.stopPropagation(); onDelete(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center gap-2 font-golos text-red-400">
                <Icon name="Trash2" size={13} /> Удалить
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-golos text-lg font-semibold text-foreground mb-1.5 leading-tight">{idea.title}</h3>
      <p className="text-xs text-muted-foreground font-golos leading-relaxed mb-4 line-clamp-2">{idea.description}</p>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground font-golos">Потенциал</span>
        </div>
        <ScoreBar score={idea.score} />
      </div>

      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {idea.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-golos">{tag}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-golos">{idea.createdAt}</span>
        <div className="flex gap-1">
          <button
            onClick={e => { e.stopPropagation(); onAnalyze(); }}
            className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-[var(--gold-dim)] hover:text-gold-light transition-all font-golos"
          >
            Анализ
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDecide(); }}
            className="text-xs px-2.5 py-1 rounded-lg btn-gold"
          >
            Решить
          </button>
        </div>
      </div>
    </div>
  );
}

function IdeaListItem({ idea, selected, onSelect, onDelete, onAnalyze, onDecide, onCycleStatus }: CardProps) {
  return (
    <div
      onClick={onSelect}
      className={`glass-card rounded-xl px-5 py-4 cursor-pointer flex items-center gap-4 ${
        selected ? 'border-gold-DEFAULT' : ''
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
        <Icon name="Lightbulb" size={15} className="text-gold-DEFAULT" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-golos font-semibold text-foreground text-sm truncate">{idea.title}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full status-${idea.status} font-golos shrink-0`}>
            {STATUS_LABELS[idea.status]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{idea.description}</p>
      </div>
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <div className="w-20">
          <ScoreBar score={idea.score} />
        </div>
        <button onClick={e => { e.stopPropagation(); onAnalyze(); }} className="text-xs px-2.5 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-all font-golos">Анализ</button>
        <button onClick={e => { e.stopPropagation(); onDecide(); }} className="text-xs px-2.5 py-1.5 rounded-lg btn-gold">Решить</button>
        <button onClick={e => { e.stopPropagation(); onDelete(); }} className="text-muted-foreground hover:text-red-400 transition-colors"><Icon name="Trash2" size={14} /></button>
      </div>
    </div>
  );
}