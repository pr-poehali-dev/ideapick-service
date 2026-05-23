import { useState } from 'react';
import { Idea } from '@/pages/Platform';
import Icon from '@/components/ui/icon';

interface Props {
  ideas: Idea[];
  selectedIdea: Idea | null;
  onSelectIdea: (id: string) => void;
  onUpdate: (idea: Idea) => void;
}

const QUESTIONS = [
  {
    id: 'problem',
    text: 'Проблема реальная?',
    desc: 'Вы лично сталкивались с этой проблемой или есть подтверждённые боли у целевой аудитории',
    yes: 'Да, подтверждено',
    no: 'Нет, предположение',
  },
  {
    id: 'willingness',
    text: 'Готовы ли платить?',
    desc: 'Есть признаки, что люди готовы платить за решение этой проблемы',
    yes: 'Готовы платить',
    no: 'Неизвестно',
  },
  {
    id: 'unfair',
    text: 'Есть преимущество?',
    desc: 'У вас есть опыт, связи или технология, которые дают преимущество перед конкурентами',
    yes: 'Есть преимущество',
    no: 'Нет особых преимуществ',
  },
  {
    id: 'mvp',
    text: 'Можно сделать MVP?',
    desc: 'Возможно создать минимальную версию за 4-8 недель, которую можно протестировать',
    yes: 'MVP реализуем',
    no: 'Долго и сложно',
  },
  {
    id: 'passion',
    text: 'Хочется делать?',
    desc: 'Вы готовы работать над этим 6–12 месяцев, даже если не будет быстрых результатов',
    yes: 'Хочу делать',
    no: 'Нет особого желания',
  },
];

