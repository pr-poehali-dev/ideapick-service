import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface LandingProps {
  onEnterApp: () => void;
}

const features = [
  {
    icon: 'Sparkles',
    title: 'Генерация идей',
    desc: 'ИИ-помощник задаёт умные вопросы и помогает сформулировать идею чётко и конкретно',
    color: 'gold',
  },
  {
    icon: 'Filter',
    title: 'Фильтрация',
    desc: 'Система оценки по 6 критериям отсеивает слабые идеи, оставляя только перспективные',
    color: 'purple',
  },
  {
    icon: 'BarChart3',
    title: 'Анализ рынка',
    desc: 'Оценка объёма рынка, целевой аудитории, конкурентного ландшафта и ключевых рисков',
    color: 'gold',
  },
  {
    icon: 'GitCompare',
    title: 'Сравнение идей',
    desc: 'Визуальное сравнение нескольких идей по всем метрикам для принятия лучшего решения',
    color: 'purple',
  },
  {
    icon: 'Target',
    title: 'Финальное решение',
    desc: 'Структурированный фреймворк помогает принять взвешенное решение: делать или нет',
    color: 'gold',
  },
  {
    icon: 'Archive',
    title: 'База знаний',
    desc: 'Все идеи хранятся в одном месте с историей изменений и статусами',
    color: 'purple',
  },
];

const steps = [
  { num: '01', title: 'Накидайте идеи', desc: 'Опишите свои задумки — от сырых мыслей до конкретных концепций' },
  { num: '02', title: 'Отфильтруйте', desc: 'Система оценит каждую по рыночному потенциалу, сложности и новизне' },
  { num: '03', title: 'Углубитесь', desc: 'Проведите полный анализ: рынок, конкуренты, аудитория, риски' },
  { num: '04', title: 'Решайте', desc: 'Сравните оставшиеся и примите финальное осознанное решение' },
];

const testimonials = [
  { name: 'Алексей М.', role: 'Инди-разработчик', text: 'За месяц отсеял 12 слабых идей и нашёл одну стоящую. Ideapick сэкономил мне полгода жизни.' },
  { name: 'Маша К.', role: 'Основатель стартапа', text: 'Наконец-то есть инструмент, который не даёт заниматься самообманом. Анализ рисков просто огонь.' },
  { name: 'Денис Р.', role: 'Продакт-менеджер', text: 'Использую для фильтрации фич в продукте. Команда перестала спорить — данные всё решают.' },
];

