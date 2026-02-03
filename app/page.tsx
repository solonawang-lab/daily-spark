'use client';

import { useState, useEffect } from 'react';
import { Category, categoryLabels } from '@/lib/quotes';
import { Style, styles, getAllStyles } from '@/lib/styles';

// Animated gradient background
function GradientOrb({ className }: { className?: string }) {
  return (
    <div 
      className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`}
      style={{ animationDuration: '4s' }}
    />
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<Category>('stoicism');
  const [style, setStyle] = useState<Style>('dark');
  const [deliveryTime, setDeliveryTime] = useState('6am');
  const [step, setStep] = useState<'landing' | 'preferences' | 'preview' | 'success'>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewWallpaper, setPreviewWallpaper] = useState<{
    imageUrl: string;
    quote: string;
    author: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    setError(null);
    setStep('preferences');
  };

  const handleGeneratePreview = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, style }),
      });
      
      if (!response.ok) throw new Error('Failed to generate preview');
      
      const data = await response.json();
      setPreviewWallpaper(data);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (plan: 'free' | 'annual') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, category, style, deliveryTime, plan }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Subscription failed');
      }

      const data = await response.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setStep('success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Landing page
  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-[#0a0a0b] overflow-hidden relative">
        {/* Ambient background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <GradientOrb className="w-[600px] h-[600px] -top-48 -left-48 bg-violet-600" />
          <GradientOrb className="w-[500px] h-[500px] top-1/3 -right-32 bg-amber-500" />
          <GradientOrb className="w-[400px] h-[400px] bottom-0 left-1/3 bg-rose-500" />
        </div>

        {/* Noise texture overlay */}
        <div 
          className="fixed inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
        />

        <div className="relative z-10">
          {/* Nav */}
          <nav className="container mx-auto px-6 py-6 flex justify-between items-center max-w-6xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <span className="text-black text-sm font-bold">S</span>
              </div>
              <span className="text-white font-medium tracking-tight">Daily Spark</span>
            </div>
            <button 
              onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Get started
            </button>
          </nav>

          {/* Hero */}
          <div className="container mx-auto px-6 pt-20 pb-32 max-w-4xl">
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-zinc-500 text-sm tracking-widest uppercase mb-6">
                For people who take mornings seriously
              </p>
              
              <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-semibold text-white leading-[1.1] tracking-tight mb-8">
                The first thing you see<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400">
                  shapes your day.
                </span>
              </h1>
              
              <p className="text-xl text-zinc-400 max-w-xl leading-relaxed mb-12">
                A premium wallpaper with a curated quote, generated fresh and delivered 
                to your inbox every morning. No effort required.
              </p>

              {/* Email signup */}
              <form onSubmit={handleEmailSubmit} id="signup" className="max-w-md">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="relative flex gap-2 p-1.5 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-zinc-600 focus:outline-none text-base"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all active:scale-[0.98]"
                    >
                      Start free
                    </button>
                  </div>
                </div>
                {error && <p className="text-rose-400 text-sm mt-3 ml-4">{error}</p>}
                <p className="text-zinc-600 text-sm mt-4 ml-4">
                  7 days free, then $49/year. Cancel anytime.
                </p>
              </form>
            </div>
          </div>

          {/* Preview section */}
          <div className="container mx-auto px-6 pb-32 max-w-6xl">
            <div className="relative">
              {/* Phone mockup */}
              <div className="relative mx-auto w-[280px] aspect-[9/19] rounded-[3rem] bg-zinc-900 p-3 shadow-2xl shadow-black/50 border border-zinc-800">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl" />
                <div className="w-full h-full rounded-[2.25rem] bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
                  <img 
                    src="/preview-wallpaper.jpg" 
                    alt="Example wallpaper"
                    className="w-full h-full object-cover opacity-90"
                    onError={(e) => {
                      // Fallback gradient if no preview image
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center">
                      <p className="text-white/90 text-lg font-serif italic leading-relaxed mb-4">
                        "The obstacle is the way."
                      </p>
                      <p className="text-white/60 text-sm">— Marcus Aurelius</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="hidden lg:block absolute -left-8 top-1/4 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-4 w-48 transform -rotate-6 shadow-xl">
                <p className="text-xs text-zinc-500 mb-1">Tomorrow, 6:00 AM</p>
                <p className="text-sm text-white">Your wallpaper is ready</p>
              </div>
              
              <div className="hidden lg:block absolute -right-8 top-1/3 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-4 w-52 transform rotate-6 shadow-xl">
                <p className="text-xs text-zinc-500 mb-1">Category</p>
                <p className="text-sm text-white">Stoicism</p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="container mx-auto px-6 pb-32 max-w-4xl">
            <h2 className="text-zinc-500 text-sm tracking-widest uppercase mb-12 text-center">How it works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  num: '01', 
                  title: 'Choose your theme', 
                  desc: 'Stoic philosophy, productivity wisdom, or motivational energy.' 
                },
                { 
                  num: '02', 
                  title: 'We do the rest', 
                  desc: 'Every morning, AI generates a unique wallpaper just for you.' 
                },
                { 
                  num: '03', 
                  title: 'Wake up inspired', 
                  desc: 'Open your phone to a fresh perspective. One tap to save.' 
                },
              ].map((item, i) => (
                <div key={i} className="group">
                  <p className="text-zinc-700 text-sm font-mono mb-4">{item.num}</p>
                  <h3 className="text-white text-lg font-medium mb-2 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="container mx-auto px-6 pb-32 max-w-xl">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
              <div className="relative bg-zinc-900/50 backdrop-blur border border-zinc-800/50 rounded-3xl p-8 md:p-10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-semibold text-white">$49</span>
                  <span className="text-zinc-500">/year</span>
                </div>
                <p className="text-zinc-500 mb-8">That's $4 per month. Less than one coffee.</p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    'Fresh AI wallpaper every morning',
                    'Curated quotes from philosophy to productivity',
                    '4 visual styles to match your aesthetic',
                    'iOS Shortcut for zero-tap automation',
                    'Cancel anytime, no questions asked',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-300">
                      <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-900 font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all active:scale-[0.99]"
                >
                  Start 7-day free trial
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="container mx-auto px-6 py-12 max-w-4xl border-t border-zinc-900">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-black text-xs font-bold">S</span>
                </div>
                <span className="text-zinc-600 text-sm">Daily Spark</span>
              </div>
              <p className="text-zinc-700 text-sm">
                Made for people who take their mornings seriously.
              </p>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // Preferences step
  if (step === 'preferences') {
    return (
      <div className="min-h-screen bg-[#0a0a0b]">
        <div className="container mx-auto px-6 py-12 max-w-lg">
          <button 
            onClick={() => setStep('landing')}
            className="text-zinc-600 hover:text-white mb-12 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="mb-12">
            <p className="text-zinc-600 text-sm mb-2">{email}</p>
            <h1 className="text-2xl font-semibold text-white">Customize your Daily Spark</h1>
          </div>

          {/* Category */}
          <div className="mb-10">
            <label className="block text-sm text-zinc-400 mb-4">What resonates with you?</label>
            <div className="grid grid-cols-2 gap-3">
              {(['stoicism', 'productivity', 'success', 'fitness'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    category === cat
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                  }`}
                >
                  <span className={`text-sm font-medium ${category === cat ? 'text-amber-400' : 'text-white'}`}>
                    {categoryLabels[cat]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-10">
            <label className="block text-sm text-zinc-400 mb-4">Visual style</label>
            <div className="grid grid-cols-2 gap-3">
              {getAllStyles().map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    style === s
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                  }`}
                >
                  <span className={`text-sm font-medium ${style === s ? 'text-amber-400' : 'text-white'}`}>
                    {styles[s].label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="mb-12">
            <label className="block text-sm text-zinc-400 mb-4">Delivery time</label>
            <div className="flex gap-3">
              {['5am', '6am', '7am'].map((time) => (
                <button
                  key={time}
                  onClick={() => setDeliveryTime(time)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                    deliveryTime === time
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 text-white'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGeneratePreview}
            disabled={isLoading}
            className="w-full py-4 bg-white text-zinc-900 font-semibold rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-50 active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </span>
            ) : (
              'Preview your first wallpaper'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Preview step
  if (step === 'preview' && previewWallpaper) {
    return (
      <div className="min-h-screen bg-[#0a0a0b]">
        <div className="container mx-auto px-6 py-12 max-w-lg">
          <button 
            onClick={() => setStep('preferences')}
            className="text-zinc-600 hover:text-white mb-12 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Change preferences
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Your first wallpaper</h1>
            <p className="text-zinc-500">This is what tomorrow morning looks like.</p>
          </div>

          {/* Phone preview */}
          <div className="relative mx-auto w-[260px] aspect-[9/19] rounded-[2.5rem] bg-zinc-900 p-2.5 shadow-2xl shadow-black/50 border border-zinc-800 mb-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl" />
            <div className="w-full h-full rounded-[2rem] overflow-hidden">
              <img
                src={previewWallpaper.imageUrl}
                alt="Preview wallpaper"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Quote */}
          <div className="text-center mb-10 px-4">
            <p className="text-zinc-300 italic mb-2">"{previewWallpaper.quote}"</p>
            <p className="text-zinc-600 text-sm">— {previewWallpaper.author}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
              {error}
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubscribe('annual')}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-900 font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? 'Processing...' : 'Subscribe — $49/year'}
            </button>
            <button
              onClick={() => handleSubscribe('free')}
              disabled={isLoading}
              className="w-full py-4 border border-zinc-800 text-zinc-300 font-medium rounded-xl hover:bg-zinc-900 transition-all disabled:opacity-50"
            >
              Start 7-day free trial
            </button>
          </div>

          <p className="text-zinc-700 text-sm text-center mt-6">
            Delivered daily at {deliveryTime} · Cancel anytime
          </p>
        </div>
      </div>
    );
  }

  // Success
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold text-white mb-3">You're all set</h1>
          <p className="text-zinc-400 mb-8">
            Your first wallpaper arrives tomorrow at {deliveryTime}.<br />
            Check your inbox for a welcome email.
          </p>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-white font-medium mb-3">Want zero-tap automation?</h3>
            <p className="text-zinc-500 text-sm mb-4">
              Our iOS Shortcut automatically sets your wallpaper every morning.
            </p>
            <a 
              href="/shortcut"
              className="inline-flex items-center gap-2 text-amber-400 text-sm hover:text-amber-300 transition-colors"
            >
              Set up iOS Shortcut
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <button
            onClick={() => setStep('landing')}
            className="text-zinc-600 hover:text-white transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return null;
}
