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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/30 to-white">
        {/* Nav */}
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center max-w-5xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-white text-sm font-bold">☀️</span>
            </div>
            <span className="text-amber-900 font-semibold tracking-tight text-lg">Daily Spark</span>
          </div>
          <button 
            onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm text-amber-700 hover:text-amber-900 font-medium transition-colors"
          >
            Get started →
          </button>
        </nav>

        {/* Hero */}
        <div className="container mx-auto px-6 pt-12 pb-16 max-w-3xl">
          <div className={`text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-8">
              <span>✨</span>
              Start your mornings with intention
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-amber-950 leading-tight mb-6">
              Wake up to inspiration,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                every single day
              </span>
            </h1>
            
            <p className="text-lg text-amber-800/70 max-w-xl mx-auto leading-relaxed mb-10">
              A beautiful wallpaper with a curated quote, freshly generated and delivered 
              to your inbox each morning. Your phone becomes your daily dose of motivation.
            </p>

            {/* Email signup */}
            <form onSubmit={handleEmailSubmit} id="signup" className="max-w-md mx-auto">
              <div className="flex gap-2 p-2 bg-white border-2 border-amber-200 rounded-2xl shadow-lg shadow-amber-100">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-transparent text-amber-900 placeholder:text-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-orange-200"
                >
                  Start free ☀️
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <p className="text-amber-600 text-sm mt-4">
                🎁 7 days free · Then just $49/year · Cancel anytime
              </p>
            </form>
          </div>
        </div>

        {/* Phone preview */}
        <div className="container mx-auto px-6 pb-20 max-w-5xl">
          <div className="relative flex justify-center">
            <div className="relative w-[220px] aspect-[9/19] rounded-[2.5rem] bg-gradient-to-b from-amber-900 to-amber-950 p-2 shadow-2xl shadow-amber-200">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-950 rounded-b-xl z-10" />
              <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-amber-500 to-amber-600" />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-center">
                    <p className="text-white text-sm font-medium leading-relaxed mb-2 drop-shadow-lg">
                      "Every morning brings new potential."
                    </p>
                    <p className="text-white/70 text-xs">— Daily Spark</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="hidden md:block absolute -left-4 top-1/4 bg-white rounded-2xl p-4 shadow-xl shadow-amber-100 border border-amber-100 transform -rotate-3">
              <p className="text-amber-600 text-xs font-medium mb-1">📬 Tomorrow, 6:00 AM</p>
              <p className="text-amber-900 text-sm font-medium">Your spark is ready!</p>
            </div>
            
            <div className="hidden md:block absolute -right-4 top-1/3 bg-white rounded-2xl p-4 shadow-xl shadow-amber-100 border border-amber-100 transform rotate-3">
              <p className="text-amber-600 text-xs font-medium mb-1">🧠 Today's theme</p>
              <p className="text-amber-900 text-sm font-medium">Stoic Wisdom</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white border-y border-amber-100">
          <div className="container mx-auto px-6 py-20 max-w-4xl">
            <h2 className="text-center text-amber-500 text-sm font-semibold tracking-wide uppercase mb-12">
              ✦ How it works ✦
            </h2>
            
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { 
                  emoji: '🎨',
                  title: 'Pick your vibe', 
                  desc: 'Choose from Stoic wisdom, productivity tips, success mindset, or fitness motivation.' 
                },
                { 
                  emoji: '🤖',
                  title: 'AI creates magic', 
                  desc: 'Every night, we generate a unique, beautiful wallpaper just for you.' 
                },
                { 
                  emoji: '🌅',
                  title: 'Wake up inspired', 
                  desc: 'Open your inbox to a fresh perspective. One tap to make it your wallpaper.' 
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3 className="text-amber-900 font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-amber-700/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="container mx-auto px-6 py-20 max-w-lg">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 text-center shadow-xl shadow-amber-100">
            <div className="inline-block px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-semibold mb-4">
              SIMPLE PRICING
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-5xl font-bold text-amber-900">$49</span>
              <span className="text-amber-600">/year</span>
            </div>
            <p className="text-amber-700 mb-8">That's less than $1 per week ☕</p>
            
            <ul className="text-left space-y-3 mb-8">
              {[
                '🌅 Fresh AI wallpaper every morning',
                '📚 100+ curated quotes across 4 themes',
                '🎨 4 beautiful visual styles',
                '⚡ iOS Shortcut for auto-set',
                '💝 Cancel anytime, no questions',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-amber-800 text-sm">
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-orange-200"
            >
              Start your 7-day free trial ☀️
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 max-w-5xl border-t border-amber-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">☀️</span>
              <span className="text-amber-700 text-sm font-medium">Daily Spark</span>
            </div>
            <p className="text-amber-600 text-sm">
              Made with 💛 for people who believe in better mornings
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Preferences step
  if (step === 'preferences') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-6 py-12 max-w-lg">
          <button 
            onClick={() => setStep('landing')}
            className="text-amber-600 hover:text-amber-900 mb-10 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>

          <div className="mb-10">
            <p className="text-amber-600 text-sm mb-1">✉️ {email}</p>
            <h1 className="text-2xl font-bold text-amber-900">Customize your Daily Spark ✨</h1>
          </div>

          {/* Category */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-amber-800 mb-3">What inspires you?</label>
            <div className="grid grid-cols-2 gap-3">
              {(['stoicism', 'productivity', 'success', 'fitness'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    category === cat
                      ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-100'
                      : 'border-amber-100 bg-white hover:border-amber-200'
                  }`}
                >
                  <span className={`text-sm font-medium ${category === cat ? 'text-amber-900' : 'text-amber-700'}`}>
                    {categoryLabels[cat]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-amber-800 mb-3">Visual style</label>
            <div className="grid grid-cols-2 gap-3">
              {getAllStyles().map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    style === s
                      ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-100'
                      : 'border-amber-100 bg-white hover:border-amber-200'
                  }`}
                >
                  <span className={`text-sm font-medium ${style === s ? 'text-amber-900' : 'text-amber-700'}`}>
                    {styles[s].label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="mb-10">
            <label className="block text-sm font-semibold text-amber-800 mb-3">When should we deliver?</label>
            <div className="flex gap-3">
              {['5am', '6am', '7am'].map((time) => (
                <button
                  key={time}
                  onClick={() => setDeliveryTime(time)}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    deliveryTime === time
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-md shadow-amber-100'
                      : 'border-amber-100 bg-white text-amber-700 hover:border-amber-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGeneratePreview}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 shadow-lg shadow-orange-200"
          >
            {isLoading ? '✨ Creating your preview...' : 'Preview my first wallpaper →'}
          </button>
        </div>
      </div>
    );
  }

  // Preview step
  if (step === 'preview' && previewWallpaper) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-6 py-12 max-w-lg">
          <button 
            onClick={() => setStep('preferences')}
            className="text-amber-600 hover:text-amber-900 mb-10 flex items-center gap-2 transition-colors"
          >
            ← Change preferences
          </button>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-amber-900 mb-2">Your first Daily Spark! 🌅</h1>
            <p className="text-amber-700">This is what tomorrow morning looks like</p>
          </div>

          {/* Phone preview */}
          <div className="relative mx-auto w-[200px] aspect-[9/19] rounded-[2rem] bg-amber-900 p-2 shadow-2xl shadow-amber-200 mb-8">
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
              <img
                src={previewWallpaper.imageUrl}
                alt="Preview wallpaper"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Quote */}
          <div className="text-center mb-10 px-4 py-6 bg-white rounded-2xl border border-amber-100 shadow-lg shadow-amber-50">
            <p className="text-amber-900 italic mb-2">"{previewWallpaper.quote}"</p>
            <p className="text-amber-600 text-sm">— {previewWallpaper.author}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubscribe('annual')}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 shadow-lg shadow-orange-200"
            >
              {isLoading ? 'Processing...' : 'Subscribe — $49/year ☀️'}
            </button>
            <button
              onClick={() => handleSubscribe('free')}
              disabled={isLoading}
              className="w-full py-4 border-2 border-amber-200 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-all disabled:opacity-50"
            >
              Start 7-day free trial
            </button>
          </div>

          <p className="text-amber-500 text-sm text-center mt-6">
            📬 Delivered daily at {deliveryTime} · Cancel anytime
          </p>
        </div>
      </div>
    );
  }

  // Success
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 max-w-md text-center">
          <div className="text-6xl mb-6">🎉</div>
          
          <h1 className="text-2xl font-bold text-amber-900 mb-3">You're all set!</h1>
          <p className="text-amber-700 mb-8">
            Your first wallpaper arrives tomorrow at {deliveryTime}.<br />
            Check your inbox for a welcome email! 💌
          </p>
          
          <div className="bg-white border-2 border-amber-100 rounded-2xl p-6 mb-8 text-left shadow-lg shadow-amber-50">
            <h3 className="text-amber-900 font-semibold mb-2">⚡ Want zero-tap automation?</h3>
            <p className="text-amber-700 text-sm mb-3">
              Our iOS Shortcut sets your wallpaper automatically each morning.
            </p>
            <a 
              href="/shortcut"
              className="inline-flex items-center gap-1 text-amber-600 text-sm font-semibold hover:text-amber-800 transition-colors"
            >
              Set up iOS Shortcut →
            </a>
          </div>

          <button
            onClick={() => setStep('landing')}
            className="text-amber-600 hover:text-amber-900 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  return null;
}
