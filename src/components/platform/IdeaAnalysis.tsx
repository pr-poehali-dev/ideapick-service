import { useState } from 'react';
import { Idea } from '@/pages/Platform';
import Icon from '@/components/ui/icon';

interface Props {
  ideas: Idea[];
  selectedIdea: Idea | null;
  onSelectIdea: (id: string) => void;
  onUpdate: (idea: Idea) => void;
}

const METRICS = [
  { key: 'market', label: 'Рынок', icon: 'TrendingUp', desc: 'Объём и потенциал рынка', color: 'gold' },
  { key: 'audience', label: 'Аудитория', icon: 'Users', desc: 'Доступность целевой аудитории', color: 'purple' },
  { key: 'competition', label: 'Конкуренция', icon: 'Swords', desc: 'Уровень конкурентного давления', color: 'gold' },
  { key: 'risk', label: 'Риски', icon: 'AlertTriangle', desc: 'Технические и рыночные риски', color: 'purple' },
  { key: 'effort', label: 'Усилия', icon: 'Wrench', desc: 'Объём работы для реализации', color: 'gold' },
  { key: 'novelty', label: 'Новизна', icon: 'Sparkles', desc: 'Уникальность идеи', color: 'purple' },
];

function RadarMetric({ label, value, color }: { label: string; value: number; color: string }) {
  const col = color === 'gold' ? '#D4A843' : '#9B72CF';
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-xs text-muted-foreground font-golos text-right shrink-0">{label}</div>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${col}80, ${col})` }}
        />
      </div>
      <div className="w-8 text-xs font-semibold font-golos text-right" style={{ color: col }}>{value}</div>
    </div>
  );
}

