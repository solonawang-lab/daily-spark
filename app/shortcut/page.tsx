'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ShortcutPage() {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dailyspark.app';
  const shortcutUrl = email ? `${baseUrl}/api/wallpaper/today?email=${encodeURIComponent(email)}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shortcutUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <div className="container mx-auto px-6 py-12 max-w-lg">
        <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm mb-10 inline-block">← Back</Link>

        <div className="mb-10">
          <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full mb-4">Power user</span>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">iOS Shortcut Setup</h1>
          <p className="text-slate-500">Auto-set your wallpaper every morning.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="text-slate-900 font-medium">Your email</h2>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="text-slate-900 font-medium">Create shortcut</h2>
            </div>
            <ol className="space-y-2 text-sm text-slate-600">
              <li>1. <span className="text-slate-900">Get Contents of URL</span> — paste your API URL</li>
              <li>2. <span className="text-slate-900">Save to Photo Album</span></li>
              <li>3. <span className="text-slate-900">Set Wallpaper</span> — choose Lock Screen</li>
            </ol>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h2 className="text-slate-900 font-medium">Your API URL</h2>
            </div>
            {shortcutUrl ? (
              <div className="flex gap-2">
                <input type="text" value={shortcutUrl} readOnly className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm font-mono truncate" />
                <button onClick={handleCopy} className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Enter your email above</p>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">4</span>
              <h2 className="text-slate-900 font-medium">Automate</h2>
            </div>
            <ol className="space-y-2 text-sm text-slate-600">
              <li>Shortcuts → Automation → + → Time of Day</li>
              <li>Select your shortcut, turn off "Ask Before Running"</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 p-5 bg-green-50 border border-green-100 rounded-xl">
          <h3 className="text-green-800 font-medium text-sm mb-1">Done!</h3>
          <p className="text-green-700 text-sm">Your wallpaper will update automatically each morning.</p>
        </div>
      </div>
    </div>
  );
}
