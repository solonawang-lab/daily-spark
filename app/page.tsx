'use client';

import { useState, useEffect, useCallback } from 'react';
import { Category, categoryLabels } from '@/lib/quotes';
import { Style, styles, getAllStyles } from '@/lib/styles';

const wallpaperSamples = [
  { image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=1200&fit=crop', quote: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { image: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&h=1200&fit=crop', quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=1200&fit=crop', quote: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
  { image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&h=1200&fit=crop', quote: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche' },
  { image: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=600&h=1200&fit=crop', quote: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
];

function WallpaperCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % wallpaperSamples.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + wallpaperSamples.length) % wallpaperSamples.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const getIndex = (offset: number) => {
    return (current + offset + wallpaperSamples.length) % wallpaperSamples.length;
  };

  return (
    <div 
      className="pb-24"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative max-w-3xl mx-auto px-4">
        {/* Arrows */}
        <button 
          onClick={prev}
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={next}
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Phones Carousel */}
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {[-1, 0, 1].map((offset) => {
            const index = getIndex(offset);
            const isCenter = offset === 0;
            return (
              <div 
                key={`${current}-${offset}`}
                className={`transition-all duration-500 ease-out ${
                  isCenter 
                    ? 'w-[180px] md:w-[200px] z-10 scale-100 opacity-100' 
                    : 'w-[140px] md:w-[160px] scale-90 opacity-60 hidden sm:block'
                }`}
              >
                <div className="aspect-[9/19] rounded-[2rem] bg-slate-900 p-1 shadow-2xl shadow-slate-300/50">
                  <div className="w-full h-full rounded-[1.75rem] overflow-hidden relative">
                    <img 
                      src={wallpaperSamples[index].image} 
                      alt="Wallpaper preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="text-center">
                        <p className={`text-white font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${isCenter ? 'text-xs md:text-sm' : 'text-[10px]'}`}>
                          &quot;{wallpaperSamples[index].quote}&quot;
                        </p>
                        <p className={`text-white/80 mt-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${isCenter ? 'text-[10px] md:text-xs' : 'text-[8px]'}`}>
                          — {wallpaperSamples[index].author}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {wallpaperSamples.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-slate-700 w-6' : 'bg-slate-300 hover:bg-slate-400 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<Category>('stoicism');
  const [style, setStyle] = useState<Style>('nature');
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

  useEffect(() => setMounted(true), []);

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
      <div className="min-h-screen bg-[#FAFBFF]">
        {/* Soft gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-emerald-100/50 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative">
          {/* Nav */}
          <nav className="container mx-auto px-6 py-6 flex justify-between items-center max-w-4xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                </svg>
              </div>
              <span className="text-slate-800 font-semibold">Daily Spark</span>
            </div>
            <button 
              onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-slate-500 hover:text-emerald-600 transition-colors"
            >
              Try free
            </button>
          </nav>

          {/* Hero */}
          <div className="container mx-auto px-6 pt-20 pb-16 max-w-2xl text-center">
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
                Daily motivation<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  on your lock screen.
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed mb-12">
                A powerful quote and striking visual, delivered before you wake. 
                Prime your mind. Set your intention. Own your day.
              </p>

              {/* Email signup */}
              <form onSubmit={handleEmailSubmit} id="signup" className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 px-4 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    Spark my day
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <p className="text-slate-400 text-sm mt-4">
                  Free for 7 days · Then from $6.58/mo
                </p>
              </form>
            </div>
          </div>

          {/* Wallpaper Carousel */}
          <WallpaperCarousel />

          {/* How it works */}
          <div className="bg-white border-y border-slate-100">
            <div className="container mx-auto px-6 py-20 max-w-3xl">
              <p className="text-center text-emerald-600 text-sm font-medium mb-12">How it works</p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-2">Pick your theme</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Stoicism, productivity, success, or fitness — choose what fuels you.</p>
                </div>
                
                {/* Step 2 */}
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-2">We craft overnight</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">A fresh wallpaper and quote, generated and delivered while you sleep.</p>
                </div>
                
                {/* Step 3 */}
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-2">Wake up inspired</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Start every day focused, motivated, and ready to take action.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="container mx-auto px-6 py-20 max-w-lg">
            <div className="text-center mb-10">
              <p className="text-emerald-600 text-sm font-medium mb-2">Start free, stay inspired</p>
              <h2 className="text-2xl font-bold text-slate-900">7 days free, then pick your plan</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Monthly */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                <p className="text-slate-500 text-sm font-medium mb-2">Monthly</p>
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="text-3xl font-bold text-slate-900">$9</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <p className="text-slate-400 text-xs mb-6">Flexible, cancel anytime</p>
                <button
                  onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Start free trial
                </button>
              </div>
              
              {/* Annual - Highlighted */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-amber-900 text-xs font-semibold rounded-full">
                  BEST VALUE
                </div>
                <p className="text-emerald-100 text-sm font-medium mb-2">Annual</p>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-3xl font-bold text-white">$79</span>
                  <span className="text-emerald-200">/year</span>
                </div>
                <p className="text-emerald-200 text-xs mb-6">Less than a coffee a week · Save 27%</p>
                <button
                  onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-2.5 bg-white text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  Start free trial
                </button>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">365 days of motivation · AI-crafted wallpapers · iOS automation included</p>
            </div>
          </div>

          {/* Footer */}
          <footer className="container mx-auto px-6 py-8 max-w-4xl border-t border-slate-100">
            <div className="flex justify-between items-center text-sm text-slate-400">
              <span>Daily Spark</span>
              <span>Fuel for your best days</span>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // Preferences
  if (step === 'preferences') {
    return (
      <div className="min-h-screen bg-[#FAFBFF]">
        <div className="container mx-auto px-6 py-12 max-w-md">
          <button onClick={() => setStep('landing')} className="text-slate-400 hover:text-slate-600 mb-10 flex items-center gap-2 text-sm">
            ← Back
          </button>

          <div className="mb-10">
            <p className="text-slate-400 text-sm mb-1">{email}</p>
            <h1 className="text-2xl font-bold text-slate-900">What fuels you?</h1>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">Quote category</label>
            <div className="grid grid-cols-2 gap-2">
              {(['stoicism', 'productivity', 'success', 'fitness'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    category === cat
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium">{categoryLabels[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3">Visual style</label>
            <div className="grid grid-cols-2 gap-2">
              {getAllStyles().map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    style === s
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium">{styles[s].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-sm font-medium text-slate-700 mb-3">Delivery time</label>
            <div className="flex gap-2">
              {['5am', '6am', '7am'].map((time) => (
                <button
                  key={time}
                  onClick={() => setDeliveryTime(time)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                    deliveryTime === time
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

          <button
            onClick={handleGeneratePreview}
            disabled={isLoading}
            className="w-full py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating preview...' : 'Preview my wallpaper'}
          </button>
        </div>
      </div>
    );
  }

  // Preview
  if (step === 'preview' && previewWallpaper) {
    return (
      <div className="min-h-screen bg-[#FAFBFF]">
        <div className="container mx-auto px-6 py-12 max-w-md">
          <button onClick={() => setStep('preferences')} className="text-slate-400 hover:text-slate-600 mb-10 flex items-center gap-2 text-sm">
            ← Back
          </button>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">This is your daily spark</h1>
            <p className="text-slate-500">Imagine starting every day with this energy</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-[180px] aspect-[9/19] rounded-[1.75rem] bg-slate-900 p-1.5 shadow-xl">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
                <img src={previewWallpaper.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="text-center mb-10 px-4 py-5 bg-white rounded-xl border border-slate-100">
            <p className="text-slate-700 italic text-sm mb-1">&quot;{previewWallpaper.quote}&quot;</p>
            <p className="text-slate-400 text-xs">— {previewWallpaper.author}</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

          <div className="space-y-3">
            <button
              onClick={() => handleSubscribe('annual')}
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Setting things up...' : 'Go Annual · $79/year (save 27%)'}
            </button>
            <button
              onClick={() => handleSubscribe('free')}
              disabled={isLoading}
              className="w-full py-3.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Try free for 7 days
            </button>
          </div>

          <p className="text-slate-400 text-sm text-center mt-6">
            In your inbox by {deliveryTime} · No commitment · Cancel anytime
          </p>
        </div>
      </div>
    );
  }

  // Success
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Tomorrow starts differently</h1>
          <p className="text-slate-500 mb-8">
            Your first spark arrives at {deliveryTime}. Get ready to show up like you mean it.
          </p>
          
          <div className="bg-white border border-slate-100 rounded-xl p-5 mb-8 text-left">
            <h3 className="text-slate-900 font-medium mb-2">Make it effortless</h3>
            <p className="text-slate-500 text-sm mb-3">
              Our iOS Shortcut auto-sets your wallpaper overnight. Zero friction, maximum impact.
            </p>
            <a href="/shortcut" className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
              Set up automation →
            </a>
          </div>

          <button onClick={() => setStep('landing')} className="text-slate-400 hover:text-slate-600 text-sm">
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return null;
}
