'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ShortcutPage() {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://dailyspark.app';
  
  const shortcutUrl = email 
    ? `${baseUrl}/api/wallpaper/today?email=${encodeURIComponent(email)}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shortcutUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        {/* Back link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-white transition-colors mb-12"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 mb-6">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Power user feature
          </div>
          <h1 className="text-3xl font-semibold text-white mb-4">iOS Shortcut Setup</h1>
          <p className="text-zinc-400 text-lg">
            Automatically set your Daily Spark wallpaper every morning. No taps, no effort.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-zinc-900 flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <h2 className="text-white font-medium">Enter your email</h2>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
            <p className="text-zinc-600 text-sm mt-2">
              The email you used to sign up for Daily Spark
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-zinc-900 flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <h2 className="text-white font-medium">Create the Shortcut</h2>
            </div>
            <p className="text-zinc-400 text-sm mb-4">
              Open the Shortcuts app on your iPhone and create a new shortcut with these actions:
            </p>
            <div className="space-y-3 mb-4">
              {[
                { action: 'Get Contents of URL', detail: 'Paste your API URL below' },
                { action: 'Save to Photo Album', detail: 'Save the wallpaper image' },
                { action: 'Set Wallpaper', detail: 'Choose Lock Screen' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-zinc-600 font-mono">{i + 1}.</span>
                  <div>
                    <span className="text-white">{item.action}</span>
                    <span className="text-zinc-600"> — {item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-zinc-500 text-sm">
              Name it "Daily Spark" and save.
            </p>
          </div>

          {/* Step 3 - API URL */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-zinc-900 flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <h2 className="text-white font-medium">Your API URL</h2>
            </div>
            {shortcutUrl ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shortcutUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-400 text-sm font-mono truncate"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    copied 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-transparent'
                  }`}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            ) : (
              <p className="text-zinc-600 text-sm italic">
                Enter your email above to generate your personal API URL
              </p>
            )}
          </div>

          {/* Step 4 */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-zinc-900 flex items-center justify-center font-semibold text-sm">
                4
              </div>
              <h2 className="text-white font-medium">Set up automation</h2>
            </div>
            <p className="text-zinc-400 text-sm mb-4">
              Make it run automatically every morning:
            </p>
            <ol className="space-y-2 text-sm text-zinc-400">
              <li className="flex gap-3">
                <span className="text-zinc-600 font-mono">1.</span>
                <span>Open <span className="text-white">Shortcuts</span> → <span className="text-white">Automation</span> tab</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-600 font-mono">2.</span>
                <span>Tap <span className="text-white">+</span> → Create Personal Automation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-600 font-mono">3.</span>
                <span>Choose <span className="text-white">Time of Day</span> → set your wake-up time</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-600 font-mono">4.</span>
                <span>Select your "Daily Spark" shortcut</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-600 font-mono">5.</span>
                <span>Turn <span className="text-white">OFF</span> "Ask Before Running"</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Done */}
        <div className="mt-12 p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">That's it</h3>
              <p className="text-zinc-400 text-sm">
                Every morning, your iPhone will automatically fetch your new wallpaper and set it — before you even wake up.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-zinc-700 text-sm text-center mt-12">
          Questions? Reply to any Daily Spark email.
        </p>
      </div>
    </div>
  );
}
