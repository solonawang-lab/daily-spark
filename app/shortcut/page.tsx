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
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Link 
          href="/"
          className="text-zinc-500 hover:text-white mb-8 inline-flex items-center gap-2"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-white mb-4 mt-8">iOS Shortcut Setup</h1>
        <p className="text-zinc-400 mb-8">
          Automatically set your Daily Spark wallpaper every morning — zero taps required.
        </p>

        {/* Step 1 */}
        <div className="bg-zinc-900 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-zinc-900 flex items-center justify-center font-bold text-sm">1</span>
            Enter your email
          </h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          <p className="text-zinc-500 text-sm mt-2">
            Use the same email you signed up with
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-zinc-900 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-zinc-900 flex items-center justify-center font-bold text-sm">2</span>
            Download the Shortcut
          </h2>
          <p className="text-zinc-400 mb-4">
            Open this link on your iPhone to install the shortcut:
          </p>
          <a
            href="https://www.icloud.com/shortcuts/daily-spark-wallpaper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition-colors"
          >
            Get Shortcut from iCloud
          </a>
          <p className="text-zinc-600 text-sm mt-3">
            Note: You'll need to allow the shortcut to run. Tap "Allow" when prompted.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-zinc-900 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-zinc-900 flex items-center justify-center font-bold text-sm">3</span>
            Configure your API URL
          </h2>
          <p className="text-zinc-400 mb-4">
            Copy this URL and paste it into the shortcut when prompted:
          </p>
          {shortcutUrl ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={shortcutUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm font-mono"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-3 bg-zinc-700 text-white rounded-xl hover:bg-zinc-600 transition-colors"
              >
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          ) : (
            <p className="text-zinc-500 italic">Enter your email above to generate your URL</p>
          )}
        </div>

        {/* Step 4 */}
        <div className="bg-zinc-900 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-zinc-900 flex items-center justify-center font-bold text-sm">4</span>
            Set up automation
          </h2>
          <p className="text-zinc-400 mb-4">
            Make it run automatically every morning:
          </p>
          <ol className="text-zinc-400 space-y-2 list-decimal list-inside">
            <li>Open the <strong className="text-white">Shortcuts</strong> app</li>
            <li>Go to the <strong className="text-white">Automation</strong> tab</li>
            <li>Tap <strong className="text-white">+</strong> → Create Personal Automation</li>
            <li>Choose <strong className="text-white">Time of Day</strong> → Set your wake-up time</li>
            <li>Tap <strong className="text-white">Next</strong> → Search for "Daily Spark"</li>
            <li>Select the shortcut → Tap <strong className="text-white">Next</strong></li>
            <li>Turn OFF "Ask Before Running" → Tap <strong className="text-white">Done</strong></li>
          </ol>
        </div>

        {/* Manual shortcut creation */}
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-3">🔧 Create shortcut manually</h3>
          <p className="text-zinc-400 text-sm mb-4">
            If the iCloud link doesn't work, create the shortcut yourself:
          </p>
          <ol className="text-zinc-500 text-sm space-y-2 list-decimal list-inside">
            <li>Open Shortcuts → Tap + to create new</li>
            <li>Add action: <strong className="text-zinc-300">Get Contents of URL</strong> → paste your API URL</li>
            <li>Add action: <strong className="text-zinc-300">Save to Photo Album</strong></li>
            <li>Add action: <strong className="text-zinc-300">Set Wallpaper</strong> → choose Lock Screen</li>
            <li>Name it "Daily Spark" and save</li>
          </ol>
        </div>

        <p className="text-zinc-600 text-sm text-center mt-8">
          Questions? Reply to any Daily Spark email and we'll help.
        </p>
      </div>
    </div>
  );
}
