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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-6 py-12 max-w-xl">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-900 transition-colors mb-10"
        >
          ← Back
        </Link>

        <div className="mb-10">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full mb-4">
            ⚡ POWER USER
          </span>
          <h1 className="text-2xl font-bold text-amber-900 mb-3">iOS Shortcut Setup</h1>
          <p className="text-amber-700">
            Your wallpaper updates automatically every morning. Zero effort! 🌅
          </p>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-white border-2 border-amber-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-md">1</span>
              <h2 className="text-amber-900 font-semibold">Enter your email</h2>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-100 rounded-xl text-amber-900 placeholder:text-amber-400 focus:outline-none focus:border-amber-300 transition-colors"
            />
            <p className="text-amber-500 text-sm mt-2">The email you signed up with</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border-2 border-amber-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-md">2</span>
              <h2 className="text-amber-900 font-semibold">Create the Shortcut</h2>
            </div>
            <p className="text-amber-700 text-sm mb-4">
              In the Shortcuts app, create a new shortcut with these actions:
            </p>
            <ol className="space-y-2 text-sm">
              {[
                { action: 'Get Contents of URL', detail: 'Paste your API URL' },
                { action: 'Save to Photo Album', detail: 'Save the image' },
                { action: 'Set Wallpaper', detail: 'Choose Lock Screen' },
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-amber-700">
                  <span className="text-amber-400">{i + 1}.</span>
                  <span><span className="text-amber-900 font-medium">{item.action}</span> — {item.detail}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Step 3 */}
          <div className="bg-white border-2 border-amber-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-md">3</span>
              <h2 className="text-amber-900 font-semibold">Your API URL</h2>
            </div>
            {shortcutUrl ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shortcutUrl}
                  readOnly
                  className="flex-1 px-3 py-2.5 bg-amber-50 border-2 border-amber-100 rounded-xl text-amber-700 text-sm font-mono truncate"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    copied 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md'
                  }`}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            ) : (
              <p className="text-amber-500 text-sm">👆 Enter your email above to get your URL</p>
            )}
          </div>

          {/* Step 4 */}
          <div className="bg-white border-2 border-amber-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold flex items-center justify-center shadow-md">4</span>
              <h2 className="text-amber-900 font-semibold">Automate it!</h2>
            </div>
            <ol className="space-y-2 text-sm text-amber-700">
              <li>Open <span className="text-amber-900 font-medium">Shortcuts</span> → Automation tab</li>
              <li>Tap + → Create Personal Automation</li>
              <li>Choose <span className="text-amber-900 font-medium">Time of Day</span> → set your wake time</li>
              <li>Select your shortcut → turn OFF "Ask Before Running"</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
          <div className="flex gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="text-green-800 font-semibold text-sm mb-1">That's it!</h3>
              <p className="text-green-700 text-sm">
                Every morning, your wallpaper updates automatically. Sweet dreams! 🌙
              </p>
            </div>
          </div>
        </div>

        <p className="text-amber-500 text-sm text-center mt-10">
          Questions? Just reply to any Daily Spark email 💌
        </p>
      </div>
    </div>
  );
}
