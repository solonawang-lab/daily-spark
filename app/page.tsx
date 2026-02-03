'use client';

import { useState } from 'react';
import { Category, categoryLabels, categoryEmojis } from '@/lib/quotes';
import { Style, styles, getAllStyles } from '@/lib/styles';

export default function Home() {
  const [category, setCategory] = useState<Category>('stoicism');
  const [style, setStyle] = useState<Style>('dark');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wallpaper, setWallpaper] = useState<{
    imageUrl: string;
    quote: string;
    author: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, style }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate wallpaper');
      }
      
      const data = await response.json();
      setWallpaper(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!wallpaper?.imageUrl) return;
    
    // For data URLs, we can download directly
    const a = document.createElement('a');
    a.href = wallpaper.imageUrl;
    a.download = `daily-spark-${category}-${style}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Daily Spark ✨
          </h1>
          <p className="text-zinc-400 text-lg">
            AI-generated wallpapers with inspiring quotes
          </p>
        </div>

        {/* Category Picker */}
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
                    ? 'border-white bg-white/10 text-white'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                <span className="text-2xl block mb-1">{categoryEmojis[cat]}</span>
                <span className="font-medium">{categoryLabels[cat]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Style Picker */}
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
                    ? 'border-white bg-white/10 text-white'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                <span className="text-2xl block mb-1">{styles[s].emoji}</span>
                <span className="font-medium">{styles[s].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 px-6 bg-white text-zinc-900 font-semibold rounded-xl hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </span>
          ) : (
            '✨ Generate Wallpaper'
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200">
            {error}
          </div>
        )}

        {/* Result */}
        {wallpaper && (
          <div className="space-y-4">
            <div className="relative aspect-[9/19] max-w-[280px] mx-auto rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10">
              <img
                src={wallpaper.imageUrl}
                alt="Generated wallpaper"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 py-3 px-6 bg-white text-zinc-900 font-semibold rounded-xl hover:bg-zinc-100 transition-colors"
              >
                📥 Download
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 py-3 px-6 bg-zinc-700 text-white font-medium rounded-xl hover:bg-zinc-600 transition-colors disabled:opacity-50"
              >
                🔄 New Quote
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-zinc-500 text-sm space-y-2">
          <p>Made with ❤️ for the indie hacker challenge</p>
          <p className="text-zinc-600">
            Project #1 of 26 • 
            <a href="https://twitter.com" className="hover:text-zinc-400 ml-1">Follow for more</a>
          </p>
        </div>
      </div>
    </div>
  );
}
