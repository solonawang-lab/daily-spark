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
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-6 py-12 max-w-xl">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-12"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="mb-10">
          <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full mb-4">
            Power user
          </span>
          <h1 className="text-2xl font-semibold text-stone-900 mb-3">iOS Shortcut Setup</h1>
          <p className="text-stone-500">
            Automatically set your Daily Spark wallpaper every morning. No taps.
          </p>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-stone-900 text-white text-sm font-medium flex items-center justify-center">1</span>
              <h2 className="text-stone-900 font-medium">Enter your email</h2>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
            />
            <p className="text-stone-400 text-sm mt-2">The email you used to sign up</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-stone-900 text-white text-sm font-medium flex items-center justify-center">2</span>
              <h2 className="text-stone-900 font-medium">Create the Shortcut</h2>
            </div>
            <p className="text-stone-500 text-sm mb-4">
              Open the Shortcuts app and create a new shortcut with these actions:
            </p>
            <ol className="space-y-2 text-sm">
              {[
                { action: 'Get Contents of URL', detail: 'Paste your API URL' },
                { action: 'Save to Photo Album', detail: 'Save the image' },
                { action: 'Set Wallpaper', detail: 'Choose Lock Screen' },
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-stone-600">
                  <span className="text-stone-400">{i + 1}.</span>
                  <span><span className="text-stone-900">{item.action}</span> — {item.detail}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-stone-900 text-white text-sm font-medium flex items-center justify-center">3</span>
              <h2 className="text-stone-900 font-medium">Your API URL</h2>
            </div>
            {shortcutUrl ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shortcutUrl}
                  readOnly
                  className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-600 text-sm font-mono truncate"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    copied 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            ) : (
              <p className="text-stone-400 text-sm">Enter your email above to generate your URL</p>
            )}
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-stone-900 text-white text-sm font-medium flex items-center justify-center">4</span>
              <h2 className="text-stone-900 font-medium">Automate it</h2>
            </div>
            <ol className="space-y-2 text-sm text-stone-600">
              <li>Open <span className="text-stone-900">Shortcuts</span> → Automation tab</li>
              <li>Tap + → Create Personal Automation</li>
              <li>Choose <span className="text-stone-900">Time of Day</span> → set your wake time</li>
              <li>Select your shortcut → turn OFF "Ask Before Running"</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="text-stone-900 font-medium text-sm mb-1">That's it</h3>
              <p className="text-stone-600 text-sm">
                Every morning, your wallpaper updates automatically before you wake up.
              </p>
            </div>
          </div>
        </div>

        <p className="text-stone-400 text-sm text-center mt-10">
          Questions? Reply to any Daily Spark email.
        </p>
      </div>
    </div>
  );
}
