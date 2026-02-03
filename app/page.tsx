'use client';

import { useState, useEffect } from 'react';
import { Category, categoryLabels } from '@/lib/quotes';
import { Style, styles, getAllStyles } from '@/lib/styles';

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-100/50 via-purple-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative">
          {/* Nav */}
          <nav className="container mx-auto px-6 py-6 flex justify-between items-center max-w-4xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                </svg>
              </div>
              <span className="text-slate-800 font-semibold">Daily Spark</span>
            </div>
            <button 
              onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Get started
            </button>
          </nav>

          {/* Hero */}
          <div className="container mx-auto px-6 pt-20 pb-16 max-w-2xl text-center">
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
                Start every morning<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  with intention
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed mb-12">
                A fresh wallpaper and inspiring quote delivered to your inbox before you wake up. 
                Beautiful. Effortless. Daily.
              </p>

              {/* Email signup */}
              <form onSubmit={handleEmailSubmit} id="signup" className="max-w-sm mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Try free
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <p className="text-slate-400 text-sm mt-4">
                  7-day free trial · $49/year after · Cancel anytime
                </p>
              </form>
            </div>
          </div>

          {/* Preview image */}
          <div className="container mx-auto px-6 pb-24 max-w-4xl">
            <div className="relative flex justify-center">
              <div className="w-[200px] aspect-[9/19] rounded-[2rem] bg-slate-900 p-1.5 shadow-2xl shadow-slate-300/50">
                <div className="w-full h-full rounded-[1.75rem] overflow-hidden bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-300">
                  <div className="w-full h-full flex items-center justify-center p-6 bg-black/20">
                    <div className="text-center">
                      <p className="text-white text-sm font-medium leading-relaxed drop-shadow-lg">
                        "The best time to plant a tree was 20 years ago. The second best time is now."
                      </p>
                      <p className="text-white/70 text-xs mt-3">— Chinese Proverb</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white border-y border-slate-100">
            <div className="container mx-auto px-6 py-20 max-w-3xl">
              <p className="text-center text-indigo-600 text-sm font-medium mb-12">How it works</p>
              
              <div className="grid md:grid-cols-3 gap-10 text-center">
                {[
                  { icon: '🎯', title: 'Pick your theme', desc: 'Stoicism, productivity, success, or fitness quotes.' },
                  { icon: '✨', title: 'We create daily', desc: 'AI generates a unique wallpaper each night.' },
                  { icon: '📱', title: 'You wake up inspired', desc: 'New art in your inbox every morning.' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <h3 className="text-slate-900 font-semibold mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="container mx-auto px-6 py-20 max-w-sm">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-indigo-600 text-sm font-medium mb-4">Simple pricing</p>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-bold text-slate-900">$49</span>
                <span className="text-slate-500">/year</span>
              </div>
              <p className="text-slate-500 text-sm mb-8">About $4/month</p>
              
              <ul className="text-left space-y-3 mb-8">
                {[
                  'Fresh wallpaper every morning',
                  '100+ curated quotes',
                  '4 visual styles',
                  'iOS Shortcut for auto-set',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Start free trial
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="container mx-auto px-6 py-8 max-w-4xl border-t border-slate-100">
            <div className="flex justify-between items-center text-sm text-slate-400">
              <span>Daily Spark</span>
              <span>Made for better mornings</span>
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
            <h1 className="text-2xl font-bold text-slate-900">Personalize your experience</h1>
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
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
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
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
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
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
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
            {isLoading ? 'Generating...' : 'Preview wallpaper'}
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Looking good!</h1>
            <p className="text-slate-500">Here's a preview of your daily wallpaper</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-[180px] aspect-[9/19] rounded-[1.75rem] bg-slate-900 p-1.5 shadow-xl">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
                <img src={previewWallpaper.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="text-center mb-10 px-4 py-5 bg-white rounded-xl border border-slate-100">
            <p className="text-slate-700 italic text-sm mb-1">"{previewWallpaper.quote}"</p>
            <p className="text-slate-400 text-xs">— {previewWallpaper.author}</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

          <div className="space-y-3">
            <button
              onClick={() => handleSubscribe('annual')}
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Subscribe — $49/year'}
            </button>
            <button
              onClick={() => handleSubscribe('free')}
              disabled={isLoading}
              className="w-full py-3.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Start free trial
            </button>
          </div>

          <p className="text-slate-400 text-sm text-center mt-6">
            Delivered at {deliveryTime} · Cancel anytime
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
          
          <h1 className="text-2xl font-bold text-slate-900 mb-3">You're all set!</h1>
          <p className="text-slate-500 mb-8">
            Your first wallpaper arrives tomorrow at {deliveryTime}.
          </p>
          
          <div className="bg-white border border-slate-100 rounded-xl p-5 mb-8 text-left">
            <h3 className="text-slate-900 font-medium mb-2">Want auto-set?</h3>
            <p className="text-slate-500 text-sm mb-3">
              Use our iOS Shortcut to automatically set your wallpaper each morning.
            </p>
            <a href="/shortcut" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
              Set up shortcut →
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
