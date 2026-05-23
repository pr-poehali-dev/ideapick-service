import { useState } from 'react';
import { Idea } from '@/pages/Platform';
import Icon from '@/components/ui/icon';

interface Props {
  onAdd: (idea: Idea) => void;
}

const CATEGORIES = ['SaaS', 'Маркетплейс', 'Dev Tools', 'Медиа', 'Здоровье', 'Образование', 'Финтех', 'E-commerce', 'B2B', 'B2C', 'Другое'];

const PROMPTS = [
  { icon: '⚡', text: 'Инструмент для разработчиков' },
  { icon: '💡', text: 'SaaS для малого бизнеса' },
  { icon: '🎯', text: 'Нишевый маркетплейс' },
  { icon: '🤖', text: 'AI-powered продукт' },
  { icon: '📊', text: 'Аналитика и метрики' },
  { icon: '🌱', text: 'Инди-продукт за выходные' },
];

const TAGS_OPTIONS = ['SaaS', 'B2C', 'B2B', 'AI', 'Dev Tools', 'Фриланс', 'Маркетплейс', 'Медиа', 'Health', 'Финтех', 'Нет-кода', 'Open Source'];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function estimateScore(title: string, desc: string, category: string): number {
  let score = 40;
  if (title.length > 10) score += 10;
  if (desc.length > 50) score += 15;
  if (desc.length > 150) score += 10;
  if (category !== 'Другое') score += 10;
  if (['SaaS', 'Dev Tools', 'Финтех'].includes(category)) score += 10;
  score += Math.floor(Math.random() * 15);
  return Math.min(score, 95);
}

export default function IdeaGenerator({ onAdd }: Props) {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');

  const handlePromptClick = (p: string) => {
    setPrompt(p);
    setDescription(prev => prev ? prev : `Идея связана с направлением: ${p}. `);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const canPreview = title.trim().length > 2 && description.trim().length > 10 && category;

  const handlePreview = () => {
    if (canPreview) setStep('preview');
  };

  const score = canPreview ? estimateScore(title, description, category) : 0;

  const handleAdd = () => {
    const idea: Idea = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      category,
      score,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0],
      tags: selectedTags.length ? selectedTags : [category],
    };
    onAdd(idea);
    setTitle('');
    setDescription('');
    setCategory('');
    setSelectedTags([]);
    setPrompt('');
    setStep('form');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-syne text-3xl font-light text-foreground mb-2">Новая идея</h2>
        <p className="text-sm text-muted-foreground font-golos">Опишите вашу идею — система оценит её потенциал</p>
      </div>

      {step === 'form' ? (
        <div className="space-y-5">
          {/* Quick prompts */}
          <div className="glass-card rounded-2xl p-5">
            <p className="text-xs text-muted-foreground font-golos mb-3 uppercase tracking-wider">Быстрый старт — выберите направление</p>
            <div className="flex flex-wrap gap-2">
              {PROMPTS.map(p => (
                <button
                  key={p.text}
                  onClick={() => handlePromptClick(p.text)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-golos font-medium transition-all ${
                    prompt === p.text
                      ? 'bg-[var(--gold-dim)] text-gold-light border border-[rgba(212,168,67,0.3)]'
                      : 'bg-secondary text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  <span>{p.icon}</span> {p.text}
                </button>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-golos uppercase tracking-wider block mb-2">Название идеи *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Например: SaaS для управления фрилансерами"
                maxLength={80}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-DEFAULT transition-colors font-golos"
              />
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-muted-foreground">{title.length}/80</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-golos uppercase tracking-wider block mb-2">Описание *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Что это за продукт? Какую проблему решает? Для кого? Чем отличается от существующих решений?"
                rows={4}
                maxLength={500}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-DEFAULT transition-colors font-golos resize-none"
              />
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-muted-foreground">{description.length}/500</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-golos uppercase tracking-wider block mb-2">Категория *</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-golos font-medium transition-all ${
                      category === cat
                        ? 'bg-[var(--gold-dim)] text-gold-light border border-[rgba(212,168,67,0.3)]'
                        : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-golos uppercase tracking-wider block mb-2">Теги</label>
              <div className="flex flex-wrap gap-2">
                {TAGS_OPTIONS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-golos font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-[var(--purple-dim)] text-purple-light border border-[rgba(155,114,207,0.3)]'
                        : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              disabled={!canPreview}
              className="flex-1 btn-gold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              <Icon name="Eye" size={15} />
              Предпросмотр и оценка
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-scale-in">
          <div className="glow-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="tag-pill mb-3 inline-block">{category}</span>
                <h3 className="font-syne text-2xl font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground font-golos mt-1.5 leading-relaxed">{description}</p>
              </div>
              <div className="ml-4 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-syne text-2xl font-bold"
                  style={{
                    background: score > 75 ? 'rgba(74, 222, 128, 0.1)' : score > 50 ? 'rgba(212, 168, 67, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                    border: `1px solid ${score > 75 ? 'rgba(74,222,128,0.3)' : score > 50 ? 'rgba(212,168,67,0.3)' : 'rgba(248,113,113,0.3)'}`,
                    color: score > 75 ? '#4ADE80' : score > 50 ? '#D4A843' : '#F87171'
                  }}
                >
                  {score}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 font-golos">Потенциал</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Рынок', icon: 'TrendingUp', val: score > 60 ? 'Средний+' : 'Нишевый' },
                { label: 'Сложность', icon: 'Wrench', val: score > 70 ? 'Высокая' : 'Средняя' },
                { label: 'Новизна', icon: 'Sparkles', val: score > 65 ? 'Высокая' : 'Умеренная' },
              ].map((m, i) => (
                <div key={i} className="bg-secondary rounded-xl p-3 text-center">
                  <Icon name={m.icon} size={14} className="mx-auto mb-1 text-gold-DEFAULT" />
                  <div className="text-xs font-semibold text-foreground font-golos">{m.val}</div>
                  <div className="text-[10px] text-muted-foreground">{m.label}</div>
                </div>
              ))}
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {selectedTags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-golos">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('form')}
              className="px-5 py-3.5 rounded-xl text-sm border border-border text-muted-foreground hover:border-gold-DEFAULT hover:text-foreground transition-all font-golos"
            >
              ← Изменить
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 btn-gold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <Icon name="Plus" size={15} />
              Добавить в коллекцию
            </button>
          </div>
        </div>
      )}
    </div>
  );
}