const DECISION_MATRIX: Record<string, { label: string; color: string; bg: string; icon: string; desc: string }> = {
  '5': { label: 'Делать!', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', icon: 'Rocket', desc: 'Все ключевые критерии выполнены. Это сильная идея — начинайте работу немедленно.' },
  '4': { label: 'Скорее делать', color: '#D4A843', bg: 'rgba(212,168,67,0.1)', icon: 'ThumbsUp', desc: 'Большинство критериев выполнено. Проработайте слабые места перед стартом.' },
  '3': { label: 'Нужно проверить', color: '#F0A843', bg: 'rgba(240,168,67,0.08)', icon: 'FlaskConical', desc: 'Половина критериев — идея требует дополнительной валидации перед инвестицией времени.' },
  '2': { label: 'Сомнительно', color: '#F87171', bg: 'rgba(248,113,113,0.08)', icon: 'AlertTriangle', desc: 'Слишком много неизвестных. Либо переосмыслите идею, либо отложите её.' },
  '1': { label: 'Не делать', color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: 'XCircle', desc: 'Идея не прошла проверку. Сфокусируйтесь на других возможностях.' },
  '0': { label: 'Не делать', color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: 'XCircle', desc: 'Идея не прошла проверку. Сфокусируйтесь на других возможностях.' },
};

export default function IdeaDecision({ ideas, selectedIdea, onSelectIdea, onUpdate }: Props) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [note, setNote] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (id: string) => {
    onSelectIdea(id);
    setAnswers({});
    setNote('');
    setShowResult(false);
    // Pre-fill note from existing decision
    const idea = ideas.find(i => i.id === id);
    if (idea?.decision) setNote(idea.decision);
  };

  const setAnswer = (questionId: string, val: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
    setShowResult(false);
  };

  const answeredCount = Object.values(answers).filter(v => v !== null && v !== undefined).length;
  const yesCount = Object.values(answers).filter(v => v === true).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const decisionKey = String(Math.max(0, Math.min(5, yesCount)));
  const decision = DECISION_MATRIX[decisionKey];

  const handleSaveDecision = () => {
    if (!selectedIdea) return;
    const newStatus: Idea['status'] = yesCount >= 4 ? 'approved' : yesCount <= 1 ? 'rejected' : 'ready';
    onUpdate({
      ...selectedIdea,
      status: newStatus,
      decision: note || decision.label,
      score: Math.max(selectedIdea.score, yesCount * 18),
    });
    setShowResult(true);
  };

  return (
    <div className="space-y-5">
      {/* Idea selector */}
      <div className="glass-card rounded-2xl p-4">
        <p className="text-xs text-muted-foreground font-golos uppercase tracking-wider mb-3">Выберите идею для оценки</p>
        <div className="flex flex-wrap gap-2">
          {ideas.map(idea => (
            <button
              key={idea.id}
              onClick={() => handleSelect(idea.id)}
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
          <Icon name="Target" size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-syne text-2xl font-light mb-2">Выберите идею</p>
          <p className="text-sm font-golos">Пройдите 5-шаговый фреймворк принятия решений</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Questions */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-syne text-xl font-semibold text-foreground">Фреймворк решения</h3>
              <span className="text-xs text-muted-foreground font-golos">{answeredCount}/{QUESTIONS.length} ответов</span>
            </div>

            {/* Progress */}
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(answeredCount / QUESTIONS.length) * 100}%`,
                  background: 'linear-gradient(90deg, #D4A843, #9B72CF)'
                }}
              />
            </div>

            {QUESTIONS.map((q, i) => {
              const ans = answers[q.id];
              return (
                <div
                  key={q.id}
                  className={`glass-card rounded-2xl p-5 transition-all ${
                    ans !== undefined ? (ans ? 'border-green-500/20' : 'border-red-500/20') : ''
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-syne text-sm font-bold"
                      style={{
                        background: ans !== undefined ? (ans ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)') : 'var(--gold-dim)',
                        color: ans !== undefined ? (ans ? '#4ADE80' : '#F87171') : '#D4A843',
                        border: `1px solid ${ans !== undefined ? (ans ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)') : 'rgba(212,168,67,0.3)'}`
                      }}
                    >
                      {ans !== undefined ? (ans ? '✓' : '✗') : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-golos font-semibold text-foreground text-sm mb-1">{q.text}</p>
                      <p className="text-xs text-muted-foreground font-golos leading-relaxed">{q.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-10">
                    <button
                      onClick={() => setAnswer(q.id, true)}
                      className={`flex-1 py-2 rounded-xl text-xs font-golos font-medium transition-all flex items-center justify-center gap-1.5 ${
                        ans === true
                          ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                          : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                      }`}
                    >
                      <Icon name="Check" size={11} /> {q.yes}
                    </button>
                    <button
                      onClick={() => setAnswer(q.id, false)}
                      className={`flex-1 py-2 rounded-xl text-xs font-golos font-medium transition-all flex items-center justify-center gap-1.5 ${
                        ans === false
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                      }`}
                    >
                      <Icon name="X" size={11} /> {q.no}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decision panel */}
          <div className="lg:col-span-1 space-y-4">
            <div
              className="rounded-2xl p-5"
              style={{
                background: allAnswered ? decision.bg : 'rgba(255,255,255,0.025)',
                border: `1px solid ${allAnswered ? decision.color + '40' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: allAnswered ? `0 0 30px ${decision.color}10` : 'none',
                transition: 'all 0.5s ease',
              }}
            >
              {allAnswered ? (
                <>
                  <div className="text-center mb-4">
                    <Icon name={decision.icon} size={36} className="mx-auto mb-3" style={{ color: decision.color }} />
                    <div className="font-syne text-3xl font-bold mb-1" style={{ color: decision.color }}>
                      {decision.label}
                    </div>
                    <div className="text-xs text-muted-foreground font-golos">{yesCount} из 5 критериев</div>
                  </div>
                  <p className="text-xs text-muted-foreground font-golos leading-relaxed mb-4">{decision.desc}</p>
                </>
              ) : (
                <div className="text-center py-4">
                  <Icon name="Target" size={32} className="mx-auto mb-3 text-muted-foreground opacity-40" />
                  <p className="font-syne text-xl font-light text-foreground mb-1">Ваш вердикт</p>
                  <p className="text-xs text-muted-foreground font-golos">Ответьте на все 5 вопросов</p>
                </div>
              )}

              {/* Progress indicator */}
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {QUESTIONS.map((q, i) => {
                  const ans = answers[q.id];
                  return (
                    <div
                      key={i}
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        background: ans === true ? '#4ADE80' : ans === false ? '#F87171' : 'hsl(220, 15%, 16%)'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Note */}
            <div className="glass-card rounded-2xl p-4">
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-golos block mb-2">Заметки к решению</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Напишите ваши мысли, условия, следующие шаги..."
                rows={4}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold-DEFAULT transition-colors font-golos resize-none"
              />
            </div>

            {allAnswered && (
              <button
                onClick={handleSaveDecision}
                className="w-full btn-gold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Icon name="Save" size={14} />
                Сохранить решение
              </button>
            )}

            {showResult && (
              <div className="glass-card rounded-xl p-4 text-center animate-scale-in">
                <Icon name="CheckCircle" size={20} className="mx-auto mb-2 text-green-400" />
                <p className="text-sm font-golos text-foreground">Решение сохранено!</p>
                <p className="text-xs text-muted-foreground mt-1">Статус идеи обновлён</p>
              </div>
            )}

            {/* Existing decision */}
            {selectedIdea.decision && !showResult && (
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-golos mb-2">Текущее решение</p>
                <p className="text-sm font-golos text-foreground">{selectedIdea.decision}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}