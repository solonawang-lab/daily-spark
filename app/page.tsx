'use client';

import { useState, useEffect } from 'react';
import { Category, categoryLabels } from '@/lib/quotes';
import { Style, styles, getAllStyles } from '@/lib/styles';

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
      <div className="min-h-screen bg-stone-50">
        <div className="relative">
          {/* Nav */}
          <nav className="container mx-auto px-6 py-6 flex justify-between items-center max-w-5xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="text-stone-900 font-semibold tracking-tight">Daily Spark</span>
            </div>
            <button 
              onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Get started
            </button>
          </nav>

          {/* Hero */}
          <div className="container mx-auto px-6 pt-16 pb-24 max-w-3xl">
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-amber-700 text-sm font-medium tracking-wide mb-6">
                For people who take mornings seriously
              </p>
              
              <h1 className="text-[clamp(2.25rem,6vw,3.5rem)] font-semibold text-stone-900 leading-[1.15] tracking-tight mb-6">
                The first thing you see<br />
                shapes your day.
              </h1>
              
              <p className="text-lg text-stone-600 max-w-xl leading-relaxed mb-10">
                A premium wallpaper with a curated quote, generated fresh and delivered 
                to your inbox every morning. No effort required.
              </p>

              {/* Email signup */}
              <form onSubmit={handleEmailSubmit} id="signup" className="max-w-md">
                <div className="flex gap-2 p-1.5 bg-white border border-stone-200 rounded-xl shadow-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 bg-transparent text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    Start free
                  </button>
                </div>
                {error && <p className="text-red-600 text-sm mt-2 ml-1">{error}</p>}
                <p className="text-stone-500 text-sm mt-3 ml-1">
                  7 days free, then $49/year. Cancel anytime.
                </p>
              </form>
            </div>
          </div>

          {/* Phone preview section */}
          <div className="container mx-auto px-6 pb-24 max-w-5xl">
            <div className="relative flex justify-center">
              {/* Phone mockup */}
              <div className="relative w-[240px] aspect-[9/19] rounded-[2.5rem] bg-stone-900 p-2 shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-stone-900 rounded-b-xl z-10" />
                <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-stone-800 to-stone-900 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-purple-900/60 to-stone-900" />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="text-center">
                      <p className="text-white/90 text-base font-serif italic leading-relaxed mb-3">
                        "The obstacle is the way."
                      </p>
                      <p className="text-white/50 text-xs">— Marcus Aurelius</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white border-y border-stone-200">
            <div className="container mx-auto px-6 py-20 max-w-4xl">
              <h2 className="text-stone-400 text-xs font-medium tracking-widest uppercase mb-12 text-center">
                How it works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-12">
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
                  <div key={i}>
                    <p className="text-stone-300 text-sm font-mono mb-3">{item.num}</p>
                    <h3 className="text-stone-900 font-semibold mb-2">{item.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="container mx-auto px-6 py-20 max-w-lg">
            <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-semibold text-stone-900">$49</span>
                <span className="text-stone-500">/year</span>
              </div>
              <p className="text-stone-500 text-sm mb-8">That's $4 per month. Less than one coffee.</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Fresh AI wallpaper every morning',
                  'Curated quotes from philosophy to productivity',
                  '4 visual styles to match your aesthetic',
                  'iOS Shortcut for zero-tap automation',
                  'Cancel anytime',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-700 text-sm">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-colors"
              >
                Start 7-day free trial
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="container mx-auto px-6 py-8 max-w-5xl border-t border-stone-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="text-stone-500 text-sm">Daily Spark</span>
              </div>
              <p className="text-stone-400 text-sm">
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
      <div className="min-h-screen bg-stone-50">
        <div className="container mx-auto px-6 py-12 max-w-lg">
          <button 
            onClick={() => setStep('landing')}
            className="text-stone-500 hover:text-stone-900 mb-12 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="mb-10">
            <p className="text-stone-500 text-sm mb-1">{email}</p>
            <h1 className="text-2xl font-semibold text-stone-900">Customize your Daily Spark</h1>
          </div>

          {/* Category */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-stone-700 mb-3">What resonates with you?</label>
            <div className="grid grid-cols-2 gap-2">
              {(['stoicism', 'productivity', 'success', 'fitness'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    category === cat
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-sm font-medium">{categoryLabels[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-stone-700 mb-3">Visual style</label>
            <div className="grid grid-cols-2 gap-2">
              {getAllStyles().map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    style === s
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-sm font-medium">{styles[s].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="mb-10">
            <label className="block text-sm font-medium text-stone-700 mb-3">Delivery time</label>
            <div className="flex gap-2">
              {['5am', '6am', '7am'].map((time) => (
                <button
                  key={time}
                  onClick={() => setDeliveryTime(time)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                    deliveryTime === time
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGeneratePreview}
            disabled={isLoading}
            className="w-full py-3.5 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50"
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
      <div className="min-h-screen bg-stone-50">
        <div className="container mx-auto px-6 py-12 max-w-lg">
          <button 
            onClick={() => setStep('preferences')}
            className="text-stone-500 hover:text-stone-900 mb-12 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Change preferences
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-stone-900 mb-2">Your first wallpaper</h1>
            <p className="text-stone-500">This is what tomorrow morning looks like.</p>
          </div>

          {/* Phone preview */}
          <div className="relative mx-auto w-[220px] aspect-[9/19] rounded-[2rem] bg-stone-900 p-2 shadow-xl mb-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-900 rounded-b-lg z-10" />
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
              <img
                src={previewWallpaper.imageUrl}
                alt="Preview wallpaper"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Quote */}
          <div className="text-center mb-10 px-4">
            <p className="text-stone-700 italic mb-2">"{previewWallpaper.quote}"</p>
            <p className="text-stone-400 text-sm">— {previewWallpaper.author}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubscribe('annual')}
              disabled={isLoading}
              className="w-full py-3.5 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Subscribe — $49/year'}
            </button>
            <button
              onClick={() => handleSubscribe('free')}
              disabled={isLoading}
              className="w-full py-3.5 border border-stone-300 text-stone-700 font-medium rounded-xl hover:bg-stone-100 transition-colors disabled:opacity-50"
            >
              Start 7-day free trial
            </button>
          </div>

          <p className="text-stone-400 text-sm text-center mt-6">
            Delivered daily at {deliveryTime} · Cancel anytime
          </p>
        </div>
      </div>
    );
  }

  // Success
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold text-stone-900 mb-3">You're all set</h1>
          <p className="text-stone-500 mb-8">
            Your first wallpaper arrives tomorrow at {deliveryTime}.<br />
            Check your inbox for a welcome email.
          </p>
          
          <div className="bg-white border border-stone-200 rounded-xl p-5 mb-8 text-left">
            <h3 className="text-stone-900 font-medium mb-2">Want zero-tap automation?</h3>
            <p className="text-stone-500 text-sm mb-3">
              Our iOS Shortcut automatically sets your wallpaper every morning.
            </p>
            <a 
              href="/shortcut"
              className="inline-flex items-center gap-1 text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors"
            >
              Set up iOS Shortcut
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <button
            onClick={() => setStep('landing')}
            className="text-stone-500 hover:text-stone-900 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return null;
}
