import { useState } from 'react';
import { Idea } from '@/pages/Platform';
import Icon from '@/components/ui/icon';

interface Props {
  ideas: Idea[];
}

const METRICS = [
  { key: 'market', label: 'Рынок', icon: 'TrendingUp' },
  { key: 'audience', label: 'Аудитория', icon: 'Users' },
  { key: 'competition', label: 'Конкуренция', icon: 'Swords' },
  { key: 'risk', label: 'Риски', icon: 'AlertTriangle' },
  { key: 'effort', label: 'Усилия', icon: 'Wrench' },
  { key: 'novelty', label: 'Новизна', icon: 'Sparkles' },
];

const COLORS = ['#D4A843', '#9B72CF', '#4ADE80', '#60A5FA'];

export default function IdeaCompare({ ideas }: Props) {
  const [selected, setSelected] = useState<string[]>(
    ideas.filter(i => i.analysis).slice(0, 2).map(i => i.id)
  );

  const analysisIdeas = ideas.filter(i => i.analysis);
  const compareIdeas = ideas.filter(i => selected.includes(i.id));

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const getWinner = (metric: string) => {
    if (compareIdeas.length < 2) return null;
    const vals = compareIdeas.map(i => ({
      id: i.id,
      val: (i.analysis as Record<string, number>)[metric] || 0
    }));
    const max = Math.max(...vals.map(v => v.val));
    return vals.find(v => v.val === max)?.id;
  };

  const getOverallWinner = () => {
    if (compareIdeas.length < 2) return null;
    return compareIdeas.reduce((best, curr) =>
      curr.score > (best.score || 0) ? curr : best
    );
  };

  const overall = getOverallWinner();

  return (
    <div className="space-y-5">
      {/* Selector */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground font-golos uppercase tracking-wider">
            Выберите идеи для сравнения (до 4)
          </p>
          <span className="text-xs text-muted-foreground font-golos">{selected.length}/4 выбрано</span>
        </div>
        {analysisIdeas.length === 0 ? (
          <p className="text-sm text-muted-foreground font-golos">Сначала проведите анализ хотя бы двух идей</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {analysisIdeas.map((idea, i) => (
              <button
                key={idea.id}
                onClick={() => toggleSelect(idea.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-golos font-medium transition-all ${
                  selected.includes(idea.id)
                    ? 'border'
                    : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                }`}
                style={selected.includes(idea.id) ? {
                  background: `${COLORS[selected.indexOf(idea.id)]}15`,
                  borderColor: `${COLORS[selected.indexOf(idea.id)]}40`,
                  color: COLORS[selected.indexOf(idea.id)]
                } : {}}
              >
                {selected.includes(idea.id) && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: COLORS[selected.indexOf(idea.id)] }}
                  />
                )}
                {idea.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {compareIdeas.length < 2 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="GitCompare" size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-syne text-2xl font-light mb-2">Выберите хотя бы 2 идеи</p>
          <p className="text-sm font-golos">Убедитесь, что идеи прошли анализ</p>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in">
          {/* Overview cards */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareIdeas.length}, 1fr)` }}>
            {compareIdeas.map((idea, idx) => {
              const color = COLORS[selected.indexOf(idea.id)];
              const isWinner = overall?.id === idea.id;
              return (
                <div
                  key={idea.id}
                  className="rounded-2xl p-5 text-center relative"
                  style={{
                    background: `${color}10`,
                    border: `1px solid ${color}30`,
                    boxShadow: isWinner ? `0 0 20px ${color}20` : 'none',
                  }}
                >
                  {isWinner && compareIdeas.length > 1 && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-2.5 py-0.5 rounded-full font-golos font-semibold"
                      style={{ background: color, color: '#0f1117' }}
                    >
                      Лидер
                    </div>
                  )}
                  <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ background: color }} />
                  <h3 className="font-syne text-lg font-semibold text-foreground mb-1">{idea.title}</h3>
                  <span className="text-[10px] text-muted-foreground font-golos">{idea.category}</span>
                  <div
                    className="text-4xl font-bold font-syne mt-3"
                    style={{ color }}
                  >
                    {idea.score}
                  </div>
                  <div className="text-xs text-muted-foreground font-golos">Общий балл</div>
                </div>
              );
            })}
          </div>

          {/* Metrics comparison table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold font-golos text-foreground">Сравнение по метрикам</p>
            </div>
            <div className="divide-y divide-border">
              {METRICS.map(m => {
                const winnerId = getWinner(m.key);
                return (
                  <div key={m.key} className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name={m.icon} size={13} className="text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground font-golos uppercase tracking-wider">{m.label}</span>
                    </div>
                    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${compareIdeas.length}, 1fr)` }}>
                      {compareIdeas.map(idea => {
                        const color = COLORS[selected.indexOf(idea.id)];
                        const val = (idea.analysis as Record<string, number>)[m.key] || 0;
                        const isWinner = winnerId === idea.id;
                        return (
                          <div key={idea.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-muted-foreground font-golos truncate">{idea.title}</span>
                              <span
                                className="text-xs font-bold font-golos"
                                style={{ color: isWinner ? color : 'hsl(215, 20.2%, 65.1%)' }}
                              >
                                {val}{isWinner && ' ★'}
                              </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${val}%`,
                                  background: isWinner ? color : `${color}60`
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {overall && (
            <div className="glow-border rounded-2xl p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-golos mb-3 flex items-center gap-1.5">
                <Icon name="Trophy" size={12} className="text-gold-DEFAULT" /> Вывод сравнения
              </p>
              <p className="text-sm font-golos text-foreground">
                По совокупности показателей лидирует <strong className="text-gold-light">"{overall.title}"</strong> с общим баллом <strong className="text-gold-light">{overall.score}</strong>.{' '}
                {overall.score > 70
                  ? 'Идея показывает высокий потенциал и достойна детального рассмотрения.'
                  : 'Идея имеет умеренный потенциал — стоит проработать слабые метрики перед принятием решения.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}