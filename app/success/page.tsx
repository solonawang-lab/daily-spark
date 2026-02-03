'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-6 py-20 max-w-lg">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-amber-900 mb-3">Welcome to Daily Spark!</h1>
          <p className="text-amber-700">
            Your subscription is active. Tomorrow starts brighter! ☀️
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {[
            { emoji: '💌', title: 'Check your inbox', desc: 'We sent a welcome email with details.' },
            { emoji: '🌅', title: 'Tomorrow morning', desc: 'Your first AI wallpaper arrives before you wake.' },
            { emoji: '📱', title: 'One tap to save', desc: 'Long-press the image, save to photos, set as wallpaper.' },
          ].map((item, i) => (
            <div key={i} className="bg-white border-2 border-amber-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <h3 className="text-amber-900 font-semibold text-sm mb-0.5">{item.title}</h3>
                  <p className="text-amber-700 text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
          <h3 className="text-amber-900 font-semibold mb-2">⚡ Want it fully automated?</h3>
          <p className="text-amber-700 text-sm mb-3">
            Our iOS Shortcut fetches and sets your wallpaper automatically — zero taps!
          </p>
          <Link 
            href="/shortcut"
            className="inline-flex items-center gap-1 text-amber-600 text-sm font-semibold hover:text-amber-800 transition-colors"
          >
            Set up automation →
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-amber-600 hover:text-amber-900 transition-colors">
            ← Back to home
          </Link>
          
          {sessionId && (
            <p className="text-amber-300 text-xs mt-6 font-mono">
              {sessionId.slice(0, 24)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-amber-500 text-2xl">☀️</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