export default function Landing({ onEnterApp }: LandingProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen mesh-bg relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-gold w-[600px] h-[600px] top-[-200px] left-[-200px] animate-pulse-glow" />
      <div className="orb orb-purple w-[500px] h-[500px] bottom-[10%] right-[-150px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="grid-lines absolute inset-0 opacity-40" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-DEFAULT to-gold-dark flex items-center justify-center">
            <span className="text-sm font-bold text-[#0f1117]">I</span>
          </div>
          <span className="font-cormorant text-xl font-semibold text-foreground">Ideapick</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Возможности</a>
          <a href="#how" className="hover:text-foreground transition-colors">Как работает</a>
          <a href="#reviews" className="hover:text-foreground transition-colors">Отзывы</a>
        </div>
        <button
          onClick={onEnterApp}
          className="btn-gold px-5 py-2 rounded-xl text-sm"
        >
          Войти в платформу →
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div
          className="inline-flex items-center gap-2 tag-pill mb-8"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
        >
          <span>✦</span> Для разработчиков и соло-предпринимателей
        </div>

        <h1
          className="font-cormorant text-6xl md:text-8xl font-light leading-[0.95] mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 0.15s'
          }}
        >
          От идеи —<br />
          <em className="gradient-text-animated not-italic">к решению</em>
        </h1>

        <p
          className="font-golos text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease 0.3s'
          }}
        >
          Ideapick помогает пройти весь путь: сгенерировать идею, отфильтровать слабые,
          проанализировать потенциал и принять обоснованное решение — делать или нет.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease 0.45s'
          }}
        >
          <button
            onClick={onEnterApp}
            className="btn-gold px-8 py-4 rounded-2xl text-base w-full sm:w-auto"
          >
            Начать бесплатно
          </button>
          <button
            onClick={onEnterApp}
            className="px-8 py-4 rounded-2xl text-base border border-border text-muted-foreground hover:border-gold-DEFAULT hover:text-foreground transition-all w-full sm:w-auto font-golos"
          >
            Смотреть демо →
          </button>
        </div>

        {/* Hero visual */}
        <div
          className="mt-20 relative max-w-4xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease 0.6s'
          }}
        >
          <div className="glow-border rounded-3xl p-1 animate-float">
            <div className="bg-card rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 h-7 bg-secondary rounded-lg flex items-center px-3">
                  <span className="text-xs text-muted-foreground">ideapick.app / dashboard</span>
                </div>
              </div>
              {/* Mock dashboard */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Всего идей', val: '24', icon: 'Lightbulb', col: 'gold' },
                  { label: 'На анализе', val: '7', icon: 'BarChart3', col: 'purple' },
                  { label: 'Одобрено', val: '3', icon: 'CheckCircle', col: 'green' },
                ].map((s, i) => (
                  <div key={i} className="glass-card rounded-2xl p-4 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name={s.icon} size={14} className={s.col === 'gold' ? 'text-gold-DEFAULT' : s.col === 'purple' ? 'text-purple-DEFAULT' : 'text-green-400'} />
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                    </div>
                    <div className={`font-cormorant text-3xl font-semibold ${s.col === 'gold' ? 'text-gold-light' : s.col === 'purple' ? 'text-purple-light' : 'text-green-400'}`}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: 'SaaS для фрилансеров', score: 87, status: 'Одобрено', sc: 'approved' },
                  { name: 'Агрегатор подкастов', score: 54, status: 'Анализ', sc: 'analyzing' },
                  { name: 'Маркетплейс шаблонов', score: 72, status: 'Готово', sc: 'ready' },
                ].map((idea, i) => (
                  <div key={i} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                        <Icon name="Lightbulb" size={14} className="text-gold-DEFAULT" />
                      </div>
                      <span className="text-sm font-golos text-foreground">{idea.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${idea.score}%`,
                              background: idea.score > 75 ? '#4ADE80' : idea.score > 50 ? '#D4A843' : '#F87171'
                            }}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${idea.score > 75 ? 'score-high' : idea.score > 50 ? 'score-mid' : 'score-low'}`}>{idea.score}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full status-${idea.sc}`}>{idea.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '10к+', label: 'Идей проанализировано' },
            { val: '94%', label: 'Точность фильтрации' },
            { val: '3х', label: 'Быстрее к решению' },
            { val: '2 мин', label: 'Базовый анализ' },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-cormorant text-4xl font-semibold gradient-text mb-1">{s.val}</div>
              <div className="text-sm text-muted-foreground font-golos">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <div className="tag-pill inline-flex items-center gap-2 mb-6">✦ Возможности</div>
          <h2 className="font-cormorant text-5xl md:text-6xl font-light mb-4">
            Всё что нужно для <em className="gradient-text not-italic">умного решения</em>
          </h2>
          <p className="text-muted-foreground font-golos max-w-xl mx-auto">
            Шесть инструментов, которые работают вместе как единая система валидации идей
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className={`glass-card rounded-2xl p-6 ${f.color === 'purple' ? '' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color === 'gold' ? 'bg-[var(--gold-dim)]' : 'bg-[var(--purple-dim)]'}`}>
                <Icon name={f.icon} size={18} className={f.color === 'gold' ? 'text-gold-DEFAULT' : 'text-purple-DEFAULT'} />
              </div>
              <h3 className="font-cormorant text-xl font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground font-golos leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 py-28 overflow-hidden">
        <div className="orb orb-gold w-[400px] h-[400px] top-0 left-1/2 -translate-x-1/2 opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="tag-pill inline-flex items-center gap-2 mb-6">✦ Процесс</div>
            <h2 className="font-cormorant text-5xl md:text-6xl font-light">Как это работает</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {steps.map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl glow-border flex items-center justify-center mx-auto mb-5 bg-card">
                  <span className="font-cormorant text-2xl font-semibold gradient-text">{s.num}</span>
                </div>
                <h3 className="font-cormorant text-xl font-semibold mb-2 text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-golos leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <div className="tag-pill inline-flex items-center gap-2 mb-6">✦ Отзывы</div>
          <h2 className="font-cormorant text-5xl md:text-6xl font-light">
            Что говорят <em className="gradient-text not-italic">пользователи</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-gold-DEFAULT text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-golos leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-DEFAULT to-purple-DEFAULT flex items-center justify-center">
                  <span className="text-xs font-bold text-[#0f1117]">{t.name[0]}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold font-golos text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <div className="glow-border rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="orb orb-gold w-[400px] h-[300px] top-[-100px] left-1/2 -translate-x-1/2 opacity-40" />
          <div className="relative">
            <div className="tag-pill inline-flex items-center gap-2 mb-6">✦ Начните сейчас</div>
            <h2 className="font-cormorant text-5xl md:text-7xl font-light mb-6">
              Ваша следующая большая идея<br />
              <em className="gradient-text-animated not-italic">ждёт решения</em>
            </h2>
            <p className="text-muted-foreground font-golos mb-10 max-w-xl mx-auto">
              Перестаньте гадать. Начните анализировать. Принимайте решения на основе данных.
            </p>
            <button onClick={onEnterApp} className="btn-gold px-10 py-4 rounded-2xl text-base">
              Открыть платформу →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gold-DEFAULT to-gold-dark flex items-center justify-center">
              <span className="text-xs font-bold text-[#0f1117]">I</span>
            </div>
            <span className="font-cormorant text-lg font-semibold">Ideapick</span>
          </div>
          <p className="text-xs text-muted-foreground font-golos">© 2025 Ideapick. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}