function MetricEditor({ metric, value, onChange }: { metric: typeof METRICS[0]; value: number; onChange: (v: number) => void }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon name={metric.icon} size={14} className={metric.color === 'gold' ? 'text-gold-DEFAULT' : 'text-purple-DEFAULT'} />
        <span className="text-sm font-semibold font-golos text-foreground">{metric.label}</span>
        <span className="ml-auto text-xs text-muted-foreground font-golos">{metric.desc}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-gold-DEFAULT"
        />
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-cormorant text-lg font-bold shrink-0"
          style={{
            background: metric.color === 'gold' ? 'var(--gold-dim)' : 'var(--purple-dim)',
            color: metric.color === 'gold' ? '#F0C96A' : '#C4A0F0',
            border: `1px solid ${metric.color === 'gold' ? 'rgba(212,168,67,0.3)' : 'rgba(155,114,207,0.3)'}`
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

const STRENGTH_LABELS: Record<string, { high: string; low: string }> = {
  market: { high: 'Большой растущий рынок', low: 'Нишевый или стагнирующий рынок' },
  audience: { high: 'Аудитория легко доступна', low: 'Сложно дотянуться до аудитории' },
  competition: { high: 'Мало конкурентов', low: 'Высокая конкуренция' },
  risk: { high: 'Управляемые риски', low: 'Высокие риски реализации' },
  effort: { high: 'Реализуемо быстро', low: 'Требует больших усилий' },
  novelty: { high: 'Уникальная идея', low: 'Похожие решения уже есть' },
};

export default function IdeaAnalysis({ ideas, selectedIdea, onSelectIdea, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [localAnalysis, setLocalAnalysis] = useState<Record<string, number>>({});

  const analysisIdeas = ideas.filter(i => i.status !== 'new');

  const startEdit = () => {
    if (!selectedIdea) return;
    setLocalAnalysis(selectedIdea.analysis || { market: 50, audience: 50, competition: 50, risk: 50, effort: 50, novelty: 50 });
    setEditing(true);
  };

  const saveEdit = () => {
    if (!selectedIdea) return;
    const avg = Math.round(Object.values(localAnalysis).reduce((a, b) => a + b, 0) / 6);
    onUpdate({
      ...selectedIdea,
      analysis: localAnalysis as Idea['analysis'],
      score: avg,
      status: selectedIdea.status === 'new' ? 'ready' : selectedIdea.status,
    });
    setEditing(false);
  };

  const analysis = selectedIdea?.analysis;
  const avgScore = analysis
    ? Math.round(Object.values(analysis).reduce((a, b) => a + b, 0) / 6)
    : 0;

  const strengths = analysis
    ? METRICS.filter(m => (analysis as Record<string, number>)[m.key] >= 65)
    : [];
  const weaknesses = analysis
    ? METRICS.filter(m => (analysis as Record<string, number>)[m.key] < 50)
    : [];

  return (
    <div className="space-y-5">
      {/* Idea selector */}
      <div className="glass-card rounded-2xl p-4">
        <p className="text-xs text-muted-foreground font-golos uppercase tracking-wider mb-3">Выберите идею для анализа</p>
        <div className="flex flex-wrap gap-2">
          {ideas.map(idea => (
            <button
              key={idea.id}
              onClick={() => { onSelectIdea(idea.id); setEditing(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-golos font-medium transition-all ${
                selectedIdea?.id === idea.id
                  ? 'bg-[var(--gold-dim)] text-gold-light border border-[rgba(212,168,67,0.3)]'
                  : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {idea.title}
            </button>
          ))}
        </div>
      </div>

      {!selectedIdea ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="BarChart3" size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-cormorant text-2xl font-light mb-2">Выберите идею</p>
          <p className="text-sm font-golos">Выберите идею выше для просмотра анализа</p>
        </div>
      ) : editing ? (
        <div className="space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <h3 className="font-cormorant text-xl font-semibold text-foreground">Редактирование анализа: {selectedIdea.title}</h3>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl text-sm border border-border text-muted-foreground hover:text-foreground transition-all font-golos">Отмена</button>
              <button onClick={saveEdit} className="btn-gold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                <Icon name="Save" size={13} /> Сохранить
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {METRICS.map(m => (
              <MetricEditor
                key={m.key}
                metric={m}
                value={localAnalysis[m.key] || 50}
                onChange={v => setLocalAnalysis(prev => ({ ...prev, [m.key]: v }))}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
          {/* Score overview */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glow-border rounded-2xl p-6 text-center">
              <div className="mb-2">
                <span className={`tag-pill ${selectedIdea.status === 'approved' ? 'tag-pill-purple' : ''}`}>
                  {selectedIdea.category}
                </span>
              </div>
              <h3 className="font-cormorant text-xl font-semibold text-foreground mb-4">{selectedIdea.title}</h3>

              {analysis ? (
                <>
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center font-cormorant text-4xl font-bold"
                    style={{
                      background: avgScore > 75 ? 'rgba(74,222,128,0.1)' : avgScore > 50 ? 'rgba(212,168,67,0.1)' : 'rgba(248,113,113,0.1)',
                      border: `2px solid ${avgScore > 75 ? 'rgba(74,222,128,0.4)' : avgScore > 50 ? 'rgba(212,168,67,0.4)' : 'rgba(248,113,113,0.4)'}`,
                      color: avgScore > 75 ? '#4ADE80' : avgScore > 50 ? '#D4A843' : '#F87171',
                      boxShadow: avgScore > 75 ? '0 0 30px rgba(74,222,128,0.15)' : avgScore > 50 ? '0 0 30px rgba(212,168,67,0.15)' : '0 0 30px rgba(248,113,113,0.15)',
                    }}
                  >
                    {avgScore}
                  </div>
                  <p className="text-xs text-muted-foreground font-golos mb-4">
                    {avgScore > 75 ? 'Высокий потенциал' : avgScore > 50 ? 'Средний потенциал' : 'Низкий потенциал'}
                  </p>
                </>
              ) : (
                <div className="py-6 text-muted-foreground">
                  <Icon name="BarChart3" size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-golos">Анализ не проведён</p>
                </div>
              )}

              <button
                onClick={startEdit}
                className="w-full btn-gold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Icon name={analysis ? 'Pencil' : 'Plus'} size={13} />
                {analysis ? 'Редактировать анализ' : 'Начать анализ'}
              </button>
            </div>

            {analysis && (
              <>
                {strengths.length > 0 && (
                  <div className="glass-card rounded-2xl p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-golos mb-3 flex items-center gap-1.5">
                      <Icon name="TrendingUp" size={12} className="text-green-400" /> Сильные стороны
                    </p>
                    <div className="space-y-1.5">
                      {strengths.map(m => (
                        <div key={m.key} className="flex items-center gap-2 text-xs font-golos">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                          <span className="text-foreground">{STRENGTH_LABELS[m.key].high}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {weaknesses.length > 0 && (
                  <div className="glass-card rounded-2xl p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-golos mb-3 flex items-center gap-1.5">
                      <Icon name="AlertTriangle" size={12} className="text-red-400" /> Слабые стороны
                    </p>
                    <div className="space-y-1.5">
                      {weaknesses.map(m => (
                        <div key={m.key} className="flex items-center gap-2 text-xs font-golos">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-foreground">{STRENGTH_LABELS[m.key].low}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Metrics breakdown */}
          <div className="lg:col-span-2 space-y-4">
            {analysis ? (
              <>
                <div className="glass-card rounded-2xl p-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-golos mb-5">Детальные метрики</p>
                  <div className="space-y-3">
                    {METRICS.map(m => (
                      <RadarMetric
                        key={m.key}
                        label={m.label}
                        value={(analysis as Record<string, number>)[m.key]}
                        color={m.color}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {METRICS.map(m => {
                    const val = (analysis as Record<string, number>)[m.key];
                    const col = m.color === 'gold' ? '#D4A843' : '#9B72CF';
                    const bg = m.color === 'gold' ? 'var(--gold-dim)' : 'var(--purple-dim)';
                    return (
                      <div key={m.key} className="glass-card rounded-xl p-4 text-center">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                          style={{ background: bg, border: `1px solid ${col}40` }}
                        >
                          <Icon name={m.icon} size={16} style={{ color: col }} />
                        </div>
                        <div className="font-cormorant text-2xl font-semibold mb-0.5" style={{ color: col }}>{val}</div>
                        <div className="text-xs text-muted-foreground font-golos">{m.label}</div>
                        <div className="text-[10px] text-muted-foreground mt-1 font-golos">
                          {val >= 65 ? '✓ Сильно' : val >= 45 ? '~ Средне' : '✗ Слабо'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="glass-card rounded-2xl p-8 text-center">
                <Icon name="BarChart3" size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="font-cormorant text-2xl font-light mb-2">Анализ не проведён</p>
                <p className="text-sm text-muted-foreground font-golos mb-6">Нажмите "Начать анализ" чтобы оценить идею по 6 ключевым метрикам</p>
                <button onClick={startEdit} className="btn-gold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2">
                  <Icon name="BarChart3" size={14} /> Начать анализ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
