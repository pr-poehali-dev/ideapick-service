import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface AuthProps {
  onAuth: () => void;
  onBack: () => void;
}

type Step = 'choose' | 'magic-sent';

export default function Auth({ onAuth, onBack }: AuthProps) {
  const [step, setStep] = useState<Step>('choose');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleMagicLink = () => {
    if (!validateEmail(email)) {
      setEmailError('Введите корректный email');
      return;
    }
    setEmailError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('magic-sent');
    }, 1200);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth();
    }, 1000);
  };

  return (
    <div className="min-h-screen mesh-bg relative overflow-hidden flex items-center justify-center px-4">
      {/* Background orbs */}
      <div className="orb orb-gold w-[500px] h-[500px] top-[-150px] left-[-150px] animate-pulse-glow" />
      <div className="orb orb-purple w-[400px] h-[400px] bottom-[-100px] right-[-100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="grid-lines absolute inset-0 opacity-30" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-golos z-10"
      >
        <Icon name="ArrowLeft" size={16} />
        На главную
      </button>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {step === 'choose' ? (
          <div className="glow-border rounded-3xl p-8 bg-card">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-DEFAULT to-gold-dark flex items-center justify-center">
                <span className="text-base font-bold text-[#0f1117]">I</span>
              </div>
              <span className="font-golos text-xl font-semibold text-foreground">Ideapick</span>
            </div>

            <div className="text-center mb-8">
              <h1 className="font-golos text-2xl font-bold text-foreground mb-2">Войти в платформу</h1>
              <p className="text-sm text-muted-foreground font-golos">Выберите способ входа</p>
            </div>

            <div className="space-y-3">
              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl border border-border bg-secondary hover:bg-secondary/80 hover:border-gold-DEFAULT transition-all font-golos text-sm font-medium text-foreground disabled:opacity-50"
              >
                {loading ? (
                  <Icon name="Loader2" size={18} className="animate-spin text-muted-foreground" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                )}
                Продолжить с Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-golos">или по email</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Magic link */}
              <div className="space-y-2">
                <div className="relative">
                  <Icon name="Mail" size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleMagicLink()}
                    placeholder="your@email.com"
                    className={`w-full bg-secondary border rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors font-golos ${
                      emailError ? 'border-red-500/50 focus:border-red-500' : 'border-border focus:border-gold-DEFAULT'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-400 font-golos pl-1">{emailError}</p>
                )}
                <button
                  onClick={handleMagicLink}
                  disabled={loading || !email}
                  className="w-full btn-gold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {loading ? (
                    <Icon name="Loader2" size={15} className="animate-spin" />
                  ) : (
                    <Icon name="Zap" size={15} />
                  )}
                  Отправить Magic Link
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground font-golos mt-6 leading-relaxed">
              Нажимая «Войти», вы соглашаетесь с{' '}
              <span className="text-gold-DEFAULT cursor-pointer hover:underline">условиями использования</span>{' '}
              и{' '}
              <span className="text-gold-DEFAULT cursor-pointer hover:underline">политикой конфиденциальности</span>
            </p>
          </div>
        ) : (
          /* Magic link sent */
          <div className="glow-border rounded-3xl p-8 bg-card text-center animate-scale-in">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'var(--gold-dim)', border: '1px solid rgba(212,168,67,0.3)' }}
            >
              <Icon name="Mail" size={36} className="text-gold-DEFAULT" />
            </div>

            <h2 className="font-golos text-2xl font-bold text-foreground mb-3">Проверьте почту</h2>
            <p className="text-sm text-muted-foreground font-golos leading-relaxed mb-2">
              Мы отправили ссылку для входа на
            </p>
            <p className="text-sm font-semibold text-gold-light font-golos mb-6">{email}</p>
            <p className="text-xs text-muted-foreground font-golos mb-8">
              Ссылка действует 15 минут. Не забудьте проверить папку «Спам».
            </p>

            <div className="space-y-2">
              <button
                onClick={onAuth}
                className="w-full btn-gold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2"
              >
                <Icon name="ArrowRight" size={15} />
                Войти в демо-режиме
              </button>
              <button
                onClick={() => setStep('choose')}
                className="w-full py-3 rounded-2xl text-sm text-muted-foreground hover:text-foreground transition-colors font-golos"
              >
                ← Изменить email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
