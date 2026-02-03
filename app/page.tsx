'use client';

import { useState } from 'react';
import { Category, categoryLabels, categoryEmojis } from '@/lib/quotes';
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
        body: JSON.stringify({ 
          email, 
          category, 
          style, 
          deliveryTime,
          plan 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Subscription failed');
      }

      const data = await response.json();
      
      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        // Free trial started
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
      <div className="min-h-screen bg-zinc-950">
        {/* Hero */}
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase mb-4">
              For busy professionals who value their time
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your lock screen is the first<br />
              thing you see every morning.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Make it intentional.
              </span>
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Premium AI-generated wallpapers with curated quotes, delivered before you wake up. 
              Set it once, never think about it again.
            </p>
          </div>

          {/* Email signup */}
          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-16">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-zinc-900 font-semibold rounded-xl hover:bg-zinc-100 transition-colors whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <p className="text-zinc-600 text-sm mt-3 text-center">
              7-day free trial • No credit card required
            </p>
          </form>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 mb-16 text-zinc-500 text-sm">
            <span>Trusted by professionals at</span>
            <span className="text-zinc-400 font-medium">Google</span>
            <span className="text-zinc-400 font-medium">Apple</span>
            <span className="text-zinc-400 font-medium">Meta</span>
          </div>

          {/* Value props */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="text-3xl mb-4">⏰</div>
              <h3 className="text-white font-semibold mb-2">Zero Daily Effort</h3>
              <p className="text-zinc-500 text-sm">
                Delivered at 6am. Auto-set with iOS Shortcut. You do nothing.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="text-white font-semibold mb-2">AI-Crafted Quality</h3>
              <p className="text-zinc-500 text-sm">
                Not random Pinterest images. Unique artwork generated daily.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-white font-semibold mb-2">Curated Wisdom</h3>
              <p className="text-zinc-500 text-sm">
                Marcus Aurelius to James Clear. Philosophy that matters.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-zinc-900/50 rounded-2xl p-8 mb-16">
            <h2 className="text-white text-2xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Choose your vibe', desc: 'Stoicism, Productivity, Success, or Fitness' },
                { step: '2', title: 'Pick a style', desc: 'Minimalist, Nature, Dark, or Vibrant' },
                { step: '3', title: 'Wake up to art', desc: 'Fresh wallpaper in your inbox at 6am' },
                { step: '4', title: 'One tap to set', desc: 'Or fully automated with iOS Shortcut' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h4 className="text-white font-medium mb-1">{item.title}</h4>
                  <p className="text-zinc-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center mb-16">
            <h2 className="text-white text-2xl font-bold mb-2">Simple Pricing</h2>
            <p className="text-zinc-500 mb-8">Less than one coffee per month</p>
            
            <div className="inline-flex gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-64">
                <h3 className="text-white font-bold text-lg mb-1">Free Trial</h3>
                <p className="text-zinc-500 text-sm mb-4">7 days</p>
                <p className="text-3xl font-bold text-white mb-4">$0</p>
                <button
                  onClick={() => {
                    if (email) setStep('preferences');
                    else document.querySelector('input')?.focus();
                  }}
                  className="w-full py-2 px-4 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  Start Free
                </button>
              </div>
              
              <div className="bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-6 w-64 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-900 text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Annual</h3>
                <p className="text-zinc-500 text-sm mb-4">$4.08/month</p>
                <p className="text-3xl font-bold text-white mb-4">$49<span className="text-lg text-zinc-500">/year</span></p>
                <button
                  onClick={() => {
                    if (email) setStep('preferences');
                    else document.querySelector('input')?.focus();
                  }}
                  className="w-full py-2 px-4 bg-amber-500 text-zinc-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-zinc-600 text-sm">
            <p>Made for people who take their mornings seriously</p>
          </div>
        </div>
      </div>
    );
  }

  // Preferences step
  if (step === 'preferences') {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="container mx-auto px-4 py-12 max-w-xl">
          <button 
            onClick={() => setStep('landing')}
            className="text-zinc-500 hover:text-white mb-8 flex items-center gap-2"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-white mb-2">Customize your Daily Spark</h1>
          <p className="text-zinc-500 mb-8">For {email}</p>

          {/* Category */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Choose your vibe
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['stoicism', 'productivity', 'success', 'fitness'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    category === cat
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-2xl block mb-1">{categoryEmojis[cat]}</span>
                  <span className="font-medium">{categoryLabels[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Pick a style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {getAllStyles().map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    style === s
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-2xl block mb-1">{styles[s].emoji}</span>
                  <span className="font-medium">{styles[s].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery time */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Delivery time
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['5am', '6am', '7am'].map((time) => (
                <button
                  key={time}
                  onClick={() => setDeliveryTime(time)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    deliveryTime === time
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200">
              {error}
            </div>
          )}

          <button
            onClick={handleGeneratePreview}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-white text-zinc-900 font-semibold rounded-xl hover:bg-zinc-100 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Generating preview...' : 'Preview My First Wallpaper →'}
          </button>
        </div>
      </div>
    );
  }

  // Preview step
  if (step === 'preview' && previewWallpaper) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="container mx-auto px-4 py-12 max-w-xl">
          <button 
            onClick={() => setStep('preferences')}
            className="text-zinc-500 hover:text-white mb-8 flex items-center gap-2"
          >
            ← Change preferences
          </button>

          <h1 className="text-2xl font-bold text-white mb-2">Your first Daily Spark</h1>
          <p className="text-zinc-500 mb-8">This is what you&apos;ll wake up to every morning</p>

          {/* Preview */}
          <div className="relative aspect-[9/19] max-w-[280px] mx-auto rounded-3xl overflow-hidden shadow-2xl ring-4 ring-zinc-800 mb-8">
            <img
              src={previewWallpaper.imageUrl}
              alt="Preview wallpaper"
              className="w-full h-full object-cover"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200">
              {error}
            </div>
          )}

          {/* CTA buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubscribe('annual')}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-amber-500 text-zinc-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Subscribe — $49/year'}
            </button>
            <button
              onClick={() => handleSubscribe('free')}
              disabled={isLoading}
              className="w-full py-3 px-6 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-900 transition-colors disabled:opacity-50"
            >
              Start 7-day free trial
            </button>
          </div>

          <p className="text-zinc-600 text-sm text-center mt-4">
            Cancel anytime • Delivered daily at {deliveryTime}
          </p>
        </div>
      </div>
    );
  }

  // Success step
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 max-w-xl text-center">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-3xl font-bold text-white mb-4">You&apos;re all set!</h1>
          <p className="text-zinc-400 mb-8">
            Your first wallpaper will arrive tomorrow at {deliveryTime}.<br />
            Check your inbox for a welcome email.
          </p>
          
          <div className="bg-zinc-900 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-3">⚡ Want it fully automated?</h3>
            <p className="text-zinc-500 text-sm mb-4">
              Download our iOS Shortcut to automatically set your wallpaper every morning — zero taps required.
            </p>
            <button className="px-6 py-2 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-colors">
              Get iOS Shortcut
            </button>
          </div>

          <button
            onClick={() => setStep('landing')}
            className="text-zinc-500 hover:text-white"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  return null;
}
